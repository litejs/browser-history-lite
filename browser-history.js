


/*
* @version  0.0.3
* @author   Lauri Rooden - https://github.com/litejs/browser-history-lite
* @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
*/



!function(win, doc, his) {
	var cb, base, last_route, iframe, tick, last
	, loc = location
	, clean_route = /^[#\/\!]+|[\s\/]+$/g
	/*
	* The JScript engine used in IE doesn't recognize vertical tabulation character
	* http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	* oldIE = "\v" == "v"
	*
	* The documentMode is an IE only property, supported in IE8+.
	*
	* Starting in Internet Explorer 9 standards mode, Internet Explorer 10 standards mode, 
	* and win8_appname_long apps, you cannot identify the browser as Internet Explorer 
	* by testing for the equivalence of the vertical tab (\v) and the "v". 
	* In earlier versions, the expression "\v" === "v" returns true. 
	* In Internet Explorer 9 standards mode, Internet Explorer 10 standards mode, 
	* and win8_appname_long apps, the expression returns false.
	*/
	, ie6_7 = !+"\v1" && (doc.documentMode||1) < 8

	function getUrl(_loc) {
		var url
		if (base) {
			url = loc.pathname.slice(base.length)
		} else {
			/*
			* bug in Firefox where location.hash is decoded
			* bug in Safari where location.pathname is decoded
			* 
			* var hash = loc.href.split('#')[1] || '';
			* https://bugs.webkit.org/show_bug.cgi?id=30225
			* https://github.com/documentcloud/backbone/pull/967
			*/
			url = (_loc || loc).href.split("#")[1] || ""
		}
		/*
		* Fix decode
		* http://unixpapa.com/js/querystring.html
		*/
		url = decodeURIComponent(url.replace(/\+/g, " "))
		return url.replace(clean_route, "")
	}

	function setUrl(url, replace) {
		url = encodeURIComponent(url).replace(/%20/g, "+")
		if (base) {
			his[replace ? "replaceState" : "pushState"](null, null, base + url)
		} else {
			loc[replace ? "replace" : "assign"]("#" + url)
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

	function checkUrl() {
		if (last_route != (last_route = getUrl()) && cb) cb(last_route)
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
					iframe = doc.body.appendChild(doc.createElement('<iframe class="hide" src="javascript:0" tabindex="-1" />')).contentWindow
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



