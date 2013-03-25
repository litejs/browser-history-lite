


/*
* @version  0.0.1
* @author   Lauri Rooden - https://github.com/litejs/browser-history-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/



!function(win, doc, his) {
	var cb, base, last_route, iframe, tick, last
	, clean_route = /^[#\/\!]+|[\s\/]+$/g
	, ie6_7 = !+"\v1" && (doc.documentMode||1) < 8

	function getUrl(loc) {
		if (base) {
			return location.pathname.slice(base.length).replace(clean_route, "")
		}
		/*
		* https://bugs.webkit.org/show_bug.cgi?id=30225
		* https://github.com/documentcloud/backbone/pull/967
		*/
		return ((loc || location).hash||"").replace(clean_route, "")
	}

	function checkUrl() {
		if (last_route != (last_route = getUrl()) && cb) cb(last_route)
	}
	
	function setUrl(url, replace) {
		if (base) {
			his[replace ? "replaceState" : "pushState"](null, null, base + url)
		} else {
			location[replace ? "replace" : "assign"]("#" + url)
			/*
			* Opening and closing the iframe tricks IE7 and earlier 
			* to push a history entry on hash-tag change.
			*/
			if (iframe && getUrl() !== getUrl(iframe.location) ) {
				iframe.location[replace ? "replace" : iframe.document.open().close(), "assign"]("#" + url)
			}
		}
		checkUrl()
	}

	his.getUrl = getUrl
	his.setUrl = setUrl

	his.start = function(_cb, _base) {
		if (!cb) {
			if (_base && his.pushState) {
				base = _base
				/*
				* Chrome and Safari emit a popstate event on page load, Firefox doesn't.
				* Firing popstate after onload is as designed.
				*
				* See the discussion on https://bugs.webkit.org/show_bug.cgi?id=41372, 
				* https://code.google.com/p/chromium/issues/detail?id=63040
				* and the change to the HTML5 spec that was made: 
				* http://html5.org/tools/web-apps-tracker?from=5345&to=5346. 
				*/
				win.onpopstate = checkUrl
			} else if ("onhashchange" in win && !ie6_7) {
				/*
				* There are onhashchange in IE7 but its not get emitted
				*
				* Basic support: 
				* Chrome 5.0, Firefox (Gecko) 3.6 (1.9.2), IE 8.0, Opera 10.6, Safari 5.0
				*/
				win.onhashchange = checkUrl
			} else {
				if (ie6_7) {
					iframe = doc.body.appendChild(doc.createElement('<iframe class="hidden" src="javascript:0" tabindex="-1" />')).contentWindow
				}
				last = getUrl()
				tick = setInterval(function(){
					var cur = getUrl()
					if (iframe && last === cur) cur = getUrl(iframe.location)
					if (last !== cur) {
						last = cur
						iframe ? setUrl(cur) : checkUrl()
					}
				}, 50)
			}
		}
		cb = _cb
		checkUrl()
	}
}(this, document, history)



