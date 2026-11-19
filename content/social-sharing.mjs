// Server-readable sharing metadata; no JavaScript execution required by crawlers.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function withSocialMeta(html){
 const english=/<html[^>]*lang="en"/.test(html),lang=english?'en':'es';
 const title=html.match(/<title>([^<]*)<\/title>/)?.[1]||'Arturo Villagomez';
 const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||title;
 const canonical=html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]||'https://arturovillagomez.com/';
 const image='https://arturovillagomez.com/assets/arturo-villagomez-share-'+lang+'-20261119.jpg';
 const alt=english?'Arturo Villagomez — Finance, Operations and Applied AI':'Arturo Villagomez — Finanzas, Operaciones e IA aplicada';
 html=html.replace(/<meta (?:property|name)="(?:og:|twitter:)[^"]*"[^>]*>/g,'');
 const values={'og:type':'website','og:site_name':'Arturo Villagomez','og:title':title,'og:description':description,'og:url':canonical,'og:locale':english?'en_US':'es_MX','og:image':image,'og:image:secure_url':image,'og:image:type':'image/jpeg','og:image:width':'1200','og:image:height':'630','og:image:alt':escape(alt),'twitter:card':'summary_large_image','twitter:title':title,'twitter:description':description,'twitter:image':image,'twitter:image:alt':escape(alt)};
 return html.replace('</head>',Object.entries(values).map(([key,value])=>'<meta '+(key.startsWith('og:')?'property':'name')+'="'+key+'" content="'+value+'">').join('')+'</head>');
}
