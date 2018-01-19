"use strict";

var Common = {
	POST: "POST",
	GET: "GET",
	XMLHTTPRequest: function(url, data, cb, method) {
		method = method || Common.GET;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open(method, url, true);
		if (cc.sys.isNative) {
			xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
		}
		xhr.setRequestHeader("Content-Type"
			, "application/x-www-form-urlencoded");
		// note: In Internet Explorer, the timeout property may be set only after calling the open()
		// method and before calling the send() method.
		xhr.timeout = 5000; // 5 seconds for timeout// Simple events
		['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
			xhr["on" + eventname] = function () {
				//cb(xhr, eventname);
			};
		});
		// generate query data string.
		var dataStr = "";
		for(var k in data) {
			dataStr = dataStr + '&' + k + "=" + data[k];
		}
		if (dataStr.length > 0) {
			dataStr = dataStr.substr(1);
		}
		cc.log(dataStr);
		// Special event
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				cb(xhr);
			}
		};
		xhr.send(dataStr);
	},
	handler: function(target, callback) {
		return function() {
			callback.apply(target, arguments);
		}
	},
	SAVE_KEY: "DATA",
	saveRank: function(rankList) {
		cc.sys.localStorage.setItem(Common.SAVE_KEY, JSON.stringify(rankList));
	},
	loadRank: function() {
		var rankList = JSON.parse(cc.sys.localStorage.getItem(Common.SAVE_KEY) || "[]");
		return rankList;
	}
};

module.exports = Common;