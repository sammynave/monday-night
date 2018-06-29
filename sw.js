(function(){"use strict"
function e(e,t){return caches.keys().then(function(n){n.forEach(function(n){var s=0===n.indexOf(e),c=n!==t
s&&c&&caches.delete(n)})})}function t(e){var t=arguments.length<=1||void 0===arguments[1]?self.location:arguments[1]
return decodeURI(new URL(encodeURI(e),t).toString())}function n(e){var n=t(e)
return new RegExp("^"+n+"$")}function s(e,t){return!!t.find(function(t){return t.test(decodeURI(e))})}self.CACHE_BUSTER="1530287493996|0.6156070842084551",self.addEventListener("install",function(e){return self.skipWaiting()}),self.addEventListener("activate",function(e){return self.clients.claim()})
var c=["assets/icon-4e20a09e0016d24aef190df08e18f5ef.png","assets/monday-night-263ece73e5903abe4067e609fa6d7662.css","assets/monday-night-4c405f6143e97cf4d33e78716f39cf56.js","assets/tailwind-c04819166359ce5fc3d39e2cd3fb6aaf.css","assets/vendor-a43e57cfe48b40a807c458c9906761be.css","assets/vendor-d81c666048c007b22a95d7876a540e6d.js"],i="esw-asset-cache-1",a=c.map(function(e){return new URL(e,self.location).toString()}),r=function(){caches.open(i).then(function(e){return e.keys().then(function(t){t.forEach(function(t){-1===a.indexOf(t.url)&&e.delete(t)})})})}
self.addEventListener("install",function(e){e.waitUntil(caches.open(i).then(function(e){return Promise.all(a.map(function(t){var n=new Request(t,{mode:"cors"})
return fetch(n).then(function(n){if(n.status>=400){var s=new Error("Request for "+t+" failed with status "+n.statusText)
throw s}return e.put(t,n)}).catch(function(e){console.error("Not caching "+t+" due to "+e)})}))}))}),self.addEventListener("activate",function(t){t.waitUntil(Promise.all([e("esw-asset-cache",i),r()]))}),self.addEventListener("fetch",function(e){var t="GET"===e.request.method,n=-1!==a.indexOf(e.request.url)
t&&n&&e.respondWith(caches.match(e.request,{cacheName:i}).then(function(t){return t||fetch(e.request)}))})
var o=["/","/*","/emails.json","https://sammynave.github.io/monday-night/","https://sammynave.github.io/monday-night/*","https://sammynave.github.io/monday-night/emails.json"],u=o.map(n)
self.addEventListener("fetch",function(e){var t=e.request
"GET"===t.method&&/^https?/.test(t.url)&&s(t.url,u)&&e.respondWith(caches.open("esw-cache-fallback-1").then(function(n){return fetch(t).then(function(e){return n.put(t,e.clone()),e}).catch(function(){return caches.match(e.request)})}))}),self.addEventListener("activate",function(t){t.waitUntil(e("esw-cache-fallback","esw-cache-fallback-1"))})
var f=[],h=[]
self.INDEX_FILE_HASH="401ec6156bb5799bff42308543a2d873"
var l=new URL("index.html",self.location).toString()
self.addEventListener("install",function(e){e.waitUntil(fetch(l,{credentials:"include"}).then(function(e){return caches.open("esw-index-1").then(function(t){return t.put(l,e)})}))}),self.addEventListener("activate",function(t){t.waitUntil(e("esw-index","esw-index-1"))}),self.addEventListener("fetch",function(e){var t=e.request,n=new URL(t.url),c="GET"===t.method,i=-1!==t.headers.get("accept").indexOf("text/html"),a=n.origin===location.origin,r=s(t.url,f),o=!h.length||s(t.url,h)
!("/tests"===n.pathname&&!1)&&c&&i&&a&&o&&!r&&e.respondWith(caches.match(l,{cacheName:"esw-index-1"}).then(function(e){return e||fetch(l,{credentials:"include"}).then(function(e){return caches.open("esw-index-1").then(function(t){return t.put(l,e)}),e.clone()})}))})})()
