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
const projectSlugs=['arturo-villagomez','casa-artu-tamanova','don-ventas','amez-cfo','sistema-financiero','butter','quickfinance','stone-oak-evans','sicaru','pafi-above-and-beyond'];
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
      const text=await r.text();assert.ok(text.length>60);variants.push(r.headers.get('etag'));
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

test('current HTML, Markdown and retained aliases are consistent',()=>{
 const registry=JSON.parse(read('agent-public-files.json'));
 for(const name of registry.files)assert.ok(fs.existsSync(path.join(root,name)),name);
 for(const c of ['amez-cfo','sistema-financiero','butter','stone-oak-evans','don-ventas']){
  assert.ok(read('projects/'+c+'/index.md').length>500);
  assert.ok(read('projects/'+c+'/index-en.md').length>500);
 }
 for(const c of ['arturo-villagomez','casa-artu-tamanova','sicaru','pafi-above-and-beyond'])assert.match(read('projects/'+c+'/index.html'),/Archivo de proyectos/);
 const alias=read('projects/quickfinance/index.html');assert.match(alias,/http-equiv="refresh"/);assert.match(alias,/noindex,follow/);assert.match(alias,/url=\/projects\/sistema-financiero\//);
 assert.doesNotMatch(read('sitemap.xml')+read('llms.txt')+read('index.md'),/quickfinance/i);
 assert.match(read('privacy/index.md'),/mismo sitio/);assert.doesNotMatch(read('privacy/index.md'),/también solicita tipografías/);
 for(const file of ['index.html','index-en.html']){
  const html=read(file);assert.equal((html.match(/id="static-home"/g)||[]).length,1);
  assert.equal((html.match(/type="application\/ld\+json"/g)||[]).length,1);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const person=schema['@graph'].find(x=>x['@type']==='Person');assert.equal(person.address.addressLocality,'Mérida');assert.equal(person.worksFor.name,'AMEZ CFO');
 }
 const mainPdf=fs.readFileSync(path.join(root,'documents/Arturo-Villagomez-CV-FPA-Manager-ES-2026-11-18.pdf'));
 for(const alias of ['cv/arturo-villagomez-cv.pdf','cv/Arturo_Villagomez_Gomez_CV.pdf'])assert.deepEqual(fs.readFileSync(path.join(root,alias)),mainPdf);
});
test('all public local links and content assets resolve',async()=>{
 const registry=JSON.parse(read('agent-public-files.json'));
 for(const file of registry.files){
  const response=await fetch(base+'/'+file);assert.equal(response.status,200,file);
  if(!file.endsWith('.html'))continue;
  for(const [,href]of read(file).matchAll(/(?:href|src)="([^"{}]+)"/g)){
   if(/^(?:https?:|mailto:|data:|#)/.test(href))continue;
   const target=new URL(href,base+'/'+file);assert.equal((await fetch(target)).status,200,file+' → '+href);
  }
 }
});
test('public font and document types; historical animation remains intact',async()=>{
 for(const [p,type]of [['assets/b10/SourceSerif4-variable.woff2','font/woff2'],['cv/arturo-villagomez-cv.pdf','application/pdf'],['assets/casos/arturo/arturo-portfolio-03-identidad-movimiento.gif','image/gif']]){const r=await fetch(base+'/'+p);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),type);}
});
test('generated integrity manifest is accurate',()=>{
 for(const [name,record]of Object.entries(JSON.parse(read('agent-readiness-manifest.json')).artifacts)){const b=fs.readFileSync(path.join(root,name));assert.equal(b.length,record.bytes,name);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),record.sha256,name);}
});
