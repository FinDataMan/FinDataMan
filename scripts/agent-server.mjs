// Reference adapter for a future compatible host. NOT executed by GitHub Pages.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import Negotiator from 'negotiator';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.pdf':'application/pdf'};
export function choose(accept, offered=['text/html; charset=utf-8','text/markdown; charset=utf-8']){
  return new Negotiator({headers:accept===undefined?{}:{accept}}).mediaType(offered);
}
export function createServer(){
  return http.createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://localhost');
      if(!['GET','HEAD'].includes(req.method)){
        res.writeHead(405,{'Allow':'GET, HEAD','Cache-Control':'no-store'});res.end();return;
      }
      let pathname;
      try{pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
      const registry=JSON.parse(await fs.readFile(path.join(root,'agent-public-files.json'),'utf8'));
      let name=pathname.slice(1),stem=registry.negotiated[pathname],status=200,negotiated=false;
      const headers={'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'};
      // Canonical redirects apply to registered information pages only, never unknown paths.
      if(pathname!=='/'&&registry.negotiated[pathname+'/']){
        res.writeHead(308,{...headers,Location:pathname+'/'});res.end();return;
      }
      if(pathname==='/index.html')stem='index';
      if(pathname.endsWith('/index.html')){
        const canonical=pathname.slice(0,-'index.html'.length);
        if(registry.negotiated[canonical])stem=registry.negotiated[canonical];
      }
      const asset=/^assets\/[a-zA-Z0-9_./-]+$/.test(name)&&!name.split('/').includes('..');
      const cv=/^cv\/[a-zA-Z0-9_./-]+$/.test(name)&&!name.split('/').includes('..');
      if(pathname==='/cv/')name='cv/index.html';
      if(stem){
        negotiated=true;
        const type=choose(req.headers.accept);
        if(!type){res.writeHead(406,{...headers,Vary:'Accept, Accept-Encoding','Content-Type':'text/plain; charset=utf-8'});res.end(req.method==='HEAD'?undefined:'Available representations: text/html, text/markdown.');return;}
        name=stem+(type.startsWith('text/markdown')?'.md':'.html');
      }else if(!registry.files.includes(name)&&name!=='agent-public-files.json'&&!asset&&!cv&&pathname!=='/cv/'){
        status=404;negotiated=true;
        const type=choose(req.headers.accept);
        if(!type){res.writeHead(406,{...headers,Vary:'Accept, Accept-Encoding'});res.end();return;}
        name=type.startsWith('text/markdown')?'404.md':'404.html';
      }
      let body;
      const target=path.resolve(root,name);
      if(!target.startsWith(root+path.sep)||name.includes('\\')||name.includes('\0')){
        status=404;negotiated=true;name=choose(req.headers.accept)?.startsWith('text/markdown')?'404.md':'404.html';
      }
      try{body=await fs.readFile(path.join(root,name));}
      catch(error){
        if(!['ENOENT','EISDIR','ENOTDIR'].includes(error.code))throw error;
        status=404;negotiated=true;
        const type=choose(req.headers.accept);
        if(!type){res.writeHead(406,{...headers,Vary:'Accept, Accept-Encoding'});res.end();return;}
        name=type.startsWith('text/markdown')?'404.md':'404.html';
        body=await fs.readFile(path.join(root,name));
      }
      const contentType=types[path.extname(name)]||'application/octet-stream';
      if(!negotiated&&!choose(req.headers.accept,[contentType])){
        res.writeHead(406,{...headers,Vary:'Accept, Accept-Encoding'});res.end();return;
      }
      headers['Content-Type']=contentType;
      headers['Content-Length']=body.length;
      headers.Vary='Accept, Accept-Encoding';
      // Variant-specific ETags and no-store avoid cross-variant cache reuse in this reference adapter.
      headers.ETag='"'+crypto.createHash('sha256').update(contentType).update(body).digest('hex')+'"';
      headers.Link='</llms.txt>; rel="describedby"'+(stem?', </'+stem+'.md>; rel="alternate"; type="text/markdown"':'');
      if(name.endsWith('.md')&&stem)headers['Content-Location']='/'+stem+'.md';
      res.writeHead(status,headers);res.end(req.method==='HEAD'?undefined:body);
    }catch{
      res.writeHead(500,{'Cache-Control':'no-store','Content-Type':'text/plain; charset=utf-8'});res.end('Internal error.');
    }
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||8798);
  createServer().listen(port,'127.0.0.1',()=>console.log('Local reference adapter: http://127.0.0.1:'+port+' (not a public deployment)'));
}
