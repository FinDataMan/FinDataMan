import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {withSocialMeta} from '../content/social-sharing.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
function jpegSize(b){assert.equal(b.readUInt16BE(0),0xffd8);let i=2;while(i<b.length){while(b[i]===255)i++;const marker=b[i++],length=b.readUInt16BE(i);if([0xc0,0xc1,0xc2].includes(marker))return [b.readUInt16BE(i+5),b.readUInt16BE(i+3)];i+=length;}throw Error('Missing JPEG frame');}
test('ES and EN sharing covers are JPEG 1200 x 630 below 500KB',()=>{for(const lang of ['es','en']){const b=fs.readFileSync(new URL('assets/arturo-villagomez-share-'+lang+'-20261119.jpg',root));assert.deepEqual(jpegSize(b),[1200,630]);assert.ok(b.length<500000);}});
test('all six principal pages expose one localized sharing card in the HTML head',()=>{for(const file of ['index.html','index-en.html','amez-cfo.html','amez-cfo-en.html','trayectoria.html','trayectoria-en.html']){const html=read(file),head=html.split('</head>')[0],lang=file.includes('-en')?'en':'es';assert.equal((head.match(/property="og:image"/g)||[]).length,1);assert.match(head,new RegExp('share-'+lang+'-20261119.jpg'));assert.match(head,/name="twitter:image"/);assert.match(head,/property="og:image:width" content="1200"/);assert.match(head,/property="og:image:height" content="630"/);assert.match(head,/property="og:image:type" content="image\/jpeg"/);assert.match(head,/name="twitter:card" content="summary_large_image"/);assert.equal(withSocialMeta(html),html);}});
test('legacy image URLs retain compatibility with the current Spanish cover',()=>{const current=fs.readFileSync(new URL('assets/arturo-villagomez-share-es-20261119.jpg',root));for(const name of ['og-image.jpg','arturo-villagomez-social-card-v1.jpg','arturo-villagomez-cv-social-card-v1.jpg'])assert.deepEqual(fs.readFileSync(new URL('assets/'+name,root)),current);});
