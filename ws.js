if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,c)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let o={};const s=e=>n(e,a),f={module:{uri:a},exports:o,require:s};i[a]=Promise.all(r.map((e=>f[e]||s(e)))).then((e=>(c(...e),o)))}}define(["./workbox-9a84fccb"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"df917bb2cc5db39900a663973d6d50df"},{url:"favicon.ico",revision:"84c9494a92a11aaa62a33c8e466bb606"},{url:"img/android-chrome-192x192.png",revision:"c6b4998bc0a618d04720cbc22e63ebbe"},{url:"img/android-chrome-256x256.png",revision:"1f4d1c410f0a0f70b2202c11beb28871"},{url:"img/android-chrome-512x512.png",revision:"3101293aac92db0182686a248ffff557"},{url:"img/favicon-16x16.png",revision:"44685e0fe01ba668e2b005b584893188"},{url:"img/favicon-32x32.png",revision:"0e4d8597e2959aad8b0ff78be3ca7ce1"},{url:"img/maskable_icon_x192.png",revision:"8c90ad4ca58eb112cb48464564788eb1"},{url:"img/maskable_icon_x256.png",revision:"b02fee8c430af763ea2ce0e87558436e"},{url:"img/maskable_icon_x512.png",revision:"61516184148c9bab8f424baf802d2a07"},{url:"img/mstile-150x150.png",revision:"e8929152bf6e784a5676e92a3710f33c"},{url:"img/og_image.png",revision:"fa09d51d09bc1e59b788a30db6a306eb"},{url:"img/safari-pinned-tab.svg",revision:"e91f2093cefca50c97caff7fb4a9df98"},{url:"site.webmanifest",revision:"f109b0c755754f1f72ae2149f662669d"},{url:"css/style.min.css",revision:"05ad4adf2d587f1797471d03ef449c6c"},{url:"js/script.min.js",revision:"459205df87c23843a14e6566b23abc38"},{url:"index.html",revision:"ac5004075d06ac65ad5662b345bd0647"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
