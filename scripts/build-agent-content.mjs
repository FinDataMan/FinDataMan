import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {site} from '../content/site-information.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const generated = new Map();
const read = p => fs.readFileSync(path.join(root,p),'utf8').replaceAll('\r\n','\n');
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const p = s => '<p>'+esc(s)+'</p>';
const h = (n,s) => '<h'+n+'>'+esc(s)+'</h'+n+'>';
const list = items => '<ul>'+items.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>';
const nav = '<nav aria-label="Información del sitio"><a href="/">Inicio</a><a href="/projects/">Proyectos</a><a href="/about/">Sobre Arturo</a><a href="/contact/">Contacto</a><a href="/privacy/">Privacidad</a></nav>';
const footer = '<footer><a href="/llms.txt">Guía para agentes</a><a href="/sitemap.xml">Mapa del sitio</a><a href="/index.md">Versión Markdown</a></footer>';
const entity = {
  '@type':'Person','@id':site.url+'/#arturo',name:site.name,url:site.url+'/',
  jobTitle:'COO y socio en AMEZ CFO',email:site.email,
  worksFor:{'@type':'Organization',name:'AMEZ CFO'},
  contactPoint:{'@type':'ContactPoint',contactType:'Consultas sobre proyectos y colaboración',email:site.email,availableLanguage:['es','en']},
  address:{'@type':'PostalAddress',addressLocality:site.location,addressCountry:'MX'},
  sameAs:['https://www.linkedin.com/in/arturo-villagomez-gomez','https://github.com/FinDataMan']
};
const schema = {'@context':'https://schema.org','@graph':[
  entity,
  {'@type':'WebSite','@id':site.url+'/#website',url:site.url+'/',name:site.name,
   publisher:{'@id':entity['@id']},copyrightHolder:{'@id':entity['@id']},inLanguage:['es','en']}
]};
const links = md => '<link rel="alternate" type="text/markdown" href="'+md+'"><link rel="describedby" href="/llms.txt">';
function page(title,slug,body,schemaData=schema,description=title+' — información pública del sitio personal de Arturo Villagomez.') {
  const url=site.url+'/'+slug+'/';
  return '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — Arturo Villagomez</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+url+'">'+links('/'+slug+'/index.md')+'<link rel="stylesheet" href="/assets/agent-pages.css"><script type="application/ld+json">'+JSON.stringify(schemaData)+'</script></head><body><main class="agent-page">'+nav+'<p class="eyebrow">Arturo Villagomez · Sistemas que escalan</p>'+h(1,title)+body+footer+'</main></body></html>\n';
}
function put(name,text){generated.set(name,text);}

let html=read('index.html');
// Mechanical extraction: retain the original stylesheet verbatim, reduce raw HTML overhead.
const landingStyle=html.match(/<helmet>[\s\S]*?<style>([\s\S]*?)<\/style>/);
if(landingStyle){
  put('assets/landing.css',landingStyle[1]);
  html=html.replace('<style>'+landingStyle[1]+'</style>','<link rel="stylesheet" href="/assets/landing.css">');
}else if(fs.existsSync(path.join(root,'assets/landing.css'))){
  put('assets/landing.css',read('assets/landing.css'));
}else throw Error('Missing landing stylesheet');
const source=html.match(/<script type="text\/x-dc" data-dc-script>([\s\S]*?)<\/script>/)?.[1];
if(!source)throw Error('Missing canonical landing component');
// Executes only the local reviewed component, with no I/O or DOM lifecycle.
const component=vm.runInNewContext(source+'\nnew Component()',{
  DCLogic:class{},React:{createRef:()=>({current:null}),createElement:()=>null}
},{timeout:2000});
const data=component.data(), ui=component.renderVals();
const mdParagraphs = paragraphs => paragraphs.join('\n\n')+'\n\n';
let md='# Arturo Villagomez\n\n> '+ui.heroSub+'\n\n';
let body=h(1,'Arturo Villagomez')+p(ui.essence)+p(ui.heroSub);
const section=(title,paras)=>{
  body+=h(2,title)+paras.map(p).join('');
  md+='## '+title+'\n\n'+mdParagraphs(paras);
};
section('La tesis',[ui.posBody]);
body+=h(2,'Formas de trabajar');
md+='## Formas de trabajar\n\n';
for(const r of data.routes){
  body+=h(3,r.tab)+p(r.thesis)+p(r.sub)+list(r.forms);
  md+='### '+r.tab+'\n\n'+mdParagraphs([r.thesis,r.sub])+r.forms.map(s=>'- '+s).join('\n')+'\n\n';
}
body+=h(2,'Proyectos y evidencia')+p(ui.casesSub);
md+='## Proyectos y evidencia\n\n'+mdParagraphs([ui.casesSub]);
for(const c of data.cases){
  body+=h(3,c.title)+p(c.brandThesis)+p(c.teaser)+p(c.flag);
  md+='### '+c.title+'\n\n'+mdParagraphs([c.brandThesis,c.teaser,c.flag]);
  for(const b of c.blocks){
    body+=p(b.k+': '+b.v);
    md+='**'+b.k+':** '+b.v+'\n\n';
  }
  body+='<p><a href="/projects/'+esc(c.slug)+'/">Ver página completa del proyecto</a></p>';
  md+='[Ver página completa del proyecto]('+site.url+'/projects/'+c.slug+'/)\n\n';
  if(c.link){body+='<p><a href="'+esc(c.link)+'">'+esc(c.linkLabelEs)+'</a></p>';md+='['+c.linkLabelEs+']('+c.link+')\n\n';}
}
section('Método',ui.method.map(m=>m.title+': '+m.body));
section('Sobre Arturo',[...ui.aboutBody,'Base: '+site.location+'.',site.ownership]);
section('Contacto',[ui.ctaBody,...ui.ctaPrompts.map(x=>x.no+' · '+x.label),ui.ctaNext,'Correo: '+site.email+'.']);
body+='<p><a href="'+esc(ui.ctaHref)+'">Escribir a Arturo</a></p>';
md+='[Contactar a Arturo]('+site.url+'/contact/)\n\n[Sobre Arturo]('+site.url+'/about/) · [Privacidad]('+site.url+'/privacy/)\n';
put('index.md',md);

// Static fallback remains visible until the real interactive component mounts.
const fallback='<!-- AGENT-STATIC-START -->\n<main id="static-home" class="agent-page">'+nav+body+footer+'</main>\n<!-- AGENT-STATIC-END -->';
html=html.replace(/<!-- AGENT-STATIC-START -->[\s\S]*?<!-- AGENT-STATIC-END -->\n?/,'');
html=html.replace('<x-dc>',fallback+'\n<x-dc>');
if(!html.includes('href="/assets/agent-pages.css"'))
  html=html.replace('</head>',links('/index.md')+'\n<link rel="stylesheet" href="/assets/agent-pages.css">\n</head>');
html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify(schema)+'</script>');
put('index.html',html);

let projectsBody=p('Ocho proyectos con su problema, sistema, rol, evidencia y estado declarados. Las imágenes se conservan completas para no alterar la lectura de cada sistema de marca.')+'<div class="project-index">';
let projectsMd='# Proyectos de Arturo Villagomez\n\nOcho proyectos con su problema, sistema, rol, evidencia y estado declarados.\n\n';
for(const c of data.cases){
  const projectUrl=site.url+'/projects/'+c.slug+'/';
  projectsBody+='<article>'+h(2,c.title)+p(c.brandThesis)+p(c.flag)+'<p><a href="/projects/'+esc(c.slug)+'/">Abrir proyecto</a></p></article>';
  projectsMd+='## ['+c.title+']('+projectUrl+')\n\n'+mdParagraphs([c.brandThesis,c.flag]);
  const gallery=c.gal.map((g,i)=>'<figure><img src="/'+esc(g.src)+'" alt="'+esc(c.imgAlt)+'"><figcaption>'+esc(String(i+1).padStart(2,'0')+' · '+g.cap)+'</figcaption></figure>').join('');
  const dossier=c.blocks.map(b=>h(2,b.k)+p(b.v)).join('');
  const external=c.link?'<p><a href="'+esc(c.link)+'">'+esc(c.linkLabelEs)+'</a></p>':'';
  const projectBody=p(c.brandThesis)+p(c.teaser)+'<p class="status">'+esc(c.flag)+'</p><div class="project-gallery">'+gallery+'</div>'+dossier+external+'<p><a href="/projects/">Volver a todos los proyectos</a></p>';
  const projectSchema={'@context':'https://schema.org','@graph':[entity,{
    '@type':'CreativeWork','@id':projectUrl+'#case',url:projectUrl,name:c.title,headline:c.brandThesis,
    description:c.teaser,creator:{'@id':entity['@id']},author:{'@id':entity['@id']},inLanguage:['es','en'],
    image:c.gal.map(g=>site.url+'/'+g.src),isPartOf:{'@id':site.url+'/#website'}
  }]};
  put('projects/'+c.slug+'/index.html',page(c.title,'projects/'+c.slug,projectBody,projectSchema,c.teaser));
  let caseMd='# '+c.title+'\n\n> '+c.brandThesis+'\n\n'+mdParagraphs([c.teaser,'Estado: '+c.flag]);
  caseMd+='## Galería\n\n'+c.gal.map((g,i)=>String(i+1)+'. ['+g.cap+']('+site.url+'/'+g.src+')').join('\n')+'\n\n';
  for(const b of c.blocks)caseMd+='## '+b.k+'\n\n'+b.v+'\n\n';
  if(c.link)caseMd+='['+c.linkLabelEs+']('+c.link+')\n\n';
  caseMd+='[Volver a todos los proyectos]('+site.url+'/projects/)\n';
  put('projects/'+c.slug+'/index.md',caseMd);
}
projectsBody+='</div>';
put('projects/index.html',page('Proyectos','projects',projectsBody,schema,'Portafolio de Arturo Villagomez: ocho proyectos con evidencia, rol y estado declarados.'));
put('projects/index.md',projectsMd.trimEnd()+'\n');

const about=[...ui.aboutBody,'Base profesional: '+site.location+'. Formación: Economía y Finanzas, Tecnológico de Monterrey. Idiomas de trabajo: español e inglés.',site.ownership,ui.posBody];
put('about/index.html',page('Sobre Arturo','about',about.map(p).join('')+h(2,'Forma de colaborar')+p(ui.heroSub)));
put('about/index.md','# Sobre Arturo Villagomez\n\n'+mdParagraphs(about)+'## Forma de colaborar\n\n'+ui.heroSub+'\n');
const contact=[ui.ctaBody,'El canal de contacto personal es '+site.email+'. Para iniciar una conversación, describe el problema que quieres resolver, el contexto del equipo, el alcance que imaginas y el siguiente paso que propones. No es necesario compartir información confidencial para una primera conversación.','Las formas de colaboración incluyen proyectos con equipos, acompañamiento fraccional y venture building selectivo. El alcance, la duración y el nivel de involucramiento se acuerdan directamente; el sitio no publica tarifas ni garantiza disponibilidad o tiempos de respuesta.',site.ownership,'Arturo tiene su base profesional en '+site.location+'. Este sitio no publica una dirección de visitas ni un teléfono personal. El enlace de email abre tu aplicación de correo; no envía nada automáticamente.'];
put('contact/index.html',page('Contacto','contact',contact.map(p).join('')+'<p><a href="mailto:'+site.email+'">Escribir a Arturo</a></p>'));
put('contact/index.md','# Contacto con Arturo Villagomez\n\n'+mdParagraphs(contact)+'[Escribir a Arturo](mailto:'+site.email+')\n');
const privacyBody=site.privacy.map(s=>h(2,s.title)+p(s.text)).join('')+'<p><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">Privacidad del alojamiento GitHub</a></p>';
put('privacy/index.html',page('Privacidad','privacy',privacyBody));
put('privacy/index.md','# Privacidad\n\n'+site.privacy.map(s=>'## '+s.title+'\n\n'+s.text+'\n').join('\n')+'\n[Privacidad de GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)\n');
put('agent-instructions.md','# Guía de uso del sitio de Arturo Villagomez\n\n'+site.ownership+'\n\n## When to use this site / Cuándo usarlo\n\n'+site.whenToUse.map(s=>'- '+s).join('\n')+'\n\n## Cómo proceder\n\n'+site.instructions.map(s=>'- '+s).join('\n')+'\n\n[Información y casos]('+site.url+'/index.md) · [Contacto]('+site.url+'/contact/index.md)\n');
put('llms.txt','# Arturo Villagomez\n\n> Sitio personal: finanzas, operaciones, producto e IA aplicada. Colaboración por proyectos y sistemas que escalan.\n\n'+site.ownership+'\n\nUse las fuentes siguientes para evaluar experiencia y colaboraciones; el sitio no proporciona una API de ejecución.\n\n## When to use this site\n\n- [Cuándo usar este sitio y cómo proceder]('+site.url+'/agent-instructions.md): Perfil, proyectos, acompañamiento fraccional, límites de evidencia y contacto con autorización humana.\n\n## Información principal\n\n- [Perfil, método y portafolio]('+site.url+'/index.md): Contenido derivado de la misma fuente que la página interactiva.\n- [Índice de proyectos]('+site.url+'/projects/index.md): Ocho casos con páginas canónicas y estados de evidencia.\n- [Sobre Arturo]('+site.url+'/about/index.md): Trayectoria, base profesional y propiedad del sitio.\n- [Contacto]('+site.url+'/contact/index.md): Canal personal y contexto para una consulta.\n- [Privacidad]('+site.url+'/privacy/index.md): Proveedores técnicos, correo y alcance de la información.\n\n## Optional\n\n- [CV público]('+site.url+'/cv/): Documento profesional complementario; conserve sus fechas y alcance.\n- [Mapa del sitio]('+site.url+'/sitemap.xml): URLs canónicas públicas.\n');
const notFound='# 404 — Página no encontrada\n\nLa ruta solicitada no existe. No es una página de un proyecto.\n\n- [Inicio]('+site.url+'/)\n- [Índice para agentes]('+site.url+'/llms.txt)\n- [Mapa del sitio]('+site.url+'/sitemap.xml)\n- [Contacto]('+site.url+'/contact/)\n';
put('404.md',notFound);
put('404.html','<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página no encontrada — Arturo Villagomez</title><link rel="stylesheet" href="/assets/agent-pages.css">'+links('/404.md')+'</head><body><main class="agent-page">'+nav+h(1,'Página no encontrada')+p('La dirección solicitada no existe. Consulta el índice antes de intentar otra ruta.')+'<pre>'+esc(notFound)+'</pre>'+footer+'</main></body></html>\n');
const managedRoutes=['about','contact','privacy','projects',...data.cases.map(c=>'projects/'+c.slug)];
const sitemap=read('sitemap.xml').replace(/\s*<url><loc>https:\/\/arturovillagomez.com\/(?:about|contact|privacy|projects(?:\/[^<]+)?)\/<\/loc>[\s\S]*?<\/url>/g,'').replace('</urlset>',managedRoutes.map(s=>'  <url><loc>'+site.url+'/'+s+'/</loc></url>').join('\n')+'\n</urlset>');
put('sitemap.xml',sitemap);
const negotiated={'/':'index','/about/':'about/index','/contact/':'contact/index','/privacy/':'privacy/index','/projects/':'projects/index'};
for(const c of data.cases)negotiated['/projects/'+c.slug+'/']='projects/'+c.slug+'/index';
put('agent-public-files.json',JSON.stringify({
  schema_version:1,origin:site.url,
  negotiated,
  files:[...generated.keys(),'llms.txt','agent-instructions.md','404.md','assets/agent-pages.css','assets/landing.css','robots.txt','cv/index.html','support.js','image-slot.js','agent-readiness-manifest.json'].filter((v,i,a)=>a.indexOf(v)===i)
},null,2)+'\n');
let dirty=false;
const integrity={revision:'agent-readiness-R1',base_commit:'819a4439829e02fc105207d0c503e018101daa20',state:'LOCAL_PREPARATION_NOT_DEPLOYED',owner:site.name,artifacts:{}};
for(const [name,text]of generated)integrity.artifacts[name]={sha256:crypto.createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text)};
for(const name of ['assets/agent-pages.css','content/site-information.mjs','scripts/build-agent-content.mjs','scripts/agent-server.mjs','scripts/audit-endpoints.mjs','tests/agent-readiness.test.mjs','package.json','pnpm-lock.yaml']){
  const bytes=fs.readFileSync(path.join(root,name));
  integrity.artifacts[name]={sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length};
}
put('agent-readiness-manifest.json',JSON.stringify(integrity,null,2)+'\n');
for(const [name,text] of generated){
  if(check){if(!fs.existsSync(path.join(root,name))||read(name)!==text){console.error('STALE '+name);dirty=true;}}
  else{fs.mkdirSync(path.dirname(path.join(root,name)),{recursive:true});fs.writeFileSync(path.join(root,name),text);}
}
if(dirty)process.exitCode=1;
else console.log((check?'Verified ':'Generated ')+generated.size+' synchronized artifacts.');
