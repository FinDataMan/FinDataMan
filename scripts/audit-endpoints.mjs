// Read-only public/local HTTP evidence. This does not calculate or claim an Ora score.
import fs from 'node:fs';
import path from 'node:path';
const base=(process.argv[2]||'http://127.0.0.1:8798').replace(/\/$/,'');
const results=[];
const paths=['/','/about/','/contact/','/privacy/','/llms.txt','/agent-instructions.md','/index.md','/about/index.md','/contact/index.md','/privacy/index.md','/404.md','/robots.txt','/sitemap.xml','/agent-public-files.json','/cv/','/agent-audit-path-that-does-not-exist'];
for(const endpoint of paths){
  for(const accept of (['/','/about/','/contact/','/privacy/','/agent-audit-path-that-does-not-exist'].includes(endpoint)?['text/html','text/markdown']:['*/*'])){
    try{
      const r=await fetch(base+endpoint,{headers:{Accept:accept},signal:AbortSignal.timeout(15000)});
      const body=await r.text();
      results.push({endpoint,accept,status:r.status,url:r.url,contentType:r.headers.get('content-type'),vary:r.headers.get('vary'),chars:body.length,recovery:body.includes('llms.txt')&&body.includes('sitemap.xml')});
    }catch(e){results.push({endpoint,accept,error:e.message});}
  }
}
const report={base,checked_at:new Date().toISOString(),deployment:'observed only',results};
const output=process.argv.find(a=>a.startsWith('--out='))?.slice(6);
if(output){
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({base,checks:results.length,statuses:results.reduce((a,r)=>(a[r.status||'error']=(a[r.status||'error']||0)+1,a),{}),output}));
}else console.log(JSON.stringify(report,null,2));
