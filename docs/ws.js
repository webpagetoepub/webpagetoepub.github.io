/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-68847b76'], (function (workbox) { 'use strict';

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "apple-touch-icon.png",
    "revision": "df917bb2cc5db39900a663973d6d50df"
  }, {
    "url": "css/style.1617cf5d21df3c9f9e1c.css",
    "revision": null
  }, {
    "url": "favicon.ico",
    "revision": "84c9494a92a11aaa62a33c8e466bb606"
  }, {
    "url": "img/android-chrome-192x192.png",
    "revision": "c6b4998bc0a618d04720cbc22e63ebbe"
  }, {
    "url": "img/android-chrome-256x256.png",
    "revision": "1f4d1c410f0a0f70b2202c11beb28871"
  }, {
    "url": "img/android-chrome-512x512.png",
    "revision": "3101293aac92db0182686a248ffff557"
  }, {
    "url": "img/favicon-16x16.png",
    "revision": "44685e0fe01ba668e2b005b584893188"
  }, {
    "url": "img/favicon-32x32.png",
    "revision": "0e4d8597e2959aad8b0ff78be3ca7ce1"
  }, {
    "url": "img/maskable_icon_x192.png",
    "revision": "8c90ad4ca58eb112cb48464564788eb1"
  }, {
    "url": "img/maskable_icon_x256.png",
    "revision": "b02fee8c430af763ea2ce0e87558436e"
  }, {
    "url": "img/maskable_icon_x512.png",
    "revision": "61516184148c9bab8f424baf802d2a07"
  }, {
    "url": "img/mstile-150x150.png",
    "revision": "e8929152bf6e784a5676e92a3710f33c"
  }, {
    "url": "img/og_image.png",
    "revision": "fa09d51d09bc1e59b788a30db6a306eb"
  }, {
    "url": "img/safari-pinned-tab.svg",
    "revision": "e91f2093cefca50c97caff7fb4a9df98"
  }, {
    "url": "index.html",
    "revision": "17072cdcd1ca8eb9f370eee37679864a"
  }, {
    "url": "js/ejs.min.js",
    "revision": "b7ee446dc6a61a45e1e48c692fb5024f"
  }, {
    "url": "js/jszip.min.js",
    "revision": "b5d02b3f0bf3ae026451909419df07bb"
  }, {
    "url": "js/script.b40ec091e5ef6bb7b615.js",
    "revision": null
  }, {
    "url": "manifest.webmanifest",
    "revision": "ac1e6238dc5cfe95faad1f59504fc7f8"
  }], {
    "ignoreURLParametersMatching": [/^utm_/, /^fbclid$/]
  });

}));
