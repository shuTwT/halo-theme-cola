const config={selector:"a",container:"body",cache:!0,hash:!1,same:!0,debug:!1,filter:{selector:null,content:null},custom:{append:null},events:null},SUPPORT={PASS:0,HASH:1,HTML5:2},suppost=history.pushState?SUPPORT.HTML5:"onhashchange"in window?SUPPORT.HASH:SUPPORT.PASS,util={extend:function(e,t){if(t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}},log:function(e){config.debug&&console.log("coffce-pjax: "+e)},getPath:function(e){return e.replace(location.protocol+"//"+location.host,"")},getFullHref:function(e){var t=document.createElement("a");return t.href=e,t.href},matchSelector:function(e,t){var n=document.documentElement.webkitMatchesSelector||document.documentElement.mozMatchesSelector||document.documentElement.msMatchesSelector||function(e,t){if(t.tagName===e.toUpperCase())return!0;for(var n=document.querySelectorAll(e),o=n.length;o--;)if(n[o]===this)return!0;return!1};return util.matchSelector=function(e,t){return n.call(e,t)},util.matchSelector(e,t)}},cache={key:function(e){return"coffce-pjax["+e+"]"},get:function(e){e=sessionStorage.getItem(cache.key(e));return e&&JSON.parse(e)},set:function(e,t){try{sessionStorage.setItem(cache.key(e),JSON.stringify(t))}catch(e){util.log("超出本地存储容量上线，本次操作将不使用本地缓存")}},clear:function(){for(var e=sessionStorage.length;e--;){var t=sessionStorage.key(e);-1<t.indexOf("coffce-pjax")&&sessionStorage.removeItem(t)}}},event={popstate:function(){core.fnb=!0,core.turn(location.href,null,null)},hashchange:function(){core.fnb&&core.turn(location.href.replace("#/",""),null,null)},click:function(e){var t,n=e.target||e.srcElement;!util.matchSelector(n,config.selector)||config.filter.selector&&!config.filter.selector(n)||void 0!==(t=(t=n.getAttribute("data-coffce-pjax-href"))?util.getFullHref(t):n.href)&&""!==t&&(e.preventDefault?e.preventDefault():window.event.returnValue=!1,config.same||t!==location.href)&&(e=n.getAttribute("data-coffce-pjax"),core.fnb=!1,core.turn(t,e,null))},bindEvent:function(){suppost===SUPPORT.HTML5?(window.addEventListener("popstate",event.popstate),window.addEventListener("click",event.click)):(window.attachEvent("onhashchange",event.hashchange),document.documentElement.attachEvent("onclick",event.click))},unbindEvent:function(){suppost===SUPPORT.HTML5?(window.removeEventListener("popstate",event.popstate),window.removeEventListener("click",event.click)):(window.detachEvent("onhashchange",event.hashchange),document.documentElement.detachEvent("onclick",event.click))}},pjax={ready:!1,events:{},init:function(e){if(suppost===SUPPORT.PASS)util.log("不支持该版本的浏览器");else{if(util.extend(config,e),"string"==typeof config.container){e=config.container;if(config.container=document.querySelector(config.container),null===config.container)throw new Error("找不到Element："+e)}if(config.events)for(var t in config.events)pjax.on(t,null,config.events[t]);suppost===SUPPORT.HASH&&2<location.hash.length&&(config.container.innerHTML="",pjax.ready=!0,core.fnd=!1,core.turn(location.href.replace("#/",""),null,function(){pjax.trigger("init")})),event.bindEvent(),pjax.ready||(pjax.ready=!0,pjax.trigger("init"))}},destroy:function(){pjax.events=null,event.unbindEvent(),util.clearCache()},turn:function(e,t,n){e=util.getFullHref(e),core.fnb=!1,core.turn(e,t,n)},on:function(e,t,n){t=void 0===n?(n=t,null):t&&util.getFullHref(t),pjax.events[e]=pjax.events[e]||[],pjax.events[e].push({listener:n,url:t})},off:function(e,t){if(t){var n=pjax.events[e];t=util.getFullHref(t);for(var o=0;o<n.length;o++)n[o].url===t&&(n.splice(o,1),o--);if(n.length)return}delete pjax.events[e]},trigger:function(e,t){var n=pjax.events[e];if(n)for(var o=0,c=n.length;o<c;o++)n[o].listener.call(pjax,t)}},core={fnb:!1,show:function(e,t){pjax.trigger("end"),document.title=e,config.custom.append?config.custom.append(t,config.container):config.container.innerHTML=t,pjax.trigger("init")},turn:function(n,o,c){var r={url:n,fnb:core.fnb,data:o};if(core.fnb&&config.cache){var e=cache.get(n);if(null!==e)return void core.show(e.title,e.html)}var i=new XMLHttpRequest;i.open("GET",n,!0),i.setRequestHeader("COFFCE-PJAX","true"),i.setRequestHeader("X-Requested-With","XMLHttpRequest"),r.xhr=i,pjax.trigger("ajaxBegin",r),i.onreadystatechange=function(){var e,t;4===i.readyState&&(200<=i.status&&i.status<300||304===i.status?(e=i.getResponseHeader("COFFCE-PJAX-TITLE")||document.title,t=i.responseText,config.filter.content&&!config.filter.content(e,t)?util.log("filter.content过滤不通过"):(c&&c(o),pjax.trigger("ajaxSuccess",r),core.show(e,t),core.fnb||(suppost===SUPPORT.HTML5?history.pushState(null,null,n):location.hash=util.getPath(n),config.cache&&cache.set(n,{title:e,html:t})))):(pjax.trigger("ajaxError",null,r),util.log("请求失败，错误码："+i.status)),core.fnb=!0)},i.send()}};"undefined"!=typeof window&&console.log("\n %c pjax v1.0.0 \n","color: #fadfa3; background: #030307; padding:5px 0;");export{pjax};