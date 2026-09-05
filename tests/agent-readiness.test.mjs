import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createServer,choose,root} from '../scripts/agent-server.mjs';
let server,base;
before(async()=>{server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;});
after(()=>new Promise(r=>server.close(r)));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const projectSlugs=['arturo-villagomez','casa-artu-tamanova','don-ventas','amez-cfo','quickfinance','stone-oak-evans','sicaru','pafi-above-and-beyond'];
const negotiatedEndpoints=['/','/about/','/contact/','/privacy/','/projects/',...projectSlugs.map(s=>'/projects/'+s+'/')];
test('Accept negotiation: quality, specificity, exclusions, browser defaults and unsupported types',()=>{
  const matrix=[
    [undefined,'html'],['*/*','html'],['text/*','html'],['text/markdown','markdown'],
    ['text/markdown, text/html;q=0.8','markdown'],['text/html, text/markdown;q=0.5','html'],
    ['text/markdown;q=0, text/html','html'],['text/markdown;q=0, */*;q=0.5','html'],
    ['text/html;q=0, text/*;q=0.8','markdown'],['TEXT/MARKDOWN','markdown'],
    ['text/markdown; charset=utf-8','markdown'],['text/markdown; charset=iso-8859-1',undefined],
    ['text/html;q=0,text/markdown;q=0',undefined],['application/json',undefined],['',undefined],
    ['text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8','html']
  ];
  for(const [input,result]of matrix)assert.equal(choose(input)?.split(';')[0],result?'text/'+result:undefined,input);
});
for(const endpoint of negotiatedEndpoints){
  test(endpoint+' serves matching HTML/Markdown, consistent HEAD, cache isolation and 406',async()=>{
    const variants=[];
    for(const type of ['text/html','text/markdown']){
      const r=await fetch(base+endpoint,{headers:{Accept:type}});
      assert.equal(r.status,200);assert.ok(r.headers.get('content-type').startsWith(type));
      assert.match(r.headers.get('vary'),/Accept/);assert.match(r.headers.get('cache-control'),/no-store/);
      const text=await r.text();assert.ok(text.length>500);variants.push(r.headers.get('etag'));
      const head=await fetch(base+endpoint,{method:'HEAD',headers:{Accept:type}});
      assert.equal(head.status,200);assert.equal(await head.text(),'');
      assert.equal(Number(head.headers.get('content-length')),Buffer.byteLength(text));
      assert.equal(head.headers.get('etag'),r.headers.get('etag'));
    }
    assert.notEqual(variants[0],variants[1]);
    assert.equal((await fetch(base+endpoint,{headers:{Accept:'application/json'}})).status,406);
  });
}
test('unknown and nested paths return genuine recoverable 404, never an app shell',async()=>{
  for(const route of ['/this-does-not-exist-ora','/about/missing','/assets/missing.png','/scripts/agent-server.mjs','/.git/config','/assets/%2e%2e%5cpackage.json']){
    const r=await fetch(base+route,{headers:{Accept:'text/markdown'}});
    assert.equal(r.status,404,route);assert.match(r.headers.get('content-type'),/text\/markdown/);
    const text=await r.text();assert.match(text,/llms.txt/);assert.match(text,/sitemap.xml/);assert.doesNotMatch(text,/<x-dc/);
  }
});
test('redirects, explicit 404 page and rejected write methods',async()=>{
  for(const route of ['/about','/contact','/privacy','/projects','/projects/arturo-villagomez']){
    const r=await fetch(base+route,{redirect:'manual'});assert.equal(r.status,308);assert.equal(r.headers.get('location'),route+'/');
  }
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  const r=await fetch(base+'/missing',{headers:{Accept:'text/html'}});assert.equal(r.status,404);
  assert.match(await r.text(),/Página no encontrada/);
});
test('all generated public files and local links exist; machine-readable files parse',async()=>{
  const registry=JSON.parse(read('agent-public-files.json'));
  for(const file of [...registry.files,'agent-public-files.json']){
    const r=await fetch(base+'/'+file);assert.equal(r.status,200,file);
  }
  for(const file of ['index.html','about/index.html','contact/index.html','privacy/index.html','projects/index.html',...projectSlugs.map(s=>'projects/'+s+'/index.html'),'404.html']){
    const text=read(file);
    for(const [,href]of text.matchAll(/href="([^"]+)"/g)){
      if(!href.startsWith('/')||href.startsWith('//'))continue;
      assert.equal((await fetch(base+href)).status,200,file+' → '+href);
    }
  }
  assert.match(read('sitemap.xml'),/<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
});
test('meaningful static homepage, sequential headings and generated Markdown parity',()=>{
  const html=read('index.html'),md=read('index.md');
  const staticHtml=html.match(/<main id="static-home"[\s\S]*?<\/main>/)[0];
  const text=staticHtml.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  assert.ok(text.length>=500);assert.ok(text.length/html.length>=.05,'content-to-HTML ratio below 5%');
  assert.equal((staticHtml.match(/<h1>/g)||[]).length,1);
  let prior=0;for(const [,n]of staticHtml.matchAll(/<h([1-6])>/g)){assert.ok(Number(n)<=prior+1);prior=Number(n);}
  assert.match(staticHtml,/Arturo Villagomez/);
  for(const name of ['Pafi','AMEZ CFO','QuickFinance','Stone Oak','Sicarú','Tamanova']){
    assert.ok(staticHtml.includes(name));assert.ok(md.includes(name));
  }
  assert.doesNotMatch(staticHtml,/vistas privadas autorizadas/i);
  assert.match(html,/data-interactive-ready/);
});
test('portfolio hierarchy, galleries and stable project records are explicit',()=>{
  const html=read('index.html'),css=read('assets/landing.css');
  assert.match(html,/tier:'lead'/);assert.match(css,/case-card\.case-lead/);assert.match(html,/Ver archivo de proyectos \(4\)/);
  assert.match(html,/Diagnosticar/);assert.match(html,/Transferir/);
  assert.doesNotMatch(html,/id="escritura"/);
  for(const slug of projectSlugs){
    const project=read('projects/'+slug+'/index.html');
    const md=read('projects/'+slug+'/index.md');
    assert.equal((project.match(/<figure>/g)||[]).length,3,slug);
    assert.match(project,/"@type":"CreativeWork"/);assert.match(md,/## Galería/);
    assert.ok(read('sitemap.xml').includes('https://arturovillagomez.com/projects/'+slug+'/'));
  }
  const pafi=read('projects/pafi-above-and-beyond/index.html');
  const arturo=read('projects/arturo-villagomez/index.html');
  for(const asset of ['pafi-portfolio-01-brand-book.png','pafi-portfolio-02-lenguaje-visual.png','pafi-portfolio-03-sistema-aplicado.png'])assert.match(pafi,new RegExp(asset));
  for(const asset of ['arturo-editorial-01-tesis.png','arturo-portfolio-02-sistema-fisico.png','arturo-portfolio-03-identidad-movimiento.gif'])assert.match(arturo,new RegExp(asset));
  assert.match(pafi,/Sistema 18\/18 cerrado/);assert.match(pafi,/PDF nativo de imprenta continúa pendiente/);
  assert.match(arturo,/B13–B17 cerradas/);assert.match(arturo,/B18 Quick Reference en revisión final local/);
});
test('portfolio assets declare governed provenance, lifecycle and local publication state',()=>{
  const manifest=JSON.parse(read('content/portfolio-asset-consumption.json'));
  assert.equal(manifest.publicationStatus,'NOT_PUBLISHED_THIS_ROUND');
  for(const key of ['arturo-villagomez','pafi-above-and-beyond']){
    const project=manifest.projects[key];assert.equal(project.assets.length,3,key);
    for(const asset of project.assets){
      assert.ok(fs.existsSync(path.join(root,asset.publicPath)),asset.publicPath);
      assert.match(asset.lifecycle,/APPROVED|CURRENT_BRAND_BOOK_SOURCE|CANONICAL_DERIVED_LOCAL_REVIEW/);
      if(asset.sha256){
        assert.match(asset.sha256,/^[a-f0-9]{64}$/);
        const bytes=fs.readFileSync(path.join(root,asset.publicPath));
        assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256,asset.publicPath);
        if(asset.publicPath.endsWith('.png')&&asset.dimensions){
          const [width,height]=asset.dimensions.split('x').map(Number);
          assert.equal(bytes.readUInt32BE(16),width,asset.publicPath+' width');
          assert.equal(bytes.readUInt32BE(20),height,asset.publicPath+' height');
        }
      }
    }
  }
  const pafi=manifest.projects['pafi-above-and-beyond'];
  assert.match(pafi.sourceState,/native print PDF pending/);
  assert.ok(pafi.assets.every(asset=>asset.lifecycle==='CANONICAL_DERIVED_LOCAL_REVIEW'));
  assert.ok(pafi.assets.every(asset=>/no crop or page distortion/i.test(asset.transformation)));
  assert.ok(pafi.limitations.some(item=>/HTML pages.*not by rasterizing the PDF/i.test(item)));
});
test('animated portfolio identity is served with its native media type',async()=>{
  const r=await fetch(base+'/assets/casos/arturo/arturo-portfolio-03-identidad-movimiento.gif');
  assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/gif');
  assert.ok((await r.arrayBuffer()).byteLength>100000);
});
test('contact brief is prefilled, non-confidential and explains the next step',()=>{
  const html=read('index.html');
  assert.match(html,/subject=Proyecto%20%2F%20reto/);
  assert.match(html,/El resultado y horizonte/);
  assert.match(html,/No necesitas compartir información confidencial/);
});
test('identity ownership and contact are truthful; no fabricated business address',()=>{
  const schema=JSON.parse(read('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const person=schema['@graph'].find(x=>x['@type']==='Person');
  const website=schema['@graph'].find(x=>x['@type']==='WebSite');
  assert.equal(website.publisher['@id'],person['@id']);assert.equal(person.worksFor.name,'AMEZ CFO');
  assert.equal(person.contactPoint.email,'hola@arturovillagomez.com');
  assert.equal(person.address.addressLocality,'Ciudad de México');assert.equal(person.address.streetAddress,undefined);
  assert.match(read('about/index.html'),/la firma no es propietaria ni editora/);
});
test('trust pages have meaningful body text; manifest verifies all generated files and changed code',()=>{
  for(const name of ['about','contact','privacy']){
    const body=read(name+'/index.html').match(/<main[\s\S]*?<\/main>/)[0].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
    assert.ok(body.length>=500,name);
    assert.ok(read('sitemap.xml').includes('https://arturovillagomez.com/'+name+'/'));
  }
  assert.match(read('robots.txt'),/Sitemap: https:\/\/arturovillagomez.com\/sitemap.xml/);
  for(const [name,record]of Object.entries(JSON.parse(read('agent-readiness-manifest.json')).artifacts)){
    const bytes=fs.readFileSync(path.join(root,name));
    assert.equal(bytes.length,record.bytes,name);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),record.sha256,name);
  }
});
test('llms.txt follows ordered H1, summary, then H2 file-list sections; use guidance is specific',()=>{
  const text=read('llms.txt');assert.match(text,/^# Arturo Villagomez\n\n> /);
  for(const section of text.split(/^## /m).slice(1)){
    for(const line of section.split('\n').slice(1).filter(x=>x.trim()))assert.match(line,/^- \[[^\]]+\]\(https:\/\/[^)]+\)(: .+)?$/);
  }
  const guidance=read('agent-instructions.md');assert.match(guidance,/When to use/);assert.match(guidance,/no una API/);assert.match(guidance,/autorización/);
});
