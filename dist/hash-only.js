/*! litejs.com/MIT-LICENSE.txt */
!function(l,a,d){function c(b){return((b||m).href.split("#")[1]||"").replace(r,"")}function n(e,a){m[a?"replace":"assign"]("#"+e);if(b&&c()!==c(b.location))b.location[a?"replace":b.document.open().close(),"assign"]("#"+e);f()}function f(){g!=(g=c())&&h&&h(g)}var h,g,b,p,k,m=location,r=/^[#\/\!]+|[\s\/]+$/g,q=!+"\v1"&&8>(a.documentMode||1);d.getUrl=c;d.setUrl=n;d.start=function(e,d){h=e;"onhashchange"in l&&!q?l.onhashchange=f:(q&&!b&&(b=a.body.appendChild(a.createElement('<iframe class="hide" tabindex="-1">')).contentWindow),
clearInterval(p),p=setInterval(function(){var a=c();b&&k===a&&(a=c(b.location));k!==a&&(k=a,b?n(a):f())},60));f()}}(this,document,history);
