if(!self.define){let e,i={};const c=(c,r)=>(c=new URL(c+".js",r).href,i[c]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=i,document.head.appendChild(e)}else e=c,importScripts(c),i()})).then((()=>{let e=i[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(r,s)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(i[a])return;let n={};const b=e=>c(e,a),o={module:{uri:a},exports:n,require:b};i[a]=Promise.all(r.map((e=>o[e]||b(e)))).then((e=>(s(...e),n)))}}define(["./workbox-e0a2b4da"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"df917bb2cc5db39900a663973d6d50df"},{url:"css/milligram.min.css",revision:"b2b580b8645eb6a38c18ddbd108e4f2f"},{url:"css/normalize.css",revision:"112272e51c80ffe5bd01becd2ce7d656"},{url:"css/normalize.min.css",revision:"36974225aa51d7b413c9a1cfb22e9c06"},{url:"css/style.css",revision:"cde47f4b890b2b47d778267076a89e34"},{url:"favicon.ico",revision:"84c9494a92a11aaa62a33c8e466bb606"},{url:"googlef50cea303c1ea669.html",revision:"cf7579ece9301c1ae0631ea7257743b3"},{url:"img/android-chrome-192x192.png",revision:"c6b4998bc0a618d04720cbc22e63ebbe"},{url:"img/android-chrome-256x256.png",revision:"1f4d1c410f0a0f70b2202c11beb28871"},{url:"img/android-chrome-512x512.png",revision:"3101293aac92db0182686a248ffff557"},{url:"img/favicon-16x16.png",revision:"44685e0fe01ba668e2b005b584893188"},{url:"img/favicon-32x32.png",revision:"0e4d8597e2959aad8b0ff78be3ca7ce1"},{url:"img/maskable_icon_x192.png",revision:"8c90ad4ca58eb112cb48464564788eb1"},{url:"img/maskable_icon_x256.png",revision:"b02fee8c430af763ea2ce0e87558436e"},{url:"img/maskable_icon_x512.png",revision:"61516184148c9bab8f424baf802d2a07"},{url:"img/mstile-150x150.png",revision:"e8929152bf6e784a5676e92a3710f33c"},{url:"img/og_image.png",revision:"fa09d51d09bc1e59b788a30db6a306eb"},{url:"img/safari-pinned-tab.svg",revision:"e91f2093cefca50c97caff7fb4a9df98"},{url:"index.html",revision:"a870798d2bf009e0a0184752803d1c26"},{url:"js/ejs.min.js",revision:"b7ee446dc6a61a45e1e48c692fb5024f"},{url:"js/jszip.min.js",revision:"b5d02b3f0bf3ae026451909419df07bb"},{url:"js/main.js",revision:"ac52ebd28ab21477df6d3b9afe2ce441"},{url:"site.webmanifest",revision:"f4977f6bb29fa166fd6b027ab898c259"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
