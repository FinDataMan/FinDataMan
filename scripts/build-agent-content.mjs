// Public generator: current copy comes only from the reviewed bilingual landing.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {site} from '../content/site-information.mjs';
import {withSocialMeta} from '../content/social-sharing.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const output=new Map(),put=(p,t)=>output.set(p,t.endsWith('\n')?t:t+'\n');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const para=s=>'<p>'+esc(s)+'</p>';
const url=p=>site.url+'/'+p;
const nav='<nav aria-label="Navegación principal"><a href="/">Inicio</a><a href="/projects/">Proyectos</a><a href="/trayectoria.html">Trayectoria y CV</a><a href="/contact/">Contacto</a></nav>';
const footer='<footer><a href="/about/">Sobre Arturo</a><a href="/privacy/">Privacidad</a><a href="/llms.txt">Guía de lectura</a></footer>';
const entity={'@type':'Person','@id':url('#arturo'),name:site.name,url:url(''),jobTitle:'Director de Operaciones y socio en AMEZ CFO',worksFor:{'@type':'Organization',name:'AMEZ CFO'},email:site.email,contactPoint:{'@type':'ContactPoint',email:site.email,contactType:'Proyectos y colaboración',availableLanguage:['es','en']},address:{'@type':'PostalAddress',addressLocality:'Mérida',addressRegion:'Yucatán',addressCountry:'MX'},sameAs:['https://www.linkedin.com/in/arturo-villagomez-gomez-5bb131119/','https://github.com/FinDataMan']};
const schema={'@context':'https://schema.org','@graph':[entity,{'@type':'WebSite','@id':url('#website'),url:url(''),name:site.name,publisher:{'@id':entity['@id']},copyrightHolder:{'@id':entity['@id']},inLanguage:['es','en']}]};
const alt=md=>'<link rel="alternate" type="text/markdown" href="/'+md+'"><link rel="describedby" href="/llms.txt">';
const schemaTag='<script type="application/ld+json">'+JSON.stringify(schema)+'</script>';
function page(title,slug,body,description=title+' — Arturo Villagomez',extra='',customSchema=schema){return '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — Arturo Villagomez</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+url(slug+'/')+'">'+alt(slug+'/index.md')+'<link rel="stylesheet" href="/assets/agent-pages.css"><link rel="stylesheet" href="/assets/b10/portfolio-r4.css">'+extra+'<script type="application/ld+json">'+JSON.stringify(customSchema)+'</script></head><body><main class="agent-page">'+nav+'<p class="eyebrow">Arturo Villagomez</p><h1>'+esc(title)+'</h1>'+body+footer+'</main></body></html>';}
function component(file){const html=read(file),source=html.match(/<script type="text\/x-dc" data-dc-script>([\s\S]*?)<\/script>/)?.[1];if(!source)throw Error('Missing reviewed component: '+file);const c=vm.runInNewContext(source+'\nnew Component()',{DCLogic:class{},React:{createRef:()=>({current:null}),createElement:()=>null}},{timeout:2000});c.data();return c.renderVals();}
const es=component('index.html'),en=component('index-en.html');
const histories=JSON.parse(read('content/historical-projects.json'));
const paragraphs=items=>items.join('\n\n')+'\n\n';
const caseMd=(c,english=false)=>'# '+c.tag+'\n\n> '+c.title+'\n\n'+paragraphs([c.brandThesis,c.teaser,c.flag])+c.blocks.map(b=>'## '+b.k+'\n\n'+b.v+'\n').join('\n')+'\n['+(english?'Read approved document':'Leer documento aprobado')+']('+url(c.pageHref)+')\n'+(c.link?'\n['+(english?'Visit website':'Visitar sitio')+']('+c.link+')\n':'');
for(const [file,ui,english] of [['index.html',es,false],['index-en.html',en,true]]){
 const mdName=file.replace('.html','.md');
 let md='# Arturo Villagomez\n\n> '+ui.essence+'\n\n'+paragraphs([ui.heroSub,ui.posTitle,ui.posBody]);
 md+='## '+ui.routerTitle+'\n\n';
 for(const r of ui.routes)md+='### '+r.tab+'\n\n'+paragraphs([r.thesis,r.sub])+r.forms.map(x=>'- '+x).join('\n')+'\n\n';
 md+='## '+ui.casesTitle+'\n\n';
 for(const c of ui.cases)md+=caseMd(c,english).replace(/^## /gm,'#### ').replace(/^# /,'### ')+'\n';
 md+='## '+(english?'About Arturo':'Sobre Arturo')+'\n\n'+paragraphs(ui.aboutBody)+'## '+(english?'Contact':'Contacto')+'\n\n'+ui.ctaBody+'\n\n['+site.email+'](mailto:'+site.email+')\n';put(mdName,md);
 let html=read(file).replace(/<!-- PUBLIC-DISCOVERY-START -->[\s\S]*?<!-- PUBLIC-DISCOVERY-END -->\n?/g,'');
 html=html.replace(/<!-- PUBLIC-ARCHIVE-LINK -->[\s\S]*?<!-- END-PUBLIC-ARCHIVE-LINK -->/g,'').replaceAll('href="https://arturovillagomez.com/privacy/"','href="/privacy/"');
 const archiveLink='<!-- PUBLIC-ARCHIVE-LINK --><a href="/projects/" style="color:#a49d92;">'+(english?'Project index and archive':'Índice y archivo de proyectos')+'</a><!-- END-PUBLIC-ARCHIVE-LINK -->';
 html=html.replace('<a href="/privacy/"',archiveLink+'<a href="/privacy/"');
 html=html.replace('</head>','<!-- PUBLIC-DISCOVERY-START -->'+alt(mdName)+schemaTag+'<!-- PUBLIC-DISCOVERY-END -->\n</head>');put(file,html);
}
const archiveNote='Archivo de proyectos · muestra histórica conservada. Los estados y las aplicaciones de esta ficha corresponden a su publicación anterior; no describen la versión actual del sistema de marca.';
let indexBody=para('Cinco proyectos actuales, con su problema, mi aportación y el alcance del trabajo.')+'<div class="project-index">';
let indexMd='# Proyectos de Arturo Villagomez\n\n## Proyectos actuales\n\n';
const routes={'/':'index','/index-en.html':'index-en','/about/':'about/index','/contact/':'contact/index','/privacy/':'privacy/index','/projects/':'projects/index'};
for(const c of es.cases){
 const slug='projects/'+c.slug; routes['/'+slug+'/']=slug+'/index';
 indexBody+='<article><h2><a href="/'+slug+'/">'+esc(c.tag)+'</a></h2>'+para(c.title)+para(c.flag)+'</article>';
 indexMd+='### ['+c.tag+']('+url(slug+'/')+')\n\n'+paragraphs([c.title,c.flag]);
 put(slug+'/index.md',caseMd(c));put(slug+'/index-en.md',caseMd(en.cases.find(x=>x.slug===c.slug),true));
 if(c.slug==='amez-cfo')continue;
 const scene='<div class="case-card is-editorial-case">'+c.visual.replace(/(src|href)="assets\//g,'$1="/assets/').replaceAll('<h3>','<h2>').replaceAll('</h3>','</h2>')+'</div>';
 const body=scene+'<div class="reading">'+c.blocks.map(b=>'<h2>'+esc(b.k)+'</h2>'+para(b.v)).join('')+'<p><a href="/'+esc(c.pageHref)+'">Leer dossier · PDF</a> · <a href="/'+slug+'/index-en.md" lang="en">English project brief</a></p></div>';
 const projectSchema={'@context':'https://schema.org','@graph':[entity,{'@type':'CreativeWork',name:c.tag,headline:c.title,description:c.flag,url:url(slug+'/'),creator:{'@id':entity['@id']},inLanguage:'es'}]};
 put(slug+'/index.html',page(c.tag,slug,body,c.title,'',projectSchema));
}
indexBody+='</div><h2>Archivo de proyectos</h2>'+para('Cuatro fichas históricas. Su estado y sus muestras se conservan como archivo, separados del trabajo actual.')+'<div class="project-index">';
indexMd+='## Archivo de proyectos\n\n'+archiveNote+'\n\n';
for(const c of histories){const slug='projects/'+c.slug;routes['/'+slug+'/']=slug+'/index';put(slug+'/index.html',page(c.title,slug,'<aside class="archive-note">'+esc(archiveNote)+'</aside>'+c.body,c.description));put(slug+'/index.md','# '+c.title+'\n\n> '+archiveNote+'\n\n'+c.markdown.replace(/^# [^\n]+\n+/,''));indexBody+='<article><h3><a href="/'+slug+'/">'+esc(c.title)+'</a></h3>'+para(c.description)+'</article>';indexMd+='- ['+c.title+']('+url(slug+'/')+'): archivo histórico.\n';}
put('projects/index.html',page('Proyectos','projects',indexBody+'</div>','Cinco proyectos actuales y cuatro fichas históricas de Arturo Villagomez.'));put('projects/index.md',indexMd);
const about=[...es.aboutBody,'Base profesional: '+site.location+'.',site.ownership];
put('about/index.html',page('Sobre Arturo','about',about.map(para).join('')+'<p><a href="/trayectoria.html">Consultar trayectoria, formación y cuatro versiones del CV</a></p>'));
put('about/index.md','# Sobre Arturo\n\n'+paragraphs(about)+'[Trayectoria y CV]('+url('trayectoria.html')+')\n');
const contact=[es.ctaBody,'Para iniciar una conversación, describe el problema, el contexto de tu equipo y qué te gustaría conseguir. No necesitas compartir información confidencial en un primer contacto.','Podemos trabajar en un proyecto concreto, colaborar periódicamente o desarrollar una nueva idea de negocio. El alcance y el siguiente paso se acuerdan directamente.',site.ownership];
put('contact/index.html',page('Contacto','contact',contact.map(para).join('')+'<p><a href="mailto:'+site.email+'">'+site.email+'</a></p>'));put('contact/index.md','# Contacto\n\n'+paragraphs(contact)+'['+site.email+'](mailto:'+site.email+')\n');
const privacy=site.privacy.map(x=>'<h2>'+esc(x.title)+'</h2>'+para(x.text)).join('')+'<p><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">Privacidad del alojamiento GitHub</a></p>';
put('privacy/index.html',page('Privacidad','privacy',privacy));put('privacy/index.md','# Privacidad\n\n'+site.privacy.map(x=>'## '+x.title+'\n\n'+x.text+'\n').join('\n'));
const aliases=[['projects/amez-cfo','/amez-cfo.html','AMEZ CFO'],['projects/quickfinance','/projects/sistema-financiero/','Sistema financiero de uso propio'],['cv','/trayectoria.html#cv','Trayectoria y CV']];
for(const [slug,target,title] of aliases){
 routes['/'+slug+'/']=slug+'/index';
 let html=page(title,slug,para('Esta página tiene una dirección actualizada.')+'<p><a href="'+target+'">Continuar a '+esc(title)+'</a></p>',title,'<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url='+target+'">');
 html=html.replace(/<link rel="canonical" href="[^"]+">/,'<link rel="canonical" href="'+url(target.slice(1).split('#')[0])+'">');put(slug+'/index.html',html);
 if(slug!=='projects/amez-cfo')put(slug+'/index.md','# '+title+'\n\n[Consultar la versión vigente]('+url(target.slice(1))+')\n');
}
put('404.md','# Página no encontrada\n\n[Inicio]('+url('')+') · [Proyectos]('+url('projects/')+') · [Guía]('+url('llms.txt')+') · [Mapa]('+url('sitemap.xml')+')\n');
put('404.html',page('Página no encontrada','404',para('La dirección solicitada no existe. Puedes volver al inicio o consultar el índice de proyectos.'), 'Página no encontrada','<meta name="robots" content="noindex">').replace(/<link rel="canonical"[^>]+>/,'').replace('/404/index.md','/404.md'));
put('agent-instructions.md','# Guía de uso del sitio de Arturo Villagomez\n\n'+site.ownership+'\n\n## When to use this site\n\n'+site.whenToUse.map(x=>'- '+x).join('\n')+'\n\n## Cómo proceder\n\n'+site.instructions.map(x=>'- '+x).join('\n'));
put('llms.txt','# Arturo Villagomez\n\n> Finanzas, operaciones e IA aplicada: entender los números de un negocio y decidir qué hacer después.\n\n'+site.ownership+'\n\n## Información principal\n\n- [Perfil ES]('+url('index.md')+'): perfil y cinco proyectos actuales.\n- [Profile EN]('+url('index-en.md')+'): approved English profile and projects.\n- [Proyectos]('+url('projects/index.md')+'): cinco proyectos actuales y cuatro fichas históricas diferenciadas.\n- [Trayectoria y CV]('+url('trayectoria.html')+'): cuatro versiones aprobadas, ES y EN.\n- [Contacto]('+url('contact/index.md')+'): canal personal.\n- [Privacidad]('+url('privacy/index.md')+'): alojamiento y contacto.\n- [Guía de uso]('+url('agent-instructions.md')+'): alcance y límites.\n');
const mainPages=['index.html','index-en.html','amez-cfo.html','amez-cfo-en.html','trayectoria.html','trayectoria-en.html'];
for(const file of mainPages)if(!output.has(file))put(file,read(file));
for(const [file,html] of output)if(file.endsWith('.html'))put(file,withSocialMeta(html));
const canonical=[...mainPages.map(n=>n==='index.html'?'':n),...Object.keys(routes).filter(r=>r!=='/'&&!r.endsWith('.html')&&!aliases.some(a=>'/'+a[0]+'/'===r)).map(r=>r.slice(1))];
put('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+canonical.map(p=>'<url><loc>'+url(p)+'</loc></url>').join('')+'</urlset>');
put('robots.txt','User-agent: *\nAllow: /\nSitemap: '+url('sitemap.xml'));
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const publicFiles=[...output.keys(),...mainPages,...walk('documents'),'assets/agent-pages.css','llms.txt','agent-instructions.md','cv/arturo-villagomez-cv.pdf','cv/Arturo_Villagomez_Gomez_CV.pdf'];
put('agent-public-files.json',JSON.stringify({schema_version:2,origin:site.url,negotiated:routes,files:[...new Set(publicFiles)].sort()},null,2));
const integrity={revision:'B10-PUBLIC-20261119',owner:site.name,artifacts:{}};
for(const [name,text] of output)integrity.artifacts[name]={sha256:crypto.createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text)};
put('agent-readiness-manifest.json',JSON.stringify(integrity,null,2));
let stale=false;for(const [name,text] of output){if(process.argv.includes('--check')){if(!fs.existsSync(path.join(root,name))||read(name)!==text){console.error('STALE '+name);stale=true;}}else{fs.mkdirSync(path.dirname(path.join(root,name)),{recursive:true});fs.writeFileSync(path.join(root,name),text);}}
if(stale)process.exitCode=1;else console.log((process.argv.includes('--check')?'Verified ':'Generated ')+output.size+' public artifacts; no deployment.');
