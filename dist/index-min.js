/*! litejs.com/MIT-LICENSE.txt */
!function(l,m,d,e){function c(b){return(g?e.pathname.slice(g.length):(b||e).href.split("#")[1]||"").replace(v,"")}function n(f,a){if(g)d[a?"replaceState":"pushState"](null,null,g+f);else if(e[a?"replace":"assign"]("#"+f),b&&c()!==c(b.location))b.location[a?"replace":b.document.open().close(),"assign"]("#"+f);h()}function h(){p!=(p=c())&&q&&q(p)}var q,g,p,b,t,r,v=/^[#\/\!]+|[\s\/]+$/g,u=!+"\v1"&&8>(m.documentMode||1);d.getUrl=c;d.setUrl=n;d.start=function(f,a,k){q=f;a&&!d.pushState&&(k=e.pathname.slice(a.length))&&
e.replace(a+"#"+k);a&&d.pushState?(g=a,(k=e.href.split("#")[1])&&!c()&&n(k,1),l.onpopstate=h):"onhashchange"in l&&!u?l.onhashchange=h:(u&&!b&&(b=m.body.appendChild(m.createElement('<iframe class="hide" tabindex="-1">')).contentWindow),clearInterval(t),t=setInterval(function(){var a=c();b&&r===a&&(a=c(b.location));r!==a&&(r=a,b?n(a):h())},60));h()}}(this,document,history,location);
