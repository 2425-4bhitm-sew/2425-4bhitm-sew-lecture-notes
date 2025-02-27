Util = window.Util || {};
(function() {
    var regexAbsoluteHttpUrl = /^(https?:)?\/\//i;
    var regexBlank = /[^\s]+/;
    var regexNumber = /^[-]?(([0-9]+[\.]?[0-9]*)|([0-9]*[\.]?[0-9]+))$/;
    var regexPlus = /\+/g;
    var regexQueryStrKeyValue = /([^&=]+)(=?)([^&]*)/g;

    Util.appendHashString = function(url, queryString) {
        if (Util.isBlank(queryString)) {
            return url;
        }
        return url + (url.indexOf("#") >= 0 ? "&" : "#") + queryString;
    };

    Util.appendQueryString = function(url, queryString) {
        if (Util.isBlank(queryString)) {
            return url;
        }
        return url + (url.indexOf("?") >= 0 ? "&" : "?") + queryString;
    };

    Util.buildQueryString = function(kvPairs) {
        var queryStrItems = [];
        if (kvPairs != null) {
            for (var key in kvPairs) {
                var val = kvPairs[key];
                if (val == null || typeof val !== "object" && typeof val !== "function") {
                    var str = encodeURIComponent(key);
                    if (val != null) {
                        str += "=" + encodeURIComponent(val);
                    }
                    queryStrItems.push(str);
                }
            }
        }
        return queryStrItems.join("&");
    };
    
    Util.clearProps = function(o) {
        for (var prop in o) {
            delete o[prop];
        }
        return o;
    };

    Util.copyFields = function(from, to, fields) {
        for (var i = 0; i < fields.length; i++) {
            var fieldName = fields[i];
            if (from[fieldName] !== undefined) {
                to[fieldName] = from[fieldName];
            } else {
                delete to[fieldName];
            }
        }
    };
    
    Util.createUniqueList = function(list) {
        var uniqueList = [];
        angular.forEach(list, function(i) {
            if (uniqueList.indexOf(i) == -1) { //not in uniqueList
                uniqueList.push(i);
            }
        });
        
        return uniqueList;
    };

    Util.getAll = function(map, keys) {
        var addVal = function(val) {
            if (val != null) {
                all.push(val);
            }
        };
        var all = [];
        if (map != null) {
            if (arguments.length == 1) {
                for (var key in map) {
                    if (map.hasOwnProperty(key)) {
                        addVal(map[key]);
                    }
                }
            } else if (keys != null) {
                for (var i = 0; i < keys.length; i++) {
                    addVal(map[keys[i]]);
                }
            }
        }
        return all;
    };

    Util.getHttpProtocol = function() {
        return 'https:' == document.location.protocol ? 'https:' : 'http:';
    };

    Util.getKeys = function(o) {
        if (o == null) {
            return [];
        }

        var keys = [];
        if (o instanceof Array) {
            var cnt = o.length;
            for (var i = 0; i < cnt; i++) {
                if (o[i] !== undefined) {
                    keys.push(i);
                }
            }
        } else {
            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        return keys;
    };

    Util.getQueryParameterValues = function(keys, opts) {
        opts = opts || {};
        var params = {};
        if (Util.isNotBlank(window.location.search)) {
            var queryParams = Util.parseQueryString(window.location.search.substr(1));
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (queryParams[key] != null) {
                    if (!opts.ignoreBlank || Util.isNotBlank(queryParams[key])) {
                        params[key] = queryParams[key];
                    }
                }
            }
        }
        return params;
    };

    Util.isAbsoluteHttpUrl = function(s) {
        return regexAbsoluteHttpUrl.test(s);
    };

    Util.isBlank = function(s) {
        return Util.isEmpty(s) || (typeof s === "string" && !regexBlank.test(s));
    };

    Util.isEmpty = function(s) {
        return s == null || s === '';
    };

    Util.isNotBlank = function(s) {
        return !Util.isBlank(s);
    };

    Util.isNotEmpty = function(s) {
        return !Util.isEmpty(s);
    };

    Util.isNumber = function(o) {
        return typeof o === 'number' || regexNumber.test(o);
    };

    Util.parseDecimal = function(o) {
        if (Util.isNumber(o)) {
            return parseFloat(o);
        } else {
            return null;
        }
    };

    Util.parseInteger = function(o) {
        if (Util.isNumber(o)) {
            var number = parseInt(o, 10);
            if (isNaN(number)) {
                // Handle case where we are calling parseInt on a decimal number < 0 that has no leading 0 (i.e. ".12")
                return 0;
            } else {
                return number;
            }
        } else {
            return null;
        }
    };

    Util.parseHashOrQueryString = function(queryStr) {
        if (arguments.length == 0) {
            if (Util.isNotBlank(window.location.hash) && window.location.hash.length > 1) {
                return Util.parseHashParameters();
            } else {
                return Util.parseQueryString();
            }
        }
        return Util.parseQueryString(queryStr);
    };

    Util.parseHashParameters = function() {
        return Util.parseQueryString(window.location.hash.substr(1));
    };

    Util.parseQueryString = function(queryStr) {
        var regexGroups;
        var urlParams = {};

        // Default the query string to the current query string
        // if no parameters are passed in.
        if (arguments.length == 0 && Util.isNotBlank(window.location.search)) {
            queryStr = window.location.search.substr(1);
        }

        if (Util.isNotBlank(queryStr)) {
            regexQueryStrKeyValue.lastIndex = 0; // Defensive coding to make sure we are starting search at beginning of string
            while (regexGroups = regexQueryStrKeyValue.exec(queryStr)) {
                var key = decodeURIComponent(regexGroups[1].replace(regexPlus, " "));
                if (regexGroups[2] != "") {
                    urlParams[key] = decodeURIComponent(regexGroups[3].replace(regexPlus, " "));
                } else {
                    urlParams[key] = null;
                }
            }
        }
        return urlParams;
    };

    Util.replaceBlank = function(s, replacement) {
        return Util.isBlank(s) ? replacement : s;
    };

    Util.replaceEmpty = function(s, replacement) {
        return Util.isEmpty(s) ? replacement : s;
    };

    Util.replaceNull = function(o, replacement) {
        return o == null ? replacement : o;
    };

    Util.replaceUndefined = function(o, replacement) {
        return o === undefined ? replacement : o;
    };

    Util.setOrDeleteIfBlank = function(obj, key, value) {
        if (Util.isNotBlank(value)) {
            obj[key] = value;
        } else {
            delete obj[key];
        }
    };

    Util.setOrDeleteIfEmpty = function(obj, key, value) {
        if (Util.isNotEmpty(value)) {
            obj[key] = value;
        } else {
            delete obj[key];
        }
    };

    Util.setOrDeleteIfNull = function(obj, key, value) {
        if (value != null) {
            obj[key] = value;
        } else {
            delete obj[key];
        }
    };

    Util.shuffleArray = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    // WARNING: This sort function is not guaranteed to be "stable" in that
    // if two values have the same sort value their order is not guaranteed
    // to be the same before and after the sort depending on browser.
    //
    // For example, sorting { a: 1, b: true } and { a: 1, b: false } on
    // field `a` may put either of these objects first (since both
    // have the same value for field `a`) regardless of which object was
    // first in the original list.
    //
    // This is evidenced by running the unit tests in some browsers where
    // the sorting tests pass (e.g. Firefox) due to browser sort being
    // natively stable or fail (e.g. Chrome) due to browser sort *not*
    // being natively stable.
    Util.sort = function(list, opts) {
        opts = opts || {};
        var sortOrder = opts.descending ? -1 : 1;
        list.sort(function(left, right) {
            var valLeft = left;
            var valRight = right;
            if (opts.field != null) {
                valLeft = left[opts.field];
                valRight = right[opts.field];
            }

            if (valLeft === undefined) {
                return valRight === undefined ? 0 : 1;
            } else if (valRight === undefined) {
                return -1;
            } else if (valLeft === null) {
                return valRight === null ? 0 : 1;
            } else if (valRight === null) {
                return -1;
            } else {
                if (opts.compareLowerCase) {
                    valLeft = valLeft.toLowerCase();
                    valRight = valRight.toLowerCase();
                }
                if (valLeft === valRight) {
                    return 0;
                }
                return (valLeft > valRight ? 1 : -1) * sortOrder;
            }
        });
    };

    Util.sortProperties = function(o) {
        if (o == null) {
            return o;
        }

        var keys = Util.getKeys(o);
        keys.sort();

        var keyCount = keys.length;

        var sortedObject = {};
        for (var i = 0; i < keyCount; i++) {
            var key = keys[i];
            sortedObject[key] = o[key];
        }
        return sortedObject;
    };

    Util.startsWith = function(s, startStr) {
        if (s && startStr) {
            return s.substring(0, startStr.length) == startStr;
        }
        return false;
    };

    /**
     * Merges two pre-sorted lists together into a single sorted list.
     *
     * list1 and list2 must be pre-sorted with no null values.
     * list1 and list2 must not have duplicate values within themselves.
     * Values that are present on both list1 and list2 are included only
     * once in the final list.
     *
     * @param list1
     * @param list2
     * @returns {Array}
     */
    Util.zipperMerge = function(list1, list2) {
        var mergedList = [];
        var list1Idx = 0;
        var list1Length = list1.length;
        var list2Idx = 0;
        var list2Length = list2.length;
        while (true) {
            var list1Item = list1Idx < list1Length ? list1[list1Idx] : null;
            var list2Item = list2Idx < list2Length ? list2[list2Idx] : null;
            if (list1Item == null) {
                if (list2Item == null) {
                    break;
                } else {
                    mergedList.push(list2Item);
                    list2Idx++;
                }
            } else if (list2Item == null || list1Item < list2Item) {
                mergedList.push(list1Item);
                list1Idx++
            } else if (list1Item > list2Item) {
                mergedList.push(list2Item);
                list2Idx++;
            } else /* list1Item == list2Item */ {
                mergedList.push(list1Item);
                list1Idx++;
                list2Idx++;
            }
        }
        return mergedList;
    };

    /** Will remove the key sent to this function from the Hash Parameter
     *
     * @param key - the key to be removed
     */
    Util.removeFromHashParams = function(key) {
        var queryParams = Util.parseHashParameters();
        delete queryParams[key];
        window.location.hash = Util.buildQueryString(queryParams);
    };

    /**
     * Make a http get and return a promise
     *
     * @param $http - Angular HTTP object
     * @param path - Path to make the XHR Get
     * @param data - Data to be transmitted
     * @param config - Config Parameters
     */

    Util.getGetResponse = function ($http, path, data, config) {
        return $http.get(path, data, config);
    };

    /**
     * Make a http post and return a promise
     *
     * @param $http - Angular HTTP object
     * @param path - Path to make the XHR Post
     * @param data - Data to be transmitted
     * @param config - Config Parameters
     */
    Util.getPostResponse = function ($http, path, data, config) {
        return $http.post(path, data, config);
    };

    /**
     * Get cookie as an object.
     *
     * @param $ngCookies - angular cookies object
     * @param cookieName - cookie name
     * @returns {*} - the cookie as an object
     */
    Util.getCookieObject = function ($ngCookies, cookieName) {
        var cookieObj = $ngCookies.getObject(cookieName);
        if (typeof cookieObj === 'string') {
            return JSON.parse(cookieObj);
        } else if (typeof cookieObj === 'object') {
            return cookieObj;
        }
    };
})();

AEMUtil = window.AEMUtil || {};
(function() {
    AEMUtil.isDevMode = function() {
        return Util.startsWith(window.location.hostname, "localhost")
            || Util.startsWith(window.location.hostname, "author-dev-")
            || Util.startsWith(window.location.hostname, "author-qa-")
            || Util.startsWith(window.location.hostname, "dev-")
            || Util.startsWith(window.location.hostname, "qa-");
    };
    AEMUtil.pageIsBeingAuthored = function() {
        return $(".aem-AuthorLayer-Design, .aem-AuthorLayer-Edit, .aem-AuthorLayer-Layouting").size() > 0;
    };
})(jQuery);
/*
 AngularJS v1.4.4
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(O,W,t){'use strict';function L(b){return function(){var a=arguments[0],c;c="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.4.4/"+(b?b+"/":"")+a;for(a=1;a<arguments.length;a++){c=c+(1==a?"?":"&")+"p"+(a-1)+"=";var d=encodeURIComponent,e;e=arguments[a];e="function"==typeof e?e.toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof e?"undefined":"string"!=typeof e?JSON.stringify(e):e;c+=d(e)}return Error(c)}}function Da(b){if(null==b||Ya(b))return!1;var a="length"in Object(b)&&b.length;
return b.nodeType===pa&&a?!0:I(b)||G(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function m(b,a,c){var d,e;if(b)if(C(b))for(d in b)"prototype"==d||"length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d)||a.call(c,b[d],d,b);else if(G(b)||Da(b)){var f="object"!==typeof b;d=0;for(e=b.length;d<e;d++)(f||d in b)&&a.call(c,b[d],d,b)}else if(b.forEach&&b.forEach!==m)b.forEach(a,c,b);else if(lc(b))for(d in b)a.call(c,b[d],d,b);else if("function"===typeof b.hasOwnProperty)for(d in b)b.hasOwnProperty(d)&&
a.call(c,b[d],d,b);else for(d in b)Na.call(b,d)&&a.call(c,b[d],d,b);return b}function mc(b,a,c){for(var d=Object.keys(b).sort(),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function nc(b){return function(a,c){b(c,a)}}function Ud(){return++mb}function oc(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function Mb(b,a,c){for(var d=b.$$hashKey,e=0,f=a.length;e<f;++e){var g=a[e];if(D(g)||C(g))for(var h=Object.keys(g),l=0,k=h.length;l<k;l++){var n=h[l],q=g[n];c&&D(q)?ca(q)?b[n]=new Date(q.valueOf()):Oa(q)?
b[n]=new RegExp(q):(D(b[n])||(b[n]=G(q)?[]:{}),Mb(b[n],[q],!0)):b[n]=q}}oc(b,d);return b}function Q(b){return Mb(b,xa.call(arguments,1),!1)}function Vd(b){return Mb(b,xa.call(arguments,1),!0)}function Y(b){return parseInt(b,10)}function Nb(b,a){return Q(Object.create(b),a)}function v(){}function Za(b){return b}function qa(b){return function(){return b}}function pc(b){return C(b.toString)&&b.toString!==Object.prototype.toString}function y(b){return"undefined"===typeof b}function x(b){return"undefined"!==
typeof b}function D(b){return null!==b&&"object"===typeof b}function lc(b){return null!==b&&"object"===typeof b&&!qc(b)}function I(b){return"string"===typeof b}function X(b){return"number"===typeof b}function ca(b){return"[object Date]"===sa.call(b)}function C(b){return"function"===typeof b}function Oa(b){return"[object RegExp]"===sa.call(b)}function Ya(b){return b&&b.window===b}function $a(b){return b&&b.$evalAsync&&b.$watch}function ab(b){return"boolean"===typeof b}function rc(b){return!(!b||!(b.nodeName||
b.prop&&b.attr&&b.find))}function Wd(b){var a={};b=b.split(",");var c;for(c=0;c<b.length;c++)a[b[c]]=!0;return a}function ta(b){return M(b.nodeName||b[0]&&b[0].nodeName)}function bb(b,a){var c=b.indexOf(a);0<=c&&b.splice(c,1);return c}function fa(b,a,c,d){if(Ya(b)||$a(b))throw Ea("cpws");if(sc.test(sa.call(a)))throw Ea("cpta");if(a){if(b===a)throw Ea("cpi");c=c||[];d=d||[];D(b)&&(c.push(b),d.push(a));var e;if(G(b))for(e=a.length=0;e<b.length;e++)a.push(fa(b[e],null,c,d));else{var f=a.$$hashKey;G(a)?
a.length=0:m(a,function(b,c){delete a[c]});if(lc(b))for(e in b)a[e]=fa(b[e],null,c,d);else if(b&&"function"===typeof b.hasOwnProperty)for(e in b)b.hasOwnProperty(e)&&(a[e]=fa(b[e],null,c,d));else for(e in b)Na.call(b,e)&&(a[e]=fa(b[e],null,c,d));oc(a,f)}}else if(a=b,D(b)){if(c&&-1!==(f=c.indexOf(b)))return d[f];if(G(b))return fa(b,[],c,d);if(sc.test(sa.call(b)))a=new b.constructor(b);else if(ca(b))a=new Date(b.getTime());else if(Oa(b))a=new RegExp(b.source,b.toString().match(/[^\/]*$/)[0]),a.lastIndex=
b.lastIndex;else return e=Object.create(qc(b)),fa(b,e,c,d);d&&(c.push(b),d.push(a))}return a}function ia(b,a){if(G(b)){a=a||[];for(var c=0,d=b.length;c<d;c++)a[c]=b[c]}else if(D(b))for(c in a=a||{},b)if("$"!==c.charAt(0)||"$"!==c.charAt(1))a[c]=b[c];return a||b}function ka(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(G(b)){if(!G(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ka(b[d],a[d]))return!1;return!0}}else{if(ca(b))return ca(a)?
ka(b.getTime(),a.getTime()):!1;if(Oa(b))return Oa(a)?b.toString()==a.toString():!1;if($a(b)||$a(a)||Ya(b)||Ya(a)||G(a)||ca(a)||Oa(a))return!1;c=ga();for(d in b)if("$"!==d.charAt(0)&&!C(b[d])){if(!ka(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!(d in c||"$"===d.charAt(0)||a[d]===t||C(a[d])))return!1;return!0}return!1}function cb(b,a,c){return b.concat(xa.call(a,c))}function tc(b,a){var c=2<arguments.length?xa.call(arguments,2):[];return!C(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?
a.apply(b,cb(c,arguments,0)):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Xd(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)&&"$"===b.charAt(1)?c=t:Ya(a)?c="$WINDOW":a&&W===a?c="$DOCUMENT":$a(a)&&(c="$SCOPE");return c}function db(b,a){if("undefined"===typeof b)return t;X(a)||(a=a?2:null);return JSON.stringify(b,Xd,a)}function uc(b){return I(b)?JSON.parse(b):b}function vc(b,a){var c=Date.parse("Jan 01, 1970 00:00:00 "+b)/6E4;return isNaN(c)?a:c}function Ob(b,
a,c){c=c?-1:1;var d=vc(a,b.getTimezoneOffset());a=b;b=c*(d-b.getTimezoneOffset());a=new Date(a.getTime());a.setMinutes(a.getMinutes()+b);return a}function ua(b){b=z(b).clone();try{b.empty()}catch(a){}var c=z("<div>").append(b).html();try{return b[0].nodeType===Pa?M(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+M(b)})}catch(d){return M(c)}}function wc(b){try{return decodeURIComponent(b)}catch(a){}}function xc(b){var a={};m((b||"").split("&"),function(b){var d,e,f;b&&(e=
b=b.replace(/\+/g,"%20"),d=b.indexOf("="),-1!==d&&(e=b.substring(0,d),f=b.substring(d+1)),e=wc(e),x(e)&&(f=x(f)?wc(f):!0,Na.call(a,e)?G(a[e])?a[e].push(f):a[e]=[a[e],f]:a[e]=f))});return a}function Pb(b){var a=[];m(b,function(b,d){G(b)?m(b,function(b){a.push(ma(d,!0)+(!0===b?"":"="+ma(b,!0)))}):a.push(ma(d,!0)+(!0===b?"":"="+ma(b,!0)))});return a.length?a.join("&"):""}function nb(b){return ma(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function ma(b,a){return encodeURIComponent(b).replace(/%40/gi,
"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%3B/gi,";").replace(/%20/g,a?"%20":"+")}function Yd(b,a){var c,d,e=Qa.length;for(d=0;d<e;++d)if(c=Qa[d]+a,I(c=b.getAttribute(c)))return c;return null}function Zd(b,a){var c,d,e={};m(Qa,function(a){a+="app";!c&&b.hasAttribute&&b.hasAttribute(a)&&(c=b,d=b.getAttribute(a))});m(Qa,function(a){a+="app";var e;!c&&(e=b.querySelector("["+a.replace(":","\\:")+"]"))&&(c=e,d=e.getAttribute(a))});c&&(e.strictDi=null!==Yd(c,"strict-di"),
a(c,d?[d]:[],e))}function yc(b,a,c){D(c)||(c={});c=Q({strictDi:!1},c);var d=function(){b=z(b);if(b.injector()){var d=b[0]===W?"document":ua(b);throw Ea("btstrpd",d.replace(/</,"&lt;").replace(/>/,"&gt;"));}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);c.debugInfoEnabled&&a.push(["$compileProvider",function(a){a.debugInfoEnabled(!0)}]);a.unshift("ng");d=eb(a,c.strictDi);d.invoke(["$rootScope","$rootElement","$compile","$injector",function(a,b,c,d){a.$apply(function(){b.data("$injector",
d);c(b)(a)})}]);return d},e=/^NG_ENABLE_DEBUG_INFO!/,f=/^NG_DEFER_BOOTSTRAP!/;O&&e.test(O.name)&&(c.debugInfoEnabled=!0,O.name=O.name.replace(e,""));if(O&&!f.test(O.name))return d();O.name=O.name.replace(f,"");aa.resumeBootstrap=function(b){m(b,function(b){a.push(b)});return d()};C(aa.resumeDeferredBootstrap)&&aa.resumeDeferredBootstrap()}function $d(){O.name="NG_ENABLE_DEBUG_INFO!"+O.name;O.location.reload()}function ae(b){b=aa.element(b).injector();if(!b)throw Ea("test");return b.get("$$testability")}
function zc(b,a){a=a||"_";return b.replace(be,function(b,d){return(d?a:"")+b.toLowerCase()})}function ce(){var b;if(!Ac){var a=ob();la=O.jQuery;x(a)&&(la=null===a?t:O[a]);la&&la.fn.on?(z=la,Q(la.fn,{scope:Ra.scope,isolateScope:Ra.isolateScope,controller:Ra.controller,injector:Ra.injector,inheritedData:Ra.inheritedData}),b=la.cleanData,la.cleanData=function(a){var d;if(Qb)Qb=!1;else for(var e=0,f;null!=(f=a[e]);e++)(d=la._data(f,"events"))&&d.$destroy&&la(f).triggerHandler("$destroy");b(a)}):z=R;aa.element=
z;Ac=!0}}function pb(b,a,c){if(!b)throw Ea("areq",a||"?",c||"required");return b}function Sa(b,a,c){c&&G(b)&&(b=b[b.length-1]);pb(C(b),a,"not a function, got "+(b&&"object"===typeof b?b.constructor.name||"Object":typeof b));return b}function Ta(b,a){if("hasOwnProperty"===b)throw Ea("badname",a);}function Bc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&C(b)?tc(e,b):b}function qb(b){var a=b[0];b=b[b.length-1];var c=[a];do{a=a.nextSibling;
if(!a)break;c.push(a)}while(a!==b);return z(c)}function ga(){return Object.create(null)}function de(b){function a(a,b,c){return a[b]||(a[b]=c())}var c=L("$injector"),d=L("ng");b=a(b,"angular",Object);b.$$minErr=b.$$minErr||L;return a(b,"module",function(){var b={};return function(f,g,h){if("hasOwnProperty"===f)throw d("badname","module");g&&b.hasOwnProperty(f)&&(b[f]=null);return a(b,f,function(){function a(b,c,e,f){f||(f=d);return function(){f[e||"push"]([b,c,arguments]);return B}}function b(a,c){return function(b,
e){e&&C(e)&&(e.$$moduleName=f);d.push([a,c,arguments]);return B}}if(!g)throw c("nomod",f);var d=[],e=[],r=[],u=a("$injector","invoke","push",e),B={_invokeQueue:d,_configBlocks:e,_runBlocks:r,requires:g,name:f,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:a("$provide","value"),constant:a("$provide","constant","unshift"),decorator:b("$provide","decorator"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider",
"register"),directive:b("$compileProvider","directive"),config:u,run:function(a){r.push(a);return this}};h&&u(h);return B})}})}function ee(b){Q(b,{bootstrap:yc,copy:fa,extend:Q,merge:Vd,equals:ka,element:z,forEach:m,injector:eb,noop:v,bind:tc,toJson:db,fromJson:uc,identity:Za,isUndefined:y,isDefined:x,isString:I,isFunction:C,isObject:D,isNumber:X,isElement:rc,isArray:G,version:fe,isDate:ca,lowercase:M,uppercase:rb,callbacks:{counter:0},getTestability:ae,$$minErr:L,$$csp:Fa,reloadWithDebugInfo:$d});
Rb=de(O);Rb("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:ge});a.provider("$compile",Cc).directive({a:he,input:Dc,textarea:Dc,form:ie,script:je,select:ke,style:le,option:me,ngBind:ne,ngBindHtml:oe,ngBindTemplate:pe,ngClass:qe,ngClassEven:re,ngClassOdd:se,ngCloak:te,ngController:ue,ngForm:ve,ngHide:we,ngIf:xe,ngInclude:ye,ngInit:ze,ngNonBindable:Ae,ngPluralize:Be,ngRepeat:Ce,ngShow:De,ngStyle:Ee,ngSwitch:Fe,ngSwitchWhen:Ge,ngSwitchDefault:He,ngOptions:Ie,ngTransclude:Je,ngModel:Ke,
ngList:Le,ngChange:Me,pattern:Ec,ngPattern:Ec,required:Fc,ngRequired:Fc,minlength:Gc,ngMinlength:Gc,maxlength:Hc,ngMaxlength:Hc,ngValue:Ne,ngModelOptions:Oe}).directive({ngInclude:Pe}).directive(sb).directive(Ic);a.provider({$anchorScroll:Qe,$animate:Re,$animateCss:Se,$$animateQueue:Te,$$AnimateRunner:Ue,$browser:Ve,$cacheFactory:We,$controller:Xe,$document:Ye,$exceptionHandler:Ze,$filter:Jc,$$forceReflow:$e,$interpolate:af,$interval:bf,$http:cf,$httpParamSerializer:df,$httpParamSerializerJQLike:ef,
$httpBackend:ff,$location:gf,$log:hf,$parse:jf,$rootScope:kf,$q:lf,$$q:mf,$sce:nf,$sceDelegate:of,$sniffer:pf,$templateCache:qf,$templateRequest:rf,$$testability:sf,$timeout:tf,$window:uf,$$rAF:vf,$$jqLite:wf,$$HashMap:xf,$$cookieReader:yf})}])}function fb(b){return b.replace(zf,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Af,"Moz$1")}function Kc(b){b=b.nodeType;return b===pa||!b||9===b}function Lc(b,a){var c,d,e=a.createDocumentFragment(),f=[];if(Sb.test(b)){c=c||e.appendChild(a.createElement("div"));
d=(Bf.exec(b)||["",""])[1].toLowerCase();d=na[d]||na._default;c.innerHTML=d[1]+b.replace(Cf,"<$1></$2>")+d[2];for(d=d[0];d--;)c=c.lastChild;f=cb(f,c.childNodes);c=e.firstChild;c.textContent=""}else f.push(a.createTextNode(b));e.textContent="";e.innerHTML="";m(f,function(a){e.appendChild(a)});return e}function R(b){if(b instanceof R)return b;var a;I(b)&&(b=T(b),a=!0);if(!(this instanceof R)){if(a&&"<"!=b.charAt(0))throw Tb("nosel");return new R(b)}if(a){a=W;var c;b=(c=Df.exec(b))?[a.createElement(c[1])]:
(c=Lc(b,a))?c.childNodes:[]}Mc(this,b)}function Ub(b){return b.cloneNode(!0)}function tb(b,a){a||ub(b);if(b.querySelectorAll)for(var c=b.querySelectorAll("*"),d=0,e=c.length;d<e;d++)ub(c[d])}function Nc(b,a,c,d){if(x(d))throw Tb("offargs");var e=(d=vb(b))&&d.events,f=d&&d.handle;if(f)if(a)m(a.split(" "),function(a){if(x(c)){var d=e[a];bb(d||[],c);if(d&&0<d.length)return}b.removeEventListener(a,f,!1);delete e[a]});else for(a in e)"$destroy"!==a&&b.removeEventListener(a,f,!1),delete e[a]}function ub(b,
a){var c=b.ng339,d=c&&gb[c];d&&(a?delete d.data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),Nc(b)),delete gb[c],b.ng339=t))}function vb(b,a){var c=b.ng339,c=c&&gb[c];a&&!c&&(b.ng339=c=++Ef,c=gb[c]={events:{},data:{},handle:t});return c}function Vb(b,a,c){if(Kc(b)){var d=x(c),e=!d&&a&&!D(a),f=!a;b=(b=vb(b,!e))&&b.data;if(d)b[a]=c;else{if(f)return b;if(e)return b&&b[a];Q(b,a)}}}function wb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+
a+" "):!1}function xb(b,a){a&&b.setAttribute&&m(a.split(" "),function(a){b.setAttribute("class",T((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+T(a)+" "," ")))})}function yb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");m(a.split(" "),function(a){a=T(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",T(c))}}function Mc(b,a){if(a)if(a.nodeType)b[b.length++]=a;else{var c=a.length;if("number"===typeof c&&a.window!==
a){if(c)for(var d=0;d<c;d++)b[b.length++]=a[d]}else b[b.length++]=a}}function Oc(b,a){return zb(b,"$"+(a||"ngController")+"Controller")}function zb(b,a,c){9==b.nodeType&&(b=b.documentElement);for(a=G(a)?a:[a];b;){for(var d=0,e=a.length;d<e;d++)if((c=z.data(b,a[d]))!==t)return c;b=b.parentNode||11===b.nodeType&&b.host}}function Pc(b){for(tb(b,!0);b.firstChild;)b.removeChild(b.firstChild)}function Wb(b,a){a||tb(b);var c=b.parentNode;c&&c.removeChild(b)}function Ff(b,a){a=a||O;if("complete"===a.document.readyState)a.setTimeout(b);
else z(a).on("load",b)}function Qc(b,a){var c=Ab[a.toLowerCase()];return c&&Rc[ta(b)]&&c}function Gf(b,a){var c=b.nodeName;return("INPUT"===c||"TEXTAREA"===c)&&Sc[a]}function Hf(b,a){var c=function(c,e){c.isDefaultPrevented=function(){return c.defaultPrevented};var f=a[e||c.type],g=f?f.length:0;if(g){if(y(c.immediatePropagationStopped)){var h=c.stopImmediatePropagation;c.stopImmediatePropagation=function(){c.immediatePropagationStopped=!0;c.stopPropagation&&c.stopPropagation();h&&h.call(c)}}c.isImmediatePropagationStopped=
function(){return!0===c.immediatePropagationStopped};1<g&&(f=ia(f));for(var l=0;l<g;l++)c.isImmediatePropagationStopped()||f[l].call(b,c)}};c.elem=b;return c}function wf(){this.$get=function(){return Q(R,{hasClass:function(b,a){b.attr&&(b=b[0]);return wb(b,a)},addClass:function(b,a){b.attr&&(b=b[0]);return yb(b,a)},removeClass:function(b,a){b.attr&&(b=b[0]);return xb(b,a)}})}}function Ga(b,a){var c=b&&b.$$hashKey;if(c)return"function"===typeof c&&(c=b.$$hashKey()),c;c=typeof b;return c="function"==
c||"object"==c&&null!==b?b.$$hashKey=c+":"+(a||Ud)():c+":"+b}function Ua(b,a){if(a){var c=0;this.nextUid=function(){return++c}}m(b,this.put,this)}function If(b){return(b=b.toString().replace(Tc,"").match(Uc))?"function("+(b[1]||"").replace(/[\s\r\n]+/," ")+")":"fn"}function eb(b,a){function c(a){return function(b,c){if(D(b))m(b,nc(a));else return a(b,c)}}function d(a,b){Ta(a,"service");if(C(b)||G(b))b=r.instantiate(b);if(!b.$get)throw Ha("pget",a);return q[a+"Provider"]=b}function e(a,b){return function(){var c=
B.invoke(b,this);if(y(c))throw Ha("undef",a);return c}}function f(a,b,c){return d(a,{$get:!1!==c?e(a,b):b})}function g(a){pb(y(a)||G(a),"modulesToLoad","not an array");var b=[],c;m(a,function(a){function d(a){var b,c;b=0;for(c=a.length;b<c;b++){var e=a[b],f=r.get(e[0]);f[e[1]].apply(f,e[2])}}if(!n.get(a)){n.put(a,!0);try{I(a)?(c=Rb(a),b=b.concat(g(c.requires)).concat(c._runBlocks),d(c._invokeQueue),d(c._configBlocks)):C(a)?b.push(r.invoke(a)):G(a)?b.push(r.invoke(a)):Sa(a,"module")}catch(e){throw G(a)&&
(a=a[a.length-1]),e.message&&e.stack&&-1==e.stack.indexOf(e.message)&&(e=e.message+"\n"+e.stack),Ha("modulerr",a,e.stack||e.message||e);}}});return b}function h(b,c){function d(a,e){if(b.hasOwnProperty(a)){if(b[a]===l)throw Ha("cdep",a+" <- "+k.join(" <- "));return b[a]}try{return k.unshift(a),b[a]=l,b[a]=c(a,e)}catch(f){throw b[a]===l&&delete b[a],f;}finally{k.shift()}}function e(b,c,f,g){"string"===typeof f&&(g=f,f=null);var h=[],k=eb.$$annotate(b,a,g),l,r,n;r=0;for(l=k.length;r<l;r++){n=k[r];if("string"!==
typeof n)throw Ha("itkn",n);h.push(f&&f.hasOwnProperty(n)?f[n]:d(n,g))}G(b)&&(b=b[l]);return b.apply(c,h)}return{invoke:e,instantiate:function(a,b,c){var d=Object.create((G(a)?a[a.length-1]:a).prototype||null);a=e(a,d,b,c);return D(a)||C(a)?a:d},get:d,annotate:eb.$$annotate,has:function(a){return q.hasOwnProperty(a+"Provider")||b.hasOwnProperty(a)}}}a=!0===a;var l={},k=[],n=new Ua([],!0),q={$provide:{provider:c(d),factory:c(f),service:c(function(a,b){return f(a,["$injector",function(a){return a.instantiate(b)}])}),
value:c(function(a,b){return f(a,qa(b),!1)}),constant:c(function(a,b){Ta(a,"constant");q[a]=b;u[a]=b}),decorator:function(a,b){var c=r.get(a+"Provider"),d=c.$get;c.$get=function(){var a=B.invoke(d,c);return B.invoke(b,null,{$delegate:a})}}}},r=q.$injector=h(q,function(a,b){aa.isString(b)&&k.push(b);throw Ha("unpr",k.join(" <- "));}),u={},B=u.$injector=h(u,function(a,b){var c=r.get(a+"Provider",b);return B.invoke(c.$get,c,t,a)});m(g(b),function(a){a&&B.invoke(a)});return B}function Qe(){var b=!0;this.disableAutoScrolling=
function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;Array.prototype.some.call(a,function(a){if("a"===ta(a))return b=a,!0});return b}function f(b){if(b){b.scrollIntoView();var c;c=g.yOffset;C(c)?c=c():rc(c)?(c=c[0],c="fixed"!==a.getComputedStyle(c).position?0:c.getBoundingClientRect().bottom):X(c)||(c=0);c&&(b=b.getBoundingClientRect().top,a.scrollBy(0,b-c))}else a.scrollTo(0,0)}function g(a){a=I(a)?a:c.hash();var b;a?(b=h.getElementById(a))?f(b):
(b=e(h.getElementsByName(a)))?f(b):"top"===a&&f(null):f(null)}var h=a.document;b&&d.$watch(function(){return c.hash()},function(a,b){a===b&&""===a||Ff(function(){d.$evalAsync(g)})});return g}]}function hb(b,a){if(!b&&!a)return"";if(!b)return a;if(!a)return b;G(b)&&(b=b.join(" "));G(a)&&(a=a.join(" "));return b+" "+a}function Jf(b){I(b)&&(b=b.split(" "));var a=ga();m(b,function(b){b.length&&(a[b]=!0)});return a}function Ia(b){return D(b)?b:{}}function Kf(b,a,c,d){function e(a){try{a.apply(null,xa.call(arguments,
1))}finally{if(B--,0===B)for(;K.length;)try{K.pop()()}catch(b){c.error(b)}}}function f(){g();h()}function g(){a:{try{w=n.state;break a}catch(a){}w=void 0}w=y(w)?null:w;ka(w,F)&&(w=F);F=w}function h(){if(A!==l.url()||p!==w)A=l.url(),p=w,m(N,function(a){a(l.url(),w)})}var l=this,k=b.location,n=b.history,q=b.setTimeout,r=b.clearTimeout,u={};l.isMock=!1;var B=0,K=[];l.$$completeOutstandingRequest=e;l.$$incOutstandingRequestCount=function(){B++};l.notifyWhenNoOutstandingRequests=function(a){0===B?a():
K.push(a)};var w,p,A=k.href,s=a.find("base"),H=null;g();p=w;l.url=function(a,c,e){y(e)&&(e=null);k!==b.location&&(k=b.location);n!==b.history&&(n=b.history);if(a){var f=p===e;if(A===a&&(!d.history||f))return l;var h=A&&Ja(A)===Ja(a);A=a;p=e;if(!d.history||h&&f){if(!h||H)H=a;c?k.replace(a):h?(c=k,e=a.indexOf("#"),a=-1===e?"":a.substr(e),c.hash=a):k.href=a}else n[c?"replaceState":"pushState"](e,"",a),g(),p=w;return l}return H||k.href.replace(/%27/g,"'")};l.state=function(){return w};var N=[],J=!1,F=
null;l.onUrlChange=function(a){if(!J){if(d.history)z(b).on("popstate",f);z(b).on("hashchange",f);J=!0}N.push(a);return a};l.$$applicationDestroyed=function(){z(b).off("hashchange popstate",f)};l.$$checkUrlChange=h;l.baseHref=function(){var a=s.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};l.defer=function(a,b){var c;B++;c=q(function(){delete u[c];e(a)},b||0);u[c]=!0;return c};l.defer.cancel=function(a){return u[a]?(delete u[a],r(a),e(v),!0):!1}}function Ve(){this.$get=["$window",
"$log","$sniffer","$document",function(b,a,c,d){return new Kf(b,d,a,c)}]}function We(){this.$get=function(){function b(b,d){function e(a){a!=q&&(r?r==a&&(r=a.n):r=a,f(a.n,a.p),f(a,q),q=a,q.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw L("$cacheFactory")("iid",b);var g=0,h=Q({},d,{id:b}),l={},k=d&&d.capacity||Number.MAX_VALUE,n={},q=null,r=null;return a[b]={put:function(a,b){if(!y(b)){if(k<Number.MAX_VALUE){var c=n[a]||(n[a]={key:a});e(c)}a in l||g++;l[a]=b;g>k&&this.remove(r.key);
return b}},get:function(a){if(k<Number.MAX_VALUE){var b=n[a];if(!b)return;e(b)}return l[a]},remove:function(a){if(k<Number.MAX_VALUE){var b=n[a];if(!b)return;b==q&&(q=b.p);b==r&&(r=b.n);f(b.n,b.p);delete n[a]}delete l[a];g--},removeAll:function(){l={};g=0;n={};q=r=null},destroy:function(){n=h=l=null;delete a[b]},info:function(){return Q({},h,{size:g})}}}var a={};b.info=function(){var b={};m(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function qf(){this.$get=
["$cacheFactory",function(b){return b("templates")}]}function Cc(b,a){function c(a,b,c){var d=/^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/,e={};m(a,function(a,f){var g=a.match(d);if(!g)throw ea("iscp",b,f,a,c?"controller bindings definition":"isolate scope definition");e[f]={mode:g[1][0],collection:"*"===g[2],optional:"?"===g[3],attrName:g[4]||f}});return e}function d(a){var b=a.charAt(0);if(!b||b!==M(b))throw ea("baddir",a);if(a!==a.trim())throw ea("baddir",a);}var e={},f=/^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
g=/(([\w\-]+)(?:\:([^;]+))?;?)/,h=Wd("ngSrc,ngSrcset,src,srcset"),l=/^(?:(\^\^?)?(\?)?(\^\^?)?)?/,k=/^(on[a-z]+|formaction)$/;this.directive=function r(a,f){Ta(a,"directive");I(a)?(d(a),pb(f,"directiveFactory"),e.hasOwnProperty(a)||(e[a]=[],b.factory(a+"Directive",["$injector","$exceptionHandler",function(b,d){var f=[];m(e[a],function(e,g){try{var h=b.invoke(e);C(h)?h={compile:qa(h)}:!h.compile&&h.link&&(h.compile=qa(h.link));h.priority=h.priority||0;h.index=g;h.name=h.name||a;h.require=h.require||
h.controller&&h.name;h.restrict=h.restrict||"EA";var k=h,l=h,r=h.name,n={isolateScope:null,bindToController:null};D(l.scope)&&(!0===l.bindToController?(n.bindToController=c(l.scope,r,!0),n.isolateScope={}):n.isolateScope=c(l.scope,r,!1));D(l.bindToController)&&(n.bindToController=c(l.bindToController,r,!0));if(D(n.bindToController)){var S=l.controller,B=l.controllerAs;if(!S)throw ea("noctrl",r);var ha;a:if(B&&I(B))ha=B;else{if(I(S)){var m=Vc.exec(S);if(m){ha=m[3];break a}}ha=void 0}if(!ha)throw ea("noident",
r);}var s=k.$$bindings=n;D(s.isolateScope)&&(h.$$isolateBindings=s.isolateScope);h.$$moduleName=e.$$moduleName;f.push(h)}catch(t){d(t)}});return f}])),e[a].push(f)):m(a,nc(r));return this};this.aHrefSanitizationWhitelist=function(b){return x(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return x(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};var n=!0;this.debugInfoEnabled=function(a){return x(a)?
(n=a,this):n};this.$get=["$injector","$interpolate","$exceptionHandler","$templateRequest","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,c,d,w,p,A,s,H,N,J){function F(a,b){try{a.addClass(b)}catch(c){}}function V(a,b,c,d,e){a instanceof z||(a=z(a));m(a,function(b,c){b.nodeType==Pa&&b.nodeValue.match(/\S+/)&&(a[c]=z(b).wrap("<span></span>").parent()[0])});var f=S(a,b,a,c,d,e);V.$$addScopeClass(a);var g=null;return function(b,c,d){pb(b,"scope");d=d||{};
var e=d.parentBoundTranscludeFn,h=d.transcludeControllers;d=d.futureParentElement;e&&e.$$boundTransclude&&(e=e.$$boundTransclude);g||(g=(d=d&&d[0])?"foreignobject"!==ta(d)&&d.toString().match(/SVG/)?"svg":"html":"html");d="html"!==g?z(Xb(g,z("<div>").append(a).html())):c?Ra.clone.call(a):a;if(h)for(var l in h)d.data("$"+l+"Controller",h[l].instance);V.$$addScopeInfo(d,b);c&&c(d,b);f&&f(b,d,d,e);return d}}function S(a,b,c,d,e,f){function g(a,c,d,e){var f,l,k,r,n,u,N;if(p)for(N=Array(c.length),r=0;r<
h.length;r+=3)f=h[r],N[f]=c[f];else N=c;r=0;for(n=h.length;r<n;)if(l=N[h[r++]],c=h[r++],f=h[r++],c){if(c.scope){if(k=a.$new(),V.$$addScopeInfo(z(l),k),u=c.$$destroyBindings)c.$$destroyBindings=null,k.$on("$destroyed",u)}else k=a;u=c.transcludeOnThisElement?P(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?P(a,b):null;c(f,k,l,d,u,c)}else f&&f(a,l.childNodes,t,e)}for(var h=[],l,k,r,n,p,u=0;u<a.length;u++){l=new aa;k=ha(a[u],[],l,0===u?d:t,e);(f=k.length?E(k,a[u],l,b,c,null,[],[],f):null)&&f.scope&&
V.$$addScopeClass(l.$$element);l=f&&f.terminal||!(r=a[u].childNodes)||!r.length?null:S(r,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:b);if(f||l)h.push(u,f,l),n=!0,p=p||f;f=null}return n?g:null}function P(a,b,c){return function(d,e,f,g,h){d||(d=a.$new(!1,h),d.$$transcluded=!0);return b(d,e,{parentBoundTranscludeFn:c,transcludeControllers:f,futureParentElement:g})}}function ha(a,b,c,d,e){var h=c.$attr,l;switch(a.nodeType){case pa:x(b,va(ta(a)),"E",d,e);for(var k,r,n,p=a.attributes,
u=0,N=p&&p.length;u<N;u++){var K=!1,J=!1;k=p[u];l=k.name;r=T(k.value);k=va(l);if(n=ia.test(k))l=l.replace(Xc,"").substr(8).replace(/_(.)/g,function(a,b){return b.toUpperCase()});var S=k.replace(/(Start|End)$/,"");L(S)&&k===S+"Start"&&(K=l,J=l.substr(0,l.length-5)+"end",l=l.substr(0,l.length-6));k=va(l.toLowerCase());h[k]=l;if(n||!c.hasOwnProperty(k))c[k]=r,Qc(a,k)&&(c[k]=!0);X(a,b,r,k,n);x(b,k,"A",d,e,K,J)}a=a.className;D(a)&&(a=a.animVal);if(I(a)&&""!==a)for(;l=g.exec(a);)k=va(l[2]),x(b,k,"C",d,
e)&&(c[k]=T(l[3])),a=a.substr(l.index+l[0].length);break;case Pa:if(11===Va)for(;a.parentNode&&a.nextSibling&&a.nextSibling.nodeType===Pa;)a.nodeValue+=a.nextSibling.nodeValue,a.parentNode.removeChild(a.nextSibling);wa(b,a.nodeValue);break;case 8:try{if(l=f.exec(a.nodeValue))k=va(l[1]),x(b,k,"M",d,e)&&(c[k]=T(l[2]))}catch(B){}}b.sort(za);return b}function ya(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ea("uterdir",b,c);a.nodeType==pa&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&
e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return z(d)}function Wc(a,b,c){return function(d,e,f,g,h){e=ya(e[0],b,c);return a(d,e,f,g,h)}}function E(a,b,d,e,f,g,h,k,r){function n(a,b,c,d){if(a){c&&(a=Wc(a,c,d));a.require=E.require;a.directiveName=x;if(P===E||E.$$isolateScope)a=Z(a,{isolateScope:!0});h.push(a)}if(b){c&&(b=Wc(b,c,d));b.require=E.require;b.directiveName=x;if(P===E||E.$$isolateScope)b=Z(b,{isolateScope:!0});k.push(b)}}function u(a,b,c,d){var e;if(I(b)){var f=b.match(l);b=
b.substring(f[0].length);var g=f[1]||f[3],f="?"===f[2];"^^"===g?c=c.parent():e=(e=d&&d[b])&&e.instance;e||(d="$"+b+"Controller",e=g?c.inheritedData(d):c.data(d));if(!e&&!f)throw ea("ctreq",b,a);}else if(G(b))for(e=[],g=0,f=b.length;g<f;g++)e[g]=u(a,b[g],c,d);return e||null}function N(a,b,c,d,e,f){var g=ga(),h;for(h in d){var l=d[h],k={$scope:l===P||l.$$isolateScope?e:f,$element:a,$attrs:b,$transclude:c},r=l.controller;"@"==r&&(r=b[l.name]);k=p(r,k,!0,l.controllerAs);g[l.name]=k;s||a.data("$"+l.name+
"Controller",k.instance)}return g}function K(a,c,e,f,g,l){function r(a,b,c){var d;$a(a)||(c=b,b=a,a=t);s&&(d=A);c||(c=s?ja.parent():ja);return g(a,b,d,c,ya)}var n,p,J,B,A,ha,ja;b===e?(f=d,ja=d.$$element):(ja=z(e),f=new aa(ja,d));P&&(B=c.$new(!0));g&&(ha=r,ha.$$boundTransclude=g);w&&(A=N(ja,f,ha,w,B,c));P&&(V.$$addScopeInfo(ja,B,!0,!(F&&(F===P||F===P.$$originalDirective))),V.$$addScopeClass(ja,!0),B.$$isolateBindings=P.$$isolateBindings,Y(c,f,B,B.$$isolateBindings,P,B));if(A){var m=P||S,H;m&&A[m.name]&&
(p=m.$$bindings.bindToController,(J=A[m.name])&&J.identifier&&p&&(H=J,l.$$destroyBindings=Y(c,f,J.instance,p,m)));for(n in A){J=A[n];var E=J();E!==J.instance&&(J.instance=E,ja.data("$"+n+"Controller",E),J===H&&(l.$$destroyBindings(),l.$$destroyBindings=Y(c,f,E,p,m)))}}n=0;for(l=h.length;n<l;n++)p=h[n],$(p,p.isolateScope?B:c,ja,f,p.require&&u(p.directiveName,p.require,ja,A),ha);var ya=c;P&&(P.template||null===P.templateUrl)&&(ya=B);a&&a(ya,e.childNodes,t,g);for(n=k.length-1;0<=n;n--)p=k[n],$(p,p.isolateScope?
B:c,ja,f,p.require&&u(p.directiveName,p.require,ja,A),ha)}r=r||{};for(var J=-Number.MAX_VALUE,S=r.newScopeDirective,w=r.controllerDirectives,P=r.newIsolateScopeDirective,F=r.templateDirective,A=r.nonTlbTranscludeDirective,m=!1,H=!1,s=r.hasElementTranscludeDirective,ba=d.$$element=z(b),E,x,v,y=e,za,wa=0,L=a.length;wa<L;wa++){E=a[wa];var Bb=E.$$start,M=E.$$end;Bb&&(ba=ya(b,Bb,M));v=t;if(J>E.priority)break;if(v=E.scope)E.templateUrl||(D(v)?(O("new/isolated scope",P||S,E,ba),P=E):O("new/isolated scope",
P,E,ba)),S=S||E;x=E.name;!E.templateUrl&&E.controller&&(v=E.controller,w=w||ga(),O("'"+x+"' controller",w[x],E,ba),w[x]=E);if(v=E.transclude)m=!0,E.$$tlb||(O("transclusion",A,E,ba),A=E),"element"==v?(s=!0,J=E.priority,v=ba,ba=d.$$element=z(W.createComment(" "+x+": "+d[x]+" ")),b=ba[0],U(f,xa.call(v,0),b),y=V(v,e,J,g&&g.name,{nonTlbTranscludeDirective:A})):(v=z(Ub(b)).contents(),ba.empty(),y=V(v,e));if(E.template)if(H=!0,O("template",F,E,ba),F=E,v=C(E.template)?E.template(ba,d):E.template,v=fa(v),
E.replace){g=E;v=Sb.test(v)?Yc(Xb(E.templateNamespace,T(v))):[];b=v[0];if(1!=v.length||b.nodeType!==pa)throw ea("tplrt",x,"");U(f,ba,b);L={$attr:{}};v=ha(b,[],L);var Q=a.splice(wa+1,a.length-(wa+1));P&&Zc(v);a=a.concat(v).concat(Q);$c(d,L);L=a.length}else ba.html(v);if(E.templateUrl)H=!0,O("template",F,E,ba),F=E,E.replace&&(g=E),K=Lf(a.splice(wa,a.length-wa),ba,d,f,m&&y,h,k,{controllerDirectives:w,newScopeDirective:S!==E&&S,newIsolateScopeDirective:P,templateDirective:F,nonTlbTranscludeDirective:A}),
L=a.length;else if(E.compile)try{za=E.compile(ba,d,y),C(za)?n(null,za,Bb,M):za&&n(za.pre,za.post,Bb,M)}catch(R){c(R,ua(ba))}E.terminal&&(K.terminal=!0,J=Math.max(J,E.priority))}K.scope=S&&!0===S.scope;K.transcludeOnThisElement=m;K.templateOnThisElement=H;K.transclude=y;r.hasElementTranscludeDirective=s;return K}function Zc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Nb(a[b],{$$isolateScope:!0})}function x(b,d,f,g,h,l,k){if(d===h)return null;h=null;if(e.hasOwnProperty(d)){var n;d=a.get(d+"Directive");for(var p=
0,u=d.length;p<u;p++)try{n=d[p],(g===t||g>n.priority)&&-1!=n.restrict.indexOf(f)&&(l&&(n=Nb(n,{$$start:l,$$end:k})),b.push(n),h=n)}catch(J){c(J)}}return h}function L(b){if(e.hasOwnProperty(b))for(var c=a.get(b+"Directive"),d=0,f=c.length;d<f;d++)if(b=c[d],b.multiElement)return!0;return!1}function $c(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;m(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});m(b,function(b,f){"class"==f?(F(e,b),a["class"]=(a["class"]?
a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function Lf(a,b,c,e,f,g,h,l){var k=[],r,n,p=b[0],u=a.shift(),J=Nb(u,{templateUrl:null,transclude:null,replace:null,$$originalDirective:u}),N=C(u.templateUrl)?u.templateUrl(b,c):u.templateUrl,B=u.templateNamespace;b.empty();d(N).then(function(d){var K,w;d=fa(d);if(u.replace){d=Sb.test(d)?Yc(Xb(B,T(d))):[];K=d[0];if(1!=d.length||K.nodeType!==
pa)throw ea("tplrt",u.name,N);d={$attr:{}};U(e,b,K);var A=ha(K,[],d);D(u.scope)&&Zc(A);a=A.concat(a);$c(c,d)}else K=p,b.html(d);a.unshift(J);r=E(a,K,c,f,b,u,g,h,l);m(e,function(a,c){a==K&&(e[c]=b[0])});for(n=S(b[0].childNodes,f);k.length;){d=k.shift();w=k.shift();var H=k.shift(),V=k.shift(),A=b[0];if(!d.$$destroyed){if(w!==p){var ya=w.className;l.hasElementTranscludeDirective&&u.replace||(A=Ub(K));U(H,z(w),A);F(z(A),ya)}w=r.transcludeOnThisElement?P(d,r.transclude,V):V;r(n,d,A,e,w,r)}}k=null});return function(a,
b,c,d,e){a=e;b.$$destroyed||(k?k.push(b,c,d,a):(r.transcludeOnThisElement&&(a=P(b,r.transclude,e)),r(n,b,c,d,a,r)))}}function za(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function O(a,b,c,d){function e(a){return a?" (module: "+a+")":""}if(b)throw ea("multidir",b.name,e(b.$$moduleName),c.name,e(c.$$moduleName),a,ua(d));}function wa(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){a=a.parent();var b=!!a.length;b&&V.$$addBindingClass(a);
return function(a,c){var e=c.parent();b||V.$$addBindingClass(e);V.$$addBindingInfo(e,d.expressions);a.$watch(d,function(a){c[0].nodeValue=a})}}})}function Xb(a,b){a=M(a||"html");switch(a){case "svg":case "math":var c=W.createElement("div");c.innerHTML="<"+a+">"+b+"</"+a+">";return c.childNodes[0].childNodes;default:return b}}function R(a,b){if("srcdoc"==b)return H.HTML;var c=ta(a);if("xlinkHref"==b||"form"==c&&"action"==b||"img"!=c&&("src"==b||"ngSrc"==b))return H.RESOURCE_URL}function X(a,c,d,e,
f){var g=R(a,e);f=h[e]||f;var l=b(d,!0,g,f);if(l){if("multiple"===e&&"select"===ta(a))throw ea("selmulti",ua(a));c.push({priority:100,compile:function(){return{pre:function(a,c,h){c=h.$$observers||(h.$$observers={});if(k.test(e))throw ea("nodomevents");var r=h[e];r!==d&&(l=r&&b(r,!0,g,f),d=r);l&&(h[e]=l(a),(c[e]||(c[e]=[])).$$inter=!0,(h.$$observers&&h.$$observers[e].$$scope||a).$watch(l,function(a,b){"class"===e&&a!=b?h.$updateClass(a,b):h.$set(e,a)}))}}}})}}function U(a,b,c){var d=b[0],e=b.length,
f=d.parentNode,g,h;if(a)for(g=0,h=a.length;g<h;g++)if(a[g]==d){a[g++]=c;h=g+e-1;for(var l=a.length;g<l;g++,h++)h<l?a[g]=a[h]:delete a[g];a.length-=e-1;a.context===d&&(a.context=c);break}f&&f.replaceChild(c,d);a=W.createDocumentFragment();a.appendChild(d);z.hasData(d)&&(z(c).data(z(d).data()),la?(Qb=!0,la.cleanData([d])):delete z.cache[d[z.expando]]);d=1;for(e=b.length;d<e;d++)f=b[d],z(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function Z(a,b){return Q(function(){return a.apply(null,
arguments)},a,b)}function $(a,b,d,e,f,g){try{a(b,d,e,f,g)}catch(h){c(h,ua(d))}}function Y(a,c,d,e,f,g){var h;m(e,function(e,g){var l=e.attrName,k=e.optional,r,n,p,K;switch(e.mode){case "@":k||Na.call(c,l)||(d[g]=c[l]=void 0);c.$observe(l,function(a){I(a)&&(d[g]=a)});c.$$observers[l].$$scope=a;I(c[l])&&(d[g]=b(c[l])(a));break;case "=":if(!Na.call(c,l)){if(k)break;c[l]=void 0}if(k&&!c[l])break;n=w(c[l]);K=n.literal?ka:function(a,b){return a===b||a!==a&&b!==b};p=n.assign||function(){r=d[g]=n(a);throw ea("nonassign",
c[l],f.name);};r=d[g]=n(a);k=function(b){K(b,d[g])||(K(b,r)?p(a,b=d[g]):d[g]=b);return r=b};k.$stateful=!0;k=e.collection?a.$watchCollection(c[l],k):a.$watch(w(c[l],k),null,n.literal);h=h||[];h.push(k);break;case "&":n=c.hasOwnProperty(l)?w(c[l]):v;if(n===v&&k)break;d[g]=function(b){return n(a,b)}}});e=h?function(){for(var a=0,b=h.length;a<b;++a)h[a]()}:v;return g&&e!==v?(g.$on("$destroy",e),v):e}var aa=function(a,b){if(b){var c=Object.keys(b),d,e,f;d=0;for(e=c.length;d<e;d++)f=c[d],this[f]=b[f]}else this.$attr=
{};this.$$element=a};aa.prototype={$normalize:va,$addClass:function(a){a&&0<a.length&&N.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&N.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=ad(a,b);c&&c.length&&N.addClass(this.$$element,c);(c=ad(b,a))&&c.length&&N.removeClass(this.$$element,c)},$set:function(a,b,d,e){var f=this.$$element[0],g=Qc(f,a),h=Gf(f,a),f=a;g?(this.$$element.prop(a,b),e=g):h&&(this[h]=b,f=h);this[a]=b;e?this.$attr[a]=e:(e=this.$attr[a])||(this.$attr[a]=
e=zc(a,"-"));g=ta(this.$$element);if("a"===g&&"href"===a||"img"===g&&"src"===a)this[a]=b=J(b,"src"===a);else if("img"===g&&"srcset"===a){for(var g="",h=T(b),l=/(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/,l=/\s/.test(h)?l:/(,)/,h=h.split(l),l=Math.floor(h.length/2),k=0;k<l;k++)var r=2*k,g=g+J(T(h[r]),!0),g=g+(" "+T(h[r+1]));h=T(h[2*k]).split(/\s/);g+=J(T(h[0]),!0);2===h.length&&(g+=" "+T(h[1]));this[a]=b=g}!1!==d&&(null===b||b===t?this.$$element.removeAttr(e):this.$$element.attr(e,b));(a=this.$$observers)&&
m(a[f],function(a){try{a(b)}catch(d){c(d)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers=ga()),e=d[a]||(d[a]=[]);e.push(b);A.$evalAsync(function(){e.$$inter||!c.hasOwnProperty(a)||y(c[a])||b(c[a])});return function(){bb(e,b)}}};var ca=b.startSymbol(),da=b.endSymbol(),fa="{{"==ca||"}}"==da?Za:function(a){return a.replace(/\{\{/g,ca).replace(/}}/g,da)},ia=/^ngAttr[A-Z]/;V.$$addBindingInfo=n?function(a,b){var c=a.data("$binding")||[];G(b)?c=c.concat(b):c.push(b);a.data("$binding",
c)}:v;V.$$addBindingClass=n?function(a){F(a,"ng-binding")}:v;V.$$addScopeInfo=n?function(a,b,c,d){a.data(c?d?"$isolateScopeNoTemplate":"$isolateScope":"$scope",b)}:v;V.$$addScopeClass=n?function(a,b){F(a,b?"ng-isolate-scope":"ng-scope")}:v;return V}]}function va(b){return fb(b.replace(Xc,""))}function ad(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function Yc(b){b=z(b);var a=b.length;
if(1>=a)return b;for(;a--;)8===b[a].nodeType&&Mf.call(b,a,1);return b}function Xe(){var b={},a=!1;this.register=function(a,d){Ta(a,"controller");D(a)?Q(b,a):b[a]=d};this.allowGlobals=function(){a=!0};this.$get=["$injector","$window",function(c,d){function e(a,b,c,d){if(!a||!D(a.$scope))throw L("$controller")("noscp",d,b);a.$scope[b]=c}return function(f,g,h,l){var k,n,q;h=!0===h;l&&I(l)&&(q=l);if(I(f)){l=f.match(Vc);if(!l)throw Nf("ctrlfmt",f);n=l[1];q=q||l[3];f=b.hasOwnProperty(n)?b[n]:Bc(g.$scope,
n,!0)||(a?Bc(d,n,!0):t);Sa(f,n,!0)}if(h)return h=(G(f)?f[f.length-1]:f).prototype,k=Object.create(h||null),q&&e(g,q,k,n||f.name),Q(function(){var a=c.invoke(f,k,g,n);a!==k&&(D(a)||C(a))&&(k=a,q&&e(g,q,k,n||f.name));return k},{instance:k,identifier:q});k=c.instantiate(f,g,n);q&&e(g,q,k,n||f.name);return k}}]}function Ye(){this.$get=["$window",function(b){return z(b.document)}]}function Ze(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function Yb(b){return D(b)?
ca(b)?b.toISOString():db(b):b}function df(){this.$get=function(){return function(b){if(!b)return"";var a=[];mc(b,function(b,d){null===b||y(b)||(G(b)?m(b,function(b,c){a.push(ma(d)+"="+ma(Yb(b)))}):a.push(ma(d)+"="+ma(Yb(b))))});return a.join("&")}}}function ef(){this.$get=function(){return function(b){function a(b,e,f){null===b||y(b)||(G(b)?m(b,function(b,c){a(b,e+"["+(D(b)?c:"")+"]")}):D(b)&&!ca(b)?mc(b,function(b,c){a(b,e+(f?"":"[")+c+(f?"":"]"))}):c.push(ma(e)+"="+ma(Yb(b))))}if(!b)return"";var c=
[];a(b,"",!0);return c.join("&")}}}function Zb(b,a){if(I(b)){var c=b.replace(Of,"").trim();if(c){var d=a("Content-Type");(d=d&&0===d.indexOf(bd))||(d=(d=c.match(Pf))&&Qf[d[0]].test(c));d&&(b=uc(c))}}return b}function cd(b){var a=ga(),c;I(b)?m(b.split("\n"),function(b){c=b.indexOf(":");var e=M(T(b.substr(0,c)));b=T(b.substr(c+1));e&&(a[e]=a[e]?a[e]+", "+b:b)}):D(b)&&m(b,function(b,c){var f=M(c),g=T(b);f&&(a[f]=a[f]?a[f]+", "+g:g)});return a}function dd(b){var a;return function(c){a||(a=cd(b));return c?
(c=a[M(c)],void 0===c&&(c=null),c):a}}function ed(b,a,c,d){if(C(d))return d(b,a,c);m(d,function(d){b=d(b,a,c)});return b}function cf(){var b=this.defaults={transformResponse:[Zb],transformRequest:[function(a){return D(a)&&"[object File]"!==sa.call(a)&&"[object Blob]"!==sa.call(a)&&"[object FormData]"!==sa.call(a)?db(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ia($b),put:ia($b),patch:ia($b)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",paramSerializer:"$httpParamSerializer"},
a=!1;this.useApplyAsync=function(b){return x(b)?(a=!!b,this):a};var c=!0;this.useLegacyPromiseExtensions=function(a){return x(a)?(c=!!a,this):c};var d=this.interceptors=[];this.$get=["$httpBackend","$$cookieReader","$cacheFactory","$rootScope","$q","$injector",function(e,f,g,h,l,k){function n(a){function d(a){var b=Q({},a);b.data=a.data?ed(a.data,a.headers,a.status,f.transformResponse):a.data;a=a.status;return 200<=a&&300>a?b:l.reject(b)}function e(a,b){var c,d={};m(a,function(a,e){C(a)?(c=a(b),null!=
c&&(d[e]=c)):d[e]=a});return d}if(!aa.isObject(a))throw L("$http")("badreq",a);var f=Q({method:"get",transformRequest:b.transformRequest,transformResponse:b.transformResponse,paramSerializer:b.paramSerializer},a);f.headers=function(a){var c=b.headers,d=Q({},a.headers),f,g,h,c=Q({},c.common,c[M(a.method)]);a:for(f in c){g=M(f);for(h in d)if(M(h)===g)continue a;d[f]=c[f]}return e(d,ia(a))}(a);f.method=rb(f.method);f.paramSerializer=I(f.paramSerializer)?k.get(f.paramSerializer):f.paramSerializer;var g=
[function(a){var c=a.headers,e=ed(a.data,dd(c),t,a.transformRequest);y(e)&&m(c,function(a,b){"content-type"===M(b)&&delete c[b]});y(a.withCredentials)&&!y(b.withCredentials)&&(a.withCredentials=b.withCredentials);return q(a,e).then(d,d)},t],h=l.when(f);for(m(B,function(a){(a.request||a.requestError)&&g.unshift(a.request,a.requestError);(a.response||a.responseError)&&g.push(a.response,a.responseError)});g.length;){a=g.shift();var r=g.shift(),h=h.then(a,r)}c?(h.success=function(a){Sa(a,"fn");h.then(function(b){a(b.data,
b.status,b.headers,f)});return h},h.error=function(a){Sa(a,"fn");h.then(null,function(b){a(b.data,b.status,b.headers,f)});return h}):(h.success=fd("success"),h.error=fd("error"));return h}function q(c,d){function g(b,c,d,e){function f(){k(c,b,d,e)}F&&(200<=b&&300>b?F.put(P,[b,c,cd(d),e]):F.remove(P));a?h.$applyAsync(f):(f(),h.$$phase||h.$apply())}function k(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?N.resolve:N.reject)({data:a,status:b,headers:dd(d),config:c,statusText:e})}function q(a){k(a.data,a.status,
ia(a.headers()),a.statusText)}function B(){var a=n.pendingRequests.indexOf(c);-1!==a&&n.pendingRequests.splice(a,1)}var N=l.defer(),J=N.promise,F,m,S=c.headers,P=r(c.url,c.paramSerializer(c.params));n.pendingRequests.push(c);J.then(B,B);!c.cache&&!b.cache||!1===c.cache||"GET"!==c.method&&"JSONP"!==c.method||(F=D(c.cache)?c.cache:D(b.cache)?b.cache:u);F&&(m=F.get(P),x(m)?m&&C(m.then)?m.then(q,q):G(m)?k(m[1],m[0],ia(m[2]),m[3]):k(m,200,{},"OK"):F.put(P,J));y(m)&&((m=gd(c.url)?f()[c.xsrfCookieName||
b.xsrfCookieName]:t)&&(S[c.xsrfHeaderName||b.xsrfHeaderName]=m),e(c.method,P,d,g,S,c.timeout,c.withCredentials,c.responseType));return J}function r(a,b){0<b.length&&(a+=(-1==a.indexOf("?")?"?":"&")+b);return a}var u=g("$http");b.paramSerializer=I(b.paramSerializer)?k.get(b.paramSerializer):b.paramSerializer;var B=[];m(d,function(a){B.unshift(I(a)?k.get(a):k.invoke(a))});n.pendingRequests=[];(function(a){m(arguments,function(a){n[a]=function(b,c){return n(Q({},c||{},{method:a,url:b}))}})})("get","delete",
"head","jsonp");(function(a){m(arguments,function(a){n[a]=function(b,c,d){return n(Q({},d||{},{method:a,url:b,data:c}))}})})("post","put","patch");n.defaults=b;return n}]}function Rf(){return new O.XMLHttpRequest}function ff(){this.$get=["$browser","$window","$document",function(b,a,c){return Sf(b,Rf,b.defer,a.angular.callbacks,c[0])}]}function Sf(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),n=null;f.type="text/javascript";f.src=a;f.async=!0;n=function(a){f.removeEventListener("load",
n,!1);f.removeEventListener("error",n,!1);e.body.removeChild(f);f=null;var g=-1,u="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),u=a.type,g="error"===a.type?404:200);c&&c(g,u)};f.addEventListener("load",n,!1);f.addEventListener("error",n,!1);e.body.appendChild(f);return n}return function(e,h,l,k,n,q,r,u){function B(){p&&p();A&&A.abort()}function K(a,d,e,f,g){H!==t&&c.cancel(H);p=A=null;a(d,e,f,g);b.$$completeOutstandingRequest(v)}b.$$incOutstandingRequestCount();h=h||b.url();if("jsonp"==
M(e)){var w="_"+(d.counter++).toString(36);d[w]=function(a){d[w].data=a;d[w].called=!0};var p=f(h.replace("JSON_CALLBACK","angular.callbacks."+w),w,function(a,b){K(k,a,d[w].data,"",b);d[w]=v})}else{var A=a();A.open(e,h,!0);m(n,function(a,b){x(a)&&A.setRequestHeader(b,a)});A.onload=function(){var a=A.statusText||"",b="response"in A?A.response:A.responseText,c=1223===A.status?204:A.status;0===c&&(c=b?200:"file"==Aa(h).protocol?404:0);K(k,c,b,A.getAllResponseHeaders(),a)};e=function(){K(k,-1,null,null,
"")};A.onerror=e;A.onabort=e;r&&(A.withCredentials=!0);if(u)try{A.responseType=u}catch(s){if("json"!==u)throw s;}A.send(l)}if(0<q)var H=c(B,q);else q&&C(q.then)&&q.then(B)}}function af(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(a){return"\\\\\\"+a}function g(c){return c.replace(n,b).replace(q,a)}function h(f,h,n,q){function w(a){try{var b=a;a=n?e.getTrusted(n,
b):e.valueOf(b);var c;if(q&&!x(a))c=a;else if(null==a)c="";else{switch(typeof a){case "string":break;case "number":a=""+a;break;default:a=db(a)}c=a}return c}catch(g){d(Ka.interr(f,g))}}q=!!q;for(var p,m,s=0,H=[],N=[],J=f.length,F=[],V=[];s<J;)if(-1!=(p=f.indexOf(b,s))&&-1!=(m=f.indexOf(a,p+l)))s!==p&&F.push(g(f.substring(s,p))),s=f.substring(p+l,m),H.push(s),N.push(c(s,w)),s=m+k,V.push(F.length),F.push("");else{s!==J&&F.push(g(f.substring(s)));break}n&&1<F.length&&Ka.throwNoconcat(f);if(!h||H.length){var S=
function(a){for(var b=0,c=H.length;b<c;b++){if(q&&y(a[b]))return;F[V[b]]=a[b]}return F.join("")};return Q(function(a){var b=0,c=H.length,e=Array(c);try{for(;b<c;b++)e[b]=N[b](a);return S(e)}catch(g){d(Ka.interr(f,g))}},{exp:f,expressions:H,$$watchDelegate:function(a,b){var c;return a.$watchGroup(N,function(d,e){var f=S(d);C(b)&&b.call(this,f,d!==e?c:f,a);c=f})}})}}var l=b.length,k=a.length,n=new RegExp(b.replace(/./g,f),"g"),q=new RegExp(a.replace(/./g,f),"g");h.startSymbol=function(){return b};h.endSymbol=
function(){return a};return h}]}function bf(){this.$get=["$rootScope","$window","$q","$$q",function(b,a,c,d){function e(e,h,l,k){var n=4<arguments.length,q=n?xa.call(arguments,4):[],r=a.setInterval,u=a.clearInterval,B=0,K=x(k)&&!k,w=(K?d:c).defer(),p=w.promise;l=x(l)?l:0;p.then(null,null,n?function(){e.apply(null,q)}:e);p.$$intervalId=r(function(){w.notify(B++);0<l&&B>=l&&(w.resolve(B),u(p.$$intervalId),delete f[p.$$intervalId]);K||b.$apply()},h);f[p.$$intervalId]=w;return p}var f={};e.cancel=function(b){return b&&
b.$$intervalId in f?(f[b.$$intervalId].reject("canceled"),a.clearInterval(b.$$intervalId),delete f[b.$$intervalId],!0):!1};return e}]}function ac(b){b=b.split("/");for(var a=b.length;a--;)b[a]=nb(b[a]);return b.join("/")}function hd(b,a){var c=Aa(b);a.$$protocol=c.protocol;a.$$host=c.hostname;a.$$port=Y(c.port)||Tf[c.protocol]||null}function id(b,a){var c="/"!==b.charAt(0);c&&(b="/"+b);var d=Aa(b);a.$$path=decodeURIComponent(c&&"/"===d.pathname.charAt(0)?d.pathname.substring(1):d.pathname);a.$$search=
xc(d.search);a.$$hash=decodeURIComponent(d.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function ra(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Ja(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Cb(b){return b.replace(/(#.+)|#$/,"$1")}function bc(b,a,c){this.$$html5=!0;c=c||"";hd(b,this);this.$$parse=function(b){var c=ra(a,b);if(!I(c))throw Db("ipthprfx",b,a);id(c,this);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var b=
Pb(this.$$search),c=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(b?"?"+b:"")+c;this.$$absUrl=a+this.$$url.substr(1)};this.$$parseLinkUrl=function(d,e){if(e&&"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;(f=ra(b,d))!==t?(g=f,g=(f=ra(c,f))!==t?a+(ra("/",f)||f):b+g):(f=ra(a,d))!==t?g=a+f:a==d+"/"&&(g=a);g&&this.$$parse(g);return!!g}}function cc(b,a,c){hd(b,this);this.$$parse=function(d){var e=ra(b,d)||ra(a,d),f;y(e)||"#"!==e.charAt(0)?this.$$html5?f=e:(f="",y(e)&&(b=d,this.replace())):
(f=ra(c,e),y(f)&&(f=e));id(f,this);d=this.$$path;var e=b,g=/^\/[A-Z]:(\/.*)/;0===f.indexOf(e)&&(f=f.replace(e,""));g.exec(f)||(d=(f=g.exec(d))?f[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var a=Pb(this.$$search),e=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(a?"?"+a:"")+e;this.$$absUrl=b+(this.$$url?c+this.$$url:"")};this.$$parseLinkUrl=function(a,c){return Ja(b)==Ja(a)?(this.$$parse(a),!0):!1}}function jd(b,a,c){this.$$html5=!0;cc.apply(this,arguments);this.$$parseLinkUrl=
function(d,e){if(e&&"#"===e[0])return this.hash(e.slice(1)),!0;var f,g;b==Ja(d)?f=d:(g=ra(a,d))?f=b+c+g:a===d+"/"&&(f=a);f&&this.$$parse(f);return!!f};this.$$compose=function(){var a=Pb(this.$$search),e=this.$$hash?"#"+nb(this.$$hash):"";this.$$url=ac(this.$$path)+(a?"?"+a:"")+e;this.$$absUrl=b+c+this.$$url}}function Eb(b){return function(){return this[b]}}function kd(b,a){return function(c){if(y(c))return this[b];this[b]=a(c);this.$$compose();return this}}function gf(){var b="",a={enabled:!1,requireBase:!0,
rewriteLinks:!0};this.hashPrefix=function(a){return x(a)?(b=a,this):b};this.html5Mode=function(b){return ab(b)?(a.enabled=b,this):D(b)?(ab(b.enabled)&&(a.enabled=b.enabled),ab(b.requireBase)&&(a.requireBase=b.requireBase),ab(b.rewriteLinks)&&(a.rewriteLinks=b.rewriteLinks),this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement","$window",function(c,d,e,f,g){function h(a,b,c){var e=k.url(),f=k.$$state;try{d.url(a,b,c),k.$$state=d.state()}catch(g){throw k.url(e),k.$$state=f,g;}}function l(a,
b){c.$broadcast("$locationChangeSuccess",k.absUrl(),a,k.$$state,b)}var k,n;n=d.baseHref();var q=d.url(),r;if(a.enabled){if(!n&&a.requireBase)throw Db("nobase");r=q.substring(0,q.indexOf("/",q.indexOf("//")+2))+(n||"/");n=e.history?bc:jd}else r=Ja(q),n=cc;var u=r.substr(0,Ja(r).lastIndexOf("/")+1);k=new n(r,u,"#"+b);k.$$parseLinkUrl(q,q);k.$$state=d.state();var B=/^\s*(javascript|mailto):/i;f.on("click",function(b){if(a.rewriteLinks&&!b.ctrlKey&&!b.metaKey&&!b.shiftKey&&2!=b.which&&2!=b.button){for(var e=
z(b.target);"a"!==ta(e[0]);)if(e[0]===f[0]||!(e=e.parent())[0])return;var h=e.prop("href"),l=e.attr("href")||e.attr("xlink:href");D(h)&&"[object SVGAnimatedString]"===h.toString()&&(h=Aa(h.animVal).href);B.test(h)||!h||e.attr("target")||b.isDefaultPrevented()||!k.$$parseLinkUrl(h,l)||(b.preventDefault(),k.absUrl()!=d.url()&&(c.$apply(),g.angular["ff-684208-preventDefault"]=!0))}});Cb(k.absUrl())!=Cb(q)&&d.url(k.absUrl(),!0);var K=!0;d.onUrlChange(function(a,b){y(ra(u,a))?g.location.href=a:(c.$evalAsync(function(){var d=
k.absUrl(),e=k.$$state,f;k.$$parse(a);k.$$state=b;f=c.$broadcast("$locationChangeStart",a,d,b,e).defaultPrevented;k.absUrl()===a&&(f?(k.$$parse(d),k.$$state=e,h(d,!1,e)):(K=!1,l(d,e)))}),c.$$phase||c.$digest())});c.$watch(function(){var a=Cb(d.url()),b=Cb(k.absUrl()),f=d.state(),g=k.$$replace,n=a!==b||k.$$html5&&e.history&&f!==k.$$state;if(K||n)K=!1,c.$evalAsync(function(){var b=k.absUrl(),d=c.$broadcast("$locationChangeStart",b,a,k.$$state,f).defaultPrevented;k.absUrl()===b&&(d?(k.$$parse(a),k.$$state=
f):(n&&h(b,g,f===k.$$state?null:k.$$state),l(a,f)))});k.$$replace=!1});return k}]}function hf(){var b=!0,a=this;this.debugEnabled=function(a){return x(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||v;a=!1;try{a=!!e.apply}catch(l){}return a?function(){var a=
[];m(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function Wa(b,a){if("__defineGetter__"===b||"__defineSetter__"===b||"__lookupGetter__"===b||"__lookupSetter__"===b||"__proto__"===b)throw da("isecfld",a);return b}function Ba(b,a){if(b){if(b.constructor===b)throw da("isecfn",a);if(b.window===b)throw da("isecwindow",
a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw da("isecdom",a);if(b===Object)throw da("isecobj",a);}return b}function ld(b,a){if(b){if(b.constructor===b)throw da("isecfn",a);if(b===Uf||b===Vf||b===Wf)throw da("isecff",a);}}function Xf(b,a){return"undefined"!==typeof b?b:a}function md(b,a){return"undefined"===typeof b?a:"undefined"===typeof a?b:b+a}function U(b,a){var c,d;switch(b.type){case s.Program:c=!0;m(b.body,function(b){U(b.expression,a);c=c&&b.expression.constant});b.constant=
c;break;case s.Literal:b.constant=!0;b.toWatch=[];break;case s.UnaryExpression:U(b.argument,a);b.constant=b.argument.constant;b.toWatch=b.argument.toWatch;break;case s.BinaryExpression:U(b.left,a);U(b.right,a);b.constant=b.left.constant&&b.right.constant;b.toWatch=b.left.toWatch.concat(b.right.toWatch);break;case s.LogicalExpression:U(b.left,a);U(b.right,a);b.constant=b.left.constant&&b.right.constant;b.toWatch=b.constant?[]:[b];break;case s.ConditionalExpression:U(b.test,a);U(b.alternate,a);U(b.consequent,
a);b.constant=b.test.constant&&b.alternate.constant&&b.consequent.constant;b.toWatch=b.constant?[]:[b];break;case s.Identifier:b.constant=!1;b.toWatch=[b];break;case s.MemberExpression:U(b.object,a);b.computed&&U(b.property,a);b.constant=b.object.constant&&(!b.computed||b.property.constant);b.toWatch=[b];break;case s.CallExpression:c=b.filter?!a(b.callee.name).$stateful:!1;d=[];m(b.arguments,function(b){U(b,a);c=c&&b.constant;b.constant||d.push.apply(d,b.toWatch)});b.constant=c;b.toWatch=b.filter&&
!a(b.callee.name).$stateful?d:[b];break;case s.AssignmentExpression:U(b.left,a);U(b.right,a);b.constant=b.left.constant&&b.right.constant;b.toWatch=[b];break;case s.ArrayExpression:c=!0;d=[];m(b.elements,function(b){U(b,a);c=c&&b.constant;b.constant||d.push.apply(d,b.toWatch)});b.constant=c;b.toWatch=d;break;case s.ObjectExpression:c=!0;d=[];m(b.properties,function(b){U(b.value,a);c=c&&b.value.constant;b.value.constant||d.push.apply(d,b.value.toWatch)});b.constant=c;b.toWatch=d;break;case s.ThisExpression:b.constant=
!1,b.toWatch=[]}}function nd(b){if(1==b.length){b=b[0].expression;var a=b.toWatch;return 1!==a.length?a:a[0]!==b?a:t}}function od(b){return b.type===s.Identifier||b.type===s.MemberExpression}function pd(b){if(1===b.body.length&&od(b.body[0].expression))return{type:s.AssignmentExpression,left:b.body[0].expression,right:{type:s.NGValueParameter},operator:"="}}function qd(b){return 0===b.body.length||1===b.body.length&&(b.body[0].expression.type===s.Literal||b.body[0].expression.type===s.ArrayExpression||
b.body[0].expression.type===s.ObjectExpression)}function rd(b,a){this.astBuilder=b;this.$filter=a}function sd(b,a){this.astBuilder=b;this.$filter=a}function Fb(b){return"constructor"==b}function dc(b){return C(b.valueOf)?b.valueOf():Yf.call(b)}function jf(){var b=ga(),a=ga();this.$get=["$filter",function(c){function d(a,b){return null==a||null==b?a===b:"object"===typeof a&&(a=dc(a),"object"===typeof a)?!1:a===b||a!==a&&b!==b}function e(a,b,c,e,f){var g=e.inputs,h;if(1===g.length){var l=d,g=g[0];return a.$watch(function(a){var b=
g(a);d(b,l)||(h=e(a,t,t,[b]),l=b&&dc(b));return h},b,c,f)}for(var k=[],n=[],q=0,m=g.length;q<m;q++)k[q]=d,n[q]=null;return a.$watch(function(a){for(var b=!1,c=0,f=g.length;c<f;c++){var l=g[c](a);if(b||(b=!d(l,k[c])))n[c]=l,k[c]=l&&dc(l)}b&&(h=e(a,t,t,n));return h},b,c,f)}function f(a,b,c,d){var e,f;return e=a.$watch(function(a){return d(a)},function(a,c,d){f=a;C(b)&&b.apply(this,arguments);x(a)&&d.$$postDigest(function(){x(f)&&e()})},c)}function g(a,b,c,d){function e(a){var b=!0;m(a,function(a){x(a)||
(b=!1)});return b}var f,g;return f=a.$watch(function(a){return d(a)},function(a,c,d){g=a;C(b)&&b.call(this,a,c,d);e(a)&&d.$$postDigest(function(){e(g)&&f()})},c)}function h(a,b,c,d){var e;return e=a.$watch(function(a){return d(a)},function(a,c,d){C(b)&&b.apply(this,arguments);e()},c)}function l(a,b){if(!b)return a;var c=a.$$watchDelegate,c=c!==g&&c!==f?function(c,d,e,f){e=a(c,d,e,f);return b(e,c,d)}:function(c,d,e,f){e=a(c,d,e,f);c=b(e,c,d);return x(e)?c:e};a.$$watchDelegate&&a.$$watchDelegate!==
e?c.$$watchDelegate=a.$$watchDelegate:b.$stateful||(c.$$watchDelegate=e,c.inputs=a.inputs?a.inputs:[a]);return c}var k=Fa().noUnsafeEval,n={csp:k,expensiveChecks:!1},q={csp:k,expensiveChecks:!0};return function(d,k,B){var m,w,p;switch(typeof d){case "string":p=d=d.trim();var s=B?a:b;m=s[p];m||(":"===d.charAt(0)&&":"===d.charAt(1)&&(w=!0,d=d.substring(2)),B=B?q:n,m=new ec(B),m=(new fc(m,c,B)).parse(d),m.constant?m.$$watchDelegate=h:w?m.$$watchDelegate=m.literal?g:f:m.inputs&&(m.$$watchDelegate=e),
s[p]=m);return l(m,k);case "function":return l(d,k);default:return v}}}]}function lf(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return td(function(a){b.$evalAsync(a)},a)}]}function mf(){this.$get=["$browser","$exceptionHandler",function(b,a){return td(function(a){b.defer(a)},a)}]}function td(b,a){function c(a,b,c){function d(b){return function(c){e||(e=!0,b.call(a,c))}}var e=!1;return[d(b),d(c)]}function d(){this.$$state={status:0}}function e(a,b){return function(c){b.call(a,c)}}
function f(c){!c.processScheduled&&c.pending&&(c.processScheduled=!0,b(function(){var b,d,e;e=c.pending;c.processScheduled=!1;c.pending=t;for(var f=0,g=e.length;f<g;++f){d=e[f][0];b=e[f][c.status];try{C(b)?d.resolve(b(c.value)):1===c.status?d.resolve(c.value):d.reject(c.value)}catch(h){d.reject(h),a(h)}}}))}function g(){this.promise=new d;this.resolve=e(this,this.resolve);this.reject=e(this,this.reject);this.notify=e(this,this.notify)}var h=L("$q",TypeError);Q(d.prototype,{then:function(a,b,c){if(y(a)&&
y(b)&&y(c))return this;var d=new g;this.$$state.pending=this.$$state.pending||[];this.$$state.pending.push([d,a,b,c]);0<this.$$state.status&&f(this.$$state);return d.promise},"catch":function(a){return this.then(null,a)},"finally":function(a,b){return this.then(function(b){return k(b,!0,a)},function(b){return k(b,!1,a)},b)}});Q(g.prototype,{resolve:function(a){this.promise.$$state.status||(a===this.promise?this.$$reject(h("qcycle",a)):this.$$resolve(a))},$$resolve:function(b){var d,e;e=c(this,this.$$resolve,
this.$$reject);try{if(D(b)||C(b))d=b&&b.then;C(d)?(this.promise.$$state.status=-1,d.call(b,e[0],e[1],this.notify)):(this.promise.$$state.value=b,this.promise.$$state.status=1,f(this.promise.$$state))}catch(g){e[1](g),a(g)}},reject:function(a){this.promise.$$state.status||this.$$reject(a)},$$reject:function(a){this.promise.$$state.value=a;this.promise.$$state.status=2;f(this.promise.$$state)},notify:function(c){var d=this.promise.$$state.pending;0>=this.promise.$$state.status&&d&&d.length&&b(function(){for(var b,
e,f=0,g=d.length;f<g;f++){e=d[f][0];b=d[f][3];try{e.notify(C(b)?b(c):c)}catch(h){a(h)}}})}});var l=function(a,b){var c=new g;b?c.resolve(a):c.reject(a);return c.promise},k=function(a,b,c){var d=null;try{C(c)&&(d=c())}catch(e){return l(e,!1)}return d&&C(d.then)?d.then(function(){return l(a,b)},function(a){return l(a,!1)}):l(a,b)},n=function(a,b,c,d){var e=new g;e.resolve(a);return e.promise.then(b,c,d)},q=function u(a){if(!C(a))throw h("norslvr",a);if(!(this instanceof u))return new u(a);var b=new g;
a(function(a){b.resolve(a)},function(a){b.reject(a)});return b.promise};q.defer=function(){return new g};q.reject=function(a){var b=new g;b.reject(a);return b.promise};q.when=n;q.resolve=n;q.all=function(a){var b=new g,c=0,d=G(a)?[]:{};m(a,function(a,e){c++;n(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise};return q}function vf(){this.$get=["$window","$timeout",function(b,a){function c(){for(var a=
0;a<n.length;a++){var b=n[a];b&&(n[a]=null,b())}k=n.length=0}function d(a){var b=n.length;k++;n.push(a);0===b&&(l=h(c));return function(){0<=b&&(b=n[b]=null,0===--k&&l&&(l(),l=null,n.length=0))}}var e=b.requestAnimationFrame||b.webkitRequestAnimationFrame,f=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,g=!!e,h=g?function(a){var b=e(a);return function(){f(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};d.supported=g;var l,k=0,n=[];return d}]}
function kf(){function b(a){function b(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$$watchersCount=0;this.$id=++mb;this.$$ChildScope=null}b.prototype=a;return b}var a=10,c=L("$rootScope"),d=null,e=null;this.digestTtl=function(b){arguments.length&&(a=b);return a};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(f,g,h,l){function k(a){a.currentScope.$$destroyed=!0}function n(){this.$id=++mb;this.$$phase=
this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this.$root=this;this.$$destroyed=!1;this.$$listeners={};this.$$listenerCount={};this.$$watchersCount=0;this.$$isolateBindings=null}function q(a){if(p.$$phase)throw c("inprog",p.$$phase);p.$$phase=a}function r(a,b){do a.$$watchersCount+=b;while(a=a.$parent)}function u(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function s(){}function K(){for(;H.length;)try{H.shift()()}catch(a){g(a)}e=
null}function w(){null===e&&(e=l.defer(function(){p.$apply(K)}))}n.prototype={constructor:n,$new:function(a,c){var d;c=c||this;a?(d=new n,d.$root=this.$root):(this.$$ChildScope||(this.$$ChildScope=b(this)),d=new this.$$ChildScope);d.$parent=c;d.$$prevSibling=c.$$childTail;c.$$childHead?(c.$$childTail.$$nextSibling=d,c.$$childTail=d):c.$$childHead=c.$$childTail=d;(a||c!=this)&&d.$on("$destroy",k);return d},$watch:function(a,b,c,e){var f=h(a);if(f.$$watchDelegate)return f.$$watchDelegate(this,b,c,f,
a);var g=this,l=g.$$watchers,k={fn:b,last:s,get:f,exp:e||a,eq:!!c};d=null;C(b)||(k.fn=v);l||(l=g.$$watchers=[]);l.unshift(k);r(this,1);return function(){0<=bb(l,k)&&r(g,-1);d=null}},$watchGroup:function(a,b){function c(){h=!1;l?(l=!1,b(e,e,g)):b(e,d,g)}var d=Array(a.length),e=Array(a.length),f=[],g=this,h=!1,l=!0;if(!a.length){var k=!0;g.$evalAsync(function(){k&&b(e,e,g)});return function(){k=!1}}if(1===a.length)return this.$watch(a[0],function(a,c,f){e[0]=a;d[0]=c;b(e,a===c?e:d,f)});m(a,function(a,
b){var l=g.$watch(a,function(a,f){e[b]=a;d[b]=f;h||(h=!0,g.$evalAsync(c))});f.push(l)});return function(){for(;f.length;)f.shift()()}},$watchCollection:function(a,b){function c(a){e=a;var b,d,g,h;if(!y(e)){if(D(e))if(Da(e))for(f!==q&&(f=q,u=f.length=0,k++),a=e.length,u!==a&&(k++,f.length=u=a),b=0;b<a;b++)h=f[b],g=e[b],d=h!==h&&g!==g,d||h===g||(k++,f[b]=g);else{f!==r&&(f=r={},u=0,k++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,g=e[b],h=f[b],b in f?(d=h!==h&&g!==g,d||h===g||(k++,f[b]=g)):(u++,f[b]=g,
k++));if(u>a)for(b in k++,f)e.hasOwnProperty(b)||(u--,delete f[b])}else f!==e&&(f=e,k++);return k}}c.$stateful=!0;var d=this,e,f,g,l=1<b.length,k=0,n=h(a,c),q=[],r={},p=!0,u=0;return this.$watch(n,function(){p?(p=!1,b(e,e,d)):b(e,g,d);if(l)if(D(e))if(Da(e)){g=Array(e.length);for(var a=0;a<e.length;a++)g[a]=e[a]}else for(a in g={},e)Na.call(e,a)&&(g[a]=e[a]);else g=e})},$digest:function(){var b,f,h,k,n,r,u=a,m,w=[],E,H;q("$digest");l.$$checkUrlChange();this===p&&null!==e&&(l.defer.cancel(e),K());d=
null;do{r=!1;for(m=this;t.length;){try{H=t.shift(),H.scope.$eval(H.expression,H.locals)}catch(v){g(v)}d=null}a:do{if(k=m.$$watchers)for(n=k.length;n--;)try{if(b=k[n])if((f=b.get(m))!==(h=b.last)&&!(b.eq?ka(f,h):"number"===typeof f&&"number"===typeof h&&isNaN(f)&&isNaN(h)))r=!0,d=b,b.last=b.eq?fa(f,null):f,b.fn(f,h===s?f:h,m),5>u&&(E=4-u,w[E]||(w[E]=[]),w[E].push({msg:C(b.exp)?"fn: "+(b.exp.name||b.exp.toString()):b.exp,newVal:f,oldVal:h}));else if(b===d){r=!1;break a}}catch(y){g(y)}if(!(k=m.$$watchersCount&&
m.$$childHead||m!==this&&m.$$nextSibling))for(;m!==this&&!(k=m.$$nextSibling);)m=m.$parent}while(m=k);if((r||t.length)&&!u--)throw p.$$phase=null,c("infdig",a,w);}while(r||t.length);for(p.$$phase=null;x.length;)try{x.shift()()}catch(z){g(z)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this===p&&l.$$applicationDestroyed();r(this,-this.$$watchersCount);for(var b in this.$$listenerCount)u(this,this.$$listenerCount[b],b);a&&a.$$childHead==
this&&(a.$$childHead=this.$$nextSibling);a&&a.$$childTail==this&&(a.$$childTail=this.$$prevSibling);this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling);this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling);this.$destroy=this.$digest=this.$apply=this.$evalAsync=this.$applyAsync=v;this.$on=this.$watch=this.$watchGroup=function(){return v};this.$$listeners={};this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=this.$$watchers=
null}},$eval:function(a,b){return h(a)(this,b)},$evalAsync:function(a,b){p.$$phase||t.length||l.defer(function(){t.length&&p.$digest()});t.push({scope:this,expression:a,locals:b})},$$postDigest:function(a){x.push(a)},$apply:function(a){try{q("$apply");try{return this.$eval(a)}finally{p.$$phase=null}}catch(b){g(b)}finally{try{p.$digest()}catch(c){throw g(c),c;}}},$applyAsync:function(a){function b(){c.$eval(a)}var c=this;a&&H.push(b);w()},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=
c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){var d=c.indexOf(b);-1!==d&&(c[d]=null,u(e,1,a))}},$emit:function(a,b){var c=[],d,e=this,f=!1,h={name:a,targetScope:e,stopPropagation:function(){f=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},l=cb([h],arguments,1),k,n;do{d=e.$$listeners[a]||c;h.currentScope=e;k=0;for(n=d.length;k<n;k++)if(d[k])try{d[k].apply(null,l)}catch(q){g(q)}else d.splice(k,
1),k--,n--;if(f)return h.currentScope=null,h;e=e.$parent}while(e);h.currentScope=null;return h},$broadcast:function(a,b){var c=this,d=this,e={name:a,targetScope:this,preventDefault:function(){e.defaultPrevented=!0},defaultPrevented:!1};if(!this.$$listenerCount[a])return e;for(var f=cb([e],arguments,1),h,l;c=d;){e.currentScope=c;d=c.$$listeners[a]||[];h=0;for(l=d.length;h<l;h++)if(d[h])try{d[h].apply(null,f)}catch(k){g(k)}else d.splice(h,1),h--,l--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&
c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}e.currentScope=null;return e}};var p=new n,t=p.$$asyncQueue=[],x=p.$$postDigestQueue=[],H=p.$$applyAsyncQueue=[];return p}]}function ge(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*((https?|ftp|file|blob):|data:image\/)/;this.aHrefSanitizationWhitelist=function(a){return x(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return x(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;f=Aa(c).href;
return""===f||f.match(e)?c:"unsafe:"+f}}}function Zf(b){if("self"===b)return b;if(I(b)){if(-1<b.indexOf("***"))throw Ca("iwcard",b);b=ud(b).replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return new RegExp("^"+b+"$")}if(Oa(b))return new RegExp("^"+b.source+"$");throw Ca("imatcher");}function vd(b){var a=[];x(b)&&m(b,function(b){a.push(Zf(b))});return a}function of(){this.SCE_CONTEXTS=oa;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=vd(a));return b};this.resourceUrlBlacklist=
function(b){arguments.length&&(a=vd(b));return a};this.$get=["$injector",function(c){function d(a,b){return"self"===a?gd(b):!!a.exec(b.href)}function e(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var f=function(a){throw Ca("unsafe");};c.has("$sanitize")&&(f=c.get("$sanitize"));var g=e(),h={};h[oa.HTML]=
e(g);h[oa.CSS]=e(g);h[oa.URL]=e(g);h[oa.JS]=e(g);h[oa.RESOURCE_URL]=e(h[oa.URL]);return{trustAs:function(a,b){var c=h.hasOwnProperty(a)?h[a]:null;if(!c)throw Ca("icontext",a,b);if(null===b||b===t||""===b)return b;if("string"!==typeof b)throw Ca("itype",a);return new c(b)},getTrusted:function(c,e){if(null===e||e===t||""===e)return e;var g=h.hasOwnProperty(c)?h[c]:null;if(g&&e instanceof g)return e.$$unwrapTrustedValue();if(c===oa.RESOURCE_URL){var g=Aa(e.toString()),q,r,u=!1;q=0;for(r=b.length;q<r;q++)if(d(b[q],
g)){u=!0;break}if(u)for(q=0,r=a.length;q<r;q++)if(d(a[q],g)){u=!1;break}if(u)return e;throw Ca("insecurl",e.toString());}if(c===oa.HTML)return f(e);throw Ca("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function nf(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sceDelegate",function(a,c){if(b&&8>Va)throw Ca("iequirks");var d=ia(oa);d.isEnabled=function(){return b};d.trustAs=c.trustAs;d.getTrusted=c.getTrusted;d.valueOf=
c.valueOf;b||(d.trustAs=d.getTrusted=function(a,b){return b},d.valueOf=Za);d.parseAs=function(b,c){var e=a(c);return e.literal&&e.constant?e:a(c,function(a){return d.getTrusted(b,a)})};var e=d.parseAs,f=d.getTrusted,g=d.trustAs;m(oa,function(a,b){var c=M(b);d[fb("parse_as_"+c)]=function(b){return e(a,b)};d[fb("get_trusted_"+c)]=function(b){return f(a,b)};d[fb("trust_as_"+c)]=function(b){return g(a,b)}});return d}]}function pf(){this.$get=["$window","$document",function(b,a){var c={},d=Y((/android (\d+)/.exec(M((b.navigator||
{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g,h=/^(Moz|webkit|ms)(?=[A-Z])/,l=f.body&&f.body.style,k=!1,n=!1;if(l){for(var q in l)if(k=h.exec(q)){g=k[0];g=g.substr(0,1).toUpperCase()+g.substr(1);break}g||(g="WebkitOpacity"in l&&"webkit");k=!!("transition"in l||g+"Transition"in l);n=!!("animation"in l||g+"Animation"in l);!d||k&&n||(k=I(l.webkitTransition),n=I(l.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hasEvent:function(a){if("input"===
a&&11>=Va)return!1;if(y(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Fa(),vendorPrefix:g,transitions:k,animations:n,android:d}}]}function rf(){this.$get=["$templateCache","$http","$q","$sce",function(b,a,c,d){function e(f,g){e.totalPendingRequests++;I(f)&&b.get(f)||(f=d.getTrustedResourceUrl(f));var h=a.defaults&&a.defaults.transformResponse;G(h)?h=h.filter(function(a){return a!==Zb}):h===Zb&&(h=null);return a.get(f,{cache:b,transformResponse:h})["finally"](function(){e.totalPendingRequests--}).then(function(a){b.put(f,
a.data);return a.data},function(a){if(!g)throw ea("tpload",f,a.status,a.statusText);return c.reject(a)})}e.totalPendingRequests=0;return e}]}function sf(){this.$get=["$rootScope","$browser","$location",function(b,a,c){return{findBindings:function(a,b,c){a=a.getElementsByClassName("ng-binding");var g=[];m(a,function(a){var d=aa.element(a).data("$binding");d&&m(d,function(d){c?(new RegExp("(^|\\s)"+ud(b)+"(\\s|\\||$)")).test(d)&&g.push(a):-1!=d.indexOf(b)&&g.push(a)})});return g},findModels:function(a,
b,c){for(var g=["ng-","data-ng-","ng\\:"],h=0;h<g.length;++h){var l=a.querySelectorAll("["+g[h]+"model"+(c?"=":"*=")+'"'+b+'"]');if(l.length)return l}},getLocation:function(){return c.url()},setLocation:function(a){a!==c.url()&&(c.url(a),b.$digest())},whenStable:function(b){a.notifyWhenNoOutstandingRequests(b)}}}]}function tf(){this.$get=["$rootScope","$browser","$q","$$q","$exceptionHandler",function(b,a,c,d,e){function f(f,l,k){C(f)||(k=l,l=f,f=v);var n=xa.call(arguments,3),q=x(k)&&!k,r=(q?d:c).defer(),
u=r.promise,m;m=a.defer(function(){try{r.resolve(f.apply(null,n))}catch(a){r.reject(a),e(a)}finally{delete g[u.$$timeoutId]}q||b.$apply()},l);u.$$timeoutId=m;g[m]=r;return u}var g={};f.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return f}]}function Aa(b){Va&&(Z.setAttribute("href",b),b=Z.href);Z.setAttribute("href",b);return{href:Z.href,protocol:Z.protocol?Z.protocol.replace(/:$/,""):"",host:Z.host,
search:Z.search?Z.search.replace(/^\?/,""):"",hash:Z.hash?Z.hash.replace(/^#/,""):"",hostname:Z.hostname,port:Z.port,pathname:"/"===Z.pathname.charAt(0)?Z.pathname:"/"+Z.pathname}}function gd(b){b=I(b)?Aa(b):b;return b.protocol===wd.protocol&&b.host===wd.host}function uf(){this.$get=qa(O)}function xd(b){function a(a){try{return decodeURIComponent(a)}catch(b){return a}}var c=b[0]||{},d={},e="";return function(){var b,g,h,l,k;b=c.cookie||"";if(b!==e)for(e=b,b=e.split("; "),d={},h=0;h<b.length;h++)g=
b[h],l=g.indexOf("="),0<l&&(k=a(g.substring(0,l)),d[k]===t&&(d[k]=a(g.substring(l+1))));return d}}function yf(){this.$get=xd}function Jc(b){function a(c,d){if(D(c)){var e={};m(c,function(b,c){e[c]=a(c,b)});return e}return b.factory(c+"Filter",d)}this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+"Filter")}}];a("currency",yd);a("date",zd);a("filter",$f);a("json",ag);a("limitTo",bg);a("lowercase",cg);a("number",Ad);a("orderBy",Bd);a("uppercase",dg)}function $f(){return function(b,
a,c){if(!Da(b)){if(null==b)return b;throw L("filter")("notarray",b);}var d;switch(gc(a)){case "function":break;case "boolean":case "null":case "number":case "string":d=!0;case "object":a=eg(a,c,d);break;default:return b}return Array.prototype.filter.call(b,a)}}function eg(b,a,c){var d=D(b)&&"$"in b;!0===a?a=ka:C(a)||(a=function(a,b){if(y(a))return!1;if(null===a||null===b)return a===b;if(D(b)||D(a)&&!pc(a))return!1;a=M(""+a);b=M(""+b);return-1!==a.indexOf(b)});return function(e){return d&&!D(e)?La(e,
b.$,a,!1):La(e,b,a,c)}}function La(b,a,c,d,e){var f=gc(b),g=gc(a);if("string"===g&&"!"===a.charAt(0))return!La(b,a.substring(1),c,d);if(G(b))return b.some(function(b){return La(b,a,c,d)});switch(f){case "object":var h;if(d){for(h in b)if("$"!==h.charAt(0)&&La(b[h],a,c,!0))return!0;return e?!1:La(b,a,c,!1)}if("object"===g){for(h in a)if(e=a[h],!C(e)&&!y(e)&&(f="$"===h,!La(f?b:b[h],e,c,f,f)))return!1;return!0}return c(b,a);case "function":return!1;default:return c(b,a)}}function gc(b){return null===
b?"null":typeof b}function yd(b){var a=b.NUMBER_FORMATS;return function(b,d,e){y(d)&&(d=a.CURRENCY_SYM);y(e)&&(e=a.PATTERNS[1].maxFrac);return null==b?b:Cd(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,e).replace(/\u00A4/g,d)}}function Ad(b){var a=b.NUMBER_FORMATS;return function(b,d){return null==b?b:Cd(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Cd(b,a,c,d,e){if(D(b))return"";var f=0>b;b=Math.abs(b);var g=Infinity===b;if(!g&&!isFinite(b))return"";var h=b+"",l="",k=!1,n=[];g&&(l="\u221e");
if(!g&&-1!==h.indexOf("e")){var q=h.match(/([\d\.]+)e(-?)(\d+)/);q&&"-"==q[2]&&q[3]>e+1?b=0:(l=h,k=!0)}if(g||k)0<e&&1>b&&(l=b.toFixed(e),b=parseFloat(l));else{g=(h.split(Dd)[1]||"").length;y(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));b=+(Math.round(+(b.toString()+"e"+e)).toString()+"e"+-e);var g=(""+b).split(Dd),h=g[0],g=g[1]||"",q=0,r=a.lgSize,u=a.gSize;if(h.length>=r+u)for(q=h.length-r,k=0;k<q;k++)0===(q-k)%u&&0!==k&&(l+=c),l+=h.charAt(k);for(k=q;k<h.length;k++)0===(h.length-k)%r&&0!==k&&
(l+=c),l+=h.charAt(k);for(;g.length<e;)g+="0";e&&"0"!==e&&(l+=d+g.substr(0,e))}0===b&&(f=!1);n.push(f?a.negPre:a.posPre,l,f?a.negSuf:a.posSuf);return n.join("")}function Gb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Gb(e,a,d)}}function Hb(b,a){return function(c,d){var e=c["get"+b](),f=rb(a?"SHORT"+b:b);return d[f][e]}}function Ed(b){var a=
(new Date(b,0,1)).getDay();return new Date(b,0,(4>=a?5:12)-a)}function Fd(b){return function(a){var c=Ed(a.getFullYear());a=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+(4-a.getDay()))-+c;a=1+Math.round(a/6048E5);return Gb(a,b)}}function hc(b,a){return 0>=b.getFullYear()?a.ERAS[0]:a.ERAS[1]}function zd(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?a.setUTCFullYear:a.setFullYear,l=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=Y(b[9]+b[10]),g=Y(b[9]+b[11]));h.call(a,Y(b[1]),
Y(b[2])-1,Y(b[3]));f=Y(b[4]||0)-f;g=Y(b[5]||0)-g;h=Y(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));l.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e,f){var g="",h=[],l,k;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;I(c)&&(c=fg.test(c)?Y(c):a(c));X(c)&&(c=new Date(c));if(!ca(c)||!isFinite(c.getTime()))return c;for(;e;)(k=gg.exec(e))?(h=cb(h,k,1),e=h.pop()):(h.push(e),e=null);var n=c.getTimezoneOffset();
f&&(n=vc(f,c.getTimezoneOffset()),c=Ob(c,f,!0));m(h,function(a){l=hg[a];g+=l?l(c,b.DATETIME_FORMATS,n):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function ag(){return function(b,a){y(a)&&(a=2);return db(b,a)}}function bg(){return function(b,a,c){a=Infinity===Math.abs(Number(a))?Number(a):Y(a);if(isNaN(a))return b;X(b)&&(b=b.toString());if(!G(b)&&!I(b))return b;c=!c||isNaN(c)?0:Y(c);c=0>c&&c>=-b.length?b.length+c:c;return 0<=a?b.slice(c,c+a):0===c?b.slice(a,b.length):b.slice(Math.max(0,
c+a),c)}}function Bd(b){function a(a,c){c=c?-1:1;return a.map(function(a){var d=1,h=Za;if(C(a))h=a;else if(I(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))d="-"==a.charAt(0)?-1:1,a=a.substring(1);if(""!==a&&(h=b(a),h.constant))var l=h(),h=function(a){return a[l]}}return{get:h,descending:d*c}})}function c(a){switch(typeof a){case "number":case "boolean":case "string":return!0;default:return!1}}return function(b,e,f){if(!Da(b))return b;G(e)||(e=[e]);0===e.length&&(e=["+"]);var g=a(e,f);g.push({get:function(){return{}},
descending:f?-1:1});b=Array.prototype.map.call(b,function(a,b){return{value:a,predicateValues:g.map(function(d){var e=d.get(a);d=typeof e;if(null===e)d="string",e="null";else if("string"===d)e=e.toLowerCase();else if("object"===d)a:{if("function"===typeof e.valueOf&&(e=e.valueOf(),c(e)))break a;if(pc(e)&&(e=e.toString(),c(e)))break a;e=b}return{value:e,type:d}})}});b.sort(function(a,b){for(var c=0,d=0,e=g.length;d<e;++d){var c=a.predicateValues[d],f=b.predicateValues[d],u=0;c.type===f.type?c.value!==
f.value&&(u=c.value<f.value?-1:1):u=c.type<f.type?-1:1;if(c=u*g[d].descending)break}return c});return b=b.map(function(a){return a.value})}}function Ma(b){C(b)&&(b={link:b});b.restrict=b.restrict||"AC";return qa(b)}function Gd(b,a,c,d,e){var f=this,g=[],h=f.$$parentForm=b.parent().controller("form")||Ib;f.$error={};f.$$success={};f.$pending=t;f.$name=e(a.name||a.ngForm||"")(c);f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;f.$submitted=!1;h.$addControl(f);f.$rollbackViewValue=function(){m(g,
function(a){a.$rollbackViewValue()})};f.$commitViewValue=function(){m(g,function(a){a.$commitViewValue()})};f.$addControl=function(a){Ta(a.$name,"input");g.push(a);a.$name&&(f[a.$name]=a)};f.$$renameControl=function(a,b){var c=a.$name;f[c]===a&&delete f[c];f[b]=a;a.$name=b};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];m(f.$pending,function(b,c){f.$setValidity(c,null,a)});m(f.$error,function(b,c){f.$setValidity(c,null,a)});m(f.$$success,function(b,c){f.$setValidity(c,null,
a)});bb(g,a)};Hd({ctrl:this,$element:b,set:function(a,b,c){var d=a[b];d?-1===d.indexOf(c)&&d.push(c):a[b]=[c]},unset:function(a,b,c){var d=a[b];d&&(bb(d,c),0===d.length&&delete a[b])},parentForm:h,$animate:d});f.$setDirty=function(){d.removeClass(b,Xa);d.addClass(b,Jb);f.$dirty=!0;f.$pristine=!1;h.$setDirty()};f.$setPristine=function(){d.setClass(b,Xa,Jb+" ng-submitted");f.$dirty=!1;f.$pristine=!0;f.$submitted=!1;m(g,function(a){a.$setPristine()})};f.$setUntouched=function(){m(g,function(a){a.$setUntouched()})};
f.$setSubmitted=function(){d.addClass(b,"ng-submitted");f.$submitted=!0;h.$setSubmitted()}}function ic(b){b.$formatters.push(function(a){return b.$isEmpty(a)?a:a.toString()})}function ib(b,a,c,d,e,f){var g=M(a[0].type);if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;l()})}var l=function(b){k&&(f.defer.cancel(k),k=null);if(!h){var e=a.val();b=b&&b.type;"password"===g||c.ngTrim&&"false"===c.ngTrim||(e=T(e));(d.$viewValue!==e||""===e&&d.$$hasNativeValidators)&&
d.$setViewValue(e,b)}};if(e.hasEvent("input"))a.on("input",l);else{var k,n=function(a,b,c){k||(k=f.defer(function(){k=null;b&&b.value===c||l(a)}))};a.on("keydown",function(a){var b=a.keyCode;91===b||15<b&&19>b||37<=b&&40>=b||n(a,this,this.value)});if(e.hasEvent("paste"))a.on("paste cut",n)}a.on("change",l);d.$render=function(){var b=d.$isEmpty(d.$viewValue)?"":d.$viewValue;a.val()!==b&&a.val(b)}}function Kb(b,a){return function(c,d){var e,f;if(ca(c))return c;if(I(c)){'"'==c.charAt(0)&&'"'==c.charAt(c.length-
1)&&(c=c.substring(1,c.length-1));if(ig.test(c))return new Date(c);b.lastIndex=0;if(e=b.exec(c))return e.shift(),f=d?{yyyy:d.getFullYear(),MM:d.getMonth()+1,dd:d.getDate(),HH:d.getHours(),mm:d.getMinutes(),ss:d.getSeconds(),sss:d.getMilliseconds()/1E3}:{yyyy:1970,MM:1,dd:1,HH:0,mm:0,ss:0,sss:0},m(e,function(b,c){c<a.length&&(f[a[c]]=+b)}),new Date(f.yyyy,f.MM-1,f.dd,f.HH,f.mm,f.ss||0,1E3*f.sss||0)}return NaN}}function jb(b,a,c,d){return function(e,f,g,h,l,k,n){function q(a){return a&&!(a.getTime&&
a.getTime()!==a.getTime())}function r(a){return x(a)?ca(a)?a:c(a):t}Id(e,f,g,h);ib(e,f,g,h,l,k);var u=h&&h.$options&&h.$options.timezone,m;h.$$parserName=b;h.$parsers.push(function(b){return h.$isEmpty(b)?null:a.test(b)?(b=c(b,m),u&&(b=Ob(b,u)),b):t});h.$formatters.push(function(a){if(a&&!ca(a))throw kb("datefmt",a);if(q(a))return(m=a)&&u&&(m=Ob(m,u,!0)),n("date")(a,d,u);m=null;return""});if(x(g.min)||g.ngMin){var s;h.$validators.min=function(a){return!q(a)||y(s)||c(a)>=s};g.$observe("min",function(a){s=
r(a);h.$validate()})}if(x(g.max)||g.ngMax){var w;h.$validators.max=function(a){return!q(a)||y(w)||c(a)<=w};g.$observe("max",function(a){w=r(a);h.$validate()})}}}function Id(b,a,c,d){(d.$$hasNativeValidators=D(a[0].validity))&&d.$parsers.push(function(b){var c=a.prop("validity")||{};return c.badInput&&!c.typeMismatch?t:b})}function Jd(b,a,c,d,e){if(x(d)){b=b(d);if(!b.constant)throw kb("constexpr",c,d);return b(a)}return e}function jc(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=
[],d=0;a:for(;d<a.length;d++){for(var e=a[d],n=0;n<b.length;n++)if(e==b[n])continue a;c.push(e)}return c}function e(a){var b=[];return G(a)?(m(a,function(a){b=b.concat(e(a))}),b):I(a)?a.split(" "):D(a)?(m(a,function(a,c){a&&(b=b.concat(c.split(" ")))}),b):a}return{restrict:"AC",link:function(f,g,h){function l(a,b){var c=g.data("$classCounts")||ga(),d=[];m(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});g.data("$classCounts",c);return d.join(" ")}function k(b){if(!0===a||f.$index%
2===a){var k=e(b||[]);if(!n){var m=l(k,1);h.$addClass(m)}else if(!ka(b,n)){var s=e(n),m=d(k,s),k=d(s,k),m=l(m,1),k=l(k,-1);m&&m.length&&c.addClass(g,m);k&&k.length&&c.removeClass(g,k)}}n=ia(b)}var n;f.$watch(h[b],k,!0);h.$observe("class",function(a){k(f.$eval(h[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var g=c&1;if(g!==(d&1)){var k=e(f.$eval(h[b]));g===a?(g=l(k,1),h.$addClass(g)):(g=l(k,-1),h.$removeClass(g))}})}}}]}function Hd(b){function a(a,b){b&&!f[a]?(k.addClass(e,a),f[a]=!0):!b&&
f[a]&&(k.removeClass(e,a),f[a]=!1)}function c(b,c){b=b?"-"+zc(b,"-"):"";a(lb+b,!0===c);a(Kd+b,!1===c)}var d=b.ctrl,e=b.$element,f={},g=b.set,h=b.unset,l=b.parentForm,k=b.$animate;f[Kd]=!(f[lb]=e.hasClass(lb));d.$setValidity=function(b,e,f){e===t?(d.$pending||(d.$pending={}),g(d.$pending,b,f)):(d.$pending&&h(d.$pending,b,f),Ld(d.$pending)&&(d.$pending=t));ab(e)?e?(h(d.$error,b,f),g(d.$$success,b,f)):(g(d.$error,b,f),h(d.$$success,b,f)):(h(d.$error,b,f),h(d.$$success,b,f));d.$pending?(a(Md,!0),d.$valid=
d.$invalid=t,c("",null)):(a(Md,!1),d.$valid=Ld(d.$error),d.$invalid=!d.$valid,c("",d.$valid));e=d.$pending&&d.$pending[b]?t:d.$error[b]?!1:d.$$success[b]?!0:null;c(b,e);l.$setValidity(b,e,d)}}function Ld(b){if(b)for(var a in b)if(b.hasOwnProperty(a))return!1;return!0}var jg=/^\/(.+)\/([a-z]*)$/,M=function(b){return I(b)?b.toLowerCase():b},Na=Object.prototype.hasOwnProperty,rb=function(b){return I(b)?b.toUpperCase():b},Va,z,la,xa=[].slice,Mf=[].splice,kg=[].push,sa=Object.prototype.toString,qc=Object.getPrototypeOf,
Ea=L("ng"),aa=O.angular||(O.angular={}),Rb,mb=0;Va=W.documentMode;v.$inject=[];Za.$inject=[];var G=Array.isArray,sc=/^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/,T=function(b){return I(b)?b.trim():b},ud=function(b){return b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")},Fa=function(){if(!x(Fa.rules)){var b=W.querySelector("[ng-csp]")||W.querySelector("[data-ng-csp]");if(b){var a=b.getAttribute("ng-csp")||b.getAttribute("data-ng-csp");
Fa.rules={noUnsafeEval:!a||-1!==a.indexOf("no-unsafe-eval"),noInlineStyle:!a||-1!==a.indexOf("no-inline-style")}}else{b=Fa;try{new Function(""),a=!1}catch(c){a=!0}b.rules={noUnsafeEval:a,noInlineStyle:!1}}}return Fa.rules},ob=function(){if(x(ob.name_))return ob.name_;var b,a,c=Qa.length,d,e;for(a=0;a<c;++a)if(d=Qa[a],b=W.querySelector("["+d.replace(":","\\:")+"jq]")){e=b.getAttribute(d+"jq");break}return ob.name_=e},Qa=["ng-","data-ng-","ng:","x-ng-"],be=/[A-Z]/g,Ac=!1,Qb,pa=1,Pa=3,fe={full:"1.4.4",
major:1,minor:4,dot:4,codeName:"pylon-requirement"};R.expando="ng339";var gb=R.cache={},Ef=1;R._data=function(b){return this.cache[b[this.expando]]||{}};var zf=/([\:\-\_]+(.))/g,Af=/^moz([A-Z])/,lg={mouseleave:"mouseout",mouseenter:"mouseover"},Tb=L("jqLite"),Df=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Sb=/<|&#?\w+;/,Bf=/<([\w:]+)/,Cf=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,na={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>",
"</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};na.optgroup=na.option;na.tbody=na.tfoot=na.colgroup=na.caption=na.thead;na.th=na.td;var Ra=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===W.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(O).on("load",a))},toString:function(){var b=[];m(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=
b?z(this[b]):z(this[this.length+b])},length:0,push:kg,sort:[].sort,splice:[].splice},Ab={};m("multiple selected checked disabled readOnly required open".split(" "),function(b){Ab[M(b)]=b});var Rc={};m("input select option textarea button form details".split(" "),function(b){Rc[b]=!0});var Sc={ngMinlength:"minlength",ngMaxlength:"maxlength",ngMin:"min",ngMax:"max",ngPattern:"pattern"};m({data:Vb,removeData:ub,hasData:function(b){for(var a in gb[b.ng339])return!0;return!1}},function(b,a){R[a]=b});m({data:Vb,
inheritedData:zb,scope:function(b){return z.data(b,"$scope")||zb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return z.data(b,"$isolateScope")||z.data(b,"$isolateScopeNoTemplate")},controller:Oc,injector:function(b){return zb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:wb,css:function(b,a,c){a=fb(a);if(x(c))b.style[a]=c;else return b.style[a]},attr:function(b,a,c){var d=b.nodeType;if(d!==Pa&&2!==d&&8!==d)if(d=M(a),Ab[d])if(x(c))c?(b[a]=!0,b.setAttribute(a,
d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||v).specified?d:t;else if(x(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?t:b},prop:function(b,a,c){if(x(c))b[a]=c;else return b[a]},text:function(){function b(a,b){if(y(b)){var d=a.nodeType;return d===pa||d===Pa?a.textContent:""}a.textContent=b}b.$dv="";return b}(),val:function(b,a){if(y(a)){if(b.multiple&&"select"===ta(b)){var c=[];m(b.options,function(a){a.selected&&c.push(a.value||
a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(y(a))return b.innerHTML;tb(b,!0);b.innerHTML=a},empty:Pc},function(b,a){R.prototype[a]=function(a,d){var e,f,g=this.length;if(b!==Pc&&(2==b.length&&b!==wb&&b!==Oc?a:d)===t){if(D(a)){for(e=0;e<g;e++)if(b===Vb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;g=e===t?Math.min(g,1):g;for(f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<g;e++)b(this[e],a,d);return this}});m({removeData:ub,
on:function a(c,d,e,f){if(x(f))throw Tb("onargs");if(Kc(c)){var g=vb(c,!0);f=g.events;var h=g.handle;h||(h=g.handle=Hf(c,f));for(var g=0<=d.indexOf(" ")?d.split(" "):[d],l=g.length;l--;){d=g[l];var k=f[d];k||(f[d]=[],"mouseenter"===d||"mouseleave"===d?a(c,lg[d],function(a){var c=a.relatedTarget;c&&(c===this||this.contains(c))||h(a,d)}):"$destroy"!==d&&c.addEventListener(d,h,!1),k=f[d]);k.push(e)}}},off:Nc,one:function(a,c,d){a=z(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,
c){var d,e=a.parentNode;tb(a);m(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];m(a.childNodes,function(a){a.nodeType===pa&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){var d=a.nodeType;if(d===pa||11===d){c=new R(c);for(var d=0,e=c.length;d<e;d++)a.appendChild(c[d])}},prepend:function(a,c){if(a.nodeType===pa){var d=a.firstChild;m(new R(c),function(c){a.insertBefore(c,d)})}},
wrap:function(a,c){c=z(c).eq(0).clone()[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:Wb,detach:function(a){Wb(a,!0)},after:function(a,c){var d=a,e=a.parentNode;c=new R(c);for(var f=0,g=c.length;f<g;f++){var h=c[f];e.insertBefore(h,d.nextSibling);d=h}},addClass:yb,removeClass:xb,toggleClass:function(a,c,d){c&&m(c.split(" "),function(c){var f=d;y(f)&&(f=!wb(a,c));(f?yb:xb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){return a.nextElementSibling},
find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Ub,triggerHandler:function(a,c,d){var e,f,g=c.type||c,h=vb(a);if(h=(h=h&&h.events)&&h[g])e={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopImmediatePropagation:function(){this.immediatePropagationStopped=!0},isImmediatePropagationStopped:function(){return!0===this.immediatePropagationStopped},stopPropagation:v,type:g,target:a},c.type&&(e=Q(e,
c)),c=ia(h),f=d?[e].concat(d):[e],m(c,function(c){e.isImmediatePropagationStopped()||c.apply(a,f)})}},function(a,c){R.prototype[c]=function(c,e,f){for(var g,h=0,l=this.length;h<l;h++)y(g)?(g=a(this[h],c,e,f),x(g)&&(g=z(g))):Mc(g,a(this[h],c,e,f));return x(g)?g:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});Ua.prototype={put:function(a,c){this[Ga(a,this.nextUid)]=c},get:function(a){return this[Ga(a,this.nextUid)]},remove:function(a){var c=this[a=Ga(a,this.nextUid)];delete this[a];
return c}};var xf=[function(){this.$get=[function(){return Ua}]}],Uc=/^[^\(]*\(\s*([^\)]*)\)/m,mg=/,/,ng=/^\s*(_?)(\S+?)\1\s*$/,Tc=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ha=L("$injector");eb.$$annotate=function(a,c,d){var e;if("function"===typeof a){if(!(e=a.$inject)){e=[];if(a.length){if(c)throw I(d)&&d||(d=a.name||If(a)),Ha("strictdi",d);c=a.toString().replace(Tc,"");c=c.match(Uc);m(c[1].split(mg),function(a){a.replace(ng,function(a,c,d){e.push(d)})})}a.$inject=e}}else G(a)?(c=a.length-1,Sa(a[c],"fn"),
e=a.slice(0,c)):Sa(a,"fn",!0);return e};var Nd=L("$animate"),Ue=function(){this.$get=["$q","$$rAF",function(a,c){function d(){}d.all=v;d.chain=v;d.prototype={end:v,cancel:v,resume:v,pause:v,complete:v,then:function(d,f){return a(function(a){c(function(){a()})}).then(d,f)}};return d}]},Te=function(){var a=new Ua,c=[];this.$get=["$$AnimateRunner","$rootScope",function(d,e){function f(d,f,l){var k=a.get(d);k||(a.put(d,k={}),c.push(d));d=function(a,c){var d=!1;a&&(a=I(a)?a.split(" "):G(a)?a:[],m(a,function(a){a&&
(d=!0,k[a]=c)}));return d};f=d(f,!0);l=d(l,!1);!f&&!l||1<c.length||e.$$postDigest(function(){m(c,function(c){var d=a.get(c);if(d){var e=Jf(c.attr("class")),f="",g="";m(d,function(a,c){a!==!!e[c]&&(a?f+=(f.length?" ":"")+c:g+=(g.length?" ":"")+c)});m(c,function(a){f&&yb(a,f);g&&xb(a,g)});a.remove(c)}});c.length=0})}return{enabled:v,on:v,off:v,pin:v,push:function(a,c,e,k){k&&k();e=e||{};e.from&&a.css(e.from);e.to&&a.css(e.to);(e.addClass||e.removeClass)&&f(a,e.addClass,e.removeClass);return new d}}}]},
Re=["$provide",function(a){var c=this;this.$$registeredAnimations=Object.create(null);this.register=function(d,e){if(d&&"."!==d.charAt(0))throw Nd("notcsel",d);var f=d+"-animation";c.$$registeredAnimations[d.substr(1)]=f;a.factory(f,e)};this.classNameFilter=function(a){if(1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null)&&/(\s+|\/)ng-animate(\s+|\/)/.test(this.$$classNameFilter.toString()))throw Nd("nongcls","ng-animate");return this.$$classNameFilter};this.$get=["$$animateQueue",
function(a){function c(a,d,e){if(e){var l;a:{for(l=0;l<e.length;l++){var k=e[l];if(1===k.nodeType){l=k;break a}}l=void 0}!l||l.parentNode||l.previousElementSibling||(e=null)}e?e.after(a):d.prepend(a)}return{on:a.on,off:a.off,pin:a.pin,enabled:a.enabled,cancel:function(a){a.end&&a.end()},enter:function(f,g,h,l){g=g&&z(g);h=h&&z(h);g=g||h.parent();c(f,g,h);return a.push(f,"enter",Ia(l))},move:function(f,g,h,l){g=g&&z(g);h=h&&z(h);g=g||h.parent();c(f,g,h);return a.push(f,"move",Ia(l))},leave:function(c,
e){return a.push(c,"leave",Ia(e),function(){c.remove()})},addClass:function(c,e,h){h=Ia(h);h.addClass=hb(h.addclass,e);return a.push(c,"addClass",h)},removeClass:function(c,e,h){h=Ia(h);h.removeClass=hb(h.removeClass,e);return a.push(c,"removeClass",h)},setClass:function(c,e,h,l){l=Ia(l);l.addClass=hb(l.addClass,e);l.removeClass=hb(l.removeClass,h);return a.push(c,"setClass",l)},animate:function(c,e,h,l,k){k=Ia(k);k.from=k.from?Q(k.from,e):e;k.to=k.to?Q(k.to,h):h;k.tempClasses=hb(k.tempClasses,l||
"ng-inline-animate");return a.push(c,"animate",k)}}}]}],Se=function(){this.$get=["$$rAF","$q",function(a,c){var d=function(){};d.prototype={done:function(a){this.defer&&this.defer[!0===a?"reject":"resolve"]()},end:function(){this.done()},cancel:function(){this.done(!0)},getPromise:function(){this.defer||(this.defer=c.defer());return this.defer.promise},then:function(a,c){return this.getPromise().then(a,c)},"catch":function(a){return this.getPromise().catch(a)},"finally":function(a){return this.getPromise().finally(a)}};
return function(c,f){function g(){a(function(){f.addClass&&(c.addClass(f.addClass),f.addClass=null);f.removeClass&&(c.removeClass(f.removeClass),f.removeClass=null);f.to&&(c.css(f.to),f.to=null);h||l.done();h=!0});return l}f.from&&(c.css(f.from),f.from=null);var h,l=new d;return{start:g,end:g}}}]},ea=L("$compile");Cc.$inject=["$provide","$$sanitizeUriProvider"];var Xc=/^((?:x|data)[\:\-_])/i,Nf=L("$controller"),Vc=/^(\S+)(\s+as\s+(\w+))?$/,$e=function(){this.$get=["$document",function(a){return function(c){c?
!c.nodeType&&c instanceof z&&(c=c[0]):c=a[0].body;return c.offsetWidth+1}}]},bd="application/json",$b={"Content-Type":bd+";charset=utf-8"},Pf=/^\[|^\{(?!\{)/,Qf={"[":/]$/,"{":/}$/},Of=/^\)\]\}',?\n/,og=L("$http"),fd=function(a){return function(){throw og("legacy",a);}},Ka=aa.$interpolateMinErr=L("$interpolate");Ka.throwNoconcat=function(a){throw Ka("noconcat",a);};Ka.interr=function(a,c){return Ka("interr",a,c.toString())};var pg=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,Tf={http:80,https:443,ftp:21},Db=
L("$location"),qg={$$html5:!1,$$replace:!1,absUrl:Eb("$$absUrl"),url:function(a){if(y(a))return this.$$url;var c=pg.exec(a);(c[1]||""===a)&&this.path(decodeURIComponent(c[1]));(c[2]||c[1]||""===a)&&this.search(c[3]||"");this.hash(c[5]||"");return this},protocol:Eb("$$protocol"),host:Eb("$$host"),port:Eb("$$port"),path:kd("$$path",function(a){a=null!==a?a.toString():"";return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(I(a)||X(a))a=
a.toString(),this.$$search=xc(a);else if(D(a))a=fa(a,{}),m(a,function(c,e){null==c&&delete a[e]}),this.$$search=a;else throw Db("isrcharg");break;default:y(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:kd("$$hash",function(a){return null!==a?a.toString():""}),replace:function(){this.$$replace=!0;return this}};m([jd,cc,bc],function(a){a.prototype=Object.create(qg);a.prototype.state=function(c){if(!arguments.length)return this.$$state;if(a!==bc||!this.$$html5)throw Db("nostate");
this.$$state=y(c)?null:c;return this}});var da=L("$parse"),Uf=Function.prototype.call,Vf=Function.prototype.apply,Wf=Function.prototype.bind,Lb=ga();m("+ - * / % === !== == != < > <= >= && || ! = |".split(" "),function(a){Lb[a]=!0});var rg={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},ec=function(a){this.options=a};ec.prototype={constructor:ec,lex:function(a){this.text=a;this.index=0;for(this.tokens=[];this.index<this.text.length;)if(a=this.text.charAt(this.index),'"'===a||"'"===a)this.readString(a);
else if(this.isNumber(a)||"."===a&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(a))this.readIdent();else if(this.is(a,"(){}[].,;:?"))this.tokens.push({index:this.index,text:a}),this.index++;else if(this.isWhitespace(a))this.index++;else{var c=a+this.peek(),d=c+this.peek(2),e=Lb[c],f=Lb[d];Lb[a]||e||f?(a=f?d:e?c:a,this.tokens.push({index:this.index,text:a,operator:!0}),this.index+=a.length):this.throwError("Unexpected next character ",this.index,this.index+1)}return this.tokens},
is:function(a,c){return-1!==c.indexOf(a)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a&&"string"===typeof a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=x(c)?"s "+c+"-"+
this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw da("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=M(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}this.tokens.push({index:c,
text:a,constant:!0,value:Number(a)})},readIdent:function(){for(var a=this.index;this.index<this.text.length;){var c=this.text.charAt(this.index);if(!this.isIdent(c)&&!this.isNumber(c))break;this.index++}this.tokens.push({index:a,text:this.text.slice(a,this.index),identifier:!0})},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||
this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d+=rg[g]||g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,constant:!0,value:d});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var s=function(a,c){this.lexer=a;this.options=c};s.Program="Program";s.ExpressionStatement="ExpressionStatement";s.AssignmentExpression="AssignmentExpression";s.ConditionalExpression="ConditionalExpression";
s.LogicalExpression="LogicalExpression";s.BinaryExpression="BinaryExpression";s.UnaryExpression="UnaryExpression";s.CallExpression="CallExpression";s.MemberExpression="MemberExpression";s.Identifier="Identifier";s.Literal="Literal";s.ArrayExpression="ArrayExpression";s.Property="Property";s.ObjectExpression="ObjectExpression";s.ThisExpression="ThisExpression";s.NGValueParameter="NGValueParameter";s.prototype={ast:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.program();0!==this.tokens.length&&
this.throwError("is an unexpected token",this.tokens[0]);return a},program:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.expressionStatement()),!this.expect(";"))return{type:s.Program,body:a}},expressionStatement:function(){return{type:s.ExpressionStatement,expression:this.filterChain()}},filterChain:function(){for(var a=this.expression();this.expect("|");)a=this.filter(a);return a},expression:function(){return this.assignment()},assignment:function(){var a=
this.ternary();this.expect("=")&&(a={type:s.AssignmentExpression,left:a,right:this.assignment(),operator:"="});return a},ternary:function(){var a=this.logicalOR(),c,d;return this.expect("?")&&(c=this.expression(),this.consume(":"))?(d=this.expression(),{type:s.ConditionalExpression,test:a,alternate:c,consequent:d}):a},logicalOR:function(){for(var a=this.logicalAND();this.expect("||");)a={type:s.LogicalExpression,operator:"||",left:a,right:this.logicalAND()};return a},logicalAND:function(){for(var a=
this.equality();this.expect("&&");)a={type:s.LogicalExpression,operator:"&&",left:a,right:this.equality()};return a},equality:function(){for(var a=this.relational(),c;c=this.expect("==","!=","===","!==");)a={type:s.BinaryExpression,operator:c.text,left:a,right:this.relational()};return a},relational:function(){for(var a=this.additive(),c;c=this.expect("<",">","<=",">=");)a={type:s.BinaryExpression,operator:c.text,left:a,right:this.additive()};return a},additive:function(){for(var a=this.multiplicative(),
c;c=this.expect("+","-");)a={type:s.BinaryExpression,operator:c.text,left:a,right:this.multiplicative()};return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a={type:s.BinaryExpression,operator:c.text,left:a,right:this.unary()};return a},unary:function(){var a;return(a=this.expect("+","-","!"))?{type:s.UnaryExpression,operator:a.text,prefix:!0,argument:this.unary()}:this.primary()},primary:function(){var a;this.expect("(")?(a=this.filterChain(),this.consume(")")):
this.expect("[")?a=this.arrayDeclaration():this.expect("{")?a=this.object():this.constants.hasOwnProperty(this.peek().text)?a=fa(this.constants[this.consume().text]):this.peek().identifier?a=this.identifier():this.peek().constant?a=this.constant():this.throwError("not a primary expression",this.peek());for(var c;c=this.expect("(","[",".");)"("===c.text?(a={type:s.CallExpression,callee:a,arguments:this.parseArguments()},this.consume(")")):"["===c.text?(a={type:s.MemberExpression,object:a,property:this.expression(),
computed:!0},this.consume("]")):"."===c.text?a={type:s.MemberExpression,object:a,property:this.identifier(),computed:!1}:this.throwError("IMPOSSIBLE");return a},filter:function(a){a=[a];for(var c={type:s.CallExpression,callee:this.identifier(),arguments:a,filter:!0};this.expect(":");)a.push(this.expression());return c},parseArguments:function(){var a=[];if(")"!==this.peekToken().text){do a.push(this.expression());while(this.expect(","))}return a},identifier:function(){var a=this.consume();a.identifier||
this.throwError("is not a valid identifier",a);return{type:s.Identifier,name:a.text}},constant:function(){return{type:s.Literal,value:this.consume().value}},arrayDeclaration:function(){var a=[];if("]"!==this.peekToken().text){do{if(this.peek("]"))break;a.push(this.expression())}while(this.expect(","))}this.consume("]");return{type:s.ArrayExpression,elements:a}},object:function(){var a=[],c;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;c={type:s.Property,kind:"init"};this.peek().constant?
c.key=this.constant():this.peek().identifier?c.key=this.identifier():this.throwError("invalid key",this.peek());this.consume(":");c.value=this.expression();a.push(c)}while(this.expect(","))}this.consume("}");return{type:s.ObjectExpression,properties:a}},throwError:function(a,c){throw da("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},consume:function(a){if(0===this.tokens.length)throw da("ueoe",this.text);var c=this.expect(a);c||this.throwError("is unexpected, expecting ["+a+
"]",this.peek());return c},peekToken:function(){if(0===this.tokens.length)throw da("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){return this.peekAhead(0,a,c,d,e)},peekAhead:function(a,c,d,e,f){if(this.tokens.length>a){a=this.tokens[a];var g=a.text;if(g===c||g===d||g===e||g===f||!(c||d||e||f))return a}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},constants:{"true":{type:s.Literal,value:!0},"false":{type:s.Literal,value:!1},"null":{type:s.Literal,
value:null},undefined:{type:s.Literal,value:t},"this":{type:s.ThisExpression}}};rd.prototype={compile:function(a,c){var d=this,e=this.astBuilder.ast(a);this.state={nextId:0,filters:{},expensiveChecks:c,fn:{vars:[],body:[],own:{}},assign:{vars:[],body:[],own:{}},inputs:[]};U(e,d.$filter);var f="",g;this.stage="assign";if(g=pd(e))this.state.computing="assign",f=this.nextId(),this.recurse(g,f),f="fn.assign="+this.generateFunction("assign","s,v,l");g=nd(e.body);d.stage="inputs";m(g,function(a,c){var e=
"fn"+c;d.state[e]={vars:[],body:[],own:{}};d.state.computing=e;var f=d.nextId();d.recurse(a,f);d.return_(f);d.state.inputs.push(e);a.watchId=c});this.state.computing="fn";this.stage="main";this.recurse(e);f='"'+this.USE+" "+this.STRICT+'";\n'+this.filterPrefix()+"var fn="+this.generateFunction("fn","s,l,a,i")+f+this.watchFns()+"return fn;";f=(new Function("$filter","ensureSafeMemberName","ensureSafeObject","ensureSafeFunction","ifDefined","plus","text",f))(this.$filter,Wa,Ba,ld,Xf,md,a);this.state=
this.stage=t;f.literal=qd(e);f.constant=e.constant;return f},USE:"use",STRICT:"strict",watchFns:function(){var a=[],c=this.state.inputs,d=this;m(c,function(c){a.push("var "+c+"="+d.generateFunction(c,"s"))});c.length&&a.push("fn.inputs=["+c.join(",")+"];");return a.join("")},generateFunction:function(a,c){return"function("+c+"){"+this.varsPrefix(a)+this.body(a)+"};"},filterPrefix:function(){var a=[],c=this;m(this.state.filters,function(d,e){a.push(d+"=$filter("+c.escape(e)+")")});return a.length?
"var "+a.join(",")+";":""},varsPrefix:function(a){return this.state[a].vars.length?"var "+this.state[a].vars.join(",")+";":""},body:function(a){return this.state[a].body.join("")},recurse:function(a,c,d,e,f,g){var h,l,k=this,n,q;e=e||v;if(!g&&x(a.watchId))c=c||this.nextId(),this.if_("i",this.lazyAssign(c,this.computedMember("i",a.watchId)),this.lazyRecurse(a,c,d,e,f,!0));else switch(a.type){case s.Program:m(a.body,function(c,d){k.recurse(c.expression,t,t,function(a){l=a});d!==a.body.length-1?k.current().body.push(l,
";"):k.return_(l)});break;case s.Literal:q=this.escape(a.value);this.assign(c,q);e(q);break;case s.UnaryExpression:this.recurse(a.argument,t,t,function(a){l=a});q=a.operator+"("+this.ifDefined(l,0)+")";this.assign(c,q);e(q);break;case s.BinaryExpression:this.recurse(a.left,t,t,function(a){h=a});this.recurse(a.right,t,t,function(a){l=a});q="+"===a.operator?this.plus(h,l):"-"===a.operator?this.ifDefined(h,0)+a.operator+this.ifDefined(l,0):"("+h+")"+a.operator+"("+l+")";this.assign(c,q);e(q);break;case s.LogicalExpression:c=
c||this.nextId();k.recurse(a.left,c);k.if_("&&"===a.operator?c:k.not(c),k.lazyRecurse(a.right,c));e(c);break;case s.ConditionalExpression:c=c||this.nextId();k.recurse(a.test,c);k.if_(c,k.lazyRecurse(a.alternate,c),k.lazyRecurse(a.consequent,c));e(c);break;case s.Identifier:c=c||this.nextId();d&&(d.context="inputs"===k.stage?"s":this.assign(this.nextId(),this.getHasOwnProperty("l",a.name)+"?l:s"),d.computed=!1,d.name=a.name);Wa(a.name);k.if_("inputs"===k.stage||k.not(k.getHasOwnProperty("l",a.name)),
function(){k.if_("inputs"===k.stage||"s",function(){f&&1!==f&&k.if_(k.not(k.nonComputedMember("s",a.name)),k.lazyAssign(k.nonComputedMember("s",a.name),"{}"));k.assign(c,k.nonComputedMember("s",a.name))})},c&&k.lazyAssign(c,k.nonComputedMember("l",a.name)));(k.state.expensiveChecks||Fb(a.name))&&k.addEnsureSafeObject(c);e(c);break;case s.MemberExpression:h=d&&(d.context=this.nextId())||this.nextId();c=c||this.nextId();k.recurse(a.object,h,t,function(){k.if_(k.notNull(h),function(){if(a.computed)l=
k.nextId(),k.recurse(a.property,l),k.addEnsureSafeMemberName(l),f&&1!==f&&k.if_(k.not(k.computedMember(h,l)),k.lazyAssign(k.computedMember(h,l),"{}")),q=k.ensureSafeObject(k.computedMember(h,l)),k.assign(c,q),d&&(d.computed=!0,d.name=l);else{Wa(a.property.name);f&&1!==f&&k.if_(k.not(k.nonComputedMember(h,a.property.name)),k.lazyAssign(k.nonComputedMember(h,a.property.name),"{}"));q=k.nonComputedMember(h,a.property.name);if(k.state.expensiveChecks||Fb(a.property.name))q=k.ensureSafeObject(q);k.assign(c,
q);d&&(d.computed=!1,d.name=a.property.name)}},function(){k.assign(c,"undefined")});e(c)},!!f);break;case s.CallExpression:c=c||this.nextId();a.filter?(l=k.filter(a.callee.name),n=[],m(a.arguments,function(a){var c=k.nextId();k.recurse(a,c);n.push(c)}),q=l+"("+n.join(",")+")",k.assign(c,q),e(c)):(l=k.nextId(),h={},n=[],k.recurse(a.callee,l,h,function(){k.if_(k.notNull(l),function(){k.addEnsureSafeFunction(l);m(a.arguments,function(a){k.recurse(a,k.nextId(),t,function(a){n.push(k.ensureSafeObject(a))})});
h.name?(k.state.expensiveChecks||k.addEnsureSafeObject(h.context),q=k.member(h.context,h.name,h.computed)+"("+n.join(",")+")"):q=l+"("+n.join(",")+")";q=k.ensureSafeObject(q);k.assign(c,q)},function(){k.assign(c,"undefined")});e(c)}));break;case s.AssignmentExpression:l=this.nextId();h={};if(!od(a.left))throw da("lval");this.recurse(a.left,t,h,function(){k.if_(k.notNull(h.context),function(){k.recurse(a.right,l);k.addEnsureSafeObject(k.member(h.context,h.name,h.computed));q=k.member(h.context,h.name,
h.computed)+a.operator+l;k.assign(c,q);e(c||q)})},1);break;case s.ArrayExpression:n=[];m(a.elements,function(a){k.recurse(a,k.nextId(),t,function(a){n.push(a)})});q="["+n.join(",")+"]";this.assign(c,q);e(q);break;case s.ObjectExpression:n=[];m(a.properties,function(a){k.recurse(a.value,k.nextId(),t,function(c){n.push(k.escape(a.key.type===s.Identifier?a.key.name:""+a.key.value)+":"+c)})});q="{"+n.join(",")+"}";this.assign(c,q);e(q);break;case s.ThisExpression:this.assign(c,"s");e("s");break;case s.NGValueParameter:this.assign(c,
"v"),e("v")}},getHasOwnProperty:function(a,c){var d=a+"."+c,e=this.current().own;e.hasOwnProperty(d)||(e[d]=this.nextId(!1,a+"&&("+this.escape(c)+" in "+a+")"));return e[d]},assign:function(a,c){if(a)return this.current().body.push(a,"=",c,";"),a},filter:function(a){this.state.filters.hasOwnProperty(a)||(this.state.filters[a]=this.nextId(!0));return this.state.filters[a]},ifDefined:function(a,c){return"ifDefined("+a+","+this.escape(c)+")"},plus:function(a,c){return"plus("+a+","+c+")"},return_:function(a){this.current().body.push("return ",
a,";")},if_:function(a,c,d){if(!0===a)c();else{var e=this.current().body;e.push("if(",a,"){");c();e.push("}");d&&(e.push("else{"),d(),e.push("}"))}},not:function(a){return"!("+a+")"},notNull:function(a){return a+"!=null"},nonComputedMember:function(a,c){return a+"."+c},computedMember:function(a,c){return a+"["+c+"]"},member:function(a,c,d){return d?this.computedMember(a,c):this.nonComputedMember(a,c)},addEnsureSafeObject:function(a){this.current().body.push(this.ensureSafeObject(a),";")},addEnsureSafeMemberName:function(a){this.current().body.push(this.ensureSafeMemberName(a),
";")},addEnsureSafeFunction:function(a){this.current().body.push(this.ensureSafeFunction(a),";")},ensureSafeObject:function(a){return"ensureSafeObject("+a+",text)"},ensureSafeMemberName:function(a){return"ensureSafeMemberName("+a+",text)"},ensureSafeFunction:function(a){return"ensureSafeFunction("+a+",text)"},lazyRecurse:function(a,c,d,e,f,g){var h=this;return function(){h.recurse(a,c,d,e,f,g)}},lazyAssign:function(a,c){var d=this;return function(){d.assign(a,c)}},stringEscapeRegex:/[^ a-zA-Z0-9]/g,
stringEscapeFn:function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)},escape:function(a){if(I(a))return"'"+a.replace(this.stringEscapeRegex,this.stringEscapeFn)+"'";if(X(a))return a.toString();if(!0===a)return"true";if(!1===a)return"false";if(null===a)return"null";if("undefined"===typeof a)return"undefined";throw da("esc");},nextId:function(a,c){var d="v"+this.state.nextId++;a||this.current().vars.push(d+(c?"="+c:""));return d},current:function(){return this.state[this.state.computing]}};
sd.prototype={compile:function(a,c){var d=this,e=this.astBuilder.ast(a);this.expression=a;this.expensiveChecks=c;U(e,d.$filter);var f,g;if(f=pd(e))g=this.recurse(f);f=nd(e.body);var h;f&&(h=[],m(f,function(a,c){var e=d.recurse(a);a.input=e;h.push(e);a.watchId=c}));var l=[];m(e.body,function(a){l.push(d.recurse(a.expression))});f=0===e.body.length?function(){}:1===e.body.length?l[0]:function(a,c){var d;m(l,function(e){d=e(a,c)});return d};g&&(f.assign=function(a,c,d){return g(a,d,c)});h&&(f.inputs=
h);f.literal=qd(e);f.constant=e.constant;return f},recurse:function(a,c,d){var e,f,g=this,h;if(a.input)return this.inputs(a.input,a.watchId);switch(a.type){case s.Literal:return this.value(a.value,c);case s.UnaryExpression:return f=this.recurse(a.argument),this["unary"+a.operator](f,c);case s.BinaryExpression:return e=this.recurse(a.left),f=this.recurse(a.right),this["binary"+a.operator](e,f,c);case s.LogicalExpression:return e=this.recurse(a.left),f=this.recurse(a.right),this["binary"+a.operator](e,
f,c);case s.ConditionalExpression:return this["ternary?:"](this.recurse(a.test),this.recurse(a.alternate),this.recurse(a.consequent),c);case s.Identifier:return Wa(a.name,g.expression),g.identifier(a.name,g.expensiveChecks||Fb(a.name),c,d,g.expression);case s.MemberExpression:return e=this.recurse(a.object,!1,!!d),a.computed||(Wa(a.property.name,g.expression),f=a.property.name),a.computed&&(f=this.recurse(a.property)),a.computed?this.computedMember(e,f,c,d,g.expression):this.nonComputedMember(e,f,
g.expensiveChecks,c,d,g.expression);case s.CallExpression:return h=[],m(a.arguments,function(a){h.push(g.recurse(a))}),a.filter&&(f=this.$filter(a.callee.name)),a.filter||(f=this.recurse(a.callee,!0)),a.filter?function(a,d,e,g){for(var r=[],m=0;m<h.length;++m)r.push(h[m](a,d,e,g));a=f.apply(t,r,g);return c?{context:t,name:t,value:a}:a}:function(a,d,e,q){var r=f(a,d,e,q),m;if(null!=r.value){Ba(r.context,g.expression);ld(r.value,g.expression);m=[];for(var s=0;s<h.length;++s)m.push(Ba(h[s](a,d,e,q),
g.expression));m=Ba(r.value.apply(r.context,m),g.expression)}return c?{value:m}:m};case s.AssignmentExpression:return e=this.recurse(a.left,!0,1),f=this.recurse(a.right),function(a,d,h,q){var m=e(a,d,h,q);a=f(a,d,h,q);Ba(m.value,g.expression);m.context[m.name]=a;return c?{value:a}:a};case s.ArrayExpression:return h=[],m(a.elements,function(a){h.push(g.recurse(a))}),function(a,d,e,f){for(var g=[],m=0;m<h.length;++m)g.push(h[m](a,d,e,f));return c?{value:g}:g};case s.ObjectExpression:return h=[],m(a.properties,
function(a){h.push({key:a.key.type===s.Identifier?a.key.name:""+a.key.value,value:g.recurse(a.value)})}),function(a,d,e,f){for(var g={},m=0;m<h.length;++m)g[h[m].key]=h[m].value(a,d,e,f);return c?{value:g}:g};case s.ThisExpression:return function(a){return c?{value:a}:a};case s.NGValueParameter:return function(a,d,e,f){return c?{value:e}:e}}},"unary+":function(a,c){return function(d,e,f,g){d=a(d,e,f,g);d=x(d)?+d:0;return c?{value:d}:d}},"unary-":function(a,c){return function(d,e,f,g){d=a(d,e,f,g);
d=x(d)?-d:0;return c?{value:d}:d}},"unary!":function(a,c){return function(d,e,f,g){d=!a(d,e,f,g);return c?{value:d}:d}},"binary+":function(a,c,d){return function(e,f,g,h){var l=a(e,f,g,h);e=c(e,f,g,h);l=md(l,e);return d?{value:l}:l}},"binary-":function(a,c,d){return function(e,f,g,h){var l=a(e,f,g,h);e=c(e,f,g,h);l=(x(l)?l:0)-(x(e)?e:0);return d?{value:l}:l}},"binary*":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)*c(e,f,g,h);return d?{value:e}:e}},"binary/":function(a,c,d){return function(e,
f,g,h){e=a(e,f,g,h)/c(e,f,g,h);return d?{value:e}:e}},"binary%":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)%c(e,f,g,h);return d?{value:e}:e}},"binary===":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)===c(e,f,g,h);return d?{value:e}:e}},"binary!==":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)!==c(e,f,g,h);return d?{value:e}:e}},"binary==":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)==c(e,f,g,h);return d?{value:e}:e}},"binary!=":function(a,c,d){return function(e,
f,g,h){e=a(e,f,g,h)!=c(e,f,g,h);return d?{value:e}:e}},"binary<":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)<c(e,f,g,h);return d?{value:e}:e}},"binary>":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)>c(e,f,g,h);return d?{value:e}:e}},"binary<=":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)<=c(e,f,g,h);return d?{value:e}:e}},"binary>=":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)>=c(e,f,g,h);return d?{value:e}:e}},"binary&&":function(a,c,d){return function(e,f,g,h){e=
a(e,f,g,h)&&c(e,f,g,h);return d?{value:e}:e}},"binary||":function(a,c,d){return function(e,f,g,h){e=a(e,f,g,h)||c(e,f,g,h);return d?{value:e}:e}},"ternary?:":function(a,c,d,e){return function(f,g,h,l){f=a(f,g,h,l)?c(f,g,h,l):d(f,g,h,l);return e?{value:f}:f}},value:function(a,c){return function(){return c?{context:t,name:t,value:a}:a}},identifier:function(a,c,d,e,f){return function(g,h,l,k){g=h&&a in h?h:g;e&&1!==e&&g&&!g[a]&&(g[a]={});h=g?g[a]:t;c&&Ba(h,f);return d?{context:g,name:a,value:h}:h}},
computedMember:function(a,c,d,e,f){return function(g,h,l,k){var n=a(g,h,l,k),q,m;null!=n&&(q=c(g,h,l,k),Wa(q,f),e&&1!==e&&n&&!n[q]&&(n[q]={}),m=n[q],Ba(m,f));return d?{context:n,name:q,value:m}:m}},nonComputedMember:function(a,c,d,e,f,g){return function(h,l,k,n){h=a(h,l,k,n);f&&1!==f&&h&&!h[c]&&(h[c]={});l=null!=h?h[c]:t;(d||Fb(c))&&Ba(l,g);return e?{context:h,name:c,value:l}:l}},inputs:function(a,c){return function(d,e,f,g){return g?g[c]:a(d,e,f)}}};var fc=function(a,c,d){this.lexer=a;this.$filter=
c;this.options=d;this.ast=new s(this.lexer);this.astCompiler=d.csp?new sd(this.ast,c):new rd(this.ast,c)};fc.prototype={constructor:fc,parse:function(a){return this.astCompiler.compile(a,this.options.expensiveChecks)}};ga();ga();var Yf=Object.prototype.valueOf,Ca=L("$sce"),oa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},ea=L("$compile"),Z=W.createElement("a"),wd=Aa(O.location.href);xd.$inject=["$document"];Jc.$inject=["$provide"];yd.$inject=["$locale"];Ad.$inject=["$locale"];
var Dd=".",hg={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:Hb("Month"),MMM:Hb("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",1),hh:$("Hours",2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:Hb("Day"),EEE:Hb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a,c,d){a=-1*d;return a=(0<=a?"+":"")+(Gb(Math[0<a?"floor":
"ceil"](a/60),2)+Gb(Math.abs(a%60),2))},ww:Fd(2),w:Fd(1),G:hc,GG:hc,GGG:hc,GGGG:function(a,c){return 0>=a.getFullYear()?c.ERANAMES[0]:c.ERANAMES[1]}},gg=/((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,fg=/^\-?\d+$/;zd.$inject=["$locale"];var cg=qa(M),dg=qa(rb);Bd.$inject=["$parse"];var he=qa({restrict:"E",compile:function(a,c){if(!c.href&&!c.xlinkHref)return function(a,c){if("a"===c[0].nodeName.toLowerCase()){var f="[object SVGAnimatedString]"===sa.call(c.prop("href"))?
"xlink:href":"href";c.on("click",function(a){c.attr(f)||a.preventDefault()})}}}}),sb={};m(Ab,function(a,c){function d(a,d,f){a.$watch(f[e],function(a){f.$set(c,!!a)})}if("multiple"!=a){var e=va("ng-"+c),f=d;"checked"===a&&(f=function(a,c,f){f.ngModel!==f[e]&&d(a,c,f)});sb[e]=function(){return{restrict:"A",priority:100,link:f}}}});m(Sc,function(a,c){sb[c]=function(){return{priority:100,link:function(a,e,f){if("ngPattern"===c&&"/"==f.ngPattern.charAt(0)&&(e=f.ngPattern.match(jg))){f.$set("ngPattern",
new RegExp(e[1],e[2]));return}a.$watch(f[c],function(a){f.$set(c,a)})}}}});m(["src","srcset","href"],function(a){var c=va("ng-"+a);sb[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===sa.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(c){c?(f.$set(h,c),Va&&g&&e.prop(g,f[h])):"href"===a&&f.$set(h,null)})}}}});var Ib={$addControl:v,$$renameControl:function(a,c){a.$name=c},$removeControl:v,$setValidity:v,
$setDirty:v,$setPristine:v,$setSubmitted:v};Gd.$inject=["$element","$attrs","$scope","$animate","$interpolate"];var Od=function(a){return["$timeout","$parse",function(c,d){function e(a){return""===a?d('this[""]').assign:d(a).assign||v}return{name:"form",restrict:a?"EAC":"E",controller:Gd,compile:function(d,g){d.addClass(Xa).addClass(lb);var h=g.name?"name":a&&g.ngForm?"ngForm":!1;return{pre:function(a,d,f,g){if(!("action"in f)){var m=function(c){a.$apply(function(){g.$commitViewValue();g.$setSubmitted()});
c.preventDefault()};d[0].addEventListener("submit",m,!1);d.on("$destroy",function(){c(function(){d[0].removeEventListener("submit",m,!1)},0,!1)})}var s=g.$$parentForm,B=h?e(g.$name):v;h&&(B(a,g),f.$observe(h,function(c){g.$name!==c&&(B(a,t),s.$$renameControl(g,c),B=e(g.$name),B(a,g))}));d.on("$destroy",function(){s.$removeControl(g);B(a,t);Q(g,Ib)})}}}}}]},ie=Od(),ve=Od(!0),ig=/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,sg=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
tg=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,ug=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,Pd=/^(\d{4})-(\d{2})-(\d{2})$/,Qd=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,kc=/^(\d{4})-W(\d\d)$/,Rd=/^(\d{4})-(\d\d)$/,Sd=/^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,Td={text:function(a,c,d,e,f,g){ib(a,c,d,e,f,g);ic(e)},date:jb("date",Pd,Kb(Pd,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":jb("datetimelocal",Qd,Kb(Qd,
"yyyy MM dd HH mm ss sss".split(" ")),"yyyy-MM-ddTHH:mm:ss.sss"),time:jb("time",Sd,Kb(Sd,["HH","mm","ss","sss"]),"HH:mm:ss.sss"),week:jb("week",kc,function(a,c){if(ca(a))return a;if(I(a)){kc.lastIndex=0;var d=kc.exec(a);if(d){var e=+d[1],f=+d[2],g=d=0,h=0,l=0,k=Ed(e),f=7*(f-1);c&&(d=c.getHours(),g=c.getMinutes(),h=c.getSeconds(),l=c.getMilliseconds());return new Date(e,0,k.getDate()+f,d,g,h,l)}}return NaN},"yyyy-Www"),month:jb("month",Rd,Kb(Rd,["yyyy","MM"]),"yyyy-MM"),number:function(a,c,d,e,f,g){Id(a,
c,d,e);ib(a,c,d,e,f,g);e.$$parserName="number";e.$parsers.push(function(a){return e.$isEmpty(a)?null:ug.test(a)?parseFloat(a):t});e.$formatters.push(function(a){if(!e.$isEmpty(a)){if(!X(a))throw kb("numfmt",a);a=a.toString()}return a});if(x(d.min)||d.ngMin){var h;e.$validators.min=function(a){return e.$isEmpty(a)||y(h)||a>=h};d.$observe("min",function(a){x(a)&&!X(a)&&(a=parseFloat(a,10));h=X(a)&&!isNaN(a)?a:t;e.$validate()})}if(x(d.max)||d.ngMax){var l;e.$validators.max=function(a){return e.$isEmpty(a)||
y(l)||a<=l};d.$observe("max",function(a){x(a)&&!X(a)&&(a=parseFloat(a,10));l=X(a)&&!isNaN(a)?a:t;e.$validate()})}},url:function(a,c,d,e,f,g){ib(a,c,d,e,f,g);ic(e);e.$$parserName="url";e.$validators.url=function(a,c){var d=a||c;return e.$isEmpty(d)||sg.test(d)}},email:function(a,c,d,e,f,g){ib(a,c,d,e,f,g);ic(e);e.$$parserName="email";e.$validators.email=function(a,c){var d=a||c;return e.$isEmpty(d)||tg.test(d)}},radio:function(a,c,d,e){y(d.name)&&c.attr("name",++mb);c.on("click",function(a){c[0].checked&&
e.$setViewValue(d.value,a&&a.type)});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e,f,g,h,l){var k=Jd(l,a,"ngTrueValue",d.ngTrueValue,!0),n=Jd(l,a,"ngFalseValue",d.ngFalseValue,!1);c.on("click",function(a){e.$setViewValue(c[0].checked,a&&a.type)});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return!1===a};e.$formatters.push(function(a){return ka(a,k)});e.$parsers.push(function(a){return a?k:n})},hidden:v,
button:v,submit:v,reset:v,file:v},Dc=["$browser","$sniffer","$filter","$parse",function(a,c,d,e){return{restrict:"E",require:["?ngModel"],link:{pre:function(f,g,h,l){l[0]&&(Td[M(h.type)]||Td.text)(f,g,h,l[0],c,a,d,e)}}}}],vg=/^(true|false|\d+)$/,Ne=function(){return{restrict:"A",priority:100,compile:function(a,c){return vg.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},ne=["$compile",function(a){return{restrict:"AC",
compile:function(c){a.$$addBindingClass(c);return function(c,e,f){a.$$addBindingInfo(e,f.ngBind);e=e[0];c.$watch(f.ngBind,function(a){e.textContent=a===t?"":a})}}}}],pe=["$interpolate","$compile",function(a,c){return{compile:function(d){c.$$addBindingClass(d);return function(d,f,g){d=a(f.attr(g.$attr.ngBindTemplate));c.$$addBindingInfo(f,d.expressions);f=f[0];g.$observe("ngBindTemplate",function(a){f.textContent=a===t?"":a})}}}}],oe=["$sce","$parse","$compile",function(a,c,d){return{restrict:"A",
compile:function(e,f){var g=c(f.ngBindHtml),h=c(f.ngBindHtml,function(a){return(a||"").toString()});d.$$addBindingClass(e);return function(c,e,f){d.$$addBindingInfo(e,f.ngBindHtml);c.$watch(h,function(){e.html(a.getTrustedHtml(g(c))||"")})}}}}],Me=qa({restrict:"A",require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),qe=jc("",!0),se=jc("Odd",0),re=jc("Even",1),te=Ma({compile:function(a,c){c.$set("ngCloak",t);a.removeClass("ng-cloak")}}),ue=[function(){return{restrict:"A",
scope:!0,controller:"@",priority:500}}],Ic={},wg={blur:!0,focus:!0};m("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=va("ng-"+a);Ic[c]=["$parse","$rootScope",function(d,e){return{restrict:"A",compile:function(f,g){var h=d(g[c],null,!0);return function(c,d){d.on(a,function(d){var f=function(){h(c,{$event:d})};wg[a]&&e.$$phase?c.$evalAsync(f):c.$apply(f)})}}}}]});var xe=["$animate",
function(a){return{multiElement:!0,transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,l,k;c.$watch(e.ngIf,function(c){c?l||g(function(c,f){l=f;c[c.length++]=W.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)}):(k&&(k.remove(),k=null),l&&(l.$destroy(),l=null),h&&(k=qb(h.clone),a.leave(k).then(function(){k=null}),h=null))})}}}],ye=["$templateRequest","$anchorScroll","$animate",function(a,c,d){return{restrict:"ECA",priority:400,
terminal:!0,transclude:"element",controller:aa.noop,compile:function(e,f){var g=f.ngInclude||f.src,h=f.onload||"",l=f.autoscroll;return function(e,f,m,r,s){var t=0,v,w,p,A=function(){w&&(w.remove(),w=null);v&&(v.$destroy(),v=null);p&&(d.leave(p).then(function(){w=null}),w=p,p=null)};e.$watch(g,function(g){var m=function(){!x(l)||l&&!e.$eval(l)||c()},q=++t;g?(a(g,!0).then(function(a){if(q===t){var c=e.$new();r.template=a;a=s(c,function(a){A();d.enter(a,null,f).then(m)});v=c;p=a;v.$emit("$includeContentLoaded",
g);e.$eval(h)}},function(){q===t&&(A(),e.$emit("$includeContentError",g))}),e.$emit("$includeContentRequested",g)):(A(),r.template=null)})}}}}],Pe=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){/SVG/.test(d[0].toString())?(d.empty(),a(Lc(f.template,W).childNodes)(c,function(a){d.append(a)},{futureParentElement:d})):(d.html(f.template),a(d.contents())(c))}}}],ze=Ma({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),
Le=function(){return{restrict:"A",priority:100,require:"ngModel",link:function(a,c,d,e){var f=c.attr(d.$attr.ngList)||", ",g="false"!==d.ngTrim,h=g?T(f):f;e.$parsers.push(function(a){if(!y(a)){var c=[];a&&m(a.split(h),function(a){a&&c.push(g?T(a):a)});return c}});e.$formatters.push(function(a){return G(a)?a.join(f):t});e.$isEmpty=function(a){return!a||!a.length}}}},lb="ng-valid",Kd="ng-invalid",Xa="ng-pristine",Jb="ng-dirty",Md="ng-pending",kb=L("ngModel"),xg=["$scope","$exceptionHandler","$attrs",
"$element","$parse","$animate","$timeout","$rootScope","$q","$interpolate",function(a,c,d,e,f,g,h,l,k,n){this.$modelValue=this.$viewValue=Number.NaN;this.$$rawModelValue=t;this.$validators={};this.$asyncValidators={};this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$untouched=!0;this.$touched=!1;this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$error={};this.$$success={};this.$pending=t;this.$name=n(d.name||"",!1)(a);var q=f(d.ngModel),r=q.assign,s=q,B=r,
K=null,w,p=this;this.$$setOptions=function(a){if((p.$options=a)&&a.getterSetter){var c=f(d.ngModel+"()"),g=f(d.ngModel+"($$$p)");s=function(a){var d=q(a);C(d)&&(d=c(a));return d};B=function(a,c){C(q(a))?g(a,{$$$p:p.$modelValue}):r(a,p.$modelValue)}}else if(!q.assign)throw kb("nonassign",d.ngModel,ua(e));};this.$render=v;this.$isEmpty=function(a){return y(a)||""===a||null===a||a!==a};var A=e.inheritedData("$formController")||Ib,z=0;Hd({ctrl:this,$element:e,set:function(a,c){a[c]=!0},unset:function(a,
c){delete a[c]},parentForm:A,$animate:g});this.$setPristine=function(){p.$dirty=!1;p.$pristine=!0;g.removeClass(e,Jb);g.addClass(e,Xa)};this.$setDirty=function(){p.$dirty=!0;p.$pristine=!1;g.removeClass(e,Xa);g.addClass(e,Jb);A.$setDirty()};this.$setUntouched=function(){p.$touched=!1;p.$untouched=!0;g.setClass(e,"ng-untouched","ng-touched")};this.$setTouched=function(){p.$touched=!0;p.$untouched=!1;g.setClass(e,"ng-touched","ng-untouched")};this.$rollbackViewValue=function(){h.cancel(K);p.$viewValue=
p.$$lastCommittedViewValue;p.$render()};this.$validate=function(){if(!X(p.$modelValue)||!isNaN(p.$modelValue)){var a=p.$$rawModelValue,c=p.$valid,d=p.$modelValue,e=p.$options&&p.$options.allowInvalid;p.$$runValidators(a,p.$$lastCommittedViewValue,function(f){e||c===f||(p.$modelValue=f?a:t,p.$modelValue!==d&&p.$$writeModelToScope())})}};this.$$runValidators=function(a,c,d){function e(){var d=!0;m(p.$validators,function(e,f){var h=e(a,c);d=d&&h;g(f,h)});return d?!0:(m(p.$asyncValidators,function(a,
c){g(c,null)}),!1)}function f(){var d=[],e=!0;m(p.$asyncValidators,function(f,h){var k=f(a,c);if(!k||!C(k.then))throw kb("$asyncValidators",k);g(h,t);d.push(k.then(function(){g(h,!0)},function(a){e=!1;g(h,!1)}))});d.length?k.all(d).then(function(){h(e)},v):h(!0)}function g(a,c){l===z&&p.$setValidity(a,c)}function h(a){l===z&&d(a)}z++;var l=z;(function(){var a=p.$$parserName||"parse";if(w===t)g(a,null);else return w||(m(p.$validators,function(a,c){g(c,null)}),m(p.$asyncValidators,function(a,c){g(c,
null)})),g(a,w),w;return!0})()?e()?f():h(!1):h(!1)};this.$commitViewValue=function(){var a=p.$viewValue;h.cancel(K);if(p.$$lastCommittedViewValue!==a||""===a&&p.$$hasNativeValidators)p.$$lastCommittedViewValue=a,p.$pristine&&this.$setDirty(),this.$$parseAndValidate()};this.$$parseAndValidate=function(){var c=p.$$lastCommittedViewValue;if(w=y(c)?t:!0)for(var d=0;d<p.$parsers.length;d++)if(c=p.$parsers[d](c),y(c)){w=!1;break}X(p.$modelValue)&&isNaN(p.$modelValue)&&(p.$modelValue=s(a));var e=p.$modelValue,
f=p.$options&&p.$options.allowInvalid;p.$$rawModelValue=c;f&&(p.$modelValue=c,p.$modelValue!==e&&p.$$writeModelToScope());p.$$runValidators(c,p.$$lastCommittedViewValue,function(a){f||(p.$modelValue=a?c:t,p.$modelValue!==e&&p.$$writeModelToScope())})};this.$$writeModelToScope=function(){B(a,p.$modelValue);m(p.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}})};this.$setViewValue=function(a,c){p.$viewValue=a;p.$options&&!p.$options.updateOnDefault||p.$$debounceViewValueCommit(c)};this.$$debounceViewValueCommit=
function(c){var d=0,e=p.$options;e&&x(e.debounce)&&(e=e.debounce,X(e)?d=e:X(e[c])?d=e[c]:X(e["default"])&&(d=e["default"]));h.cancel(K);d?K=h(function(){p.$commitViewValue()},d):l.$$phase?p.$commitViewValue():a.$apply(function(){p.$commitViewValue()})};a.$watch(function(){var c=s(a);if(c!==p.$modelValue&&(p.$modelValue===p.$modelValue||c===c)){p.$modelValue=p.$$rawModelValue=c;w=t;for(var d=p.$formatters,e=d.length,f=c;e--;)f=d[e](f);p.$viewValue!==f&&(p.$viewValue=p.$$lastCommittedViewValue=f,p.$render(),
p.$$runValidators(c,f,v))}return c})}],Ke=["$rootScope",function(a){return{restrict:"A",require:["ngModel","^?form","^?ngModelOptions"],controller:xg,priority:1,compile:function(c){c.addClass(Xa).addClass("ng-untouched").addClass(lb);return{pre:function(a,c,f,g){var h=g[0],l=g[1]||Ib;h.$$setOptions(g[2]&&g[2].$options);l.$addControl(h);f.$observe("name",function(a){h.$name!==a&&l.$$renameControl(h,a)});a.$on("$destroy",function(){l.$removeControl(h)})},post:function(c,e,f,g){var h=g[0];if(h.$options&&
h.$options.updateOn)e.on(h.$options.updateOn,function(a){h.$$debounceViewValueCommit(a&&a.type)});e.on("blur",function(e){h.$touched||(a.$$phase?c.$evalAsync(h.$setTouched):c.$apply(h.$setTouched))})}}}}}],yg=/(\s+|^)default(\s+|$)/,Oe=function(){return{restrict:"A",controller:["$scope","$attrs",function(a,c){var d=this;this.$options=fa(a.$eval(c.ngModelOptions));this.$options.updateOn!==t?(this.$options.updateOnDefault=!1,this.$options.updateOn=T(this.$options.updateOn.replace(yg,function(){d.$options.updateOnDefault=
!0;return" "}))):this.$options.updateOnDefault=!0}]}},Ae=Ma({terminal:!0,priority:1E3}),zg=L("ngOptions"),Ag=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,Ie=["$compile","$parse",function(a,c){function d(a,d,e){function f(a,c,d,e,g){this.selectValue=a;this.viewValue=c;this.label=d;this.group=e;this.disabled=g}
function n(a){var c;if(!s&&Da(a))c=a;else{c=[];for(var d in a)a.hasOwnProperty(d)&&"$"!==d.charAt(0)&&c.push(d)}return c}var m=a.match(Ag);if(!m)throw zg("iexp",a,ua(d));var r=m[5]||m[7],s=m[6];a=/ as /.test(m[0])&&m[1];var t=m[9];d=c(m[2]?m[1]:r);var v=a&&c(a)||d,w=t&&c(t),p=t?function(a,c){return w(e,c)}:function(a){return Ga(a)},A=function(a,c){return p(a,C(a,c))},x=c(m[2]||m[1]),z=c(m[3]||""),y=c(m[4]||""),J=c(m[8]),F={},C=s?function(a,c){F[s]=c;F[r]=a;return F}:function(a){F[r]=a;return F};return{trackBy:t,
getTrackByValue:A,getWatchables:c(J,function(a){var c=[];a=a||[];for(var d=n(a),f=d.length,g=0;g<f;g++){var h=a===d?g:d[g],k=C(a[h],h),h=p(a[h],k);c.push(h);if(m[2]||m[1])h=x(e,k),c.push(h);m[4]&&(k=y(e,k),c.push(k))}return c}),getOptions:function(){for(var a=[],c={},d=J(e)||[],g=n(d),h=g.length,m=0;m<h;m++){var q=d===g?m:g[m],r=C(d[q],q),s=v(e,r),q=p(s,r),u=x(e,r),w=z(e,r),r=y(e,r),s=new f(q,s,u,w,r);a.push(s);c[q]=s}return{items:a,selectValueMap:c,getOptionFromViewValue:function(a){return c[A(a)]},
getViewValueFromOption:function(a){return t?aa.copy(a.viewValue):a.viewValue}}}}}var e=W.createElement("option"),f=W.createElement("optgroup");return{restrict:"A",terminal:!0,require:["select","?ngModel"],link:function(c,h,l,k){function n(a,c){a.element=c;c.disabled=a.disabled;a.value!==c.value&&(c.value=a.selectValue);a.label!==c.label&&(c.label=a.label,c.textContent=a.label)}function q(a,c,d,e){c&&M(c.nodeName)===d?d=c:(d=e.cloneNode(!1),c?a.insertBefore(d,c):a.appendChild(d));return d}function r(a){for(var c;a;)c=
a.nextSibling,Wb(a),a=c}function s(a){var c=p&&p[0],d=J&&J[0];if(c||d)for(;a&&(a===c||a===d);)a=a.nextSibling;return a}function t(){var a=F&&w.readValue();F=D.getOptions();var c={},d=h[0].firstChild;N&&h.prepend(p);d=s(d);F.items.forEach(function(a){var g,k;a.group?(g=c[a.group],g||(g=q(h[0],d,"optgroup",f),d=g.nextSibling,g.label=a.group,g=c[a.group]={groupElement:g,currentOptionElement:g.firstChild}),k=q(g.groupElement,g.currentOptionElement,"option",e),n(a,k),g.currentOptionElement=k.nextSibling):
(k=q(h[0],d,"option",e),n(a,k),d=k.nextSibling)});Object.keys(c).forEach(function(a){r(c[a].currentOptionElement)});r(d);v.$render();if(!v.$isEmpty(a)){var g=w.readValue();(D.trackBy?ka(a,g):a===g)||(v.$setViewValue(g),v.$render())}}var v=k[1];if(v){var w=k[0];k=l.multiple;for(var p,x=0,y=h.children(),C=y.length;x<C;x++)if(""===y[x].value){p=y.eq(x);break}var N=!!p,J=z(e.cloneNode(!1));J.val("?");var F,D=d(l.ngOptions,h,c);k?(v.$isEmpty=function(a){return!a||0===a.length},w.writeValue=function(a){F.items.forEach(function(a){a.element.selected=
!1});a&&a.forEach(function(a){(a=F.getOptionFromViewValue(a))&&!a.disabled&&(a.element.selected=!0)})},w.readValue=function(){var a=h.val()||[],c=[];m(a,function(a){(a=F.selectValueMap[a])&&!a.disabled&&c.push(F.getViewValueFromOption(a))});return c},D.trackBy&&c.$watchCollection(function(){if(G(v.$viewValue))return v.$viewValue.map(function(a){return D.getTrackByValue(a)})},function(){v.$render()})):(w.writeValue=function(a){var c=F.getOptionFromViewValue(a);c&&!c.disabled?h[0].value!==c.selectValue&&
(J.remove(),N||p.remove(),h[0].value=c.selectValue,c.element.selected=!0,c.element.setAttribute("selected","selected")):null===a||N?(J.remove(),N||h.prepend(p),h.val(""),p.prop("selected",!0),p.attr("selected",!0)):(N||p.remove(),h.prepend(J),h.val("?"),J.prop("selected",!0),J.attr("selected",!0))},w.readValue=function(){var a=F.selectValueMap[h.val()];return a&&!a.disabled?(N||p.remove(),J.remove(),F.getViewValueFromOption(a)):null},D.trackBy&&c.$watch(function(){return D.getTrackByValue(v.$viewValue)},
function(){v.$render()}));N?(p.remove(),a(p)(c),p.removeClass("ng-scope")):p=z(e.cloneNode(!1));t();c.$watchCollection(D.getWatchables,t)}}}}],Be=["$locale","$interpolate","$log",function(a,c,d){var e=/{}/g,f=/^when(Minus)?(.+)$/;return{link:function(g,h,l){function k(a){h.text(a||"")}var n=l.count,q=l.$attr.when&&h.attr(l.$attr.when),r=l.offset||0,s=g.$eval(q)||{},t={},x=c.startSymbol(),w=c.endSymbol(),p=x+n+"-"+r+w,A=aa.noop,z;m(l,function(a,c){var d=f.exec(c);d&&(d=(d[1]?"-":"")+M(d[2]),s[d]=h.attr(l.$attr[c]))});
m(s,function(a,d){t[d]=c(a.replace(e,p))});g.$watch(n,function(c){var e=parseFloat(c),f=isNaN(e);f||e in s||(e=a.pluralCat(e-r));e===z||f&&X(z)&&isNaN(z)||(A(),f=t[e],y(f)?(null!=c&&d.debug("ngPluralize: no rule defined for '"+e+"' in "+q),A=v,k()):A=g.$watch(f,k),z=e)})}}}],Ce=["$parse","$animate",function(a,c){var d=L("ngRepeat"),e=function(a,c,d,e,k,n,m){a[d]=e;k&&(a[k]=n);a.$index=c;a.$first=0===c;a.$last=c===m-1;a.$middle=!(a.$first||a.$last);a.$odd=!(a.$even=0===(c&1))};return{restrict:"A",
multiElement:!0,transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,compile:function(f,g){var h=g.ngRepeat,l=W.createComment(" end ngRepeat: "+h+" "),k=h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);if(!k)throw d("iexp",h);var n=k[1],q=k[2],r=k[3],s=k[4],k=n.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);if(!k)throw d("iidexp",n);var v=k[3]||k[1],x=k[2];if(r&&(!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(r)||/^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(r)))throw d("badident",
r);var w,p,A,y,C={$id:Ga};s?w=a(s):(A=function(a,c){return Ga(c)},y=function(a){return a});return function(a,f,g,k,n){w&&(p=function(c,d,e){x&&(C[x]=c);C[v]=d;C.$index=e;return w(a,C)});var s=ga();a.$watchCollection(q,function(g){var k,q,u=f[0],w,C=ga(),D,F,I,G,L,H,M;r&&(a[r]=g);if(Da(g))L=g,q=p||A;else for(M in q=p||y,L=[],g)g.hasOwnProperty(M)&&"$"!==M.charAt(0)&&L.push(M);D=L.length;M=Array(D);for(k=0;k<D;k++)if(F=g===L?k:L[k],I=g[F],G=q(F,I,k),s[G])H=s[G],delete s[G],C[G]=H,M[k]=H;else{if(C[G])throw m(M,
function(a){a&&a.scope&&(s[a.id]=a)}),d("dupes",h,G,I);M[k]={id:G,scope:t,clone:t};C[G]=!0}for(w in s){H=s[w];G=qb(H.clone);c.leave(G);if(G[0].parentNode)for(k=0,q=G.length;k<q;k++)G[k].$$NG_REMOVED=!0;H.scope.$destroy()}for(k=0;k<D;k++)if(F=g===L?k:L[k],I=g[F],H=M[k],H.scope){w=u;do w=w.nextSibling;while(w&&w.$$NG_REMOVED);H.clone[0]!=w&&c.move(qb(H.clone),null,z(u));u=H.clone[H.clone.length-1];e(H.scope,k,v,I,x,F,D)}else n(function(a,d){H.scope=d;var f=l.cloneNode(!1);a[a.length++]=f;c.enter(a,
null,z(u));u=f;H.clone=a;C[H.id]=H;e(H.scope,k,v,I,x,F,D)});s=C})}}}}],De=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngShow,function(c){a[c?"removeClass":"addClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],we=["$animate",function(a){return{restrict:"A",multiElement:!0,link:function(c,d,e){c.$watch(e.ngHide,function(c){a[c?"addClass":"removeClass"](d,"ng-hide",{tempClasses:"ng-hide-animate"})})}}}],Ee=Ma(function(a,c,d){a.$watch(d.ngStyle,
function(a,d){d&&a!==d&&m(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Fe=["$animate",function(a){return{require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g=[],h=[],l=[],k=[],n=function(a,c){return function(){a.splice(c,1)}};c.$watch(e.ngSwitch||e.on,function(c){var d,e;d=0;for(e=l.length;d<e;++d)a.cancel(l[d]);d=l.length=0;for(e=k.length;d<e;++d){var s=qb(h[d].clone);k[d].$destroy();(l[d]=a.leave(s)).then(n(l,d))}h.length=0;k.length=0;(g=f.cases["!"+
c]||f.cases["?"])&&m(g,function(c){c.transclude(function(d,e){k.push(e);var f=c.element;d[d.length++]=W.createComment(" end ngSwitchWhen: ");h.push({clone:d});a.enter(d,f.parent(),f)})})})}}}],Ge=Ma({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),He=Ma({transclude:"element",priority:1200,require:"^ngSwitch",multiElement:!0,link:function(a,
c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Je=Ma({restrict:"EAC",link:function(a,c,d,e,f){if(!f)throw L("ngTransclude")("orphan",ua(c));f(function(a){c.empty();c.append(a)})}}),je=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Bg={$setViewValue:v,$render:v},Cg=["$element","$scope","$attrs",function(a,c,d){var e=this,f=new Ua;e.ngModelCtrl=Bg;e.unknownOption=z(W.createElement("option"));
e.renderUnknownOption=function(c){c="? "+Ga(c)+" ?";e.unknownOption.val(c);a.prepend(e.unknownOption);a.val(c)};c.$on("$destroy",function(){e.renderUnknownOption=v});e.removeUnknownOption=function(){e.unknownOption.parent()&&e.unknownOption.remove()};e.readValue=function(){e.removeUnknownOption();return a.val()};e.writeValue=function(c){e.hasOption(c)?(e.removeUnknownOption(),a.val(c),""===c&&e.emptyOption.prop("selected",!0)):null==c&&e.emptyOption?(e.removeUnknownOption(),a.val("")):e.renderUnknownOption(c)};
e.addOption=function(a,c){Ta(a,'"option value"');""===a&&(e.emptyOption=c);var d=f.get(a)||0;f.put(a,d+1)};e.removeOption=function(a){var c=f.get(a);c&&(1===c?(f.remove(a),""===a&&(e.emptyOption=t)):f.put(a,c-1))};e.hasOption=function(a){return!!f.get(a)}}],ke=function(){return{restrict:"E",require:["select","?ngModel"],controller:Cg,link:function(a,c,d,e){var f=e[1];if(f){var g=e[0];g.ngModelCtrl=f;f.$render=function(){g.writeValue(f.$viewValue)};c.on("change",function(){a.$apply(function(){f.$setViewValue(g.readValue())})});
if(d.multiple){g.readValue=function(){var a=[];m(c.find("option"),function(c){c.selected&&a.push(c.value)});return a};g.writeValue=function(a){var d=new Ua(a);m(c.find("option"),function(a){a.selected=x(d.get(a.value))})};var h,l=NaN;a.$watch(function(){l!==f.$viewValue||ka(h,f.$viewValue)||(h=ia(f.$viewValue),f.$render());l=f.$viewValue});f.$isEmpty=function(a){return!a||0===a.length}}}}}},me=["$interpolate",function(a){function c(a){a[0].hasAttribute("selected")&&(a[0].selected=!0)}return{restrict:"E",
priority:100,compile:function(d,e){if(y(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),m=k.data("$selectController")||k.parent().data("$selectController");m&&m.ngModelCtrl&&(f?a.$watch(f,function(a,f){e.$set("value",a);f!==a&&m.removeOption(f);m.addOption(a,d);m.ngModelCtrl.$render();c(d)}):(m.addOption(e.value,d),m.ngModelCtrl.$render(),c(d)),d.on("$destroy",function(){m.removeOption(e.value);m.ngModelCtrl.$render()}))}}}}],le=qa({restrict:"E",
terminal:!1}),Fc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){e&&(d.required=!0,e.$validators.required=function(a,c){return!d.required||!e.$isEmpty(c)},d.$observe("required",function(){e.$validate()}))}}},Ec=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f,g=d.ngPattern||d.pattern;d.$observe("pattern",function(a){I(a)&&0<a.length&&(a=new RegExp("^"+a+"$"));if(a&&!a.test)throw L("ngPattern")("noregexp",g,a,ua(c));f=a||t;e.$validate()});
e.$validators.pattern=function(a){return e.$isEmpty(a)||y(f)||f.test(a)}}}}},Hc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=-1;d.$observe("maxlength",function(a){a=Y(a);f=isNaN(a)?-1:a;e.$validate()});e.$validators.maxlength=function(a,c){return 0>f||e.$isEmpty(c)||c.length<=f}}}}},Gc=function(){return{restrict:"A",require:"?ngModel",link:function(a,c,d,e){if(e){var f=0;d.$observe("minlength",function(a){f=Y(a)||0;e.$validate()});e.$validators.minlength=function(a,
c){return e.$isEmpty(c)||c.length>=f}}}}};O.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):(ce(),ee(aa),aa.module("ngLocale",[],["$provide",function(a){function c(a){a+="";var c=a.indexOf(".");return-1==c?0:a.length-c-1}a.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),ERANAMES:["Before Christ","Anno Domini"],ERAS:["BC","AD"],FIRSTDAYOFWEEK:6,MONTH:"January February March April May June July August September October November December".split(" "),
SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),WEEKENDRANGE:[5,6],fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",medium:"MMM d, y h:mm:ss a",mediumDate:"MMM d, y",mediumTime:"h:mm:ss a","short":"M/d/yy h:mm a",shortDate:"M/d/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"$",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,
maxFrac:2,minFrac:2,minInt:1,negPre:"-\u00a4",negSuf:"",posPre:"\u00a4",posSuf:""}]},id:"en-us",pluralCat:function(a,e){var f=a|0,g=e;t===g&&(g=Math.min(c(a),3));Math.pow(10,g);return 1==f&&0==g?"one":"other"}})}]),z(W).ready(function(){Zd(W,yc)}))})(window,document);!window.angular.$$csp().noInlineStyle&&window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');
//# sourceMappingURL=angular.min.js.map

!function(Z,da,k){!function(b){function c(d){if(a[d])return a[d].exports;var e=a[d]={exports:{},id:d,loaded:!1};return b[d].call(e.exports,e,e.exports,c),e.loaded=!0,e.exports}var a={};return c.m=b,c.c=a,c.p='',c(0)}([function(b,c,a){a(1);a(50);a(51);a(52);a(54);a(55);a(58);a(59);a(60);a(61);a(62);a(63);a(64);a(65);a(66);a(68);a(70);a(72);a(74);a(77);a(78);a(79);a(83);a(86);a(87);a(88);a(89);a(91);a(92);a(93);a(94);a(95);a(97);a(99);a(100);a(101);a(103);a(104);a(105);a(107);a(108);a(109);a(111);a(112);
    a(113);a(114);a(115);a(116);a(117);a(118);a(119);a(120);a(121);a(122);a(123);a(124);a(126);a(130);a(131);a(132);a(133);a(137);a(139);a(140);a(141);a(142);a(143);a(144);a(145);a(146);a(147);a(148);a(149);a(150);a(151);a(152);a(158);a(159);a(161);a(162);a(163);a(167);a(168);a(169);a(170);a(171);a(173);a(174);a(175);a(176);a(179);a(181);a(182);a(183);a(185);a(187);a(189);a(190);a(191);a(193);a(194);a(195);a(196);a(203);a(206);a(207);a(209);a(210);a(211);a(212);a(213);a(214);a(215);a(216);a(217);a(218);
    a(219);a(220);a(222);a(223);a(224);a(225);a(226);a(227);a(228);a(229);a(231);a(234);a(235);a(237);a(238);a(239);a(240);a(241);a(242);a(243);a(244);a(245);a(246);a(247);a(249);a(250);a(251);a(252);a(253);a(254);a(255);a(256);a(258);a(259);a(261);a(262);a(263);a(264);a(267);a(268);a(269);a(270);a(271);a(272);a(273);a(274);a(276);a(277);a(278);a(279);a(280);a(281);a(282);a(283);a(284);a(285);a(286);a(287);b.exports=a(288)},function(b,c,a){b=a(2);var d=a(3),e=a(4);c=a(6);var f=a(16),g=a(20).KEY,l=a(5),
    h=a(21),m=a(22),n=a(17),p=a(23),q=a(24),x=a(25),w=a(27),r=a(40),t=a(43),u=a(10),v=a(30),A=a(14),B=a(15),I=a(44),y=a(47),V=a(49),J=a(9),L=a(28),K=V.f,C=J.f,E=y.f,z=b.Symbol,G=b.JSON,Q=G&&G.stringify,D=p('_hidden'),X=p('toPrimitive'),Y={}.propertyIsEnumerable,T=h('symbol-registry'),R=h('symbols'),M=h('op-symbols'),H=Object.prototype,h='function'===typeof z,N=b.QObject,P=!N||!N.prototype||!N.prototype.findChild,S=e&&l(function(){return 7!=I(C({},'a',{get:function(){return C(this,'a',{value:7}).a}})).a})?
        function(a,b,d){var e=K(H,b);e&&delete H[b];C(a,b,d);e&&a!==H&&C(H,b,e)}:C,aa=function(a){var b=R[a]=I(z.prototype);return b._k=a,b},U=h&&'symbol'===typeof z.iterator?function(a){return'symbol'===typeof a}:function(a){return a instanceof z},O=function(a,b,e){return a===H&&O(M,b,e),u(a),b=A(b,!0),u(e),d(R,b)?(e.enumerable?(d(a,D)&&a[D][b]&&(a[D][b]=!1),e=I(e,{enumerable:B(0,!1)})):(d(a,D)||C(a,D,B(1,{})),a[D][b]=!0),S(a,b,e)):C(a,b,e)},ba=function(a,b){u(a);for(var d,e=r(b=v(b)),f=0,g=e.length;g>f;)O(a,
        d=e[f++],b[d]);return a},qa=function(a){var b=Y.call(this,a=A(a,!0));return!(this===H&&d(R,a)&&!d(M,a))&&(!(b||!d(this,a)||!d(R,a)||d(this,D)&&this[D][a])||b)},N=function(a,b){if(a=v(a),b=A(b,!0),a!==H||!d(R,b)||d(M,b)){var e=K(a,b);return!e||!d(R,b)||d(a,D)&&a[D][b]||(e.enumerable=!0),e}},ea=function(a){var b;a=E(v(a));for(var e=[],f=0;a.length>f;)d(R,b=a[f++])||b==D||b==g||e.push(b);return e},ga=function(a){var b,e=a===H;a=E(e?M:v(a));for(var f=[],g=0;a.length>g;)!d(R,b=a[g++])||e&&!d(H,b)||f.push(R[b]);
        return f};h||(z=function(){if(this instanceof z)throw TypeError('Symbol is not a constructor!');var a=n(0<arguments.length?arguments[0]:k),b=function(e){this===H&&b.call(M,e);d(this,D)&&d(this[D],a)&&(this[D][a]=!1);S(this,a,B(1,e))};return e&&P&&S(H,a,{configurable:!0,set:b}),aa(a)},f(z.prototype,'toString',function(){return this._k}),V.f=N,J.f=O,a(48).f=y.f=ea,a(42).f=qa,a(41).f=ga,e&&!a(26)&&f(H,'propertyIsEnumerable',qa,!0),q.f=function(a){return aa(p(a))});c(c.G+c.W+c.F*!h,{Symbol:z});f='hasInstance isConcatSpreadable iterator match replace search species split toPrimitive toStringTag unscopables'.split(' ');
    for(q=0;f.length>q;)p(f[q++]);f=L(p.store);for(q=0;f.length>q;)x(f[q++]);c(c.S+c.F*!h,'Symbol',{'for':function(a){return d(T,a+='')?T[a]:T[a]=z(a)},keyFor:function(a){if(U(a))return w(T,a);throw TypeError(a+' is not a symbol!');},useSetter:function(){P=!0},useSimple:function(){P=!1}});c(c.S+c.F*!h,'Object',{create:function(a,b){return b===k?I(a):ba(I(a),b)},defineProperty:O,defineProperties:ba,getOwnPropertyDescriptor:N,getOwnPropertyNames:ea,getOwnPropertySymbols:ga});G&&c(c.S+c.F*(!h||l(function(){var a=
            z();return'[null]'!=Q([a])||'{}'!=Q({a:a})||'{}'!=Q(Object(a))})),'JSON',{stringify:function(a){if(a!==k&&!U(a)){for(var b,d,e=[a],f=1;arguments.length>f;)e.push(arguments[f++]);return b=e[1],'function'===typeof b&&(d=b),!d&&t(b)||(b=function(a,b){if(d&&(b=d.call(this,a,b)),!U(b))return b}),e[1]=b,Q.apply(G,e)}}});z.prototype[X]||a(8)(z.prototype,X,z.prototype.valueOf);m(z,'Symbol');m(Math,'Math',!0);m(b.JSON,'JSON',!0)},function(b,c){var a=b.exports='undefined'!==typeof window&&Math==Math?window:
    'undefined'!==typeof self&&self.Math==Math?self:Function('return this')();'number'===typeof da&&(da=a)},function(b,c){var a={}.hasOwnProperty;b.exports=function(b,e){return a.call(b,e)}},function(b,c,a){b.exports=!a(5)(function(){return 7!=Object.defineProperty({},'a',{get:function(){return 7}}).a})},function(b,c){b.exports=function(a){try{return!!a()}catch(d){return!0}}},function(b,c,a){var d=a(2),e=a(7),f=a(8),g=a(16),l=a(18),h=function(a,b,c){var m,n,p=a&h.F;n=a&h.G;var r=a&h.S,t=a&h.P,u=a&h.B,
    r=n?d:r?d[b]||(d[b]={}):(d[b]||{}).prototype,v=n?e:e[b]||(e[b]={}),A=v.prototype||(v.prototype={});n&&(c=b);for(m in c)n=!p&&r&&r[m]!==k,b=(n?r:c)[m],n=u&&n?l(b,d):t&&'function'===typeof b?l(Function.call,b):b,r&&g(r,m,b,a&h.U),v[m]!=b&&f(v,m,n),t&&A[m]!=b&&(A[m]=b)};d.core=e;h.F=1;h.G=2;h.S=4;h.P=8;h.B=16;h.W=32;h.U=64;h.R=128;b.exports=h},function(b,c){var a=b.exports={version:'2.4.0'};'number'===typeof Z&&(Z=a)},function(b,c,a){var d=a(9),e=a(15);b.exports=a(4)?function(a,b,c){return d.f(a,b,e(1,
    c))}:function(a,b,d){return a[b]=d,a}},function(b,c,a){var d=a(10),e=a(12),f=a(14),g=Object.defineProperty;c.f=a(4)?Object.defineProperty:function(a,b,c){if(d(a),b=f(b,!0),d(c),e)try{return g(a,b,c)}catch(n){}if('get'in c||'set'in c)throw TypeError('Accessors not supported!');return'value'in c&&(a[b]=c.value),a}},function(b,c,a){var d=a(11);b.exports=function(a){if(!d(a))throw TypeError(a+' is not an object!');return a}},function(b,c){b.exports=function(a){return'object'===typeof a?null!==a:'function'===
    typeof a}},function(b,c,a){b.exports=!a(4)&&!a(5)(function(){return 7!=Object.defineProperty(a(13)('div'),'a',{get:function(){return 7}}).a})},function(b,c,a){c=a(11);var d=a(2).document,e=c(d)&&c(d.createElement);b.exports=function(a){return e?d.createElement(a):{}}},function(b,c,a){var d=a(11);b.exports=function(a,b){if(!d(a))return a;var e,f;if(b&&'function'===typeof(e=a.toString)&&!d(f=e.call(a))||'function'===typeof(e=a.valueOf)&&!d(f=e.call(a))||!b&&'function'===typeof(e=a.toString)&&!d(f=e.call(a)))return f;
    throw TypeError("Can't convert object to primitive value");}},function(b,c){b.exports=function(a,b){return{enumerable:!(1&a),configurable:!(2&a),writable:!(4&a),value:b}}},function(b,c,a){var d=a(2),e=a(8),f=a(3),g=a(17)('src'),l=Function.toString,h=(''+l).split('toString');a(7).inspectSource=function(a){return l.call(a)};(b.exports=function(a,b,c,l){var m='function'===typeof c;m&&(f(c,'name')||e(c,'name',b));a[b]!==c&&(m&&(f(c,g)||e(c,g,a[b]?''+a[b]:h.join(String(b)))),a===d?a[b]=c:l?a[b]?a[b]=c:
    e(a,b,c):(delete a[b],e(a,b,c)))})(Function.prototype,'toString',function(){return'function'===typeof this&&this[g]||l.call(this)})},function(b,c){var a=0,d=Math.random();b.exports=function(b){return'Symbol('.concat(b===k?'':b,')_',(++a+d).toString(36))}},function(b,c,a){var d=a(19);b.exports=function(a,b,g){if(d(a),b===k)return a;switch(g){case 1:return function(d){return a.call(b,d)};case 2:return function(d,e){return a.call(b,d,e)};case 3:return function(d,e,f){return a.call(b,d,e,f)}}return function(){return a.apply(b,
    arguments)}}},function(b,c){b.exports=function(a){if('function'!==typeof a)throw TypeError(a+' is not a function!');return a}},function(b,c,a){var d=a(17)('meta'),e=a(11),f=a(3),g=a(9).f,l=0,h=Object.isExtensible||function(){return!0},m=!a(5)(function(){return h(Object.preventExtensions({}))}),n=function(a){g(a,d,{value:{i:'O'+ ++l,w:{}}})},p=b.exports={KEY:d,NEED:!1,fastKey:function(a,b){if(!e(a))return'symbol'===typeof a?a:('string'===typeof a?'S':'P')+a;if(!f(a,d)){if(!h(a))return'F';if(!b)return'E';
    n(a)}return a[d].i},getWeak:function(a,b){if(!f(a,d)){if(!h(a))return!0;if(!b)return!1;n(a)}return a[d].w},onFreeze:function(a){return m&&p.NEED&&h(a)&&!f(a,d)&&n(a),a}}},function(b,c,a){c=a(2);var d=c['__core-js_shared__']||(c['__core-js_shared__']={});b.exports=function(a){return d[a]||(d[a]={})}},function(b,c,a){var d=a(9).f,e=a(3),f=a(23)('toStringTag');b.exports=function(a,b,c){a&&!e(a=c?a:a.prototype,f)&&d(a,f,{configurable:!0,value:b})}},function(b,c,a){var d=a(21)('wks'),e=a(17),f=a(2).Symbol,
    g='function'===typeof f;(b.exports=function(a){return d[a]||(d[a]=g&&f[a]||(g?f:e)('Symbol.'+a))}).store=d},function(b,c,a){c.f=a(23)},function(b,c,a){var d=a(2),e=a(7),f=a(26),g=a(24),l=a(9).f;b.exports=function(a){var b=e.Symbol||(e.Symbol=f?{}:d.Symbol||{});'_'==a.charAt(0)||a in b||l(b,a,{value:g.f(a)})}},function(b,c){b.exports=!1},function(b,c,a){var d=a(28),e=a(30);b.exports=function(a,b){for(var f,g=e(a),c=d(g),n=c.length,p=0;n>p;)if(g[f=c[p++]]===b)return f}},function(b,c,a){var d=a(29),
    e=a(39);b.exports=Object.keys||function(a){return d(a,e)}},function(b,c,a){var d=a(3),e=a(30),f=a(34)(!1),g=a(38)('IE_PROTO');b.exports=function(a,b){var c,l=e(a),h=0,q=[];for(c in l)c!=g&&d(l,c)&&q.push(c);for(;b.length>h;)d(l,c=b[h++])&&(~f(q,c)||q.push(c));return q}},function(b,c,a){var d=a(31),e=a(33);b.exports=function(a){return d(e(a))}},function(b,c,a){var d=a(32);b.exports=Object('z').propertyIsEnumerable(0)?Object:function(a){return'String'==d(a)?a.split(''):Object(a)}},function(b,c){var a=
    {}.toString;b.exports=function(b){return a.call(b).slice(8,-1)}},function(b,c){b.exports=function(a){if(a==k)throw TypeError("Can't call method on  "+a);return a}},function(b,c,a){var d=a(30),e=a(35),f=a(37);b.exports=function(a){return function(b,g,c){var l;b=d(b);var h=e(b.length);c=f(c,h);if(a&&g!=g)for(;h>c;){if(l=b[c++],l!=l)return!0}else for(;h>c;c++)if((a||c in b)&&b[c]===g)return a||c||0;return!a&&-1}}},function(b,c,a){var d=a(36),e=Math.min;b.exports=function(a){return 0<a?e(d(a),9007199254740991):
    0}},function(b,c){var a=Math.ceil,d=Math.floor;b.exports=function(b){return isNaN(b=+b)?0:(0<b?d:a)(b)}},function(b,c,a){var d=a(36),e=Math.max,f=Math.min;b.exports=function(a,b){return a=d(a),0>a?e(a+b,0):f(a,b)}},function(b,c,a){var d=a(21)('keys'),e=a(17);b.exports=function(a){return d[a]||(d[a]=e(a))}},function(b,c){b.exports='constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(' ')},function(b,c,a){var d=a(28),e=a(41),f=a(42);b.exports=function(a){var b=
    d(a),c=e.f;if(c)for(var g,c=c(a),n=f.f,p=0;c.length>p;)n.call(a,g=c[p++])&&b.push(g);return b}},function(b,c){c.f=Object.getOwnPropertySymbols},function(b,c){c.f={}.propertyIsEnumerable},function(b,c,a){var d=a(32);b.exports=Array.isArray||function(a){return'Array'==d(a)}},function(b,c,a){var d=a(10),e=a(45),f=a(39),g=a(38)('IE_PROTO'),l=function(){},h=function(){var b;b=a(13)('iframe');var d=f.length;b.style.display='none';a(46).appendChild(b);b.src='javascript:';b=b.contentWindow.document;b.open();
    b.write('<script>document.F=Object\x3c/script>');b.close();for(h=b.F;d--;)delete h.prototype[f[d]];return h()};b.exports=Object.create||function(a,b){var f;return null!==a?(l.prototype=d(a),f=new l,l.prototype=null,f[g]=a):f=h(),b===k?f:e(f,b)}},function(b,c,a){var d=a(9),e=a(10),f=a(28);b.exports=a(4)?Object.defineProperties:function(a,b){e(a);for(var c,g=f(b),l=g.length,p=0;l>p;)d.f(a,c=g[p++],b[c]);return a}},function(b,c,a){b.exports=a(2).document&&document.documentElement},function(b,c,a){var d=
    a(30),e=a(48).f,f={}.toString,g='object'===typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];b.exports.f=function(a){var b;if(g&&'[object Window]'==f.call(a))try{b=e(a)}catch(m){b=g.slice()}else b=e(d(a));return b}},function(b,c,a){var d=a(29),e=a(39).concat('length','prototype');c.f=Object.getOwnPropertyNames||function(a){return d(a,e)}},function(b,c,a){var d=a(42),e=a(15),f=a(30),g=a(14),l=a(3),h=a(12),m=Object.getOwnPropertyDescriptor;c.f=a(4)?m:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        b){if(a=f(a),b=g(b,!0),h)try{return m(a,b)}catch(q){}if(l(a,b))return e(!d.f.call(a,b),a[b])}},function(b,c,a){b=a(6);b(b.S+b.F*!a(4),'Object',{defineProperty:a(9).f})},function(b,c,a){b=a(6);b(b.S+b.F*!a(4),'Object',{defineProperties:a(45)})},function(b,c,a){var d=a(30),e=a(49).f;a(53)('getOwnPropertyDescriptor',function(){return function(a,b){return e(d(a),b)}})},function(b,c,a){var d=a(6),e=a(7),f=a(5);b.exports=function(a,b){var c=(e.Object||{})[a]||Object[a],g={};g[a]=b(c);d(d.S+d.F*f(function(){c(1)}),
    'Object',g)}},function(b,c,a){b=a(6);b(b.S,'Object',{create:a(44)})},function(b,c,a){var d=a(56),e=a(57);a(53)('getPrototypeOf',function(){return function(a){return e(d(a))}})},function(b,c,a){var d=a(33);b.exports=function(a){return Object(d(a))}},function(b,c,a){var d=a(3),e=a(56),f=a(38)('IE_PROTO'),g=Object.prototype;b.exports=Object.getPrototypeOf||function(a){return a=e(a),d(a,f)?a[f]:'function'===typeof a.constructor&&a instanceof a.constructor?a.constructor.prototype:a instanceof Object?g:
        null}},function(b,c,a){var d=a(56),e=a(28);a(53)('keys',function(){return function(a){return e(d(a))}})},function(b,c,a){a(53)('getOwnPropertyNames',function(){return a(47).f})},function(b,c,a){var d=a(11),e=a(20).onFreeze;a(53)('freeze',function(a){return function(b){return a&&d(b)?a(e(b)):b}})},function(b,c,a){var d=a(11),e=a(20).onFreeze;a(53)('seal',function(a){return function(b){return a&&d(b)?a(e(b)):b}})},function(b,c,a){var d=a(11),e=a(20).onFreeze;a(53)('preventExtensions',function(a){return function(b){return a&&
d(b)?a(e(b)):b}})},function(b,c,a){var d=a(11);a(53)('isFrozen',function(a){return function(b){return!d(b)||!!a&&a(b)}})},function(b,c,a){var d=a(11);a(53)('isSealed',function(a){return function(b){return!d(b)||!!a&&a(b)}})},function(b,c,a){var d=a(11);a(53)('isExtensible',function(a){return function(b){return!!d(b)&&(!a||a(b))}})},function(b,c,a){b=a(6);b(b.S+b.F,'Object',{assign:a(67)})},function(b,c,a){var d=a(28),e=a(41),f=a(42),g=a(56),l=a(31),h=Object.assign;b.exports=!h||a(5)(function(){var a=
    {},b={},d=Symbol();return a[d]=7,'abcdefghijklmnopqrst'.split('').forEach(function(a){b[a]=a}),7!=h({},a)[d]||'abcdefghijklmnopqrst'!=Object.keys(h({},b)).join('')})?function(a,b){for(var c=g(a),h=arguments.length,m=1,n=e.f,r=f.f;h>m;)for(var k,u=l(arguments[m++]),v=n?d(u).concat(n(u)):d(u),A=v.length,B=0;A>B;)r.call(u,k=v[B++])&&(c[k]=u[k]);return c}:h},function(b,c,a){b=a(6);b(b.S,'Object',{is:a(69)})},function(b,c){b.exports=Object.is||function(a,b){return a===b?0!==a||1/a===1/b:a!=a&&b!=b}},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 c,a){b=a(6);b(b.S,'Object',{setPrototypeOf:a(71).set})},function(b,c,a){var d=a(11),e=a(10),f=function(a,b){if(e(a),!d(b)&&null!==b)throw TypeError(b+": can't set as prototype!");};b.exports={set:Object.setPrototypeOf||('__proto__'in{}?function(b,d,e){try{e=a(18)(Function.call,a(49).f(Object.prototype,'__proto__').set,2),e(b,[]),d=!(b instanceof Array)}catch(m){d=!0}return function(a,b){return f(a,b),d?a.__proto__=b:e(a,b),a}}({},!1):k),check:f}},function(b,c,a){var d=a(73);b={};b[a(23)('toStringTag')]=
    'z';'[object z]'!=b+''&&a(16)(Object.prototype,'toString',function(){return'[object '+d(this)+']'},!0)},function(b,c,a){var d=a(32),e=a(23)('toStringTag'),f='Arguments'==d(function(){return arguments}());b.exports=function(a){var b,c;if(a===k)b='Undefined';else{var g;if(null===a)g='Null';else{a:{var n=a=Object(a);try{g=n[e];break a}catch(p){}g=void 0}g='string'===typeof(b=g)?b:f?d(a):'Object'==(c=d(a))&&'function'===typeof a.callee?'Arguments':c}b=g}return b}},function(b,c,a){b=a(6);b(b.P,'Function',
    {bind:a(75)})},function(b,c,a){var d=a(19),e=a(11),f=a(76),g=[].slice,l={};b.exports=Function.bind||function(a){var b=d(this),c=g.call(arguments,1),h=function(){var d=c.concat(g.call(arguments)),e;if(this instanceof h){e=b;var n=d.length;if(!(n in l)){for(var m=[],p=0;p<n;p++)m[p]='a['+p+']';l[n]=Function('F,a','return new F('+m.join(',')+')')}e=l[n](e,d)}else e=f(b,d,a);return e};return e(b.prototype)&&(h.prototype=b.prototype),h}},function(b,c){b.exports=function(a,b,e){var d=e===k;switch(b.length){case 0:return d?
    a():a.call(e);case 1:return d?a(b[0]):a.call(e,b[0]);case 2:return d?a(b[0],b[1]):a.call(e,b[0],b[1]);case 3:return d?a(b[0],b[1],b[2]):a.call(e,b[0],b[1],b[2]);case 4:return d?a(b[0],b[1],b[2],b[3]):a.call(e,b[0],b[1],b[2],b[3])}return a.apply(e,b)}},function(b,c,a){var d=a(9).f,e=a(15),f=a(3);b=Function.prototype;var g=/^\s*function ([^ (]*)/,l=Object.isExtensible||function(){return!0};'name'in b||a(4)&&d(b,'name',{configurable:!0,get:function(){try{var a=(''+this).match(g)[1];return f(this,'name')||
!l(this)||d(this,'name',e(5,a)),a}catch(m){return''}}})},function(b,c,a){var d=a(11),e=a(57);b=a(23)('hasInstance');c=Function.prototype;b in c||a(9).f(c,b,{value:function(a){if('function'!==typeof this||!d(a))return!1;if(!d(this.prototype))return a instanceof this;for(;a=e(a);)if(this.prototype===a)return!0;return!1}})},function(b,c,a){b=a(2);c=a(3);var d=a(32),e=a(80),f=a(14),g=a(5),l=a(48).f,h=a(49).f,m=a(9).f,n=a(81).trim,p=b.Number,q=p,k=p.prototype,w='Number'==d(a(44)(k)),r='trim'in String.prototype,
    t=function(a){var b=f(a,!1);if('string'===typeof b&&2<b.length){var b=r?b.trim():n(b,3),d;a=b.charCodeAt(0);if(43===a||45===a){if(d=b.charCodeAt(2),88===d||120===d)return NaN}else if(48===a){switch(b.charCodeAt(1)){case 66:case 98:d=2;a=49;break;case 79:case 111:d=8;a=55;break;default:return+b}for(var e,b=b.slice(2),c=0,g=b.length;c<g;c++)if(e=b.charCodeAt(c),48>e||e>a)return NaN;return parseInt(b,d)}}return+b};if(!p(' 0o1')||!p('0b1')||p('+0x1')){for(var p=function(a){var b=1>arguments.length?0:
    a,f=this;return f instanceof p&&(w?g(function(){k.valueOf.call(f)}):'Number'!=d(f))?e(new q(t(b)),f,p):t(b)},u,l=a(4)?l(q):'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY EPSILON isFinite isInteger isNaN isSafeInteger MAX_SAFE_INTEGER MIN_SAFE_INTEGER parseFloat parseInt isInteger'.split(' '),v=0;l.length>v;v++)c(q,u=l[v])&&!c(p,u)&&m(p,u,h(q,u));p.prototype=k;k.constructor=p;a(16)(b,'Number',p)}},function(b,c,a){var d=a(11),e=a(71).set;b.exports=function(a,b,c){var f;b=b.constructor;
    return b!==c&&'function'===typeof b&&(f=b.prototype)!==c.prototype&&d(f)&&e&&e(a,f),a}},function(b,c,a){var d=a(6),e=a(33),f=a(5),g=a(82);c='['+g+']';var l=RegExp('^'+c+c+'*'),h=RegExp(c+c+'*$');c=function(a,b,e){var c={},h=f(function(){return!!g[a]()||'​'!='​'[a]()});b=c[a]=h?b(m):g[a];e&&(c[e]=b);d(d.P+d.F*h,'String',c)};var m=c.trim=function(a,b){return a=String(e(a)),1&b&&(a=a.replace(l,'')),2&b&&(a=a.replace(h,'')),a};b.exports=c},function(b,c){b.exports='\t\n\x0B\f\r   ᠎             　\u2028\u2029﻿'},
    function(b,c,a){b=a(6);var d=a(36),e=a(84),f=a(85),g=(1).toFixed,l=Math.floor,h=[0,0,0,0,0,0],m=function(a,b){for(var d=-1,e=b;6>++d;)e+=a*h[d],h[d]=e%1E7,e=l(e/1E7)},n=function(a){for(var b=6,d=0;0<=--b;)d+=h[b],h[b]=l(d/a),d=d%a*1E7},p=function(){for(var a=6,b='';0<=--a;)if(''!==b||0===a||0!==h[a])var d=String(h[a]),b=''===b?d:b+f.call('0',7-d.length)+d;return b},q=function(a,b,d){return 0===b?d:1===b%2?q(a,b-1,d*a):q(a*a,b/2,d)};b(b.P+b.F*(!!g&&('0.000'!==(8E-5).toFixed(3)||'1'!==(.9).toFixed(0)||
        '1.25'!==(1.255).toFixed(2)||'1000000000000000128'!==(0xde0b6b3a7640080).toFixed(0))||!a(5)(function(){g.call({})})),'Number',{toFixed:function(a){var b,c,g,h=e(this,'Number.toFixed: incorrect invocation!');a=d(a);var l='',k='0';if(0>a||20<a)throw RangeError('Number.toFixed: incorrect invocation!');if(h!=h)return'NaN';if(-1E21>=h||1E21<=h)return String(h);if(0>h&&(l='-',h=-h),1E-21<h){for(var k=0,x=h*q(2,69,1);4096<=x;)k+=12,x/=4096;for(;2<=x;)k+=1,x/=2;if(b=k-69,c=0>b?h*q(2,-b,1):h/q(2,b,1),c*=4503599627370496,
            b=52-b,0<b){m(0,c);for(c=a;7<=c;)m(1E7,0),c-=7;m(q(10,c,1),0);for(c=b-1;23<=c;)n(8388608),c-=23;n(1<<c);m(1,1);n(2);k=p()}else m(0,c),m(1<<-b,0),k=p()+f.call('0',a)}return 0<a?(g=k.length,k=l+(g<=a?'0.'+f.call('0',a-g)+k:k.slice(0,g-a)+'.'+k.slice(g-a))):k=l+k,k}})},function(b,c,a){var d=a(32);b.exports=function(a,b){if('number'!==typeof a&&'Number'!=d(a))throw TypeError(b);return+a}},function(b,c,a){var d=a(36),e=a(33);b.exports=function(a){var b=String(e(this)),c='';a=d(a);if(0>a||a==1/0)throw RangeError("Count can't be negative");
        for(;0<a;(a>>>=1)&&(b+=b))1&a&&(c+=b);return c}},function(b,c,a){b=a(6);c=a(5);var d=a(84),e=(1).toPrecision;b(b.P+b.F*(c(function(){return'1'!==e.call(1,k)})||!c(function(){e.call({})})),'Number',{toPrecision:function(a){var b=d(this,'Number#toPrecision: incorrect invocation!');return a===k?e.call(b):e.call(b,a)}})},function(b,c,a){b=a(6);b(b.S,'Number',{EPSILON:Math.pow(2,-52)})},function(b,c,a){b=a(6);var d=a(2).isFinite;b(b.S,'Number',{isFinite:function(a){return'number'===typeof a&&d(a)}})},
    function(b,c,a){b=a(6);b(b.S,'Number',{isInteger:a(90)})},function(b,c,a){var d=a(11),e=Math.floor;b.exports=function(a){return!d(a)&&isFinite(a)&&e(a)===a}},function(b,c,a){b=a(6);b(b.S,'Number',{isNaN:function(a){return a!=a}})},function(b,c,a){b=a(6);var d=a(90),e=Math.abs;b(b.S,'Number',{isSafeInteger:function(a){return d(a)&&9007199254740991>=e(a)}})},function(b,c,a){b=a(6);b(b.S,'Number',{MAX_SAFE_INTEGER:9007199254740991})},function(b,c,a){b=a(6);b(b.S,'Number',{MIN_SAFE_INTEGER:-9007199254740991})},
    function(b,c,a){b=a(6);a=a(96);b(b.S+b.F*(Number.parseFloat!=a),'Number',{parseFloat:a})},function(b,c,a){var d=a(2).parseFloat,e=a(81).trim;b.exports=1/d(a(82)+'-0')!==-(1/0)?function(a){a=e(String(a),3);var b=d(a);return 0===b&&'-'==a.charAt(0)?-0:b}:d},function(b,c,a){b=a(6);a=a(98);b(b.S+b.F*(Number.parseInt!=a),'Number',{parseInt:a})},function(b,c,a){var d=a(2).parseInt,e=a(81).trim;c=a(82);var f=/^[\-+]?0[xX]/;b.exports=8!==d(c+'08')||22!==d(c+'0x16')?function(a,b){var c=e(String(a),3);return d(c,
        b>>>0||(f.test(c)?16:10))}:d},function(b,c,a){b=a(6);a=a(98);b(b.G+b.F*(parseInt!=a),{parseInt:a})},function(b,c,a){b=a(6);a=a(96);b(b.G+b.F*(parseFloat!=a),{parseFloat:a})},function(b,c,a){b=a(6);var d=a(102),e=Math.sqrt;a=Math.acosh;b(b.S+b.F*!(a&&710==Math.floor(a(Number.MAX_VALUE))&&a(1/0)==1/0),'Math',{acosh:function(a){return 1>(a=+a)?NaN:9.490626562425156E7<a?Math.log(a)+Math.LN2:d(a-1+e(a-1)*e(a+1))}})},function(b,c){b.exports=Math.log1p||function(a){return-1E-8<(a=+a)&&1E-8>a?a-a*a/2:Math.log(1+
            a)}},function(b,c,a){function d(a){return isFinite(a=+a)&&0!=a?0>a?-d(-a):Math.log(a+Math.sqrt(a*a+1)):a}b=a(6);c=Math.asinh;b(b.S+b.F*!(c&&0<1/c(0)),'Math',{asinh:d})},function(b,c,a){b=a(6);c=Math.atanh;b(b.S+b.F*!(c&&0>1/c(-0)),'Math',{atanh:function(a){return 0==(a=+a)?a:Math.log((1+a)/(1-a))/2}})},function(b,c,a){b=a(6);var d=a(106);b(b.S,'Math',{cbrt:function(a){return d(a=+a)*Math.pow(Math.abs(a),1/3)}})},function(b,c){b.exports=Math.sign||function(a){return 0==(a=+a)||a!=a?a:0>a?-1:1}},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        c,a){b=a(6);b(b.S,'Math',{clz32:function(a){return(a>>>=0)?31-Math.floor(Math.log(a+.5)*Math.LOG2E):32}})},function(b,c,a){b=a(6);var d=Math.exp;b(b.S,'Math',{cosh:function(a){return(d(a=+a)+d(-a))/2}})},function(b,c,a){b=a(6);a=a(110);b(b.S+b.F*(a!=Math.expm1),'Math',{expm1:a})},function(b,c){var a=Math.expm1;b.exports=!a||22025.465794806718<a(10)||22025.465794806718>a(10)||-2E-17!=a(-2E-17)?function(a){return 0==(a=+a)?a:-1E-6<a&&1E-6>a?a+a*a/2:Math.exp(a)-1}:a},function(b,c,a){b=a(6);var d=a(106);
        a=Math.pow;var e=a(2,-52),f=a(2,-23),g=a(2,127)*(2-f),l=a(2,-126);b(b.S,'Math',{fround:function(a){var b,c,h=Math.abs(a);a=d(a);return h<l?a*(h/l/f+1/e-1/e)*l*f:(b=(1+f/e)*h,c=b-(b-h),c>g||c!=c?1/0*a:a*c)}})},function(b,c,a){b=a(6);var d=Math.abs;b(b.S,'Math',{hypot:function(a,b){for(var e,c,f=0,m=0,n=arguments.length,p=0;m<n;)e=d(arguments[m++]),p<e?(c=p/e,f=f*c*c+1,p=e):0<e?(c=e/p,f+=c*c):f+=e;return p===1/0?1/0:p*Math.sqrt(f)}})},function(b,c,a){b=a(6);var d=Math.imul;b(b.S+b.F*a(5)(function(){return-5!=
            d(4294967295,5)||2!=d.length}),'Math',{imul:function(a,b){var d=+a,e=+b,c=65535&d,f=65535&e;return 0|c*f+((65535&d>>>16)*f+c*(65535&e>>>16)<<16>>>0)}})},function(b,c,a){b=a(6);b(b.S,'Math',{log10:function(a){return Math.log(a)/Math.LN10}})},function(b,c,a){b=a(6);b(b.S,'Math',{log1p:a(102)})},function(b,c,a){b=a(6);b(b.S,'Math',{log2:function(a){return Math.log(a)/Math.LN2}})},function(b,c,a){b=a(6);b(b.S,'Math',{sign:a(106)})},function(b,c,a){b=a(6);var d=a(110),e=Math.exp;b(b.S+b.F*a(5)(function(){return-2E-17!=
            !Math.sinh(-2E-17)}),'Math',{sinh:function(a){return 1>Math.abs(a=+a)?(d(a)-d(-a))/2:(e(a-1)-e(-a-1))*(Math.E/2)}})},function(b,c,a){b=a(6);var d=a(110),e=Math.exp;b(b.S,'Math',{tanh:function(a){var b=d(a=+a),c=d(-a);return b==1/0?1:c==1/0?-1:(b-c)/(e(a)+e(-a))}})},function(b,c,a){b=a(6);b(b.S,'Math',{trunc:function(a){return(0<a?Math.floor:Math.ceil)(a)}})},function(b,c,a){b=a(6);var d=a(37),e=String.fromCharCode;a=String.fromCodePoint;b(b.S+b.F*(!!a&&1!=a.length),'String',{fromCodePoint:function(a){for(var b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              c=[],f=arguments.length,m=0;f>m;){if(b=+arguments[m++],d(b,1114111)!==b)throw RangeError(b+' is not a valid code point');c.push(65536>b?e(b):e(((b-=65536)>>10)+55296,b%1024+56320))}return c.join('')}})},function(b,c,a){b=a(6);var d=a(30),e=a(35);b(b.S,'String',{raw:function(a){for(var b=d(a.raw),c=e(b.length),f=arguments.length,m=[],n=0;c>n;)m.push(String(b[n++])),n<f&&m.push(String(arguments[n]));return m.join('')}})},function(b,c,a){a(81)('trim',function(a){return function(){return a(this,3)}})},
    function(b,c,a){b=a(6);var d=a(125)(!1);b(b.P,'String',{codePointAt:function(a){return d(this,a)}})},function(b,c,a){var d=a(36),e=a(33);b.exports=function(a){return function(b,c){var f,g,l=String(e(b)),p=d(c),q=l.length;return 0>p||p>=q?a?'':k:(f=l.charCodeAt(p),55296>f||56319<f||p+1===q||56320>(g=l.charCodeAt(p+1))||57343<g?a?l.charAt(p):f:a?l.slice(p,p+2):(f-55296<<10)+(g-56320)+65536)}}},function(b,c,a){b=a(6);var d=a(35),e=a(127),f=''.endsWith;b(b.P+b.F*a(129)('endsWith'),'String',{endsWith:function(a){var b=
        e(this,a,'endsWith'),c=1<arguments.length?arguments[1]:k,g=d(b.length),c=c===k?g:Math.min(d(c),g),g=String(a);return f?f.call(b,g,c):b.slice(c-g.length,c)===g}})},function(b,c,a){var d=a(128),e=a(33);b.exports=function(a,b,c){if(d(b))throw TypeError('String#'+c+" doesn't accept regex!");return String(e(a))}},function(b,c,a){var d=a(11),e=a(32),f=a(23)('match');b.exports=function(a){var b;return d(a)&&((b=a[f])!==k?!!b:'RegExp'==e(a))}},function(b,c,a){var d=a(23)('match');b.exports=function(a){var b=
        /./;try{'/./'[a](b)}catch(g){try{return b[d]=!1,!'/./'[a](b)}catch(l){}}return!0}},function(b,c,a){b=a(6);var d=a(127);b(b.P+b.F*a(129)('includes'),'String',{includes:function(a){return!!~d(this,a,'includes').indexOf(a,1<arguments.length?arguments[1]:k)}})},function(b,c,a){b=a(6);b(b.P,'String',{repeat:a(85)})},function(b,c,a){b=a(6);var d=a(35),e=a(127),f=''.startsWith;b(b.P+b.F*a(129)('startsWith'),'String',{startsWith:function(a){var b=e(this,a,'startsWith'),c=d(Math.min(1<arguments.length?arguments[1]:
        k,b.length)),g=String(a);return f?f.call(b,g,c):b.slice(c,c+g.length)===g}})},function(b,c,a){var d=a(125)(!0);a(134)(String,'String',function(a){this._t=String(a);this._i=0},function(){var a,b=this._t,c=this._i;return c>=b.length?{value:k,done:!0}:(a=d(b,c),this._i+=a.length,{value:a,done:!1})})},function(b,c,a){var d=a(26),e=a(6),f=a(16),g=a(8),l=a(3),h=a(135),m=a(136),n=a(22),p=a(57),q=a(23)('iterator'),x=!([].keys&&'next'in[].keys()),w=function(){return this};b.exports=function(a,b,c,v,A,B,I){m(c,
        b,v);var r,u,t;v=function(a){return!x&&a in E?E[a]:function(){return new c(this,a)}};var L=b+' Iterator',K='values'==A,C=!1,E=a.prototype,z=E[q]||E['@@iterator']||A&&E[A],G=z||v(A),Q=A?K?v('entries'):G:k,D='Array'==b?E.entries||z:z;if(D&&(t=p(D.call(new a)),t!==Object.prototype&&(n(t,L,!0),d||l(t,q)||g(t,q,w))),K&&z&&'values'!==z.name&&(C=!0,G=function(){return z.call(this)}),d&&!I||!x&&!C&&E[q]||g(E,q,G),h[b]=G,h[L]=w,A)if(r={values:K?G:v('values'),keys:B?G:v('keys'),entries:Q},I)for(u in r)u in
    E||f(E,u,r[u]);else e(e.P+e.F*(x||C),b,r);return r}},function(b,c){b.exports={}},function(b,c,a){var d=a(44),e=a(15),f=a(22),g={};a(8)(g,a(23)('iterator'),function(){return this});b.exports=function(a,b,c){a.prototype=d(g,{next:e(1,c)});f(a,b+' Iterator')}},function(b,c,a){a(138)('anchor',function(a){return function(b){return a(this,'a','name',b)}})},function(b,c,a){var d=a(6),e=a(5),f=a(33),g=/"/g,l=function(a,b,d,c){a=String(f(a));var e='<'+b;return''!==d&&(e+=' '+d+'="'+String(c).replace(g,'&quot;')+
        '"'),e+'>'+a+'</'+b+'>'};b.exports=function(a,b){var c={};c[a]=b(l);d(d.P+d.F*e(function(){var b=''[a]('"');return b!==b.toLowerCase()||3<b.split('"').length}),'String',c)}},function(b,c,a){a(138)('big',function(a){return function(){return a(this,'big','','')}})},function(b,c,a){a(138)('blink',function(a){return function(){return a(this,'blink','','')}})},function(b,c,a){a(138)('bold',function(a){return function(){return a(this,'b','','')}})},function(b,c,a){a(138)('fixed',function(a){return function(){return a(this,
        'tt','','')}})},function(b,c,a){a(138)('fontcolor',function(a){return function(b){return a(this,'font','color',b)}})},function(b,c,a){a(138)('fontsize',function(a){return function(b){return a(this,'font','size',b)}})},function(b,c,a){a(138)('italics',function(a){return function(){return a(this,'i','','')}})},function(b,c,a){a(138)('link',function(a){return function(b){return a(this,'a','href',b)}})},function(b,c,a){a(138)('small',function(a){return function(){return a(this,'small','','')}})},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c,a){a(138)('strike',function(a){return function(){return a(this,'strike','','')}})},function(b,c,a){a(138)('sub',function(a){return function(){return a(this,'sub','','')}})},function(b,c,a){a(138)('sup',function(a){return function(){return a(this,'sup','','')}})},function(b,c,a){b=a(6);b(b.S,'Array',{isArray:a(43)})},function(b,c,a){var d=a(18);b=a(6);var e=a(56),f=a(153),g=a(154),l=a(35),h=a(155),m=a(156);b(b.S+b.F*!a(157)(function(a){Array.from(a)}),'Array',{from:function(a){var b,c,n;n=e(a);c=
        'function'===typeof this?this:Array;b=arguments.length;var w=1<b?arguments[1]:k,r=w!==k,t=0,u=m(n);if(r&&(w=d(w,2<b?arguments[2]:k,2)),u==k||c==Array&&g(u))for(b=l(n.length),c=new c(b);b>t;t++)h(c,t,r?w(n[t],t):n[t]);else for(n=u.call(n),c=new c;!(b=n.next()).done;t++)h(c,t,r?f(n,w,[b.value,t],!0):b.value);return c.length=t,c}})},function(b,c,a){var d=a(10);b.exports=function(a,b,c,l){try{return l?b(d(c)[0],c[1]):b(c)}catch(h){throw b=a['return'],b!==k&&d(b.call(a)),h;}}},function(b,c,a){var d=a(135),
        e=a(23)('iterator'),f=Array.prototype;b.exports=function(a){return a!==k&&(d.Array===a||f[e]===a)}},function(b,c,a){var d=a(9),e=a(15);b.exports=function(a,b,c){b in a?d.f(a,b,e(0,c)):a[b]=c}},function(b,c,a){var d=a(73),e=a(23)('iterator'),f=a(135);b.exports=a(7).getIteratorMethod=function(a){if(a!=k)return a[e]||a['@@iterator']||f[d(a)]}},function(b,c,a){var d=a(23)('iterator'),e=!1;try{var f=[7][d]();f['return']=function(){e=!0};Array.from(f,function(){throw 2;})}catch(g){}b.exports=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            b){if(!b&&!e)return!1;var c=!1;try{var f=[7],g=f[d]();g.next=function(){return{done:c=!0}};f[d]=function(){return g};a(f)}catch(p){}return c}},function(b,c,a){b=a(6);var d=a(155);b(b.S+b.F*a(5)(function(){function a(){}return!(Array.of.call(a)instanceof a)}),'Array',{of:function(){for(var a=0,b=arguments.length,c=new ('function'===typeof this?this:Array)(b);b>a;)d(c,a,arguments[a++]);return c.length=b,c}})},function(b,c,a){b=a(6);var d=a(30),e=[].join;b(b.P+b.F*(a(31)!=Object||!a(160)(e)),'Array',
        {join:function(a){return e.call(d(this),a===k?',':a)}})},function(b,c,a){var d=a(5);b.exports=function(a,b){return!!a&&d(function(){b?a.call(null,function(){},1):a.call(null)})}},function(b,c,a){b=a(6);var d=a(46),e=a(32),f=a(37),g=a(35),l=[].slice;b(b.P+b.F*a(5)(function(){d&&l.call(d)}),'Array',{slice:function(a,b){var d=g(this.length),c=e(this);if(b=b===k?d:b,'Array'==c)return l.call(this,a,b);for(var h=f(a,d),d=f(b,d),d=g(d-h),m=Array(d),w=0;w<d;w++)m[w]='String'==c?this.charAt(h+w):this[h+w];
        return m}})},function(b,c,a){b=a(6);var d=a(19),e=a(56);c=a(5);var f=[].sort,g=[1,2,3];b(b.P+b.F*(c(function(){g.sort(k)})||!c(function(){g.sort(null)})||!a(160)(f)),'Array',{sort:function(a){return a===k?f.call(e(this)):f.call(e(this),d(a))}})},function(b,c,a){b=a(6);var d=a(164)(0);a=a(160)([].forEach,!0);b(b.P+b.F*!a,'Array',{forEach:function(a,b){return d(this,a,b)}})},function(b,c,a){var d=a(18),e=a(31),f=a(56),g=a(35),l=a(165);b.exports=function(a,b){var c=1==a,h=2==a,m=3==a,x=4==a,w=6==a,r=
        5==a||w,t=b||l;return function(b,l,n){var p,q,v=f(b),u=e(v);l=d(l,n,3);n=g(u.length);var A=0;for(b=c?t(b,n):h?t(b,0):k;n>A;A++)if((r||A in u)&&(p=u[A],q=l(p,A,v),a))if(c)b[A]=q;else if(q)switch(a){case 3:return!0;case 5:return p;case 6:return A;case 2:b.push(p)}else if(x)return!1;return w?-1:m||x?x:b}}},function(b,c,a){var d=a(166);b.exports=function(a,b){return new (d(a))(b)}},function(b,c,a){var d=a(11),e=a(43),f=a(23)('species');b.exports=function(a){var b;return e(a)&&(b=a.constructor,'function'!==
    typeof b||b!==Array&&!e(b.prototype)||(b=k),d(b)&&(b=b[f],null===b&&(b=k))),b===k?Array:b}},function(b,c,a){b=a(6);var d=a(164)(1);b(b.P+b.F*!a(160)([].map,!0),'Array',{map:function(a,b){return d(this,a,b)}})},function(b,c,a){b=a(6);var d=a(164)(2);b(b.P+b.F*!a(160)([].filter,!0),'Array',{filter:function(a,b){return d(this,a,b)}})},function(b,c,a){b=a(6);var d=a(164)(3);b(b.P+b.F*!a(160)([].some,!0),'Array',{some:function(a,b){return d(this,a,b)}})},function(b,c,a){b=a(6);var d=a(164)(4);b(b.P+b.F*
        !a(160)([].every,!0),'Array',{every:function(a,b){return d(this,a,b)}})},function(b,c,a){b=a(6);var d=a(172);b(b.P+b.F*!a(160)([].reduce,!0),'Array',{reduce:function(a){return d(this,a,arguments.length,arguments[1],!1)}})},function(b,c,a){var d=a(19),e=a(56),f=a(31),g=a(35);b.exports=function(a,b,c,n,p){d(b);a=e(a);var h=f(a),l=g(a.length),m=p?l-1:0,k=p?-1:1;if(2>c)for(;;){if(m in h){n=h[m];m+=k;break}if(m+=k,p?0>m:l<=m)throw TypeError('Reduce of empty array with no initial value');}for(;p?0<=m:l>
        m;m+=k)m in h&&(n=b(n,h[m],m,a));return n}},function(b,c,a){b=a(6);var d=a(172);b(b.P+b.F*!a(160)([].reduceRight,!0),'Array',{reduceRight:function(a){return d(this,a,arguments.length,arguments[1],!0)}})},function(b,c,a){b=a(6);var d=a(34)(!1),e=[].indexOf,f=!!e&&0>1/[1].indexOf(1,-0);b(b.P+b.F*(f||!a(160)(e)),'Array',{indexOf:function(a){return f?e.apply(this,arguments)||0:d(this,a,arguments[1])}})},function(b,c,a){b=a(6);var d=a(30),e=a(36),f=a(35),g=[].lastIndexOf,l=!!g&&0>1/[1].lastIndexOf(1,-0);
        b(b.P+b.F*(l||!a(160)(g)),'Array',{lastIndexOf:function(a){if(l)return g.apply(this,arguments)||0;var b=d(this),c=f(b.length),h=c-1;1<arguments.length&&(h=Math.min(h,e(arguments[1])));for(0>h&&(h=c+h);0<=h;h--)if(h in b&&b[h]===a)return h||0;return-1}})},function(b,c,a){b=a(6);b(b.P,'Array',{copyWithin:a(177)});a(178)('copyWithin')},function(b,c,a){var d=a(56),e=a(37),f=a(35);b.exports=[].copyWithin||function(a,b){var c=d(this),g=f(c.length),l=e(a,g),p=e(b,g),q=2<arguments.length?arguments[2]:k,g=
            Math.min((q===k?g:e(q,g))-p,g-l),q=1;for(p<l&&l<p+g&&(q=-1,p+=g-1,l+=g-1);0<g--;)p in c?c[l]=c[p]:delete c[l],l+=q,p+=q;return c}},function(b,c,a){var d=a(23)('unscopables'),e=Array.prototype;e[d]==k&&a(8)(e,d,{});b.exports=function(a){e[d][a]=!0}},function(b,c,a){b=a(6);b(b.P,'Array',{fill:a(180)});a(178)('fill')},function(b,c,a){var d=a(56),e=a(37),f=a(35);b.exports=function(a){for(var b=d(this),c=f(b.length),g=arguments.length,n=e(1<g?arguments[1]:k,c),g=2<g?arguments[2]:k,c=g===k?c:e(g,c);c>n;)b[n++]=
        a;return b}},function(b,c,a){b=a(6);var d=a(164)(5),e=!0;'find'in[]&&Array(1).find(function(){e=!1});b(b.P+b.F*e,'Array',{find:function(a){return d(this,a,1<arguments.length?arguments[1]:k)}});a(178)('find')},function(b,c,a){b=a(6);var d=a(164)(6),e=!0;'findIndex'in[]&&Array(1).findIndex(function(){e=!1});b(b.P+b.F*e,'Array',{findIndex:function(a){return d(this,a,1<arguments.length?arguments[1]:k)}});a(178)('findIndex')},function(b,c,a){c=a(178);var d=a(184),e=a(135),f=a(30);b.exports=a(134)(Array,
        'Array',function(a,b){this._t=f(a);this._i=0;this._k=b},function(){var a=this._t,b=this._k,c=this._i++;return!a||c>=a.length?(this._t=k,d(1)):'keys'==b?d(0,c):'values'==b?d(0,a[c]):d(0,[c,a[c]])},'values');e.Arguments=e.Array;c('keys');c('values');c('entries')},function(b,c){b.exports=function(a,b){return{value:b,done:!!a}}},function(b,c,a){a(186)('Array')},function(b,c,a){var d=a(2),e=a(9),f=a(4),g=a(23)('species');b.exports=function(a){a=d[a];f&&a&&!a[g]&&e.f(a,g,{configurable:!0,get:function(){return this}})}},
    function(b,c,a){b=a(2);var d=a(80),e=a(9).f,f=a(48).f,g=a(128),l=a(188),h=b.RegExp,m=h,n=h.prototype,p=/a/g,q=/a/g,x=new h(p)!==p;if(a(4)&&(!x||a(5)(function(){return q[a(23)('match')]=!1,h(p)!=p||h(q)==q||'/a/i'!=h(p,'i')}))){h=function(a,b){var c=this instanceof h,e=g(a),f=b===k;return!c&&e&&a.constructor===h&&f?a:d(x?new m(e&&!f?a.source:a,b):m((e=a instanceof h)?a.source:a,e&&f?l.call(a):b),c?this:n,h)};c=function(a){a in h||e(h,a,{configurable:!0,get:function(){return m[a]},set:function(b){m[a]=
        b}})};for(var f=f(m),w=0;f.length>w;)c(f[w++]);n.constructor=h;h.prototype=n;a(16)(b,'RegExp',h)}a(186)('RegExp')},function(b,c,a){var d=a(10);b.exports=function(){var a=d(this),b='';return a.global&&(b+='g'),a.ignoreCase&&(b+='i'),a.multiline&&(b+='m'),a.unicode&&(b+='u'),a.sticky&&(b+='y'),b}},function(b,c,a){a(190);var d=a(10),e=a(188),f=a(4),g=/./.toString;a(5)(function(){return'/a/b'!=g.call({source:'a',flags:'b'})})?a(16)(RegExp.prototype,'toString',function(){var a=d(this);return'/'.concat(a.source,
        '/','flags'in a?a.flags:!f&&a instanceof RegExp?e.call(a):k)},!0):'toString'!=g.name&&a(16)(RegExp.prototype,'toString',function(){return g.call(this)},!0)},function(b,c,a){a(4)&&'g'!=/./g.flags&&a(9).f(RegExp.prototype,'flags',{configurable:!0,get:a(188)})},function(b,c,a){a(192)('match',1,function(a,b,c){return[function(c){var d=a(this),e=c==k?k:c[b];return e!==k?e.call(c,d):(new RegExp(c))[b](String(d))},c]})},function(b,c,a){var d=a(8),e=a(16),f=a(5),g=a(33),l=a(23);b.exports=function(a,b,c){var h=
        l(a);c=c(g,h,''[a]);var n=c[0],m=c[1];f(function(){var b={};return b[h]=function(){return 7},7!=''[a](b)})&&(e(String.prototype,a,n),d(RegExp.prototype,h,2==b?function(a,b){return m.call(a,this,b)}:function(a){return m.call(a,this)}))}},function(b,c,a){a(192)('replace',2,function(a,b,c){return[function(d,e){var f=a(this),g=d==k?k:d[b];return g!==k?g.call(d,f,e):c.call(String(f),d,e)},c]})},function(b,c,a){a(192)('search',1,function(a,b,c){return[function(c){var d=a(this),e=c==k?k:c[b];return e!==
    k?e.call(c,d):(new RegExp(c))[b](String(d))},c]})},function(b,c,a){a(192)('split',2,function(b,c,f){var d=a(128),e=f,h=[].push;if('c'=='abbc'.split(/(b)*/)[1]||4!='test'.split(/(?:)/,-1).length||2!='ab'.split(/(?:ab)*/).length||4!='.'.split(/(.?)(.?)/).length||1<'.'.split(/()()/).length||''.split(/.?/).length){var m=/()??/.exec('')[1]===k;f=function(a,b){var c=String(this);if(a===k&&0===b)return[];if(!d(a))return e.call(c,a,b);var f,g,l,n,p,v=[],A=(a.ignoreCase?'i':'')+(a.multiline?'m':'')+(a.unicode?
            'u':'')+(a.sticky?'y':''),B=0,I=b===k?4294967295:b>>>0,y=new RegExp(a.source,A+'g');for(m||(f=new RegExp('^'+y.source+'$(?!\\s)',A));(g=y.exec(c))&&(l=g.index+g[0].length,!(l>B&&(v.push(c.slice(B,g.index)),!m&&1<g.length&&g[0].replace(f,function(){for(p=1;p<arguments.length-2;p++)arguments[p]===k&&(g[p]=k)}),1<g.length&&g.index<c.length&&h.apply(v,g.slice(1)),n=g[0].length,B=l,v.length>=I)));)y.lastIndex===g.index&&y.lastIndex++;return B===c.length?!n&&y.test('')||v.push(''):v.push(c.slice(B)),v.length>
    I?v.slice(0,I):v}}else'0'.split(k,0).length&&(f=function(a,b){return a===k&&0===b?[]:e.call(this,a,b)});return[function(a,d){var e=b(this),g=a==k?k:a[c];return g!==k?g.call(a,e,d):f.call(String(e),a,d)},f]})},function(b,c,a){var d,e,f;b=a(26);var g=a(2),l=a(18),h=a(73);c=a(6);var m=a(11),n=a(19),p=a(197),q=a(198),x=a(199),w=a(200).set,r=a(201)(),t=g.TypeError,u=g.process,v=g.Promise,u=g.process,A='process'==h(u),B=function(){},h=!!function(){try{var b=v.resolve(1),c=(b.constructor={})[a(23)('species')]=
        function(a){a(B,B)};return(A||'function'===typeof PromiseRejectionEvent)&&b.then(B)instanceof c}catch(X){}}(),I=function(a){var b;return!(!m(a)||'function'!==typeof(b=a.then))&&b},y=function(a){return v===a||v===v&&a===f?new V(a):new e(a)},V=e=function(a){var b,c;this.promise=new a(function(a,d){if(b!==k||c!==k)throw t('Bad Promise constructor');b=a;c=d});this.resolve=n(b);this.reject=n(c)},J=function(a){try{a()}catch(D){return{error:D}}},L=function(a,b){if(!a._n){a._n=!0;var c=a._c;r(function(){for(var d=
        a._v,e=1==a._s,f=0;c.length>f;){var g=void 0,h=void 0,l=c[f++],m=e?l.ok:l.fail,n=l.resolve,k=l.reject,p=l.domain;try{m?(e||(2==a._h&&E(a),a._h=1),!0===m?h=d:(p&&p.enter(),h=m(d),p&&p.exit()),h===l.promise?k(t('Promise-chain cycle')):(g=I(h))?g.call(h,n,k):n(h)):k(d)}catch(O){k(O)}}a._c=[];a._n=!1;b&&!a._h&&K(a)})}},K=function(a){w.call(g,function(){var b,c,d,e=a._v;if(C(a)&&(b=J(function(){A?u.emit('unhandledRejection',e,a):(c=g.onunhandledrejection)?c({promise:a,reason:e}):(d=g.console)&&d.error&&
            d.error('Unhandled promise rejection',e)}),a._h=A||C(a)?2:1),a._a=k,b)throw b.error;})},C=function(a){if(1==a._h)return!1;var b;a=a._a||a._c;for(var c=0;a.length>c;)if(b=a[c++],b.fail||!C(b.promise))return!1;return!0},E=function(a){w.call(g,function(){var b;A?u.emit('rejectionHandled',a):(b=g.onrejectionhandled)&&b({promise:a,reason:a._v})})},z=function(a){var b=this;b._d||(b._d=!0,b=b._w||b,b._v=a,b._s=2,b._a||(b._a=b._c.slice()),L(b,!0))},G=function(a){var b,c=this;if(!c._d){c._d=!0;c=c._w||c;try{if(c===
        a)throw t("Promise can't be resolved itself");(b=I(a))?r(function(){var d={_w:c,_d:!1};try{b.call(a,l(G,d,1),l(z,d,1))}catch(T){z.call(d,T)}}):(c._v=a,c._s=1,L(c,!1))}catch(Y){z.call({_w:c,_d:!1},Y)}}};h||(v=function(a){p(this,v,'Promise','_h');n(a);d.call(this);try{a(l(G,this,1),l(z,this,1))}catch(D){z.call(this,D)}},d=function(a){this._c=[];this._a=k;this._s=0;this._d=!1;this._v=k;this._h=0;this._n=!1},d.prototype=a(202)(v.prototype,{then:function(a,b){var c=y(x(this,v));return c.ok='function'!==
        typeof a||a,c.fail='function'===typeof b&&b,c.domain=A?u.domain:k,this._c.push(c),this._a&&this._a.push(c),this._s&&L(this,!1),c.promise},'catch':function(a){return this.then(k,a)}}),V=function(){var a=new d;this.promise=a;this.resolve=l(G,a,1);this.reject=l(z,a,1)});c(c.G+c.W+c.F*!h,{Promise:v});a(22)(v,'Promise');a(186)('Promise');f=a(7).Promise;c(c.S+c.F*!h,'Promise',{reject:function(a){var b=y(this),c=b.reject;return c(a),b.promise}});c(c.S+c.F*(b||!h),'Promise',{resolve:function(a){var b;if(b=
            a instanceof v)b=a.constructor,b=b===this||b===v&&this===f;if(b)return a;b=y(this);var c=b.resolve;return c(a),b.promise}});c(c.S+c.F*!(h&&a(157)(function(a){v.all(a)['catch'](B)})),'Promise',{all:function(a){var b=this,c=y(b),d=c.resolve,e=c.reject,f=J(function(){var c=[],f=0,g=1;q(a,!1,function(a){var h=f++,l=!1;c.push(k);g++;b.resolve(a).then(function(a){l||(l=!0,c[h]=a,--g||d(c))},e)});--g||d(c)});return f&&e(f.error),c.promise},race:function(a){var b=this,c=y(b),d=c.reject,e=J(function(){q(a,
        !1,function(a){b.resolve(a).then(c.resolve,d)})});return e&&d(e.error),c.promise}})},function(b,c){b.exports=function(a,b,c,f){if(!(a instanceof b)||f!==k&&f in a)throw TypeError(c+': incorrect invocation!');return a}},function(b,c,a){var d=a(18),e=a(153),f=a(154),g=a(10),l=a(35),h=a(156),m={},n={};c=b.exports=function(a,b,c,k,r){var p,q;r=r?function(){return a}:h(a);c=d(c,k,b?2:1);k=0;if('function'!==typeof r)throw TypeError(a+' is not iterable!');if(f(r))for(r=l(a.length);r>k;k++){if(q=b?c(g(p=
            a[k])[0],p[1]):c(a[k]),q===m||q===n)return q}else for(r=r.call(a);!(p=r.next()).done;)if(q=e(r,c,p.value,b),q===m||q===n)return q};c.BREAK=m;c.RETURN=n},function(b,c,a){var d=a(10),e=a(19),f=a(23)('species');b.exports=function(a,b){var c,g=d(a).constructor;return g===k||(c=d(g)[f])==k?b:e(c)}},function(b,c,a){var d,e,f,g=a(18),l=a(76),h=a(46),m=a(13),n=a(2),k=n.process;c=n.setImmediate;var q=n.clearImmediate,x=n.MessageChannel,w=0,r={},t=function(){var a=+this;if(r.hasOwnProperty(a)){var b=r[a];delete r[a];
        b()}},u=function(a){t.call(a.data)};c&&q||(c=function(a){for(var b=[],c=1;arguments.length>c;)b.push(arguments[c++]);return r[++w]=function(){l('function'===typeof a?a:Function(a),b)},d(w),w},q=function(a){delete r[a]},'process'==a(32)(k)?d=function(a){k.nextTick(g(t,a,1))}:x?(e=new x,f=e.port2,e.port1.onmessage=u,d=g(f.postMessage,f,1)):n.addEventListener&&'function'===typeof postMessage&&!n.importScripts?(d=function(a){n.postMessage(a+'','*')},n.addEventListener('message',u,!1)):d='onreadystatechange'in
    m('script')?function(a){h.appendChild(m('script')).onreadystatechange=function(){h.removeChild(this);t.call(a)}}:function(a){setTimeout(g(t,a,1),0)});b.exports={set:c,clear:q}},function(b,c,a){var d=a(2),e=a(200).set,f=d.MutationObserver||d.WebKitMutationObserver,g=d.process,l=d.Promise,h='process'==a(32)(g);b.exports=function(){var a,b,c,q=function(){var d,e;for(h&&(d=g.domain)&&d.exit();a;){e=a.fn;a=a.next;try{e()}catch(v){throw a?c():b=k,v;}}b=k;d&&d.enter()};if(h)c=function(){g.nextTick(q)};else if(f){var x=
        !0,w=document.createTextNode('');(new f(q)).observe(w,{characterData:!0});c=function(){w.data=x=!x}}else if(l&&l.resolve){var r=l.resolve();c=function(){r.then(q)}}else c=function(){e.call(d,q)};return function(d){d={fn:d,next:k};b&&(b.next=d);a||(a=d,c());b=d}}},function(b,c,a){var d=a(16);b.exports=function(a,b,c){for(var e in b)d(a,e,b[e],c);return a}},function(b,c,a){var d=a(204);b.exports=a(205)('Map',function(a){return function(){return a(this,0<arguments.length?arguments[0]:k)}},{get:function(a){return(a=
            d.getEntry(this,a))&&a.v},set:function(a,b){return d.def(this,0===a?0:a,b)}},d,!0)},function(b,c,a){var d=a(9).f,e=a(44),f=a(202),g=a(18),l=a(197),h=a(33),m=a(198),n=a(134),p=a(184),q=a(186),x=a(4),w=a(20).fastKey,r=x?'_s':'size',t=function(a,b){var c;c=w(b);if('F'!==c)return a._i[c];for(c=a._f;c;c=c.n)if(c.k==b)return c};b.exports={getConstructor:function(a,b,c,n){var p=a(function(a,d){l(a,p,b,'_i');a._i=e(null);a._f=k;a._l=k;a[r]=0;d!=k&&m(d,c,a[n],a)});return f(p.prototype,{clear:function(){for(var a=
        this._i,b=this._f;b;b=b.n)b.r=!0,b.p&&(b.p=b.p.n=k),delete a[b.i];this._f=this._l=k;this[r]=0},'delete':function(a){if(a=t(this,a)){var b=a.n,c=a.p;delete this._i[a.i];a.r=!0;c&&(c.n=b);b&&(b.p=c);this._f==a&&(this._f=b);this._l==a&&(this._l=c);this[r]--}return!!a},forEach:function(a){l(this,p,'forEach');for(var b,c=g(a,1<arguments.length?arguments[1]:k,3);b=b?b.n:this._f;)for(c(b.v,b.k,this);b&&b.r;)b=b.p},has:function(a){return!!t(this,a)}}),x&&d(p.prototype,'size',{get:function(){return h(this[r])}}),
        p},def:function(a,b,c){var d,e,f=t(a,b);return f?f.v=c:(a._l=f={i:e=w(b,!0),k:b,v:c,p:d=a._l,n:k,r:!1},a._f||(a._f=f),d&&(d.n=f),a[r]++,'F'!==e&&(a._i[e]=f)),a},getEntry:t,setStrong:function(a,b,c){n(a,b,function(a,b){this._t=a;this._k=b;this._l=k},function(){for(var a=this._k,b=this._l;b&&b.r;)b=b.p;return this._t&&(this._l=b=b?b.n:this._t._f)?'keys'==a?p(0,b.k):'values'==a?p(0,b.v):p(0,[b.k,b.v]):(this._t=k,p(1))},c?'entries':'values',!c,!0);q(b)}}},function(b,c,a){var d=a(2),e=a(6),f=a(16),g=a(202),
        l=a(20),h=a(198),m=a(197),n=a(11),p=a(5),q=a(157),x=a(22),w=a(80);b.exports=function(a,b,c,v,A,B){var t=d[a],r=t,u=A?'set':'add',J=r&&r.prototype,L={},K=function(a){var b=J[a];f(J,a,'delete'==a?function(a){return!(B&&!n(a))&&b.call(this,0===a?0:a)}:'has'==a?function(a){return!(B&&!n(a))&&b.call(this,0===a?0:a)}:'get'==a?function(a){return B&&!n(a)?k:b.call(this,0===a?0:a)}:'add'==a?function(a){return b.call(this,0===a?0:a),this}:function(a,c){return b.call(this,0===a?0:a,c),this})};if('function'===
        typeof r&&(B||J.forEach&&!p(function(){(new r).entries().next()}))){var C=new r;c=C[u](B?{}:-0,1)!=C;var E=p(function(){C.has(1)}),z=q(function(a){new r(a)}),G=!B&&p(function(){for(var a=new r,b=5;b--;)a[u](b,b);return!a.has(-0)});z||(r=b(function(b,c){m(b,r,a);var d=w(new t,b,r);return c!=k&&h(c,A,d[u],d),d}),r.prototype=J,J.constructor=r);(E||G)&&(K('delete'),K('has'),A&&K('get'));(G||c)&&K(u);B&&J.clear&&delete J.clear}else r=v.getConstructor(b,a,A,u),g(r.prototype,c),l.NEED=!0;return x(r,a),L[a]=
        r,e(e.G+e.W+e.F*(r!=t),L),B||v.setStrong(r,a,A),r}},function(b,c,a){var d=a(204);b.exports=a(205)('Set',function(a){return function(){return a(this,0<arguments.length?arguments[0]:k)}},{add:function(a){return d.def(this,a=0===a?0:a,a)}},d)},function(b,c,a){var d;c=a(164)(0);var e=a(16),f=a(20),g=a(67),l=a(208),h=a(11),m=f.getWeak,n=Object.isExtensible,p=l.ufstore,q={},x=function(a){return function(){return a(this,0<arguments.length?arguments[0]:k)}},w={get:function(a){if(h(a)){var b=m(a);return!0===
    b?p(this).get(a):b?b[this._i]:k}},set:function(a,b){return l.def(this,a,b)}},r=b.exports=a(205)('WeakMap',x,w,l,!0,!0);7!=(new r).set((Object.freeze||Object)(q),7).get(q)&&(d=l.getConstructor(x),g(d.prototype,w),f.NEED=!0,c(['delete','has','get','set'],function(a){var b=r.prototype,c=b[a];e(b,a,function(b,e){if(h(b)&&!n(b)){this._f||(this._f=new d);var f=this._f[a](b,e);return'set'==a?this:f}return c.call(this,b,e)})}))},function(b,c,a){var d=a(202),e=a(20).getWeak,f=a(10),g=a(11),l=a(197),h=a(198);
        c=a(164);var m=a(3),n=c(5),p=c(6),q=0,x=function(a){return a._l||(a._l=new w)},w=function(){this.a=[]},r=function(a,b){return n(a.a,function(a){return a[0]===b})};w.prototype={get:function(a){if(a=r(this,a))return a[1]},has:function(a){return!!r(this,a)},set:function(a,b){var c=r(this,a);c?c[1]=b:this.a.push([a,b])},'delete':function(a){var b=p(this.a,function(b){return b[0]===a});return~b&&this.a.splice(b,1),!!~b}};b.exports={getConstructor:function(a,b,c,f){var n=a(function(a,d){l(a,n,b,'_i');a._i=
            q++;a._l=k;d!=k&&h(d,c,a[f],a)});return d(n.prototype,{'delete':function(a){if(!g(a))return!1;var b=e(a);return!0===b?x(this)['delete'](a):b&&m(b,this._i)&&delete b[this._i]},has:function(a){if(!g(a))return!1;var b=e(a);return!0===b?x(this).has(a):b&&m(b,this._i)}}),n},def:function(a,b,c){var d=e(f(b),!0);return!0===d?x(a).set(b,c):d[a._i]=c,a},ufstore:x}},function(b,c,a){var d=a(208);a(205)('WeakSet',function(a){return function(){return a(this,0<arguments.length?arguments[0]:k)}},{add:function(a){return d.def(this,
        a,!0)}},d,!1,!0)},function(b,c,a){b=a(6);var d=a(19),e=a(10),f=(a(2).Reflect||{}).apply,g=Function.apply;b(b.S+b.F*!a(5)(function(){f(function(){})}),'Reflect',{apply:function(a,b,c){a=d(a);c=e(c);return f?f(a,b,c):g.call(a,b,c)}})},function(b,c,a){b=a(6);var d=a(44),e=a(19),f=a(10),g=a(11);c=a(5);var l=a(75),h=(a(2).Reflect||{}).construct,k=c(function(){function a(){}return!(h(function(){},[],a)instanceof a)}),n=!c(function(){h(function(){})});b(b.S+b.F*(k||n),'Reflect',{construct:function(a,b){e(a);
        f(b);var c=3>arguments.length?a:e(arguments[2]);if(n&&!k)return h(a,b,c);if(a==c){switch(b.length){case 0:return new a;case 1:return new a(b[0]);case 2:return new a(b[0],b[1]);case 3:return new a(b[0],b[1],b[2]);case 4:return new a(b[0],b[1],b[2],b[3])}c=[null];return c.push.apply(c,b),new (l.apply(a,c))}var c=c.prototype,c=d(g(c)?c:Object.prototype),m=Function.apply.call(a,c,b);return g(m)?m:c}})},function(b,c,a){var d=a(9);b=a(6);var e=a(10),f=a(14);b(b.S+b.F*a(5)(function(){Reflect.defineProperty(d.f({},
            1,{value:1}),1,{value:2})}),'Reflect',{defineProperty:function(a,b,c){e(a);b=f(b,!0);e(c);try{return d.f(a,b,c),!0}catch(m){return!1}}})},function(b,c,a){b=a(6);var d=a(49).f,e=a(10);b(b.S,'Reflect',{deleteProperty:function(a,b){var c=d(e(a),b);return!(c&&!c.configurable)&&delete a[b]}})},function(b,c,a){b=a(6);var d=a(10),e=function(a){this._t=d(a);this._i=0;var b,c=this._k=[];for(b in a)c.push(b)};a(136)(e,'Object',function(){var a,b=this._k;do if(this._i>=b.length)return{value:k,done:!0};while(!((a=
        b[this._i++])in this._t));return{value:a,done:!1}});b(b.S,'Reflect',{enumerate:function(a){return new e(a)}})},function(b,c,a){function d(a,b){var c,n,m=3>arguments.length?a:arguments[2];return h(a)===m?a[b]:(c=e.f(a,b))?g(c,'value')?c.value:c.get!==k?c.get.call(m):k:l(n=f(a))?d(n,b,m):void 0}var e=a(49),f=a(57),g=a(3);b=a(6);var l=a(11),h=a(10);b(b.S,'Reflect',{get:d})},function(b,c,a){var d=a(49);b=a(6);var e=a(10);b(b.S,'Reflect',{getOwnPropertyDescriptor:function(a,b){return d.f(e(a),b)}})},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     c,a){b=a(6);var d=a(57),e=a(10);b(b.S,'Reflect',{getPrototypeOf:function(a){return d(e(a))}})},function(b,c,a){b=a(6);b(b.S,'Reflect',{has:function(a,b){return b in a}})},function(b,c,a){b=a(6);var d=a(10),e=Object.isExtensible;b(b.S,'Reflect',{isExtensible:function(a){return d(a),!e||e(a)}})},function(b,c,a){b=a(6);b(b.S,'Reflect',{ownKeys:a(221)})},function(b,c,a){var d=a(48),e=a(41),f=a(10);c=a(2).Reflect;b.exports=c&&c.ownKeys||function(a){var b=d.f(f(a)),c=e.f;return c?b.concat(c(a)):b}},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c,a){b=a(6);var d=a(10),e=Object.preventExtensions;b(b.S,'Reflect',{preventExtensions:function(a){d(a);try{return e&&e(a),!0}catch(g){return!1}}})},function(b,c,a){function d(a,b,c){var p,q,t=4>arguments.length?a:arguments[3];q=f.f(m(a),b);if(!q){if(n(q=g(a)))return d(q,b,c,t);q=h(0)}return l(q,'value')?!(!1===q.writable||!n(t))&&(p=f.f(t,b)||h(0),p.value=c,e.f(t,b,p),!0):q.set!==k&&(q.set.call(t,c),!0)}var e=a(9),f=a(49),g=a(57),l=a(3);b=a(6);var h=a(15),m=a(10),n=a(11);b(b.S,'Reflect',{set:d})},
    function(b,c,a){b=a(6);var d=a(71);d&&b(b.S,'Reflect',{setPrototypeOf:function(a,b){d.check(a,b);try{return d.set(a,b),!0}catch(g){return!1}}})},function(b,c,a){b=a(6);b(b.S,'Date',{now:function(){return(new Date).getTime()}})},function(b,c,a){b=a(6);var d=a(56),e=a(14);b(b.P+b.F*a(5)(function(){return null!==(new Date(NaN)).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})}),'Date',{toJSON:function(a){a=d(this);var b=e(a);return'number'!==typeof b||isFinite(b)?a.toISOString():
        null}})},function(b,c,a){b=a(6);a=a(5);var d=Date.prototype.getTime,e=function(a){return 9<a?a:'0'+a};b(b.P+b.F*(a(function(){return'0385-07-25T07:06:39.999Z'!=(new Date(-5E13-1)).toISOString()})||!a(function(){(new Date(NaN)).toISOString()})),'Date',{toISOString:function(){if(!isFinite(d.call(this)))throw RangeError('Invalid time value');var a=this.getUTCFullYear(),b=this.getUTCMilliseconds(),c=0>a?'-':9999<a?'+':'';return c+('00000'+Math.abs(a)).slice(c?-6:-4)+'-'+e(this.getUTCMonth()+1)+'-'+e(this.getUTCDate())+
        'T'+e(this.getUTCHours())+':'+e(this.getUTCMinutes())+':'+e(this.getUTCSeconds())+'.'+(99<b?b:'0'+e(b))+'Z'}})},function(b,c,a){b=Date.prototype;var d=b.toString,e=b.getTime;'Invalid Date'!=new Date(NaN)+''&&a(16)(b,'toString',function(){var a=e.call(this);return a===a?d.call(this):'Invalid Date'})},function(b,c,a){b=a(23)('toPrimitive');c=Date.prototype;b in c||a(8)(c,b,a(230))},function(b,c,a){var d=a(10),e=a(14);b.exports=function(a){if('string'!==a&&'number'!==a&&'default'!==a)throw TypeError('Incorrect hint');
        return e(d(this),'number'!=a)}},function(b,c,a){b=a(6);c=a(232);var d=a(233),e=a(10),f=a(37),g=a(35),l=a(11),h=a(2).ArrayBuffer,m=a(199),n=d.ArrayBuffer,p=d.DataView,q=c.ABV&&h.isView,x=n.prototype.slice,w=c.VIEW;b(b.G+b.W+b.F*(h!==n),{ArrayBuffer:n});b(b.S+b.F*!c.CONSTR,'ArrayBuffer',{isView:function(a){return q&&q(a)||l(a)&&w in a}});b(b.P+b.U+b.F*a(5)(function(){return!(new n(2)).slice(1,k).byteLength}),'ArrayBuffer',{slice:function(a,b){if(x!==k&&b===k)return x.call(e(this),a);for(var c=e(this).byteLength,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      d=f(a,c),c=f(b===k?c:b,c),h=new (m(this,n))(g(c-d)),l=new p(this),q=new p(h),r=0;d<c;)q.setUint8(r++,l.getUint8(d++));return h}});a(186)('ArrayBuffer')},function(b,c,a){var d;c=a(2);var e=a(8),f=a(17);a=f('typed_array');for(var f=f('view'),g=!(!c.ArrayBuffer||!c.DataView),l=g,h=0,k='Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(' ');9>h;)(d=c[k[h++]])?(e(d.prototype,a,!0),e(d.prototype,f,!0)):l=!1;b.exports={ABV:g,CONSTR:l,TYPED:a,
        VIEW:f}},function(b,c,a){var d=a(2),e=a(4),f=a(26);b=a(232);var g=a(8),l=a(202),h=a(5),m=a(197),n=a(36),p=a(35),q=a(48).f,x=a(9).f,w=a(180);a=a(22);var r=d.ArrayBuffer,t=d.DataView,u=d.Math,v=d.RangeError,A=d.Infinity,B=r,I=u.abs,y=u.pow,V=u.floor,J=u.log,L=u.LN2,K=e?'_b':'buffer',C=e?'_l':'byteLength',E=e?'_o':'byteOffset',z=function(a,b,c){var d,e,f,g=Array(c);c=8*c-b-1;var h=(1<<c)-1,l=h>>1,k=23===b?y(2,-24)-y(2,-77):0,n=0,m=0>a||0===a&&0>1/a?1:0;a=I(a);for(a!=a||a===A?(e=a!=a?1:0,d=h):(d=V(J(a)/
        L),1>a*(f=y(2,-d))&&(d--,f*=2),a+=1<=d+l?k/f:k*y(2,1-l),2<=a*f&&(d++,f/=2),d+l>=h?(e=0,d=h):1<=d+l?(e=(a*f-1)*y(2,b),d+=l):(e=a*y(2,l-1)*y(2,b),d=0));8<=b;g[n++]=255&e,e/=256,b-=8);d=d<<b|e;for(c+=b;0<c;g[n++]=255&d,d/=256,c-=8);return g[--n]|=128*m,g},G=function(a,b,c){for(var d=8*c-b-1,e=(1<<d)-1,f=e>>1,d=d-7,g=c-1,h=a[g--],l=127&h,h=h>>7;0<d;l=256*l+a[g],g--,d-=8);c=l&(1<<-d)-1;l>>=-d;for(d+=b;0<d;c=256*c+a[g],g--,d-=8);if(0===l)l=1-f;else{if(l===e)return c?NaN:h?-A:A;c+=y(2,b);l-=f}return(h?-1:
            1)*c*y(2,l-b)},Q=function(a){return a[3]<<24|a[2]<<16|a[1]<<8|a[0]},D=function(a){return[255&a]},X=function(a){return[255&a,a>>8&255]},Y=function(a){return[255&a,a>>8&255,a>>16&255,a>>24&255]},T=function(a){return z(a,52,8)},R=function(a){return z(a,23,4)},d=function(a,b,c){x(a.prototype,b,{get:function(){return this[c]}})},M=function(a,b,c,d){c=+c;var e=n(c);if(c!=e||0>e||e+b>a[C])throw v('Wrong index!');c=e+a[E];a=a[K]._b.slice(c,c+b);return d?a:a.reverse()},H=function(a,b,c,d,e,f){c=+c;var g=n(c);
        if(c!=g||0>g||g+b>a[C])throw v('Wrong index!');c=a[K]._b;a=g+a[E];d=d(+e);for(e=0;e<b;e++)c[a+e]=d[f?e:b-e-1]},N=function(a,b){m(a,r,'ArrayBuffer');var c=+b,d=p(c);if(c!=d)throw v('Wrong length!');return d};if(b.ABV){if(!h(function(){new r})||!h(function(){new r(.5)})){for(var r=function(a){return new B(N(this,a))},P,e=r.prototype=B.prototype,q=q(B),h=0;q.length>h;)(P=q[h++])in r||g(r,P,B[P]);f||(e.constructor=r)}P=new t(new r(2));var S=t.prototype.setInt8;P.setInt8(0,2147483648);P.setInt8(1,2147483649);
        !P.getInt8(0)&&P.getInt8(1)||l(t.prototype,{setInt8:function(a,b){S.call(this,a,b<<24>>24)},setUint8:function(a,b){S.call(this,a,b<<24>>24)}},!0)}else r=function(a){a=N(this,a);this._b=w.call(Array(a),0);this[C]=a},t=function(a,b,c){m(this,t,'DataView');m(a,r,'DataView');var d=a[C];b=n(b);if(0>b||b>d)throw v('Wrong offset!');if(c=c===k?d-b:p(c),b+c>d)throw v('Wrong length!');this[K]=a;this[E]=b;this[C]=c},e&&(d(r,'byteLength','_l'),d(t,'buffer','_b'),d(t,'byteLength','_l'),d(t,'byteOffset','_o')),
        l(t.prototype,{getInt8:function(a){return M(this,1,a)[0]<<24>>24},getUint8:function(a){return M(this,1,a)[0]},getInt16:function(a,b){var c=M(this,2,a,b);return(c[1]<<8|c[0])<<16>>16},getUint16:function(a,b){var c=M(this,2,a,b);return c[1]<<8|c[0]},getInt32:function(a,b){return Q(M(this,4,a,b))},getUint32:function(a,b){return Q(M(this,4,a,b))>>>0},getFloat32:function(a,b){return G(M(this,4,a,b),23,4)},getFloat64:function(a,b){return G(M(this,8,a,b),52,8)},setInt8:function(a,b){H(this,1,a,D,b)},setUint8:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            b){H(this,1,a,D,b)},setInt16:function(a,b,c){H(this,2,a,X,b,c)},setUint16:function(a,b,c){H(this,2,a,X,b,c)},setInt32:function(a,b,c){H(this,4,a,Y,b,c)},setUint32:function(a,b,c){H(this,4,a,Y,b,c)},setFloat32:function(a,b,c){H(this,4,a,R,b,c)},setFloat64:function(a,b,c){H(this,8,a,T,b,c)}});a(r,'ArrayBuffer');a(t,'DataView');g(t.prototype,b.VIEW,!0);c.ArrayBuffer=r;c.DataView=t},function(b,c,a){b=a(6);b(b.G+b.W+b.F*!a(232).ABV,{DataView:a(233).DataView})},function(b,c,a){a(236)('Int8',1,function(a){return function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,d){return a(this,b,c,d)}})},function(b,c,a){if(a(4)){var d=a(26),e=a(2),f=a(5),g=a(6),l=a(232),h=a(233),m=a(18),n=a(197),p=a(15),q=a(8);c=a(202);var x=a(36),w=a(35),r=a(37),t=a(14),u=a(3),v=a(69),A=a(73),B=a(11),I=a(56),y=a(154),V=a(44),J=a(57),L=a(48).f,K=a(156),C=a(17),E=a(23),z=a(164),G=a(34),Q=a(199),D=a(183),X=a(135),Y=a(157),T=a(186),R=a(180),M=a(177),H=a(9);a=a(49);var N=H.f,P=a.f,S=e.RangeError,aa=e.TypeError,U=e.Uint8Array,O=Array.prototype,ba=h.ArrayBuffer,Z=h.DataView,ea=z(0),ga=z(2),
        da=z(3),Ca=z(4),Da=z(5),Ea=z(6),Fa=G(!0),Ga=G(!1),Ha=D.values,Ia=D.keys,Ja=D.entries,Ka=O.lastIndexOf,La=O.reduce,Ma=O.reduceRight,ra=O.join,Na=O.sort,sa=O.slice,fa=O.toString,ma=O.toLocaleString,na=E('iterator'),ha=E('toStringTag'),ta=C('typed_constructor'),ia=C('def_constructor'),h=l.CONSTR,ca=l.TYPED,Oa=l.VIEW,Pa=z(1,function(a,b){return ja(Q(a,a[ia]),b)}),ua=f(function(){return 1===(new U((new Uint16Array([1])).buffer))[0]}),Qa=!!U&&!!U.prototype.set&&f(function(){(new U(1)).set({})}),va=function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  b){if(a===k)throw aa('Wrong length!');var c=+a,d=w(a);if(b&&!v(c,d))throw S('Wrong length!');return d},ka=function(a,b){var c=x(a);if(0>c||c%b)throw S('Wrong offset!');return c},F=function(a){if(B(a)&&ca in a)return a;throw aa(a+' is not a typed array!');},ja=function(a,b){if(!(B(a)&&ta in a))throw aa('It is not a typed array constructor!');return new a(b)},wa=function(a,b){return oa(Q(a,a[ia]),b)},oa=function(a,b){for(var c=0,d=b.length,e=ja(a,d);d>c;)e[c]=b[c++];return e},z=function(a,b,c){N(a,
            b,{get:function(){return this._d[c]}})},pa=function(a){var b,c,d,e,f;d=I(a);c=arguments.length;var g=1<c?arguments[1]:k,h=g!==k;b=K(d);if(b!=k&&!y(b))for(f=b.call(d),d=[],b=0;!(e=f.next()).done;b++)d.push(e.value);h&&2<c&&(g=m(g,arguments[2],2));b=0;c=w(d.length);for(e=ja(this,c);c>b;b++)e[b]=h?g(d[b],b):d[b];return e},Ra=function(){for(var a=0,b=arguments.length,c=ja(this,b);b>a;)c[a]=arguments[a++];return c},Sa=!!U&&f(function(){ma.call(new U(1))}),xa=function(){return ma.apply(Sa?sa.call(F(this)):
            F(this),arguments)},ya={copyWithin:function(a,b){return M.call(F(this),a,b,2<arguments.length?arguments[2]:k)},every:function(a){return Ca(F(this),a,1<arguments.length?arguments[1]:k)},fill:function(a){return R.apply(F(this),arguments)},filter:function(a){return wa(this,ga(F(this),a,1<arguments.length?arguments[1]:k))},find:function(a){return Da(F(this),a,1<arguments.length?arguments[1]:k)},findIndex:function(a){return Ea(F(this),a,1<arguments.length?arguments[1]:k)},forEach:function(a){ea(F(this),
            a,1<arguments.length?arguments[1]:k)},indexOf:function(a){return Ga(F(this),a,1<arguments.length?arguments[1]:k)},includes:function(a){return Fa(F(this),a,1<arguments.length?arguments[1]:k)},join:function(a){return ra.apply(F(this),arguments)},lastIndexOf:function(a){return Ka.apply(F(this),arguments)},map:function(a){return Pa(F(this),a,1<arguments.length?arguments[1]:k)},reduce:function(a){return La.apply(F(this),arguments)},reduceRight:function(a){return Ma.apply(F(this),arguments)},reverse:function(){for(var a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  b=F(this).length,c=Math.floor(b/2),d=0;d<c;)a=this[d],this[d++]=this[--b],this[b]=a;return this},some:function(a){return da(F(this),a,1<arguments.length?arguments[1]:k)},sort:function(a){return Na.call(F(this),a)},subarray:function(a,b){var c=F(this),d=c.length,e=r(a,d);return new (Q(c,c[ia]))(c.buffer,c.byteOffset+e*c.BYTES_PER_ELEMENT,w((b===k?d:r(b,d))-e))}},za=function(a,b){return wa(this,sa.call(F(this),a,b))},Aa=function(a,b){F(this);var c=ka(b,1),d=this.length,e=I(a),f=w(e.length),g=0;if(f+
            c>d)throw S('Wrong length!');for(;g<f;)this[c+g]=e[g++]},la={entries:function(){return Ja.call(F(this))},keys:function(){return Ia.call(F(this))},values:function(){return Ha.call(F(this))}},Ba=function(a,b){return B(a)&&a[ca]&&'symbol'!==typeof b&&b in a&&String(+b)==String(b)},C=function(a,b){return Ba(a,b=t(b,!0))?p(2,a[b]):P(a,b)},E=function(a,b,c){return!(Ba(a,b=t(b,!0))&&B(c)&&u(c,'value'))||u(c,'get')||u(c,'set')||c.configurable||u(c,'writable')&&!c.writable||u(c,'enumerable')&&!c.enumerable?
            N(a,b,c):(a[b]=c.value,a)};h||(a.f=C,H.f=E);g(g.S+g.F*!h,'Object',{getOwnPropertyDescriptor:C,defineProperty:E});f(function(){fa.call({})})&&(fa=ma=function(){return ra.call(this)});var W=c({},ya);c(W,la);q(W,na,la.values);c(W,{slice:za,set:Aa,constructor:function(){},toString:fa,toLocaleString:xa});z(W,'buffer','b');z(W,'byteOffset','o');z(W,'byteLength','l');z(W,'length','e');N(W,ha,{get:function(){return this[ca]}});b.exports=function(a,b,c,h){h=!!h;var m=a+(h?'Clamped':'')+'Array',p='Uint8Array'!=
        m,r='get'+a,v='set'+a,t=e[m],u=t||{},x=t&&J(t);a={};var y=t&&t.prototype,z=function(a,c){N(a,c,{get:function(){var a=this._d;return a.v[r](c*b+a.o,ua)},set:function(a){var d=this._d;h&&(a=0>(a=Math.round(a))?0:255<a?255:255&a);d.v[v](c*b+d.o,a,ua)},enumerable:!0})};t&&l.ABV?Y(function(a){new t(null);new t(a)},!0)||(t=c(function(a,c,d,e){n(a,t,m);var f;return B(c)?c instanceof ba||'ArrayBuffer'==(f=A(c))||'SharedArrayBuffer'==f?e!==k?new u(c,ka(d,b),e):d!==k?new u(c,ka(d,b)):new u(c):ca in c?oa(t,
            c):pa.call(t,c):new u(va(c,p))}),ea(x!==Function.prototype?L(u).concat(L(x)):L(u),function(a){a in t||q(t,a,u[a])}),t.prototype=y,d||(y.constructor=t)):(t=c(function(a,c,d,e){n(a,t,m,'_d');var f,g,h=0,l=0;if(B(c)){if(!(c instanceof ba||'ArrayBuffer'==(f=A(c))||'SharedArrayBuffer'==f))return ca in c?oa(t,c):pa.call(t,c);f=c;l=ka(d,b);c=c.byteLength;if(e===k){if(c%b)throw S('Wrong length!');if(g=c-l,0>g)throw S('Wrong length!');}else if(g=w(e)*b,g+l>c)throw S('Wrong length!');e=g/b}else e=va(c,!0),
        g=e*b,f=new ba(g);for(q(a,'_d',{b:f,o:l,l:g,e:e,v:new Z(f)});h<e;)z(a,h++)}),y=t.prototype=V(W),q(y,'constructor',t));c=y[na];var x=!!c&&('values'==c.name||c.name==k),I=la.values;q(t,ta,!0);q(y,ca,m);q(y,Oa,!0);q(y,ia,t);(h?(new t(1))[ha]==m:ha in y)||N(y,ha,{get:function(){return m}});a[m]=t;g(g.G+g.W+g.F*(t!=u),a);g(g.S,m,{BYTES_PER_ELEMENT:b,from:pa,of:Ra});'BYTES_PER_ELEMENT'in y||q(y,'BYTES_PER_ELEMENT',b);g(g.P,m,ya);T(m);g(g.P+g.F*Qa,m,{set:Aa});g(g.P+g.F*!x,m,la);g(g.P+g.F*(y.toString!=fa),
        m,{toString:fa});g(g.P+g.F*f(function(){(new t(1)).slice()}),m,{slice:za});g(g.P+g.F*(f(function(){return[1,2].toLocaleString()!=(new t([1,2])).toLocaleString()})||!f(function(){y.toLocaleString.call([1,2])})),m,{toLocaleString:xa});X[m]=x?c:I;d||x||q(y,na,I)}}else b.exports=function(){}},function(b,c,a){a(236)('Uint8',1,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Uint8',1,function(a){return function(b,c,d){return a(this,b,c,d)}},!0)},function(b,c,a){a(236)('Int16',
        2,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Uint16',2,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Int32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Uint32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Float32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,c,a){a(236)('Float64',8,function(a){return function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             c,d){return a(this,b,c,d)}})},function(b,c,a){b=a(6);var d=a(34)(!0);b(b.P,'Array',{includes:function(a){return d(this,a,1<arguments.length?arguments[1]:k)}});a(178)('includes')},function(b,c,a){b=a(6);var d=a(125)(!0);b(b.P,'String',{at:function(a){return d(this,a)}})},function(b,c,a){b=a(6);var d=a(248);b(b.P,'String',{padStart:function(a){return d(this,a,1<arguments.length?arguments[1]:k,!0)}})},function(b,c,a){var d=a(35),e=a(85),f=a(33);b.exports=function(a,b,c,m){a=String(f(a));var g=a.length;
        c=c===k?' ':String(c);b=d(b);if(b<=g||''==c)return a;b-=g;g=e.call(c,Math.ceil(b/c.length));return g.length>b&&(g=g.slice(0,b)),m?g+a:a+g}},function(b,c,a){b=a(6);var d=a(248);b(b.P,'String',{padEnd:function(a){return d(this,a,1<arguments.length?arguments[1]:k,!1)}})},function(b,c,a){a(81)('trimLeft',function(a){return function(){return a(this,1)}},'trimStart')},function(b,c,a){a(81)('trimRight',function(a){return function(){return a(this,2)}},'trimEnd')},function(b,c,a){b=a(6);var d=a(33),e=a(35),
        f=a(128),g=a(188),l=RegExp.prototype,h=function(a,b){this._r=a;this._s=b};a(136)(h,'RegExp String',function(){var a=this._r.exec(this._s);return{value:a,done:null===a}});b(b.P,'String',{matchAll:function(a){if(d(this),!f(a))throw TypeError(a+' is not a regexp!');var b=String(this),c='flags'in l?String(a.flags):g.call(a),c=new RegExp(a.source,~c.indexOf('g')?c:'g'+c);return c.lastIndex=e(a.lastIndex),new h(c,b)}})},function(b,c,a){a(25)('asyncIterator')},function(b,c,a){a(25)('observable')},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c,a){b=a(6);var d=a(221),e=a(30),f=a(49),g=a(155);b(b.S,'Object',{getOwnPropertyDescriptors:function(a){var b;a=e(a);for(var c=f.f,l=d(a),k={},q=0;l.length>q;)g(k,b=l[q++],c(a,b));return k}})},function(b,c,a){b=a(6);var d=a(257)(!1);b(b.S,'Object',{values:function(a){return d(a)}})},function(b,c,a){var d=a(28),e=a(30),f=a(42).f;b.exports=function(a){return function(b){var c;b=e(b);for(var g=d(b),l=g.length,k=0,q=[];l>k;)f.call(b,c=g[k++])&&q.push(a?[c,b[c]]:b[c]);return q}}},function(b,c,a){b=a(6);
        var d=a(257)(!0);b(b.S,'Object',{entries:function(a){return d(a)}})},function(b,c,a){b=a(6);var d=a(56),e=a(19),f=a(9);a(4)&&b(b.P+a(260),'Object',{__defineGetter__:function(a,b){f.f(d(this),a,{get:e(b),enumerable:!0,configurable:!0})}})},function(b,c,a){b.exports=a(26)||!a(5)(function(){var b=Math.random();__defineSetter__.call(null,b,function(){});delete a(2)[b]})},function(b,c,a){b=a(6);var d=a(56),e=a(19),f=a(9);a(4)&&b(b.P+a(260),'Object',{__defineSetter__:function(a,b){f.f(d(this),a,{set:e(b),
        enumerable:!0,configurable:!0})}})},function(b,c,a){b=a(6);var d=a(56),e=a(14),f=a(57),g=a(49).f;a(4)&&b(b.P+a(260),'Object',{__lookupGetter__:function(a){var b=d(this),c=e(a,!0);do if(a=g(b,c))return a.get;while(b=f(b))}})},function(b,c,a){b=a(6);var d=a(56),e=a(14),f=a(57),g=a(49).f;a(4)&&b(b.P+a(260),'Object',{__lookupSetter__:function(a){var b=d(this),c=e(a,!0);do if(a=g(b,c))return a.set;while(b=f(b))}})},function(b,c,a){b=a(6);b(b.P+b.R,'Map',{toJSON:a(265)('Map')})},function(b,c,a){var d=a(73),
        e=a(266);b.exports=function(a){return function(){if(d(this)!=a)throw TypeError(a+"#toJSON isn't generic");return e(this)}}},function(b,c,a){var d=a(198);b.exports=function(a,b){var c=[];return d(a,!1,c.push,c,b),c}},function(b,c,a){b=a(6);b(b.P+b.R,'Set',{toJSON:a(265)('Set')})},function(b,c,a){b=a(6);b(b.S,'System',{global:a(2)})},function(b,c,a){b=a(6);var d=a(32);b(b.S,'Error',{isError:function(a){return'Error'===d(a)}})},function(b,c,a){b=a(6);b(b.S,'Math',{iaddh:function(a,b,c,g){a>>>=0;c>>>=
        0;return(b>>>0)+(g>>>0)+((a&c|(a|c)&~(a+c>>>0))>>>31)|0}})},function(b,c,a){b=a(6);b(b.S,'Math',{isubh:function(a,b,c,g){a>>>=0;c>>>=0;return(b>>>0)-(g>>>0)-((~a&c|~(a^c)&a-c>>>0)>>>31)|0}})},function(b,c,a){b=a(6);b(b.S,'Math',{imulh:function(a,b){var c=+a,d=+b,e=c&65535,h=d&65535,c=c>>16,d=d>>16,h=(c*h>>>0)+(e*h>>>16);return c*d+(h>>16)+((e*d>>>0)+(h&65535)>>16)}})},function(b,c,a){b=a(6);b(b.S,'Math',{umulh:function(a,b){var c=+a,d=+b,e=c&65535,h=d&65535,c=c>>>16,d=d>>>16,h=(c*h>>>0)+(e*h>>>16);
        return c*d+(h>>>16)+((e*d>>>0)+(h&65535)>>>16)}})},function(b,c,a){b=a(275);var d=a(10),e=b.key,f=b.set;b.exp({defineMetadata:function(a,b,c,k){f(a,b,d(c),e(k))}})},function(b,c,a){var d=a(203),e=a(6);c=a(21)('metadata');var f=c.store||(c.store=new (a(207))),g=function(a,b,c){var e=f.get(a);if(!e){if(!c)return k;f.set(a,e=new d)}a=e.get(b);if(!a){if(!c)return k;e.set(b,a=new d)}return a};b.exports={store:f,map:g,has:function(a,b,c){b=g(b,c,!1);return b!==k&&b.has(a)},get:function(a,b,c){b=g(b,c,!1);
        return b===k?k:b.get(a)},set:function(a,b,c,d){g(c,d,!0).set(a,b)},keys:function(a,b){var c=g(a,b,!1),d=[];return c&&c.forEach(function(a,b){d.push(b)}),d},key:function(a){return a===k||'symbol'===typeof a?a:String(a)},exp:function(a){e(e.S,'Reflect',a)}}},function(b,c,a){b=a(275);var d=a(10),e=b.key,f=b.map,g=b.store;b.exp({deleteMetadata:function(a,b){var c=3>arguments.length?k:e(arguments[2]),h=f(d(b),c,!1);if(h===k||!h['delete'](a))return!1;if(h.size)return!0;h=g.get(b);return h['delete'](c),
    !!h.size||g['delete'](b)}})},function(b,c,a){b=a(275);var d=a(10),e=a(57),f=b.has,g=b.get,l=b.key,h=function(a,b,c){if(f(a,b,c))return g(a,b,c);b=e(b);return null!==b?h(a,b,c):k};b.exp({getMetadata:function(a,b){return h(a,d(b),3>arguments.length?k:l(arguments[2]))}})},function(b,c,a){var d=a(206),e=a(266);b=a(275);var f=a(10),g=a(57),l=b.keys,h=b.key,m=function(a,b){var c=l(a,b),f=g(a);if(null===f)return c;f=m(f,b);return f.length?c.length?e(new d(c.concat(f))):f:c};b.exp({getMetadataKeys:function(a){return m(f(a),
        2>arguments.length?k:h(arguments[1]))}})},function(b,c,a){b=a(275);var d=a(10),e=b.get,f=b.key;b.exp({getOwnMetadata:function(a,b){return e(a,d(b),3>arguments.length?k:f(arguments[2]))}})},function(b,c,a){b=a(275);var d=a(10),e=b.keys,f=b.key;b.exp({getOwnMetadataKeys:function(a){return e(d(a),2>arguments.length?k:f(arguments[1]))}})},function(b,c,a){b=a(275);var d=a(10),e=a(57),f=b.has,g=b.key,l=function(a,b,c){if(f(a,b,c))return!0;b=e(b);return null!==b&&l(a,b,c)};b.exp({hasMetadata:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           b){return l(a,d(b),3>arguments.length?k:g(arguments[2]))}})},function(b,c,a){b=a(275);var d=a(10),e=b.has,f=b.key;b.exp({hasOwnMetadata:function(a,b){return e(a,d(b),3>arguments.length?k:f(arguments[2]))}})},function(b,c,a){b=a(275);var d=a(10),e=a(19),f=b.key,g=b.set;b.exp({metadata:function(a,b){return function(c,h){g(a,b,(h!==k?d:e)(c),f(h))}}})},function(b,c,a){b=a(6);var d=a(201)(),e=a(2).process,f='process'==a(32)(e);b(b.G,{asap:function(a){var b=f&&e.domain;d(b?b.bind(a):a)}})},function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              c,a){b=a(6);var d=a(2),e=a(7),f=a(201)(),g=a(23)('observable'),l=a(19),h=a(10),m=a(197);c=a(202);var n=a(8),p=a(198),q=p.RETURN,x=function(a){return null==a?k:l(a)},w=function(a){var b=a._c;b&&(a._c=k,b())},r=function(a,b){h(a);this._c=k;this._o=a;a=new t(this);try{var c=b(a),d=c;null!=c&&('function'===typeof c.unsubscribe?c=function(){d.unsubscribe()}:l(c),this._c=c)}catch(y){return void a.error(y)}this._o===k&&w(this)};r.prototype=c({},{unsubscribe:function(){this._o===k||(this._o=k,w(this))}});
        var t=function(a){this._s=a};t.prototype=c({},{next:function(a){var b=this._s;if(b._o!==k){var c=b._o;try{var d=x(c.next);if(d)return d.call(c,a)}catch(y){try{b._o===k||(b._o=k,w(b))}finally{throw y;}}}},error:function(a){var b=this._s;if(b._o===k)throw a;var c=b._o;b._o=k;try{var d=x(c.error);if(!d)throw a;a=d.call(c,a)}catch(y){try{w(b)}finally{throw y;}}return w(b),a},complete:function(a){var b=this._s;if(b._o!==k){var c=b._o;b._o=k;try{var d=x(c.complete);a=d?d.call(c,a):k}catch(y){try{w(b)}finally{throw y;
        }}return w(b),a}}});var u=function(a){m(this,u,'Observable','_f')._f=l(a)};c(u.prototype,{subscribe:function(a){return new r(a,this._f)},forEach:function(a){var b=this;return new (e.Promise||d.Promise)(function(c,d){l(a);var e=b.subscribe({next:function(b){try{return a(b)}catch(J){d(J),e.unsubscribe()}},error:d,complete:c})})}});c(u,{from:function(a){var b='function'===typeof this?this:u,c=x(h(a)[g]);if(c){var d=h(c.call(a));return d.constructor===b?d:new b(function(a){return d.subscribe(a)})}return new b(function(b){var c=
            !1;return f(function(){if(!c){try{if(p(a,!1,function(a){if(b.next(a),c)return q})===q)return}catch(J){if(c)throw J;return void b.error(J)}b.complete()}}),function(){c=!0}})},of:function(){for(var a=0,b=arguments.length,c=Array(b);a<b;)c[a]=arguments[a++];return new ('function'===typeof this?this:u)(function(a){var b=!1;return f(function(){if(!b){for(var d=0;d<c.length;++d)if(a.next(c[d]),b)return;a.complete()}}),function(){b=!0}})}});n(u.prototype,g,function(){return this});b(b.G,{Observable:u});
        a(186)('Observable')},function(b,c,a){b=a(6);a=a(200);b(b.G+b.B,{setImmediate:a.set,clearImmediate:a.clear})},function(b,c,a){b=a(183);c=a(16);var d=a(2),e=a(8),f=a(135),g=a(23);a=g('iterator');for(var g=g('toStringTag'),k=f.Array,h=['NodeList','DOMTokenList','MediaList','StyleSheetList','CSSRuleList'],m=0;5>m;m++){var n,p=h[m],q=d[p];if(q=q&&q.prototype)for(n in q[a]||e(q,a,k),q[g]||e(q,g,p),f[p]=k,b)q[n]||c(q,n,b[n],!0)}},function(b,c,a){b=a(2);c=a(6);var d=a(76),e=a(289);a=b.navigator;var f=!!a&&
        /MSIE .\./.test(a.userAgent);a=function(a){return f?function(b,c){return a(d(e,[].slice.call(arguments,2),'function'===typeof b?b:Function(b)),c)}:a};c(c.G+c.B+c.F*f,{setTimeout:a(b.setTimeout),setInterval:a(b.setInterval)})},function(b,c,a){var d=a(290),e=a(76),f=a(19);b.exports=function(){for(var a=f(this),b=arguments.length,c=Array(b),k=0,n=d._,p=!1;b>k;)(c[k]=arguments[k++])===n&&(p=!0);return function(){var d,f=arguments.length,g=0,h=0;if(!p&&!f)return e(a,c,this);if(d=c.slice(),p)for(;b>g;g++)d[g]===
    n&&(d[g]=arguments[h++]);for(;f>h;)d.push(arguments[h++]);return e(a,d,this)}}},function(b,c,a){b.exports=a(2)}]);'undefined'!==typeof module&&module.exports?module.exports=Z:'function'===typeof define&&define.amd?define(function(){return Z}):da.core=Z}(1,1);
/*
 AngularJS v1.4.4
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(E,s,X){'use strict';function sa(a,b,c){if(!a)throw ngMinErr("areq",b||"?",c||"required");return a}function ta(a,b){if(!a&&!b)return"";if(!a)return b;if(!b)return a;Y(a)&&(a=a.join(" "));Y(b)&&(b=b.join(" "));return a+" "+b}function Da(a){var b={};a&&(a.to||a.from)&&(b.to=a.to,b.from=a.from);return b}function U(a,b,c){var d="";a=Y(a)?a:a&&O(a)&&a.length?a.split(/\s+/):[];l(a,function(a,w){a&&0<a.length&&(d+=0<w?" ":"",d+=c?b+a:a+b)});return d}function Ea(a){if(a instanceof J)switch(a.length){case 0:return[];
case 1:if(1===a[0].nodeType)return a;break;default:return J(ia(a))}if(1===a.nodeType)return J(a)}function ia(a){if(!a[0])return a;for(var b=0;b<a.length;b++){var c=a[b];if(1==c.nodeType)return c}}function Fa(a,b,c){l(b,function(b){a.addClass(b,c)})}function Ga(a,b,c){l(b,function(b){a.removeClass(b,c)})}function R(a){return function(b,c){c.addClass&&(Fa(a,b,c.addClass),c.addClass=null);c.removeClass&&(Ga(a,b,c.removeClass),c.removeClass=null)}}function ha(a){a=a||{};if(!a.$$prepared){var b=a.domOperation||
G;a.domOperation=function(){a.$$domOperationFired=!0;b();b=G};a.$$prepared=!0}return a}function da(a,b){ua(a,b);va(a,b)}function ua(a,b){b.from&&(a.css(b.from),b.from=null)}function va(a,b){b.to&&(a.css(b.to),b.to=null)}function S(a,b,c){var d=(b.addClass||"")+" "+(c.addClass||""),e=(b.removeClass||"")+" "+(c.removeClass||"");a=Ha(a.attr("class"),d,e);c.preparationClasses&&(b.preparationClasses=V(c.preparationClasses,b.preparationClasses),delete c.preparationClasses);d=b.domOperation!==G?b.domOperation:
null;wa(b,c);d&&(b.domOperation=d);b.addClass=a.addClass?a.addClass:null;b.removeClass=a.removeClass?a.removeClass:null;return b}function Ha(a,b,c){function d(a){O(a)&&(a=a.split(" "));var b={};l(a,function(a){a.length&&(b[a]=!0)});return b}var e={};a=d(a);b=d(b);l(b,function(a,b){e[b]=1});c=d(c);l(c,function(a,b){e[b]=1===e[b]?null:-1});var w={addClass:"",removeClass:""};l(e,function(b,c){var d,e;1===b?(d="addClass",e=!a[c]):-1===b&&(d="removeClass",e=a[c]);e&&(w[d].length&&(w[d]+=" "),w[d]+=c)});
return w}function D(a){return a instanceof s.element?a[0]:a}function xa(a,b,c){var d="";b&&(d=U(b,"ng-",!0));c.addClass&&(d=V(d,U(c.addClass,"-add")));c.removeClass&&(d=V(d,U(c.removeClass,"-remove")));d.length&&(c.preparationClasses=d,a.addClass(d))}function $(a,b){var c=b?"-"+b+"s":"";ea(a,[fa,c]);return[fa,c]}function ja(a,b){var c=b?"paused":"",d=W+"PlayState";ea(a,[d,c]);return[d,c]}function ea(a,b){a.style[b[0]]=b[1]}function V(a,b){return a?b?a+" "+b:a:b}function ya(a,b,c){var d=Object.create(null),
e=a.getComputedStyle(b)||{};l(c,function(a,b){var c=e[a];if(c){var F=c.charAt(0);if("-"===F||"+"===F||0<=F)c=Ia(c);0===c&&(c=null);d[b]=c}});return d}function Ia(a){var b=0;a=a.split(/\s*,\s*/);l(a,function(a){"s"==a.charAt(a.length-1)&&(a=a.substring(0,a.length-1));a=parseFloat(a)||0;b=b?Math.max(a,b):a});return b}function ka(a){return 0===a||null!=a}function za(a,b){var c=K,d=a+"s";b?c+="Duration":d+=" linear all";return[c,d]}function Aa(){var a=Object.create(null);return{flush:function(){a=Object.create(null)},
count:function(b){return(b=a[b])?b.total:0},get:function(b){return(b=a[b])&&b.value},put:function(b,c){a[b]?a[b].total++:a[b]={total:1,value:c}}}}var G=s.noop,wa=s.extend,J=s.element,l=s.forEach,Y=s.isArray,O=s.isString,la=s.isObject,Ja=s.isUndefined,Ka=s.isDefined,Ba=s.isFunction,ma=s.isElement,K,na,W,oa;E.ontransitionend===X&&E.onwebkittransitionend!==X?(K="WebkitTransition",na="webkitTransitionEnd transitionend"):(K="transition",na="transitionend");E.onanimationend===X&&E.onwebkitanimationend!==
X?(W="WebkitAnimation",oa="webkitAnimationEnd animationend"):(W="animation",oa="animationend");var pa=W+"Delay",qa=W+"Duration",fa=K+"Delay";E=K+"Duration";var La={transitionDuration:E,transitionDelay:fa,transitionProperty:K+"Property",animationDuration:qa,animationDelay:pa,animationIterationCount:W+"IterationCount"},Ma={transitionDuration:E,transitionDelay:fa,animationDuration:qa,animationDelay:pa};s.module("ngAnimate",[]).provider("$$body",function(){this.$get=["$document",function(a){return J(a[0].body)}]}).directive("ngAnimateChildren",
[function(){return function(a,b,c){a=c.ngAnimateChildren;s.isString(a)&&0===a.length?b.data("$$ngAnimateChildren",!0):c.$observe("ngAnimateChildren",function(a){b.data("$$ngAnimateChildren","on"===a||"true"===a)})}}]).factory("$$rAFMutex",["$$rAF",function(a){return function(){var b=!1;a(function(){b=!0});return function(c){b?c():a(c)}}}]).factory("$$AnimateRunner",["$q","$$rAFMutex",function(a,b){function c(a){this.setHost(a);this._doneCallbacks=[];this._runInAnimationFrame=b();this._state=0}c.chain=
function(a,b){function c(){if(H===a.length)b(!0);else a[H](function(a){!1===a?b(!1):(H++,c())})}var H=0;c()};c.all=function(a,b){function c(w){u=u&&w;++H===a.length&&b(u)}var H=0,u=!0;l(a,function(a){a.done(c)})};c.prototype={setHost:function(a){this.host=a||{}},done:function(a){2===this._state?a():this._doneCallbacks.push(a)},progress:G,getPromise:function(){if(!this.promise){var b=this;this.promise=a(function(a,c){b.done(function(b){!1===b?c():a()})})}return this.promise},then:function(a,b){return this.getPromise().then(a,
b)},"catch":function(a){return this.getPromise()["catch"](a)},"finally":function(a){return this.getPromise()["finally"](a)},pause:function(){this.host.pause&&this.host.pause()},resume:function(){this.host.resume&&this.host.resume()},end:function(){this.host.end&&this.host.end();this._resolve(!0)},cancel:function(){this.host.cancel&&this.host.cancel();this._resolve(!1)},complete:function(a){var b=this;0===b._state&&(b._state=1,b._runInAnimationFrame(function(){b._resolve(a)}))},_resolve:function(a){2!==
this._state&&(l(this._doneCallbacks,function(b){b(a)}),this._doneCallbacks.length=0,this._state=2)}};return c}]).provider("$$animateQueue",["$animateProvider",function(a){function b(a,b,c,l){return d[a].some(function(a){return a(b,c,l)})}function c(a,b){a=a||{};var c=0<(a.addClass||"").length,d=0<(a.removeClass||"").length;return b?c&&d:c||d}var d=this.rules={skip:[],cancel:[],join:[]};d.join.push(function(a,b,d){return!b.structural&&c(b.options)});d.skip.push(function(a,b,d){return!b.structural&&
!c(b.options)});d.skip.push(function(a,b,c){return"leave"==c.event&&b.structural});d.skip.push(function(a,b,c){return c.structural&&2===c.state&&!b.structural});d.cancel.push(function(a,b,c){return c.structural&&b.structural});d.cancel.push(function(a,b,c){return 2===c.state&&b.structural});d.cancel.push(function(a,b,c){a=b.options;c=c.options;return a.addClass&&a.addClass===c.removeClass||a.removeClass&&a.removeClass===c.addClass});this.$get=["$$rAF","$rootScope","$rootElement","$document","$$body",
"$$HashMap","$$animation","$$AnimateRunner","$templateRequest","$$jqLite","$$forceReflow",function(d,w,H,u,F,B,N,z,Na,t,Oa){function s(a,b){var c=D(a),f=[],h=r[b];h&&l(h,function(a){a.node.contains(c)&&f.push(a.callback)});return f}function I(a,b,c,f){d(function(){l(s(b,a),function(a){a(b,c,f)})})}function n(a,h,m){function d(b,c,f,h){I(c,a,f,h);b.progress(c,f,h)}function r(b){var c=a,f=m;f.preparationClasses&&(c.removeClass(f.preparationClasses),f.preparationClasses=null);f.activeClasses&&(c.removeClass(f.activeClasses),
f.activeClasses=null);Ca(a,m);da(a,m);m.domOperation();q.complete(!b)}var g,n;if(a=Ea(a))g=D(a),n=a.parent();m=ha(m);var q=new z;Y(m.addClass)&&(m.addClass=m.addClass.join(" "));m.addClass&&!O(m.addClass)&&(m.addClass=null);Y(m.removeClass)&&(m.removeClass=m.removeClass.join(" "));m.removeClass&&!O(m.removeClass)&&(m.removeClass=null);m.from&&!la(m.from)&&(m.from=null);m.to&&!la(m.to)&&(m.to=null);if(!g)return r(),q;var e=[g.className,m.addClass,m.removeClass].join(" ");if(!A(e))return r(),q;var l=
0<=["enter","move","leave"].indexOf(h),F=!M||x.get(g),e=!F&&v.get(g)||{},t=!!e.state;F||t&&1==e.state||(F=!ca(a,n,h));if(F)return r(),q;l&&y(a);n={structural:l,element:a,event:h,close:r,options:m,runner:q};if(t){if(b("skip",a,n,e)){if(2===e.state)return r(),q;S(a,e.options,m);return e.runner}if(b("cancel",a,n,e))if(2===e.state)e.runner.end();else if(e.structural)e.close();else return S(a,e.options,n.options),e.runner;else if(b("join",a,n,e))if(2===e.state)S(a,m,{});else return xa(a,l?h:null,m),h=
n.event=e.event,m=S(a,e.options,n.options),e.runner}else S(a,m,{});(t=n.structural)||(t="animate"===n.event&&0<Object.keys(n.options.to||{}).length||c(n.options));if(!t)return r(),f(a),q;xa(a,l?h:null,m);$(g,9999);var B=(e.counter||0)+1;n.counter=B;k(a,1,n);w.$$postDigest(function(){var b=v.get(g),y=!b,b=b||{},A=0<(a.parent()||[]).length&&("animate"===b.event||b.structural||c(b.options));if(y||b.counter!==B||!A){y&&(Ca(a,m),da(a,m));if(y||l&&b.event!==h)m.domOperation(),q.end();A||f(a)}else h=!b.structural&&
c(b.options,!0)?"setClass":b.event,k(a,2),b=N(a,h,b.options,function(a){Oa();$(D(a),!1)}),b.done(function(b){r(!b);(b=v.get(g))&&b.counter===B&&f(D(a));d(q,h,"close",{})}),q.setHost(b),d(q,h,"start",{})});return q}function y(a){a=D(a).querySelectorAll("[data-ng-animate]");l(a,function(a){var b=parseInt(a.getAttribute("data-ng-animate")),c=v.get(a);switch(b){case 2:c.runner.end();case 1:c&&v.remove(a)}})}function f(a){a=D(a);a.removeAttribute("data-ng-animate");v.remove(a)}function g(a,b){return D(a)===
D(b)}function ca(a,b,c){c=g(a,F)||"HTML"===a[0].nodeName;var f=g(a,H),h=!1,r;for((a=a.data("$ngAnimatePin"))&&(b=a);b&&b.length;){f||(f=g(b,H));a=b[0];if(1!==a.nodeType)break;var d=v.get(a)||{};h||(h=d.structural||x.get(a));if(Ja(r)||!0===r)a=b.data("$$ngAnimateChildren"),Ka(a)&&(r=a);if(h&&!1===r)break;f||(f=g(b,H),f||(a=b.data("$ngAnimatePin"))&&(b=a));c||(c=g(b,F));b=b.parent()}return(!h||r)&&f&&c}function k(a,b,c){c=c||{};c.state=b;a=D(a);a.setAttribute("data-ng-animate",b);c=(b=v.get(a))?wa(b,
c):c;v.put(a,c)}var v=new B,x=new B,M=null,h=w.$watch(function(){return 0===Na.totalPendingRequests},function(a){a&&(h(),w.$$postDigest(function(){w.$$postDigest(function(){null===M&&(M=!0)})}))}),r={},q=a.classNameFilter(),A=q?function(a){return q.test(a)}:function(){return!0},Ca=R(t);return{on:function(a,b,c){b=ia(b);r[a]=r[a]||[];r[a].push({node:b,callback:c})},off:function(a,b,c){function f(a,b,c){var h=ia(b);return a.filter(function(a){return!(a.node===h&&(!c||a.callback===c))})}var h=r[a];h&&
(r[a]=1===arguments.length?null:f(h,b,c))},pin:function(a,b){sa(ma(a),"element","not an element");sa(ma(b),"parentElement","not an element");a.data("$ngAnimatePin",b)},push:function(a,b,c,f){c=c||{};c.domOperation=f;return n(a,b,c)},enabled:function(a,b){var c=arguments.length;if(0===c)b=!!M;else if(ma(a)){var f=D(a),h=x.get(f);1===c?b=!h:(b=!!b)?h&&x.remove(f):x.put(f,!0)}else b=M=!!a;return b}}}]}]).provider("$$animation",["$animateProvider",function(a){function b(a){return a.data("$$animationRunner")}
var c=this.drivers=[];this.$get=["$$jqLite","$rootScope","$injector","$$AnimateRunner","$$HashMap",function(a,e,w,H,u){function F(a){function b(a){if(a.processed)return a;a.processed=!0;var d=a.domNode,f=d.parentNode;e.put(d,a);for(var g;f;){if(g=e.get(f)){g.processed||(g=b(g));break}f=f.parentNode}(g||c).children.push(a);return a}var c={children:[]},d,e=new u;for(d=0;d<a.length;d++){var I=a[d];e.put(I.domNode,a[d]={domNode:I.domNode,fn:I.fn,children:[]})}for(d=0;d<a.length;d++)b(a[d]);return function(a){var b=
[],c=[],d;for(d=0;d<a.children.length;d++)c.push(a.children[d]);a=c.length;var e=0,k=[];for(d=0;d<c.length;d++){var v=c[d];0>=a&&(a=e,e=0,b=b.concat(k),k=[]);k.push(v.fn);l(v.children,function(a){e++;c.push(a)});a--}k.length&&(b=b.concat(k));return b}(c)}var B=[],N=R(a);return function(z,u,t,s){function G(a){a=a.hasAttribute("ng-animate-ref")?[a]:a.querySelectorAll("[ng-animate-ref]");var b=[];l(a,function(a){var c=a.getAttribute("ng-animate-ref");c&&c.length&&b.push(a)});return b}function I(a){var b=
[],c={};l(a,function(a,f){var h=D(a.element),d=0<=["enter","move"].indexOf(a.event),h=a.structural?G(h):[];if(h.length){var e=d?"to":"from";l(h,function(a){var b=a.getAttribute("ng-animate-ref");c[b]=c[b]||{};c[b][e]={animationID:f,element:J(a)}})}else b.push(a)});var f={},d={};l(c,function(c,e){var k=c.from,y=c.to;if(k&&y){var g=a[k.animationID],v=a[y.animationID],q=k.animationID.toString();if(!d[q]){var x=d[q]={beforeStart:function(){g.beforeStart();v.beforeStart()},close:function(){g.close();v.close()},
classes:n(g.classes,v.classes),from:g,to:v,anchors:[]};x.classes.length?b.push(x):(b.push(g),b.push(v))}d[q].anchors.push({out:k.element,"in":y.element})}else k=k?k.animationID:y.animationID,y=k.toString(),f[y]||(f[y]=!0,b.push(a[k]))});return b}function n(a,b){a=a.split(" ");b=b.split(" ");for(var c=[],f=0;f<a.length;f++){var d=a[f];if("ng-"!==d.substring(0,3))for(var k=0;k<b.length;k++)if(d===b[k]){c.push(d);break}}return c.join(" ")}function y(a,b){for(var f=c.length-1;0<=f;f--){var d=c[f];if(w.has(d)&&
(d=w.get(d)(a,b)))return d}}function f(a,c){a.from&&a.to?(b(a.from.element).setHost(c),b(a.to.element).setHost(c)):b(a.element).setHost(c)}function g(){var a=b(z);!a||"leave"===u&&t.$$domOperationFired||a.end()}function ca(b){z.off("$destroy",g);z.removeData("$$animationRunner");N(z,t);da(z,t);t.domOperation();M&&a.removeClass(z,M);z.removeClass("ng-animate");v.complete(!b)}t=ha(t);var k=0<=["enter","move","leave"].indexOf(u),v=new H({end:function(){ca()},cancel:function(){ca(!0)}});if(!c.length)return ca(),
v;z.data("$$animationRunner",v);var x=ta(z.attr("class"),ta(t.addClass,t.removeClass)),M=t.tempClasses;M&&(x+=" "+M,t.tempClasses=null);B.push({element:z,classes:x,event:u,structural:k,options:t,beforeStart:function(){z.addClass("ng-animate");M&&a.addClass(z,M)},close:ca});z.on("$destroy",g);if(1<B.length)return v;e.$$postDigest(function(){var a=[];l(B,function(c){var f=c.element;b(f)&&D(f).parentNode?a.push(c):c.close()});B.length=0;var c=I(a),d=[];l(c,function(a){d.push({domNode:D(a.from?a.from.element:
a.element),fn:function(){a.beforeStart();var c,d=a.close;if(b(a.anchors?a.from.element||a.to.element:a.element)){var h=y(a,s);h&&(c=h.start)}c?(c=c(),c.done(function(a){d(!a)}),f(a,c)):d()}})});l(F(d),function(a){a()})});return v}}]}]).provider("$animateCss",["$animateProvider",function(a){var b=Aa(),c=Aa();this.$get=["$window","$$jqLite","$$AnimateRunner","$timeout","$$forceReflow","$sniffer","$$rAF",function(a,e,w,H,u,F,B){function N(a,b){var c=a.parentNode;return(c.$$ngAnimateParentKey||(c.$$ngAnimateParentKey=
++E))+"-"+a.getAttribute("class")+"-"+b}function z(y,f,g,n){var k;0<b.count(g)&&(k=c.get(g),k||(f=U(f,"-stagger"),e.addClass(y,f),k=ya(a,y,n),k.animationDuration=Math.max(k.animationDuration,0),k.transitionDuration=Math.max(k.transitionDuration,0),e.removeClass(y,f),c.put(g,k)));return k||{}}function s(a){I&&I();n.push(a);I=B(function(){I=null;b.flush();c.flush();for(var a=u(),d=0;d<n.length;d++)n[d](a);n.length=0})}function t(c,f,e){f=b.get(e);f||(f=ya(a,c,La),"infinite"===f.animationIterationCount&&
(f.animationIterationCount=1));b.put(e,f);c=f;e=c.animationDelay;f=c.transitionDelay;c.maxDelay=e&&f?Math.max(e,f):e||f;c.maxDuration=Math.max(c.animationDuration*c.animationIterationCount,c.transitionDuration);return c}var G=R(e),E=0,I,n=[];return function(a,c){function d(){k()}function n(){k(!0)}function k(b){if(!(B||ra&&u)){B=!0;u=!1;c.$$skipPreparationClasses||e.removeClass(a,Z);e.removeClass(a,X);ja(h,!1);$(h,!1);l(r,function(a){h.style[a[0]]=""});G(a,c);da(a,c);if(c.onDone)c.onDone();m&&m.complete(!b)}}
function v(a){p.blockTransition&&$(h,a);p.blockKeyframeAnimation&&ja(h,!!a)}function x(){m=new w({end:d,cancel:n});k();return{$$willAnimate:!1,start:function(){return m},end:d}}function I(){function b(){if(!B){v(!1);l(r,function(a){h.style[a[0]]=a[1]});G(a,c);e.addClass(a,X);if(p.recalculateTimingStyles){ga=h.className+" "+Z;aa=N(h,ga);C=t(h,ga,aa);Q=C.maxDelay;J=Math.max(Q,0);L=C.maxDuration;if(0===L){k();return}p.hasTransitions=0<C.transitionDuration;p.hasAnimations=0<C.animationDuration}if(p.applyTransitionDelay||
p.applyAnimationDelay){Q="boolean"!==typeof c.delay&&ka(c.delay)?parseFloat(c.delay):Q;J=Math.max(Q,0);var g;p.applyTransitionDelay&&(C.transitionDelay=Q,g=[fa,Q+"s"],r.push(g),h.style[g[0]]=g[1]);p.applyAnimationDelay&&(C.animationDelay=Q,g=[pa,Q+"s"],r.push(g),h.style[g[0]]=g[1])}O=1E3*J;R=1E3*L;if(c.easing){var q=c.easing;p.hasTransitions&&(g=K+"TimingFunction",r.push([g,q]),h.style[g]=q);p.hasAnimations&&(g=W+"TimingFunction",r.push([g,q]),h.style[g]=q)}C.transitionDuration&&x.push(na);C.animationDuration&&
x.push(oa);n=Date.now();a.on(x.join(" "),m);H(d,O+1.5*R,!1);va(a,c)}}function d(){k()}function m(a){a.stopPropagation();var b=a.originalEvent||a;a=b.$manualTimeStamp||b.timeStamp||Date.now();b=parseFloat(b.elapsedTime.toFixed(3));Math.max(a-n,0)>=O&&b>=L&&(ra=!0,k())}if(!B)if(h.parentNode){var n,x=[],g=function(a){if(ra)u&&a&&(u=!1,k());else if(u=!a,C.animationDuration)if(a=ja(h,u),u)r.push(a);else{var b=r,c=b.indexOf(a);0<=a&&b.splice(c,1)}},q=0<V&&(C.transitionDuration&&0===T.transitionDuration||
C.animationDuration&&0===T.animationDuration)&&Math.max(T.animationDelay,T.transitionDelay);q?H(b,Math.floor(q*V*1E3),!1):b();E.resume=function(){g(!0)};E.pause=function(){g(!1)}}else k()}var h=D(a);if(!h||!h.parentNode)return x();c=ha(c);var r=[],q=a.attr("class"),A=Da(c),B,u,ra,m,E,J,O,L,R;if(0===c.duration||!F.animations&&!F.transitions)return x();var ba=c.event&&Y(c.event)?c.event.join(" "):c.event,S="",P="";ba&&c.structural?S=U(ba,"ng-",!0):ba&&(S=ba);c.addClass&&(P+=U(c.addClass,"-add"));c.removeClass&&
(P.length&&(P+=" "),P+=U(c.removeClass,"-remove"));c.applyClassesEarly&&P.length&&(G(a,c),P="");var Z=[S,P].join(" ").trim(),ga=q+" "+Z,X=U(Z,"-active"),q=A.to&&0<Object.keys(A.to).length;if(!(0<(c.keyframeStyle||"").length||q||Z))return x();var aa,T;0<c.stagger?(A=parseFloat(c.stagger),T={transitionDelay:A,animationDelay:A,transitionDuration:0,animationDuration:0}):(aa=N(h,ga),T=z(h,Z,aa,Ma));c.$$skipPreparationClasses||e.addClass(a,Z);c.transitionStyle&&(A=[K,c.transitionStyle],ea(h,A),r.push(A));
0<=c.duration&&(A=0<h.style[K].length,A=za(c.duration,A),ea(h,A),r.push(A));c.keyframeStyle&&(A=[W,c.keyframeStyle],ea(h,A),r.push(A));var V=T?0<=c.staggerIndex?c.staggerIndex:b.count(aa):0;(ba=0===V)&&!c.skipBlocking&&$(h,9999);var C=t(h,ga,aa),Q=C.maxDelay;J=Math.max(Q,0);L=C.maxDuration;var p={};p.hasTransitions=0<C.transitionDuration;p.hasAnimations=0<C.animationDuration;p.hasTransitionAll=p.hasTransitions&&"all"==C.transitionProperty;p.applyTransitionDuration=q&&(p.hasTransitions&&!p.hasTransitionAll||
p.hasAnimations&&!p.hasTransitions);p.applyAnimationDuration=c.duration&&p.hasAnimations;p.applyTransitionDelay=ka(c.delay)&&(p.applyTransitionDuration||p.hasTransitions);p.applyAnimationDelay=ka(c.delay)&&p.hasAnimations;p.recalculateTimingStyles=0<P.length;if(p.applyTransitionDuration||p.applyAnimationDuration)L=c.duration?parseFloat(c.duration):L,p.applyTransitionDuration&&(p.hasTransitions=!0,C.transitionDuration=L,A=0<h.style[K+"Property"].length,r.push(za(L,A))),p.applyAnimationDuration&&(p.hasAnimations=
!0,C.animationDuration=L,r.push([qa,L+"s"]));if(0===L&&!p.recalculateTimingStyles)return x();null==c.duration&&0<C.transitionDuration&&(p.recalculateTimingStyles=p.recalculateTimingStyles||ba);O=1E3*J;R=1E3*L;c.skipBlocking||(p.blockTransition=0<C.transitionDuration,p.blockKeyframeAnimation=0<C.animationDuration&&0<T.animationDelay&&0===T.animationDuration);ua(a,c);p.blockTransition||p.blockKeyframeAnimation?v(L):c.skipBlocking||$(h,!1);return{$$willAnimate:!0,end:d,start:function(){if(!B)return E=
{end:d,cancel:n,resume:null,pause:null},m=new w(E),s(I),m}}}}]}]).provider("$$animateCssDriver",["$$animationProvider",function(a){a.drivers.push("$$animateCssDriver");this.$get=["$animateCss","$rootScope","$$AnimateRunner","$rootElement","$$body","$sniffer","$$jqLite",function(a,c,d,e,w,H,u){function F(a){return a.replace(/\bng-\S+\b/g,"")}function B(a,b){O(a)&&(a=a.split(" "));O(b)&&(b=b.split(" "));return a.filter(function(a){return-1===b.indexOf(a)}).join(" ")}function N(c,e,u){function f(a){var b=
{},c=D(a).getBoundingClientRect();l(["width","height","top","left"],function(a){var d=c[a];switch(a){case "top":d+=t.scrollTop;break;case "left":d+=t.scrollLeft}b[a]=Math.floor(d)+"px"});return b}function g(){var c=F(u.attr("class")||""),d=B(c,v),c=B(v,c),d=a(k,{to:f(u),addClass:"ng-anchor-in "+d,removeClass:"ng-anchor-out "+c,delay:!0});return d.$$willAnimate?d:null}function N(){k.remove();e.removeClass("ng-animate-shim");u.removeClass("ng-animate-shim")}var k=J(D(e).cloneNode(!0)),v=F(k.attr("class")||
"");e.addClass("ng-animate-shim");u.addClass("ng-animate-shim");k.addClass("ng-anchor");E.append(k);var x;c=function(){var c=a(k,{addClass:"ng-anchor-out",delay:!0,from:f(e)});return c.$$willAnimate?c:null}();if(!c&&(x=g(),!x))return N();var M=c||x;return{start:function(){function a(){c&&c.end()}var b,c=M.start();c.done(function(){c=null;if(!x&&(x=g()))return c=x.start(),c.done(function(){c=null;N();b.complete()}),c;N();b.complete()});return b=new d({end:a,cancel:a})}}}function z(a,b,c,f){var e=s(a,
G),u=s(b,G),k=[];l(f,function(a){(a=N(c,a.out,a["in"]))&&k.push(a)});if(e||u||0!==k.length)return{start:function(){function a(){l(b,function(a){a.end()})}var b=[];e&&b.push(e.start());u&&b.push(u.start());l(k,function(a){b.push(a.start())});var c=new d({end:a,cancel:a});d.all(b,function(a){c.complete(a)});return c}}}function s(c,d){var e=c.element,f=c.options||{};f.$$skipPreparationClasses=!0;f.skipBlocking=!0;c.structural&&(f.event=c.event,"leave"===c.event&&(f.onDone=f.domOperation));d(e);K(e,f);
f.preparationClasses&&(f.event=V(f.event,f.preparationClasses));e=a(e,f);return e.$$willAnimate?e:null}if(!H.animations&&!H.transitions)return G;var t=D(w);c=D(e);var E=J(t.parentNode===c?t:c),K=R(u);return function(a,b){return a.from&&a.to?z(a.from,a.to,a.classes,a.anchors):s(a,b)}}]}]).provider("$$animateJs",["$animateProvider",function(a){this.$get=["$injector","$$AnimateRunner","$$rAFMutex","$$jqLite",function(b,c,d,e){function w(c){c=Y(c)?c:c.split(" ");for(var d=[],e={},l=0;l<c.length;l++){var w=
c[l],s=a.$$registeredAnimations[w];s&&!e[w]&&(d.push(b.get(s)),e[w]=!0)}return d}var s=R(e);return function(a,b,d,e){function z(){e.domOperation();s(a,e)}function D(a,b,d,e,f){switch(d){case "animate":b=[b,e.from,e.to,f];break;case "setClass":b=[b,J,I,f];break;case "addClass":b=[b,J,f];break;case "removeClass":b=[b,I,f];break;default:b=[b,f]}b.push(e);if(a=a.apply(a,b))if(Ba(a.start)&&(a=a.start()),a instanceof c)a.done(f);else if(Ba(a))return a;return G}function t(a,b,d,e,f){var g=[];l(e,function(e){var l=
e[f];l&&g.push(function(){var e,f,h=!1,g=function(a){h||(h=!0,(f||G)(a),e.complete(!a))};e=new c({end:function(){g()},cancel:function(){g(!0)}});f=D(l,a,b,d,function(a){g(!1===a)});return e})});return g}function E(a,b,d,e,f){var g=t(a,b,d,e,f);if(0===g.length){var q,n;"beforeSetClass"===f?(q=t(a,"removeClass",d,e,"beforeRemoveClass"),n=t(a,"addClass",d,e,"beforeAddClass")):"setClass"===f&&(q=t(a,"removeClass",d,e,"removeClass"),n=t(a,"addClass",d,e,"addClass"));q&&(g=g.concat(q));n&&(g=g.concat(n))}if(0!==
g.length)return function(a){var b=[];g.length&&l(g,function(a){b.push(a())});b.length?c.all(b,a):a();return function(a){l(b,function(b){a?b.cancel():b.end()})}}}3===arguments.length&&la(d)&&(e=d,d=null);e=ha(e);d||(d=a.attr("class")||"",e.addClass&&(d+=" "+e.addClass),e.removeClass&&(d+=" "+e.removeClass));var J=e.addClass,I=e.removeClass,n=w(d),y,f;if(n.length){var g,K;"leave"==b?(K="leave",g="afterLeave"):(K="before"+b.charAt(0).toUpperCase()+b.substr(1),g=b);"enter"!==b&&"move"!==b&&(y=E(a,b,e,
n,K));f=E(a,b,e,n,g)}if(y||f)return{start:function(){function b(c){l=!0;z();da(a,e);h.complete(c)}var d,g=[];y&&g.push(function(a){d=y(a)});g.length?g.push(function(a){z();a(!0)}):z();f&&g.push(function(a){d=f(a)});var l=!1,h=new c({end:function(){l||((d||G)(void 0),b(void 0))},cancel:function(){l||((d||G)(!0),b(!0))}});c.chain(g,b);return h}}}}]}]).provider("$$animateJsDriver",["$$animationProvider",function(a){a.drivers.push("$$animateJsDriver");this.$get=["$$animateJs","$$AnimateRunner",function(a,
c){function d(c){return a(c.element,c.event,c.classes,c.options)}return function(a){if(a.from&&a.to){var b=d(a.from),s=d(a.to);if(b||s)return{start:function(){function a(){return function(){l(d,function(a){a.end()})}}var d=[];b&&d.push(b.start());s&&d.push(s.start());c.all(d,function(a){e.complete(a)});var e=new c({end:a(),cancel:a()});return e}}}else return d(a)}}]}])})(window,window.angular);
//# sourceMappingURL=angular-animate.min.js.map

/*!
 * angularjs-breakpoint v0.0.1
 *
 * BREAKPOINT DIRECTIVE FOR RESPONSIVE WEBSITES
 *
 *  http://snapjay.github.com/angularjs-breakpoint/
 *  Apply as a attribute of the body tag. Set
 *  breakpoint="{1250:'break1250', 1000:'break1000',1120:'break1120'}
 *
 *  Values are available on scope as
 *  {{breakpoint.class}} = current set class
 *  {{breakpoint.windowSize}} = current width of window
 */
var breakpointApp=angular.module("breakpointApp",[]);breakpointApp.directive('breakpoint',['$window','$rootScope',function($window,$rootScope){return{restrict:"A",link:function(scope,element,attr){scope.breakpoint={class:'',windowSize:$window.innerWidth};var breakpoints=(scope.$eval(attr.breakpoint));var firstTime=true;angular.element($window).bind('resize',setWindowSize);scope.$watch('breakpoint.windowSize',function(windowWidth,oldValue){setClass(windowWidth)});scope.$watch('breakpoint.class',function(newClass,oldClass){if(newClass!=oldClass||firstTime){broadcastEvent(oldClass);firstTime=false}});function broadcastEvent(oldClass){$rootScope.$broadcast('breakpointChange',scope.breakpoint,oldClass)}function setWindowSize(){scope.breakpoint.windowSize=$window.innerWidth;if(!scope.$$phase)scope.$apply()}function setClass(windowWidth){var setClass=breakpoints[Object.keys(breakpoints)[0]];for(var breakpoint in breakpoints){if(breakpoint<windowWidth)setClass=breakpoints[breakpoint];element.removeClass(breakpoints[breakpoint])}element.addClass(setClass);scope.breakpoint.class=setClass;if(!scope.$$phase)scope.$apply()}}}}]);
/*
 AngularJS v1.4.4
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,g,l){'use strict';function m(b,a,f){var c=f.baseHref(),k=b[0];return function(b,d,e){var f,h;e=e||{};h=e.expires;f=g.isDefined(e.path)?e.path:c;d===l&&(h="Thu, 01 Jan 1970 00:00:00 GMT",d="");g.isString(h)&&(h=new Date(h));d=encodeURIComponent(b)+"="+encodeURIComponent(d);d=d+(f?";path="+f:"")+(e.domain?";domain="+e.domain:"");d+=h?";expires="+h.toUTCString():"";d+=e.secure?";secure":"";e=d.length+1;4096<e&&a.warn("Cookie '"+b+"' possibly not set or overflowed because it was too large ("+
e+" > 4096 bytes)!");k.cookie=d}}g.module("ngCookies",["ng"]).provider("$cookies",[function(){var b=this.defaults={};this.$get=["$$cookieReader","$$cookieWriter",function(a,f){return{get:function(c){return a()[c]},getObject:function(c){return(c=this.get(c))?g.fromJson(c):c},getAll:function(){return a()},put:function(c,a,n){f(c,a,n?g.extend({},b,n):b)},putObject:function(c,b,a){this.put(c,g.toJson(b),a)},remove:function(a,k){f(a,l,k?g.extend({},b,k):b)}}}]}]);g.module("ngCookies").factory("$cookieStore",
["$cookies",function(b){return{get:function(a){return b.getObject(a)},put:function(a,f){b.putObject(a,f)},remove:function(a){b.remove(a)}}}]);m.$inject=["$document","$log","$browser"];g.module("ngCookies").provider("$$cookieWriter",function(){this.$get=m})})(window,window.angular);
//# sourceMappingURL=angular-cookies.min.js.map

/*
 AngularJS v1.4.4
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(x,s,y){'use strict';function t(f,k,p){n.directive(f,["$parse","$swipe",function(c,e){return function(l,m,g){function h(a){if(!b)return!1;var d=Math.abs(a.y-b.y);a=(a.x-b.x)*k;return r&&75>d&&0<a&&30<a&&.3>d/a}var d=c(g[f]),b,r,a=["touch"];s.isDefined(g.ngSwipeDisableMouse)||a.push("mouse");e.bind(m,{start:function(a,d){b=a;r=!0},cancel:function(a){r=!1},end:function(a,b){h(a)&&l.$apply(function(){m.triggerHandler(p);d(l,{$event:b})})}},a)}}])}var n=s.module("ngTouch",[]);n.factory("$swipe",
[function(){function f(c){c=c.originalEvent||c;var e=c.touches&&c.touches.length?c.touches:[c];c=c.changedTouches&&c.changedTouches[0]||e[0];return{x:c.clientX,y:c.clientY}}function k(c,e){var l=[];s.forEach(c,function(c){(c=p[c][e])&&l.push(c)});return l.join(" ")}var p={mouse:{start:"mousedown",move:"mousemove",end:"mouseup"},touch:{start:"touchstart",move:"touchmove",end:"touchend",cancel:"touchcancel"}};return{bind:function(c,e,l){var m,g,h,d,b=!1;l=l||["mouse","touch"];c.on(k(l,"start"),function(a){h=
f(a);b=!0;g=m=0;d=h;e.start&&e.start(h,a)});var r=k(l,"cancel");if(r)c.on(r,function(a){b=!1;e.cancel&&e.cancel(a)});c.on(k(l,"move"),function(a){if(b&&h){var c=f(a);m+=Math.abs(c.x-d.x);g+=Math.abs(c.y-d.y);d=c;10>m&&10>g||(g>m?(b=!1,e.cancel&&e.cancel(a)):(a.preventDefault(),e.move&&e.move(c,a)))}});c.on(k(l,"end"),function(a){b&&(b=!1,e.end&&e.end(f(a),a))})}}}]);n.config(["$provide",function(f){f.decorator("ngClickDirective",["$delegate",function(k){k.shift();return k}])}]);n.directive("ngClick",
["$parse","$timeout","$rootElement",function(f,k,p){function c(d,b,c){for(var a=0;a<d.length;a+=2){var e=d[a+1],g=c;if(25>Math.abs(d[a]-b)&&25>Math.abs(e-g))return d.splice(a,a+2),!0}return!1}function e(d){if(!(2500<Date.now()-m)){var b=d.touches&&d.touches.length?d.touches:[d],e=b[0].clientX,b=b[0].clientY;if(!(1>e&&1>b||h&&h[0]===e&&h[1]===b)){h&&(h=null);var a=d.target;"label"===s.lowercase(a.nodeName||a[0]&&a[0].nodeName)&&(h=[e,b]);c(g,e,b)||(d.stopPropagation(),d.preventDefault(),d.target&&
d.target.blur&&d.target.blur())}}}function l(d){d=d.touches&&d.touches.length?d.touches:[d];var b=d[0].clientX,c=d[0].clientY;g.push(b,c);k(function(){for(var a=0;a<g.length;a+=2)if(g[a]==b&&g[a+1]==c){g.splice(a,a+2);break}},2500,!1)}var m,g,h;return function(d,b,h){var a=f(h.ngClick),k=!1,q,n,t,v;b.on("touchstart",function(a){k=!0;q=a.target?a.target:a.srcElement;3==q.nodeType&&(q=q.parentNode);b.addClass("ng-click-active");n=Date.now();a=a.originalEvent||a;a=(a.touches&&a.touches.length?a.touches:
[a])[0];t=a.clientX;v=a.clientY});b.on("touchcancel",function(a){k=!1;b.removeClass("ng-click-active")});b.on("touchend",function(a){var d=Date.now()-n,f=a.originalEvent||a,u=(f.changedTouches&&f.changedTouches.length?f.changedTouches:f.touches&&f.touches.length?f.touches:[f])[0],f=u.clientX,u=u.clientY,w=Math.sqrt(Math.pow(f-t,2)+Math.pow(u-v,2));k&&750>d&&12>w&&(g||(p[0].addEventListener("click",e,!0),p[0].addEventListener("touchstart",l,!0),g=[]),m=Date.now(),c(g,f,u),q&&q.blur(),s.isDefined(h.disabled)&&
!1!==h.disabled||b.triggerHandler("click",[a]));k=!1;b.removeClass("ng-click-active")});b.onclick=function(a){};b.on("click",function(b,c){d.$apply(function(){a(d,{$event:c||b})})});b.on("mousedown",function(a){b.addClass("ng-click-active")});b.on("mousemove mouseup",function(a){b.removeClass("ng-click-active")})}}]);t("ngSwipeLeft",-1,"swipeleft");t("ngSwipeRight",1,"swiperight")})(window,window.angular);
//# sourceMappingURL=angular-touch.min.js.map

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./content/jcr_root/apps/clientlibs/fmmp-base/libs/polyfills/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./content/jcr_root/apps/clientlibs/fmmp-base/libs/polyfills/src/index.js":
/*!********************************************************************************!*\
  !*** ./content/jcr_root/apps/clientlibs/fmmp-base/libs/polyfills/src/index.js ***!
  \********************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_es7_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/es7/promise */ "./node_modules/core-js/es7/promise.js");
/* harmony import */ var core_js_es7_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_es7_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_es6_number__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/es6/number */ "./node_modules/core-js/es6/number.js");
/* harmony import */ var core_js_es6_number__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_es6_number__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_fn_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/fn/symbol/iterator.js */ "./node_modules/core-js/fn/symbol/iterator.js");
/* harmony import */ var core_js_fn_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_fn_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! intersection-observer */ "./node_modules/intersection-observer/intersection-observer.js");
/* harmony import */ var intersection_observer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(intersection_observer__WEBPACK_IMPORTED_MODULE_3__);



 // Needed by Ag-grid table to correcty be rendered in IE11

Document.prototype.contains = function contains(node) {
  if (!(0 in arguments)) {
    throw new TypeError("1 argument is required");
  }

  do {
    if (this === node) {
      return true;
    }
  } while (node = node && node.parentNode);

  return false;
};

/***/ }),

/***/ "./node_modules/core-js/es6/number.js":
/*!********************************************!*\
  !*** ./node_modules/core-js/es6/number.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/es6.number.constructor */ "./node_modules/core-js/modules/es6.number.constructor.js");
__webpack_require__(/*! ../modules/es6.number.to-fixed */ "./node_modules/core-js/modules/es6.number.to-fixed.js");
__webpack_require__(/*! ../modules/es6.number.to-precision */ "./node_modules/core-js/modules/es6.number.to-precision.js");
__webpack_require__(/*! ../modules/es6.number.epsilon */ "./node_modules/core-js/modules/es6.number.epsilon.js");
__webpack_require__(/*! ../modules/es6.number.is-finite */ "./node_modules/core-js/modules/es6.number.is-finite.js");
__webpack_require__(/*! ../modules/es6.number.is-integer */ "./node_modules/core-js/modules/es6.number.is-integer.js");
__webpack_require__(/*! ../modules/es6.number.is-nan */ "./node_modules/core-js/modules/es6.number.is-nan.js");
__webpack_require__(/*! ../modules/es6.number.is-safe-integer */ "./node_modules/core-js/modules/es6.number.is-safe-integer.js");
__webpack_require__(/*! ../modules/es6.number.max-safe-integer */ "./node_modules/core-js/modules/es6.number.max-safe-integer.js");
__webpack_require__(/*! ../modules/es6.number.min-safe-integer */ "./node_modules/core-js/modules/es6.number.min-safe-integer.js");
__webpack_require__(/*! ../modules/es6.number.parse-float */ "./node_modules/core-js/modules/es6.number.parse-float.js");
__webpack_require__(/*! ../modules/es6.number.parse-int */ "./node_modules/core-js/modules/es6.number.parse-int.js");
module.exports = __webpack_require__(/*! ../modules/_core */ "./node_modules/core-js/modules/_core.js").Number;


/***/ }),

/***/ "./node_modules/core-js/es7/promise.js":
/*!*********************************************!*\
  !*** ./node_modules/core-js/es7/promise.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../modules/es7.promise.finally */ "./node_modules/core-js/modules/es7.promise.finally.js");
__webpack_require__(/*! ../modules/es7.promise.try */ "./node_modules/core-js/modules/es7.promise.try.js");
module.exports = __webpack_require__(/*! ../modules/_core */ "./node_modules/core-js/modules/_core.js").Promise;


/***/ }),

/***/ "./node_modules/core-js/fn/symbol/iterator.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/fn/symbol/iterator.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/core-js/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/web.dom.iterable */ "./node_modules/core-js/modules/web.dom.iterable.js");
module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ "./node_modules/core-js/modules/_wks-ext.js").f('iterator');


/***/ }),

/***/ "./node_modules/core-js/modules/_a-function.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_a-function.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_a-number-value.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_a-number-value.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_add-to-unscopables.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_add-to-unscopables.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_an-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_an-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_array-includes.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_array-includes.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/core-js/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_cof.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_cof.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_core.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_core.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_ctx.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_ctx.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_defined.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_defined.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_descriptors.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_descriptors.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_dom-create.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_dom-create.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/modules/_enum-bug-keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_enum-bug-keys.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "./node_modules/core-js/modules/_export.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_export.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/core-js/modules/_fails.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_fails.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_function-to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_function-to-string.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('native-function-to-string', Function.toString);


/***/ }),

/***/ "./node_modules/core-js/modules/_global.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_global.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_has.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_has.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_hide.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_hide.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_html.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_html.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/modules/_ie8-dom-define.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_ie8-dom-define.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_inherit-if-required.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_inherit-if-required.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var setPrototypeOf = __webpack_require__(/*! ./_set-proto */ "./node_modules/core-js/modules/_set-proto.js").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iobject.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_iobject.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-integer.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-integer.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-create.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-create.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/modules/_object-create.js");
var descriptor = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-define.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-define.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var $iterCreate = __webpack_require__(/*! ./_iter-create */ "./node_modules/core-js/modules/_iter-create.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js");
var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/modules/_object-gpo.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-step.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-step.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iterators.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iterators.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/modules/_library.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_library.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/modules/_new-promise-capability.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/_new-promise-capability.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-create.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_object-create.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "./node_modules/core-js/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-dp.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dp.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-dps.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dps.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopd.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopd.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/modules/_object-pie.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/modules/_ie8-dom-define.js");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopn.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopn.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/modules/_object-keys-internal.js");
var hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gpo.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gpo.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys-internal.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys-internal.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-pie.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-pie.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/modules/_parse-float.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_parse-float.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").parseFloat;
var $trim = __webpack_require__(/*! ./_string-trim */ "./node_modules/core-js/modules/_string-trim.js").trim;

module.exports = 1 / $parseFloat(__webpack_require__(/*! ./_string-ws */ "./node_modules/core-js/modules/_string-ws.js") + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),

/***/ "./node_modules/core-js/modules/_parse-int.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_parse-int.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").parseInt;
var $trim = __webpack_require__(/*! ./_string-trim */ "./node_modules/core-js/modules/_string-trim.js").trim;
var ws = __webpack_require__(/*! ./_string-ws */ "./node_modules/core-js/modules/_string-ws.js");
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;


/***/ }),

/***/ "./node_modules/core-js/modules/_perform.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_perform.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_promise-resolve.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/_promise-resolve.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/core-js/modules/_new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_property-desc.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_property-desc.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_redefine.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var SRC = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js")('src');
var $toString = __webpack_require__(/*! ./_function-to-string */ "./node_modules/core-js/modules/_function-to-string.js");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "./node_modules/core-js/modules/_set-proto.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_set-proto.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js")(Function.call, __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/modules/_object-gopd.js").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "./node_modules/core-js/modules/_set-to-string-tag.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_set-to-string-tag.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f;
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_shared-key.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_shared-key.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_shared.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_shared.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/modules/_species-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_species-constructor.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-at.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_string-at.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-repeat.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_string-repeat.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-trim.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_string-trim.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var spaces = __webpack_require__(/*! ./_string-ws */ "./node_modules/core-js/modules/_string-ws.js");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "./node_modules/core-js/modules/_string-ws.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_string-ws.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "./node_modules/core-js/modules/_to-absolute-index.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_to-absolute-index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-integer.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-integer.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-iobject.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-iobject.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-length.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-length.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-object.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-primitive.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_to-primitive.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/modules/_uid.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_uid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_wks-ext.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_wks-ext.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js");


/***/ }),

/***/ "./node_modules/core-js/modules/_wks.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_wks.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js");
var Symbol = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.iterator.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/modules/_add-to-unscopables.js");
var step = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/modules/_iter-step.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/modules/_iter-define.js")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.constructor.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.constructor.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
var inheritIfRequired = __webpack_require__(/*! ./_inherit-if-required */ "./node_modules/core-js/modules/_inherit-if-required.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var gOPN = __webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/modules/_object-gopn.js").f;
var gOPD = __webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/modules/_object-gopd.js").f;
var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f;
var $trim = __webpack_require__(/*! ./_string-trim */ "./node_modules/core-js/modules/_string-trim.js").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__(/*! ./_object-create */ "./node_modules/core-js/modules/_object-create.js")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js")(global, NUMBER, $Number);
}


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.epsilon.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.epsilon.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.is-finite.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.is-finite.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var _isFinite = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.is-integer.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.is-integer.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");

$export($export.S, 'Number', { isInteger: __webpack_require__(/*! ./_is-integer */ "./node_modules/core-js/modules/_is-integer.js") });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.is-nan.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.is-nan.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.is-safe-integer.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.is-safe-integer.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var isInteger = __webpack_require__(/*! ./_is-integer */ "./node_modules/core-js/modules/_is-integer.js");
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.max-safe-integer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.max-safe-integer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.min-safe-integer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.min-safe-integer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.parse-float.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.parse-float.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $parseFloat = __webpack_require__(/*! ./_parse-float */ "./node_modules/core-js/modules/_parse-float.js");
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.parse-int.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.parse-int.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $parseInt = __webpack_require__(/*! ./_parse-int */ "./node_modules/core-js/modules/_parse-int.js");
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.to-fixed.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.to-fixed.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var aNumberValue = __webpack_require__(/*! ./_a-number-value */ "./node_modules/core-js/modules/_a-number-value.js");
var repeat = __webpack_require__(/*! ./_string-repeat */ "./node_modules/core-js/modules/_string-repeat.js");
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.number.to-precision.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.number.to-precision.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var aNumberValue = __webpack_require__(/*! ./_a-number-value */ "./node_modules/core-js/modules/_a-number-value.js");
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.string.iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.string.iterator.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/modules/_iter-define.js")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/core-js/modules/es7.promise.finally.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es7.promise.finally.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ "./node_modules/core-js/modules/_species-constructor.js");
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ "./node_modules/core-js/modules/_promise-resolve.js");

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ "./node_modules/core-js/modules/es7.promise.try.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es7.promise.try.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/core-js/modules/_new-promise-capability.js");
var perform = __webpack_require__(/*! ./_perform */ "./node_modules/core-js/modules/_perform.js");

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom.iterable.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom.iterable.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(/*! ./es6.array.iterator */ "./node_modules/core-js/modules/es6.array.iterator.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/modules/_object-keys.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var wks = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "./node_modules/intersection-observer/intersection-observer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/intersection-observer/intersection-observer.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */

(function(window, document) {
'use strict';


// Exits early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}


/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = entry.rootBounds;
  this.boundingClientRect = entry.boundingClientRect;
  this.intersectionRect = entry.intersectionRect || getEmptyRect();
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (options.root && options.root.nodeType != 1) {
    throw new Error('root must be an Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections();
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {

    return item.element != target;
  });
  if (!this._observationTargets.length) {
    this._unmonitorIntersections();
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function() {
  if (!this._monitoringIntersections) {
    this._monitoringIntersections = true;

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      this._monitoringInterval = setInterval(
          this._checkForIntersections, this.POLL_INTERVAL);
    }
    else {
      addEvent(window, 'resize', this._checkForIntersections, true);
      addEvent(document, 'scroll', this._checkForIntersections, true);

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
        this._domObserver = new MutationObserver(this._checkForIntersections);
        this._domObserver.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function() {
  if (this._monitoringIntersections) {
    this._monitoringIntersections = false;

    clearInterval(this._monitoringInterval);
    this._monitoringInterval = null;

    removeEvent(window, 'resize', this._checkForIntersections, true);
    removeEvent(document, 'scroll', this._checkForIntersections, true);

    if (this._domObserver) {
      this._domObserver.disconnect();
      this._domObserver = null;
    }
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, rootRect);

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: rootRect,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, rootRect) {

  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var targetRect = getBoundingClientRect(target);
  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return;

    if (parent == this.root || parent == document) {
      atRoot = true;
      parentRect = rootRect;
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      if (parent != document.body &&
          parent != document.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);

      if (!intersectionRect) break;
    }
    parent = getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {Object} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var html = document.documentElement;
    var body = document.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {Object} rect The rect object to expand.
 * @return {Object} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  return containsDeep(this.root || document, target);
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object} The intersection rect or undefined if no intersection
 *     is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  };
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {Object} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {Object} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}

/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }
  return parent;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}(window, document));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY29udGVudC9qY3Jfcm9vdC9hcHBzL2NsaWVudGxpYnMvZm1tcC1iYXNlL2xpYnMvcG9seWZpbGxzL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9lczYvbnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzNy9wcm9taXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2EtbnVtYmVyLXZhbHVlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY3R4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mYWlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hhcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW5oZXJpdC1pZi1yZXF1aXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWludGVnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BhcnNlLWZsb2F0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BhcnNlLWludC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wZXJmb3JtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1wcm90by5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctcmVwZWF0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy10cmltLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy13cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1leHQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuZXBzaWxvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtZmluaXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1pbnRlZ2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1uYW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLXNhZmUtaW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIubWF4LXNhZmUtaW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIubWluLXNhZmUtaW50ZWdlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIucGFyc2UtZmxvYXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLnBhcnNlLWludC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIudG8tZml4ZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLnRvLXByZWNpc2lvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcucHJvbWlzZS5maW5hbGx5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnByb21pc2UudHJ5LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaW50ZXJzZWN0aW9uLW9ic2VydmVyL2ludGVyc2VjdGlvbi1vYnNlcnZlci5qcyJdLCJuYW1lcyI6WyJEb2N1bWVudCIsInByb3RvdHlwZSIsImNvbnRhaW5zIiwibm9kZSIsImFyZ3VtZW50cyIsIlR5cGVFcnJvciIsInBhcmVudE5vZGUiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFD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QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEIsV0FBVyxLQUFLO0FBQ2hCLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEIsWUFBWSxVQUFVO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDIiwiZmlsZSI6Ii4vY29udGVudC9qY3Jfcm9vdC9hcHBzL2NsaWVudGxpYnMvZm1tcC1iYXNlL2xpYnMvcG9seWZpbGxzL2J1aWxkL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2NvbnRlbnQvamNyX3Jvb3QvYXBwcy9jbGllbnRsaWJzL2ZtbXAtYmFzZS9saWJzL3BvbHlmaWxscy9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgXCJjb3JlLWpzL2VzNy9wcm9taXNlXCI7XG5pbXBvcnQgXCJjb3JlLWpzL2VzNi9udW1iZXJcIjtcbmltcG9ydCBcImNvcmUtanMvZm4vc3ltYm9sL2l0ZXJhdG9yLmpzXCI7XG5pbXBvcnQgXCJpbnRlcnNlY3Rpb24tb2JzZXJ2ZXJcIjtcblxuLy8gTmVlZGVkIGJ5IEFnLWdyaWQgdGFibGUgdG8gY29ycmVjdHkgYmUgcmVuZGVyZWQgaW4gSUUxMVxuRG9jdW1lbnQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMobm9kZSkge1xuICAgIGlmICghKDAgaW4gYXJndW1lbnRzKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiMSBhcmd1bWVudCBpcyByZXF1aXJlZFwiKTtcbiAgICB9XG5cbiAgICBkbyB7XG4gICAgICAgIGlmICh0aGlzID09PSBub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKChub2RlID0gbm9kZSAmJiBub2RlLnBhcmVudE5vZGUpKTtcblxuICAgIHJldHVybiBmYWxzZTtcbn07XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm51bWJlci50by1maXhlZCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubnVtYmVyLnRvLXByZWNpc2lvbicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubnVtYmVyLmVwc2lsb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm51bWJlci5pcy1pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5udW1iZXIuaXMtbmFuJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5udW1iZXIuaXMtc2FmZS1pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5udW1iZXIubWF4LXNhZmUtaW50ZWdlcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubnVtYmVyLm1pbi1zYWZlLWludGVnZXInKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm51bWJlci5wYXJzZS1mbG9hdCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYubnVtYmVyLnBhcnNlLWludCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuTnVtYmVyO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS5maW5hbGx5Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5wcm9taXNlLnRyeScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIG1zZykge1xuICBpZiAodHlwZW9mIGl0ICE9ICdudW1iZXInICYmIGNvZihpdCkgIT0gJ051bWJlcicpIHRocm93IFR5cGVFcnJvcihtc2cpO1xuICByZXR1cm4gK2l0O1xufTtcbiIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vX3drcycpKCd1bnNjb3BhYmxlcycpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5pZiAoQXJyYXlQcm90b1tVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKSByZXF1aXJlKCcuL19oaWRlJykoQXJyYXlQcm90bywgVU5TQ09QQUJMRVMsIHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICBBcnJheVByb3RvW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTEnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHRhcmdldCwgQykge1xuICB2YXIgUyA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgdmFyIFA7XG4gIGlmIChTICE9PSBDICYmIHR5cGVvZiBTID09ICdmdW5jdGlvbicgJiYgKFAgPSBTLnByb3RvdHlwZSkgIT09IEMucHJvdG90eXBlICYmIGlzT2JqZWN0KFApICYmIHNldFByb3RvdHlwZU9mKSB7XG4gICAgc2V0UHJvdG90eXBlT2YodGhhdCwgUCk7XG4gIH0gcmV0dXJuIHRoYXQ7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0ludGVnZXIoaXQpIHtcbiAgcmV0dXJuICFpc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjUuNC4xLjUgTmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5cbmZ1bmN0aW9uIFByb21pc2VDYXBhYmlsaXR5KEMpIHtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24gKCQkcmVzb2x2ZSwgJCRyZWplY3QpIHtcbiAgICBpZiAocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIChDKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgZ09QRCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSU9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlRGVzYyghcElFLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJ2YXIgJHBhcnNlRmxvYXQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5wYXJzZUZsb2F0O1xudmFyICR0cmltID0gcmVxdWlyZSgnLi9fc3RyaW5nLXRyaW0nKS50cmltO1xuXG5tb2R1bGUuZXhwb3J0cyA9IDEgLyAkcGFyc2VGbG9hdChyZXF1aXJlKCcuL19zdHJpbmctd3MnKSArICctMCcpICE9PSAtSW5maW5pdHkgPyBmdW5jdGlvbiBwYXJzZUZsb2F0KHN0cikge1xuICB2YXIgc3RyaW5nID0gJHRyaW0oU3RyaW5nKHN0ciksIDMpO1xuICB2YXIgcmVzdWx0ID0gJHBhcnNlRmxvYXQoc3RyaW5nKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gMCAmJiBzdHJpbmcuY2hhckF0KDApID09ICctJyA/IC0wIDogcmVzdWx0O1xufSA6ICRwYXJzZUZsb2F0O1xuIiwidmFyICRwYXJzZUludCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLnBhcnNlSW50O1xudmFyICR0cmltID0gcmVxdWlyZSgnLi9fc3RyaW5nLXRyaW0nKS50cmltO1xudmFyIHdzID0gcmVxdWlyZSgnLi9fc3RyaW5nLXdzJyk7XG52YXIgaGV4ID0gL15bLStdPzBbeFhdLztcblxubW9kdWxlLmV4cG9ydHMgPSAkcGFyc2VJbnQod3MgKyAnMDgnKSAhPT0gOCB8fCAkcGFyc2VJbnQod3MgKyAnMHgxNicpICE9PSAyMiA/IGZ1bmN0aW9uIHBhcnNlSW50KHN0ciwgcmFkaXgpIHtcbiAgdmFyIHN0cmluZyA9ICR0cmltKFN0cmluZyhzdHIpLCAzKTtcbiAgcmV0dXJuICRwYXJzZUludChzdHJpbmcsIChyYWRpeCA+Pj4gMCkgfHwgKGhleC50ZXN0KHN0cmluZykgPyAxNiA6IDEwKSk7XG59IDogJHBhcnNlSW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiB7IGU6IGZhbHNlLCB2OiBleGVjKCkgfTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB7IGU6IHRydWUsIHY6IGUgfTtcbiAgfVxufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEMsIHgpIHtcbiAgYW5PYmplY3QoQyk7XG4gIGlmIChpc09iamVjdCh4KSAmJiB4LmNvbnN0cnVjdG9yID09PSBDKSByZXR1cm4geDtcbiAgdmFyIHByb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkuZihDKTtcbiAgdmFyIHJlc29sdmUgPSBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlO1xuICByZXNvbHZlKHgpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbiAoTywgcHJvdG8pIHtcbiAgYW5PYmplY3QoTyk7XG4gIGlmICghaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKSB0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbiAodGVzdCwgYnVnZ3ksIHNldCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYnVnZ3kgPSB0cnVlOyB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pIHtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZiAoYnVnZ3kpIE8uX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcbiAgICAgICAgcmV0dXJuIE87XG4gICAgICB9O1xuICAgIH0oe30sIGZhbHNlKSA6IHVuZGVmaW5lZCksXG4gIGNoZWNrOiBjaGVja1xufTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTkgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsIi8vIDcuMy4yMCBTcGVjaWVzQ29uc3RydWN0b3IoTywgZGVmYXVsdENvbnN0cnVjdG9yKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgRCkge1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yO1xuICB2YXIgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gIHZhciBzdHIgPSBTdHJpbmcoZGVmaW5lZCh0aGlzKSk7XG4gIHZhciByZXMgPSAnJztcbiAgdmFyIG4gPSB0b0ludGVnZXIoY291bnQpO1xuICBpZiAobiA8IDAgfHwgbiA9PSBJbmZpbml0eSkgdGhyb3cgUmFuZ2VFcnJvcihcIkNvdW50IGNhbid0IGJlIG5lZ2F0aXZlXCIpO1xuICBmb3IgKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpIGlmIChuICYgMSkgcmVzICs9IHN0cjtcbiAgcmV0dXJuIHJlcztcbn07XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNwYWNlcyA9IHJlcXVpcmUoJy4vX3N0cmluZy13cycpO1xudmFyIHNwYWNlID0gJ1snICsgc3BhY2VzICsgJ10nO1xudmFyIG5vbiA9ICdcXHUyMDBiXFx1MDA4NSc7XG52YXIgbHRyaW0gPSBSZWdFeHAoJ14nICsgc3BhY2UgKyBzcGFjZSArICcqJyk7XG52YXIgcnRyaW0gPSBSZWdFeHAoc3BhY2UgKyBzcGFjZSArICcqJCcpO1xuXG52YXIgZXhwb3J0ZXIgPSBmdW5jdGlvbiAoS0VZLCBleGVjLCBBTElBUykge1xuICB2YXIgZXhwID0ge307XG4gIHZhciBGT1JDRSA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISFzcGFjZXNbS0VZXSgpIHx8IG5vbltLRVldKCkgIT0gbm9uO1xuICB9KTtcbiAgdmFyIGZuID0gZXhwW0tFWV0gPSBGT1JDRSA/IGV4ZWModHJpbSkgOiBzcGFjZXNbS0VZXTtcbiAgaWYgKEFMSUFTKSBleHBbQUxJQVNdID0gZm47XG4gICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogRk9SQ0UsICdTdHJpbmcnLCBleHApO1xufTtcblxuLy8gMSAtPiBTdHJpbmcjdHJpbUxlZnRcbi8vIDIgLT4gU3RyaW5nI3RyaW1SaWdodFxuLy8gMyAtPiBTdHJpbmcjdHJpbVxudmFyIHRyaW0gPSBleHBvcnRlci50cmltID0gZnVuY3Rpb24gKHN0cmluZywgVFlQRSkge1xuICBzdHJpbmcgPSBTdHJpbmcoZGVmaW5lZChzdHJpbmcpKTtcbiAgaWYgKFRZUEUgJiAxKSBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShsdHJpbSwgJycpO1xuICBpZiAoVFlQRSAmIDIpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gIHJldHVybiBzdHJpbmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydGVyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAnXFx4MDlcXHgwQVxceDBCXFx4MENcXHgwRFxceDIwXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDMnICtcbiAgJ1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkYnO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgaW5oZXJpdElmUmVxdWlyZWQgPSByZXF1aXJlKCcuL19pbmhlcml0LWlmLXJlcXVpcmVkJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciBnT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciAkdHJpbSA9IHJlcXVpcmUoJy4vX3N0cmluZy10cmltJykudHJpbTtcbnZhciBOVU1CRVIgPSAnTnVtYmVyJztcbnZhciAkTnVtYmVyID0gZ2xvYmFsW05VTUJFUl07XG52YXIgQmFzZSA9ICROdW1iZXI7XG52YXIgcHJvdG8gPSAkTnVtYmVyLnByb3RvdHlwZTtcbi8vIE9wZXJhIH4xMiBoYXMgYnJva2VuIE9iamVjdCN0b1N0cmluZ1xudmFyIEJST0tFTl9DT0YgPSBjb2YocmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpKHByb3RvKSkgPT0gTlVNQkVSO1xudmFyIFRSSU0gPSAndHJpbScgaW4gU3RyaW5nLnByb3RvdHlwZTtcblxuLy8gNy4xLjMgVG9OdW1iZXIoYXJndW1lbnQpXG52YXIgdG9OdW1iZXIgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdmFyIGl0ID0gdG9QcmltaXRpdmUoYXJndW1lbnQsIGZhbHNlKTtcbiAgaWYgKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyAmJiBpdC5sZW5ndGggPiAyKSB7XG4gICAgaXQgPSBUUklNID8gaXQudHJpbSgpIDogJHRyaW0oaXQsIDMpO1xuICAgIHZhciBmaXJzdCA9IGl0LmNoYXJDb2RlQXQoMCk7XG4gICAgdmFyIHRoaXJkLCByYWRpeCwgbWF4Q29kZTtcbiAgICBpZiAoZmlyc3QgPT09IDQzIHx8IGZpcnN0ID09PSA0NSkge1xuICAgICAgdGhpcmQgPSBpdC5jaGFyQ29kZUF0KDIpO1xuICAgICAgaWYgKHRoaXJkID09PSA4OCB8fCB0aGlyZCA9PT0gMTIwKSByZXR1cm4gTmFOOyAvLyBOdW1iZXIoJysweDEnKSBzaG91bGQgYmUgTmFOLCBvbGQgVjggZml4XG4gICAgfSBlbHNlIGlmIChmaXJzdCA9PT0gNDgpIHtcbiAgICAgIHN3aXRjaCAoaXQuY2hhckNvZGVBdCgxKSkge1xuICAgICAgICBjYXNlIDY2OiBjYXNlIDk4OiByYWRpeCA9IDI7IG1heENvZGUgPSA0OTsgYnJlYWs7IC8vIGZhc3QgZXF1YWwgL14wYlswMV0rJC9pXG4gICAgICAgIGNhc2UgNzk6IGNhc2UgMTExOiByYWRpeCA9IDg7IG1heENvZGUgPSA1NTsgYnJlYWs7IC8vIGZhc3QgZXF1YWwgL14wb1swLTddKyQvaVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gK2l0O1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgZGlnaXRzID0gaXQuc2xpY2UoMiksIGkgPSAwLCBsID0gZGlnaXRzLmxlbmd0aCwgY29kZTsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb2RlID0gZGlnaXRzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIC8vIHBhcnNlSW50IHBhcnNlcyBhIHN0cmluZyB0byBhIGZpcnN0IHVuYXZhaWxhYmxlIHN5bWJvbFxuICAgICAgICAvLyBidXQgVG9OdW1iZXIgc2hvdWxkIHJldHVybiBOYU4gaWYgYSBzdHJpbmcgY29udGFpbnMgdW5hdmFpbGFibGUgc3ltYm9sc1xuICAgICAgICBpZiAoY29kZSA8IDQ4IHx8IGNvZGUgPiBtYXhDb2RlKSByZXR1cm4gTmFOO1xuICAgICAgfSByZXR1cm4gcGFyc2VJbnQoZGlnaXRzLCByYWRpeCk7XG4gICAgfVxuICB9IHJldHVybiAraXQ7XG59O1xuXG5pZiAoISROdW1iZXIoJyAwbzEnKSB8fCAhJE51bWJlcignMGIxJykgfHwgJE51bWJlcignKzB4MScpKSB7XG4gICROdW1iZXIgPSBmdW5jdGlvbiBOdW1iZXIodmFsdWUpIHtcbiAgICB2YXIgaXQgPSBhcmd1bWVudHMubGVuZ3RoIDwgMSA/IDAgOiB2YWx1ZTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoYXQgaW5zdGFuY2VvZiAkTnVtYmVyXG4gICAgICAvLyBjaGVjayBvbiAxLi5jb25zdHJ1Y3Rvcihmb28pIGNhc2VcbiAgICAgICYmIChCUk9LRU5fQ09GID8gZmFpbHMoZnVuY3Rpb24gKCkgeyBwcm90by52YWx1ZU9mLmNhbGwodGhhdCk7IH0pIDogY29mKHRoYXQpICE9IE5VTUJFUilcbiAgICAgICAgPyBpbmhlcml0SWZSZXF1aXJlZChuZXcgQmFzZSh0b051bWJlcihpdCkpLCB0aGF0LCAkTnVtYmVyKSA6IHRvTnVtYmVyKGl0KTtcbiAgfTtcbiAgZm9yICh2YXIga2V5cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BOKEJhc2UpIDogKFxuICAgIC8vIEVTMzpcbiAgICAnTUFYX1ZBTFVFLE1JTl9WQUxVRSxOYU4sTkVHQVRJVkVfSU5GSU5JVFksUE9TSVRJVkVfSU5GSU5JVFksJyArXG4gICAgLy8gRVM2IChpbiBjYXNlLCBpZiBtb2R1bGVzIHdpdGggRVM2IE51bWJlciBzdGF0aWNzIHJlcXVpcmVkIGJlZm9yZSk6XG4gICAgJ0VQU0lMT04saXNGaW5pdGUsaXNJbnRlZ2VyLGlzTmFOLGlzU2FmZUludGVnZXIsTUFYX1NBRkVfSU5URUdFUiwnICtcbiAgICAnTUlOX1NBRkVfSU5URUdFUixwYXJzZUZsb2F0LHBhcnNlSW50LGlzSW50ZWdlcidcbiAgKS5zcGxpdCgnLCcpLCBqID0gMCwga2V5OyBrZXlzLmxlbmd0aCA+IGo7IGorKykge1xuICAgIGlmIChoYXMoQmFzZSwga2V5ID0ga2V5c1tqXSkgJiYgIWhhcygkTnVtYmVyLCBrZXkpKSB7XG4gICAgICBkUCgkTnVtYmVyLCBrZXksIGdPUEQoQmFzZSwga2V5KSk7XG4gICAgfVxuICB9XG4gICROdW1iZXIucHJvdG90eXBlID0gcHJvdG87XG4gIHByb3RvLmNvbnN0cnVjdG9yID0gJE51bWJlcjtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShnbG9iYWwsIE5VTUJFUiwgJE51bWJlcik7XG59XG4iLCIvLyAyMC4xLjIuMSBOdW1iZXIuRVBTSUxPTlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7IEVQU0lMT046IE1hdGgucG93KDIsIC01MikgfSk7XG4iLCIvLyAyMC4xLjIuMiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBfaXNGaW5pdGUgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5pc0Zpbml0ZTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzRmluaXRlOiBmdW5jdGlvbiBpc0Zpbml0ZShpdCkge1xuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgX2lzRmluaXRlKGl0KTtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywgeyBpc0ludGVnZXI6IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKSB9KTtcbiIsIi8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNOYU46IGZ1bmN0aW9uIGlzTmFOKG51bWJlcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICByZXR1cm4gbnVtYmVyICE9IG51bWJlcjtcbiAgfVxufSk7XG4iLCIvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzSW50ZWdlciA9IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKTtcbnZhciBhYnMgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uIGlzU2FmZUludGVnZXIobnVtYmVyKSB7XG4gICAgcmV0dXJuIGlzSW50ZWdlcihudW1iZXIpICYmIGFicyhudW1iZXIpIDw9IDB4MWZmZmZmZmZmZmZmZmY7XG4gIH1cbn0pO1xuIiwiLy8gMjAuMS4yLjYgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywgeyBNQVhfU0FGRV9JTlRFR0VSOiAweDFmZmZmZmZmZmZmZmZmIH0pO1xuIiwiLy8gMjAuMS4yLjEwIE51bWJlci5NSU5fU0FGRV9JTlRFR0VSXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHsgTUlOX1NBRkVfSU5URUdFUjogLTB4MWZmZmZmZmZmZmZmZmYgfSk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRwYXJzZUZsb2F0ID0gcmVxdWlyZSgnLi9fcGFyc2UtZmxvYXQnKTtcbi8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChOdW1iZXIucGFyc2VGbG9hdCAhPSAkcGFyc2VGbG9hdCksICdOdW1iZXInLCB7IHBhcnNlRmxvYXQ6ICRwYXJzZUZsb2F0IH0pO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkcGFyc2VJbnQgPSByZXF1aXJlKCcuL19wYXJzZS1pbnQnKTtcbi8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKE51bWJlci5wYXJzZUludCAhPSAkcGFyc2VJbnQpLCAnTnVtYmVyJywgeyBwYXJzZUludDogJHBhcnNlSW50IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgYU51bWJlclZhbHVlID0gcmVxdWlyZSgnLi9fYS1udW1iZXItdmFsdWUnKTtcbnZhciByZXBlYXQgPSByZXF1aXJlKCcuL19zdHJpbmctcmVwZWF0Jyk7XG52YXIgJHRvRml4ZWQgPSAxLjAudG9GaXhlZDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG52YXIgZGF0YSA9IFswLCAwLCAwLCAwLCAwLCAwXTtcbnZhciBFUlJPUiA9ICdOdW1iZXIudG9GaXhlZDogaW5jb3JyZWN0IGludm9jYXRpb24hJztcbnZhciBaRVJPID0gJzAnO1xuXG52YXIgbXVsdGlwbHkgPSBmdW5jdGlvbiAobiwgYykge1xuICB2YXIgaSA9IC0xO1xuICB2YXIgYzIgPSBjO1xuICB3aGlsZSAoKytpIDwgNikge1xuICAgIGMyICs9IG4gKiBkYXRhW2ldO1xuICAgIGRhdGFbaV0gPSBjMiAlIDFlNztcbiAgICBjMiA9IGZsb29yKGMyIC8gMWU3KTtcbiAgfVxufTtcbnZhciBkaXZpZGUgPSBmdW5jdGlvbiAobikge1xuICB2YXIgaSA9IDY7XG4gIHZhciBjID0gMDtcbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgYyArPSBkYXRhW2ldO1xuICAgIGRhdGFbaV0gPSBmbG9vcihjIC8gbik7XG4gICAgYyA9IChjICUgbikgKiAxZTc7XG4gIH1cbn07XG52YXIgbnVtVG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpID0gNjtcbiAgdmFyIHMgPSAnJztcbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgaWYgKHMgIT09ICcnIHx8IGkgPT09IDAgfHwgZGF0YVtpXSAhPT0gMCkge1xuICAgICAgdmFyIHQgPSBTdHJpbmcoZGF0YVtpXSk7XG4gICAgICBzID0gcyA9PT0gJycgPyB0IDogcyArIHJlcGVhdC5jYWxsKFpFUk8sIDcgLSB0Lmxlbmd0aCkgKyB0O1xuICAgIH1cbiAgfSByZXR1cm4gcztcbn07XG52YXIgcG93ID0gZnVuY3Rpb24gKHgsIG4sIGFjYykge1xuICByZXR1cm4gbiA9PT0gMCA/IGFjYyA6IG4gJSAyID09PSAxID8gcG93KHgsIG4gLSAxLCBhY2MgKiB4KSA6IHBvdyh4ICogeCwgbiAvIDIsIGFjYyk7XG59O1xudmFyIGxvZyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBuID0gMDtcbiAgdmFyIHgyID0geDtcbiAgd2hpbGUgKHgyID49IDQwOTYpIHtcbiAgICBuICs9IDEyO1xuICAgIHgyIC89IDQwOTY7XG4gIH1cbiAgd2hpbGUgKHgyID49IDIpIHtcbiAgICBuICs9IDE7XG4gICAgeDIgLz0gMjtcbiAgfSByZXR1cm4gbjtcbn07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKCEhJHRvRml4ZWQgJiYgKFxuICAwLjAwMDA4LnRvRml4ZWQoMykgIT09ICcwLjAwMCcgfHxcbiAgMC45LnRvRml4ZWQoMCkgIT09ICcxJyB8fFxuICAxLjI1NS50b0ZpeGVkKDIpICE9PSAnMS4yNScgfHxcbiAgMTAwMDAwMDAwMDAwMDAwMDEyOC4wLnRvRml4ZWQoMCkgIT09ICcxMDAwMDAwMDAwMDAwMDAwMTI4J1xuKSB8fCAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIC8vIFY4IH4gQW5kcm9pZCA0LjMtXG4gICR0b0ZpeGVkLmNhbGwoe30pO1xufSkpLCAnTnVtYmVyJywge1xuICB0b0ZpeGVkOiBmdW5jdGlvbiB0b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKSB7XG4gICAgdmFyIHggPSBhTnVtYmVyVmFsdWUodGhpcywgRVJST1IpO1xuICAgIHZhciBmID0gdG9JbnRlZ2VyKGZyYWN0aW9uRGlnaXRzKTtcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBtID0gWkVSTztcbiAgICB2YXIgZSwgeiwgaiwgaztcbiAgICBpZiAoZiA8IDAgfHwgZiA+IDIwKSB0aHJvdyBSYW5nZUVycm9yKEVSUk9SKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKHggIT0geCkgcmV0dXJuICdOYU4nO1xuICAgIGlmICh4IDw9IC0xZTIxIHx8IHggPj0gMWUyMSkgcmV0dXJuIFN0cmluZyh4KTtcbiAgICBpZiAoeCA8IDApIHtcbiAgICAgIHMgPSAnLSc7XG4gICAgICB4ID0gLXg7XG4gICAgfVxuICAgIGlmICh4ID4gMWUtMjEpIHtcbiAgICAgIGUgPSBsb2coeCAqIHBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICB6ID0gZSA8IDAgPyB4ICogcG93KDIsIC1lLCAxKSA6IHggLyBwb3coMiwgZSwgMSk7XG4gICAgICB6ICo9IDB4MTAwMDAwMDAwMDAwMDA7XG4gICAgICBlID0gNTIgLSBlO1xuICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgIG11bHRpcGx5KDAsIHopO1xuICAgICAgICBqID0gZjtcbiAgICAgICAgd2hpbGUgKGogPj0gNykge1xuICAgICAgICAgIG11bHRpcGx5KDFlNywgMCk7XG4gICAgICAgICAgaiAtPSA3O1xuICAgICAgICB9XG4gICAgICAgIG11bHRpcGx5KHBvdygxMCwgaiwgMSksIDApO1xuICAgICAgICBqID0gZSAtIDE7XG4gICAgICAgIHdoaWxlIChqID49IDIzKSB7XG4gICAgICAgICAgZGl2aWRlKDEgPDwgMjMpO1xuICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgIH1cbiAgICAgICAgZGl2aWRlKDEgPDwgaik7XG4gICAgICAgIG11bHRpcGx5KDEsIDEpO1xuICAgICAgICBkaXZpZGUoMik7XG4gICAgICAgIG0gPSBudW1Ub1N0cmluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbXVsdGlwbHkoMCwgeik7XG4gICAgICAgIG11bHRpcGx5KDEgPDwgLWUsIDApO1xuICAgICAgICBtID0gbnVtVG9TdHJpbmcoKSArIHJlcGVhdC5jYWxsKFpFUk8sIGYpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZiA+IDApIHtcbiAgICAgIGsgPSBtLmxlbmd0aDtcbiAgICAgIG0gPSBzICsgKGsgPD0gZiA/ICcwLicgKyByZXBlYXQuY2FsbChaRVJPLCBmIC0gaykgKyBtIDogbS5zbGljZSgwLCBrIC0gZikgKyAnLicgKyBtLnNsaWNlKGsgLSBmKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBzICsgbTtcbiAgICB9IHJldHVybiBtO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBhTnVtYmVyVmFsdWUgPSByZXF1aXJlKCcuL19hLW51bWJlci12YWx1ZScpO1xudmFyICR0b1ByZWNpc2lvbiA9IDEuMC50b1ByZWNpc2lvbjtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gSUU3LVxuICByZXR1cm4gJHRvUHJlY2lzaW9uLmNhbGwoMSwgdW5kZWZpbmVkKSAhPT0gJzEnO1xufSkgfHwgISRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIFY4IH4gQW5kcm9pZCA0LjMtXG4gICR0b1ByZWNpc2lvbi5jYWxsKHt9KTtcbn0pKSwgJ051bWJlcicsIHtcbiAgdG9QcmVjaXNpb246IGZ1bmN0aW9uIHRvUHJlY2lzaW9uKHByZWNpc2lvbikge1xuICAgIHZhciB0aGF0ID0gYU51bWJlclZhbHVlKHRoaXMsICdOdW1iZXIjdG9QcmVjaXNpb246IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICAgIHJldHVybiBwcmVjaXNpb24gPT09IHVuZGVmaW5lZCA/ICR0b1ByZWNpc2lvbi5jYWxsKHRoYXQpIDogJHRvUHJlY2lzaW9uLmNhbGwodGhhdCwgcHJlY2lzaW9uKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtZmluYWxseVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1Byb21pc2UnLCB7ICdmaW5hbGx5JzogZnVuY3Rpb24gKG9uRmluYWxseSkge1xuICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBjb3JlLlByb21pc2UgfHwgZ2xvYmFsLlByb21pc2UpO1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBvbkZpbmFsbHkgPT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9KTtcbiAgICB9IDogb25GaW5hbGx5LFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSk7XG4gICAgfSA6IG9uRmluYWxseVxuICApO1xufSB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtdHJ5XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUHJvbWlzZScsIHsgJ3RyeSc6IGZ1bmN0aW9uIChjYWxsYmFja2ZuKSB7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYodGhpcyk7XG4gIHZhciByZXN1bHQgPSBwZXJmb3JtKGNhbGxiYWNrZm4pO1xuICAocmVzdWx0LmUgPyBwcm9taXNlQ2FwYWJpbGl0eS5yZWplY3QgOiBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlKShyZXN1bHQudik7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufSB9KTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNiBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBXM0MgU09GVFdBUkUgQU5EIERPQ1VNRU5UIE5PVElDRSBBTkQgTElDRU5TRS5cbiAqXG4gKiAgaHR0cHM6Ly93d3cudzMub3JnL0NvbnNvcnRpdW0vTGVnYWwvMjAxNS9jb3B5cmlnaHQtc29mdHdhcmUtYW5kLWRvY3VtZW50XG4gKlxuICovXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50KSB7XG4ndXNlIHN0cmljdCc7XG5cblxuLy8gRXhpdHMgZWFybHkgaWYgYWxsIEludGVyc2VjdGlvbk9ic2VydmVyIGFuZCBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5XG4vLyBmZWF0dXJlcyBhcmUgbmF0aXZlbHkgc3VwcG9ydGVkLlxuaWYgKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93ICYmXG4gICAgJ0ludGVyc2VjdGlvbk9ic2VydmVyRW50cnknIGluIHdpbmRvdyAmJlxuICAgICdpbnRlcnNlY3Rpb25SYXRpbycgaW4gd2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyRW50cnkucHJvdG90eXBlKSB7XG5cbiAgLy8gTWluaW1hbCBwb2x5ZmlsbCBmb3IgRWRnZSAxNSdzIGxhY2sgb2YgYGlzSW50ZXJzZWN0aW5nYFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIvaXNzdWVzLzIxMVxuICBpZiAoISgnaXNJbnRlcnNlY3RpbmcnIGluIHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5LnByb3RvdHlwZSkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyRW50cnkucHJvdG90eXBlLFxuICAgICAgJ2lzSW50ZXJzZWN0aW5nJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVyc2VjdGlvblJhdGlvID4gMDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm47XG59XG5cblxuLyoqXG4gKiBBbiBJbnRlcnNlY3Rpb25PYnNlcnZlciByZWdpc3RyeS4gVGhpcyByZWdpc3RyeSBleGlzdHMgdG8gaG9sZCBhIHN0cm9uZ1xuICogcmVmZXJlbmNlIHRvIEludGVyc2VjdGlvbk9ic2VydmVyIGluc3RhbmNlcyBjdXJyZW50bHkgb2JzZXJ2aW5nIGEgdGFyZ2V0XG4gKiBlbGVtZW50LiBXaXRob3V0IHRoaXMgcmVnaXN0cnksIGluc3RhbmNlcyB3aXRob3V0IGFub3RoZXIgcmVmZXJlbmNlIG1heSBiZVxuICogZ2FyYmFnZSBjb2xsZWN0ZWQuXG4gKi9cbnZhciByZWdpc3RyeSA9IFtdO1xuXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgZ2xvYmFsIEludGVyc2VjdGlvbk9ic2VydmVyRW50cnkgY29uc3RydWN0b3IuXG4gKiBodHRwczovL3czYy5naXRodWIuaW8vSW50ZXJzZWN0aW9uT2JzZXJ2ZXIvI2ludGVyc2VjdGlvbi1vYnNlcnZlci1lbnRyeVxuICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IEEgZGljdGlvbmFyeSBvZiBpbnN0YW5jZSBwcm9wZXJ0aWVzLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEludGVyc2VjdGlvbk9ic2VydmVyRW50cnkoZW50cnkpIHtcbiAgdGhpcy50aW1lID0gZW50cnkudGltZTtcbiAgdGhpcy50YXJnZXQgPSBlbnRyeS50YXJnZXQ7XG4gIHRoaXMucm9vdEJvdW5kcyA9IGVudHJ5LnJvb3RCb3VuZHM7XG4gIHRoaXMuYm91bmRpbmdDbGllbnRSZWN0ID0gZW50cnkuYm91bmRpbmdDbGllbnRSZWN0O1xuICB0aGlzLmludGVyc2VjdGlvblJlY3QgPSBlbnRyeS5pbnRlcnNlY3Rpb25SZWN0IHx8IGdldEVtcHR5UmVjdCgpO1xuICB0aGlzLmlzSW50ZXJzZWN0aW5nID0gISFlbnRyeS5pbnRlcnNlY3Rpb25SZWN0O1xuXG4gIC8vIENhbGN1bGF0ZXMgdGhlIGludGVyc2VjdGlvbiByYXRpby5cbiAgdmFyIHRhcmdldFJlY3QgPSB0aGlzLmJvdW5kaW5nQ2xpZW50UmVjdDtcbiAgdmFyIHRhcmdldEFyZWEgPSB0YXJnZXRSZWN0LndpZHRoICogdGFyZ2V0UmVjdC5oZWlnaHQ7XG4gIHZhciBpbnRlcnNlY3Rpb25SZWN0ID0gdGhpcy5pbnRlcnNlY3Rpb25SZWN0O1xuICB2YXIgaW50ZXJzZWN0aW9uQXJlYSA9IGludGVyc2VjdGlvblJlY3Qud2lkdGggKiBpbnRlcnNlY3Rpb25SZWN0LmhlaWdodDtcblxuICAvLyBTZXRzIGludGVyc2VjdGlvbiByYXRpby5cbiAgaWYgKHRhcmdldEFyZWEpIHtcbiAgICAvLyBSb3VuZCB0aGUgaW50ZXJzZWN0aW9uIHJhdGlvIHRvIGF2b2lkIGZsb2F0aW5nIHBvaW50IG1hdGggaXNzdWVzOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIvaXNzdWVzLzMyNFxuICAgIHRoaXMuaW50ZXJzZWN0aW9uUmF0aW8gPSBOdW1iZXIoKGludGVyc2VjdGlvbkFyZWEgLyB0YXJnZXRBcmVhKS50b0ZpeGVkKDQpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJZiBhcmVhIGlzIHplcm8gYW5kIGlzIGludGVyc2VjdGluZywgc2V0cyB0byAxLCBvdGhlcndpc2UgdG8gMFxuICAgIHRoaXMuaW50ZXJzZWN0aW9uUmF0aW8gPSB0aGlzLmlzSW50ZXJzZWN0aW5nID8gMSA6IDA7XG4gIH1cbn1cblxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIGdsb2JhbCBJbnRlcnNlY3Rpb25PYnNlcnZlciBjb25zdHJ1Y3Rvci5cbiAqIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9JbnRlcnNlY3Rpb25PYnNlcnZlci8jaW50ZXJzZWN0aW9uLW9ic2VydmVyLWludGVyZmFjZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgYWZ0ZXIgaW50ZXJzZWN0aW9uXG4gKiAgICAgY2hhbmdlcyBoYXZlIHF1ZXVlZC4gVGhlIGZ1bmN0aW9uIGlzIG5vdCBpbnZva2VkIGlmIHRoZSBxdWV1ZSBoYXNcbiAqICAgICBiZWVuIGVtcHRpZWQgYnkgY2FsbGluZyB0aGUgYHRha2VSZWNvcmRzYCBtZXRob2QuXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdF9vcHRpb25zIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnRlcnNlY3Rpb25PYnNlcnZlcihjYWxsYmFjaywgb3B0X29wdGlvbnMpIHtcblxuICB2YXIgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9O1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcignY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5yb290ICYmIG9wdGlvbnMucm9vdC5ub2RlVHlwZSAhPSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdyb290IG11c3QgYmUgYW4gRWxlbWVudCcpO1xuICB9XG5cbiAgLy8gQmluZHMgYW5kIHRocm90dGxlcyBgdGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zYC5cbiAgdGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zID0gdGhyb3R0bGUoXG4gICAgICB0aGlzLl9jaGVja0ZvckludGVyc2VjdGlvbnMuYmluZCh0aGlzKSwgdGhpcy5USFJPVFRMRV9USU1FT1VUKTtcblxuICAvLyBQcml2YXRlIHByb3BlcnRpZXMuXG4gIHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIHRoaXMuX29ic2VydmF0aW9uVGFyZ2V0cyA9IFtdO1xuICB0aGlzLl9xdWV1ZWRFbnRyaWVzID0gW107XG4gIHRoaXMuX3Jvb3RNYXJnaW5WYWx1ZXMgPSB0aGlzLl9wYXJzZVJvb3RNYXJnaW4ob3B0aW9ucy5yb290TWFyZ2luKTtcblxuICAvLyBQdWJsaWMgcHJvcGVydGllcy5cbiAgdGhpcy50aHJlc2hvbGRzID0gdGhpcy5faW5pdFRocmVzaG9sZHMob3B0aW9ucy50aHJlc2hvbGQpO1xuICB0aGlzLnJvb3QgPSBvcHRpb25zLnJvb3QgfHwgbnVsbDtcbiAgdGhpcy5yb290TWFyZ2luID0gdGhpcy5fcm9vdE1hcmdpblZhbHVlcy5tYXAoZnVuY3Rpb24obWFyZ2luKSB7XG4gICAgcmV0dXJuIG1hcmdpbi52YWx1ZSArIG1hcmdpbi51bml0O1xuICB9KS5qb2luKCcgJyk7XG59XG5cblxuLyoqXG4gKiBUaGUgbWluaW11bSBpbnRlcnZhbCB3aXRoaW4gd2hpY2ggdGhlIGRvY3VtZW50IHdpbGwgYmUgY2hlY2tlZCBmb3JcbiAqIGludGVyc2VjdGlvbiBjaGFuZ2VzLlxuICovXG5JbnRlcnNlY3Rpb25PYnNlcnZlci5wcm90b3R5cGUuVEhST1RUTEVfVElNRU9VVCA9IDEwMDtcblxuXG4vKipcbiAqIFRoZSBmcmVxdWVuY3kgaW4gd2hpY2ggdGhlIHBvbHlmaWxsIHBvbGxzIGZvciBpbnRlcnNlY3Rpb24gY2hhbmdlcy5cbiAqIHRoaXMgY2FuIGJlIHVwZGF0ZWQgb24gYSBwZXIgaW5zdGFuY2UgYmFzaXMgYW5kIG11c3QgYmUgc2V0IHByaW9yIHRvXG4gKiBjYWxsaW5nIGBvYnNlcnZlYCBvbiB0aGUgZmlyc3QgdGFyZ2V0LlxuICovXG5JbnRlcnNlY3Rpb25PYnNlcnZlci5wcm90b3R5cGUuUE9MTF9JTlRFUlZBTCA9IG51bGw7XG5cbi8qKlxuICogVXNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgb24gdGhlIHJvb3QgZWxlbWVudFxuICogdG8gZGV0ZWN0IGludGVyc2VjdGlvbiBjaGFuZ2VzLlxuICovXG5JbnRlcnNlY3Rpb25PYnNlcnZlci5wcm90b3R5cGUuVVNFX01VVEFUSU9OX09CU0VSVkVSID0gdHJ1ZTtcblxuXG4vKipcbiAqIFN0YXJ0cyBvYnNlcnZpbmcgYSB0YXJnZXQgZWxlbWVudCBmb3IgaW50ZXJzZWN0aW9uIGNoYW5nZXMgYmFzZWQgb25cbiAqIHRoZSB0aHJlc2hvbGRzIHZhbHVlcy5cbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0IFRoZSBET00gZWxlbWVudCB0byBvYnNlcnZlLlxuICovXG5JbnRlcnNlY3Rpb25PYnNlcnZlci5wcm90b3R5cGUub2JzZXJ2ZSA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICB2YXIgaXNUYXJnZXRBbHJlYWR5T2JzZXJ2ZWQgPSB0aGlzLl9vYnNlcnZhdGlvblRhcmdldHMuc29tZShmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uZWxlbWVudCA9PSB0YXJnZXQ7XG4gIH0pO1xuXG4gIGlmIChpc1RhcmdldEFscmVhZHlPYnNlcnZlZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghKHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIEVsZW1lbnQnKTtcbiAgfVxuXG4gIHRoaXMuX3JlZ2lzdGVySW5zdGFuY2UoKTtcbiAgdGhpcy5fb2JzZXJ2YXRpb25UYXJnZXRzLnB1c2goe2VsZW1lbnQ6IHRhcmdldCwgZW50cnk6IG51bGx9KTtcbiAgdGhpcy5fbW9uaXRvckludGVyc2VjdGlvbnMoKTtcbiAgdGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zKCk7XG59O1xuXG5cbi8qKlxuICogU3RvcHMgb2JzZXJ2aW5nIGEgdGFyZ2V0IGVsZW1lbnQgZm9yIGludGVyc2VjdGlvbiBjaGFuZ2VzLlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgVGhlIERPTSBlbGVtZW50IHRvIG9ic2VydmUuXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS51bm9ic2VydmUgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgdGhpcy5fb2JzZXJ2YXRpb25UYXJnZXRzID1cbiAgICAgIHRoaXMuX29ic2VydmF0aW9uVGFyZ2V0cy5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuXG4gICAgcmV0dXJuIGl0ZW0uZWxlbWVudCAhPSB0YXJnZXQ7XG4gIH0pO1xuICBpZiAoIXRoaXMuX29ic2VydmF0aW9uVGFyZ2V0cy5sZW5ndGgpIHtcbiAgICB0aGlzLl91bm1vbml0b3JJbnRlcnNlY3Rpb25zKCk7XG4gICAgdGhpcy5fdW5yZWdpc3Rlckluc3RhbmNlKCk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBTdG9wcyBvYnNlcnZpbmcgYWxsIHRhcmdldCBlbGVtZW50cyBmb3IgaW50ZXJzZWN0aW9uIGNoYW5nZXMuXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5kaXNjb25uZWN0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX29ic2VydmF0aW9uVGFyZ2V0cyA9IFtdO1xuICB0aGlzLl91bm1vbml0b3JJbnRlcnNlY3Rpb25zKCk7XG4gIHRoaXMuX3VucmVnaXN0ZXJJbnN0YW5jZSgpO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgYW55IHF1ZXVlIGVudHJpZXMgdGhhdCBoYXZlIG5vdCB5ZXQgYmVlbiByZXBvcnRlZCB0byB0aGVcbiAqIGNhbGxiYWNrIGFuZCBjbGVhcnMgdGhlIHF1ZXVlLiBUaGlzIGNhbiBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggdGhlXG4gKiBjYWxsYmFjayB0byBvYnRhaW4gdGhlIGFic29sdXRlIG1vc3QgdXAtdG8tZGF0ZSBpbnRlcnNlY3Rpb24gaW5mb3JtYXRpb24uXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIGN1cnJlbnRseSBxdWV1ZWQgZW50cmllcy5cbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLnRha2VSZWNvcmRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZWNvcmRzID0gdGhpcy5fcXVldWVkRW50cmllcy5zbGljZSgpO1xuICB0aGlzLl9xdWV1ZWRFbnRyaWVzID0gW107XG4gIHJldHVybiByZWNvcmRzO1xufTtcblxuXG4vKipcbiAqIEFjY2VwdHMgdGhlIHRocmVzaG9sZCB2YWx1ZSBmcm9tIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGFuZFxuICogcmV0dXJucyBhIHNvcnRlZCBhcnJheSBvZiB1bmlxdWUgdGhyZXNob2xkIHZhbHVlcy4gSWYgYSB2YWx1ZSBpcyBub3RcbiAqIGJldHdlZW4gMCBhbmQgMSBhbmQgZXJyb3IgaXMgdGhyb3duLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8bnVtYmVyPX0gb3B0X3RocmVzaG9sZCBBbiBvcHRpb25hbCB0aHJlc2hvbGQgdmFsdWUgb3JcbiAqICAgICBhIGxpc3Qgb2YgdGhyZXNob2xkIHZhbHVlcywgZGVmYXVsdGluZyB0byBbMF0uXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBzb3J0ZWQgbGlzdCBvZiB1bmlxdWUgYW5kIHZhbGlkIHRocmVzaG9sZCB2YWx1ZXMuXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5faW5pdFRocmVzaG9sZHMgPSBmdW5jdGlvbihvcHRfdGhyZXNob2xkKSB7XG4gIHZhciB0aHJlc2hvbGQgPSBvcHRfdGhyZXNob2xkIHx8IFswXTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHRocmVzaG9sZCkpIHRocmVzaG9sZCA9IFt0aHJlc2hvbGRdO1xuXG4gIHJldHVybiB0aHJlc2hvbGQuc29ydCgpLmZpbHRlcihmdW5jdGlvbih0LCBpLCBhKSB7XG4gICAgaWYgKHR5cGVvZiB0ICE9ICdudW1iZXInIHx8IGlzTmFOKHQpIHx8IHQgPCAwIHx8IHQgPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RocmVzaG9sZCBtdXN0IGJlIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSBpbmNsdXNpdmVseScpO1xuICAgIH1cbiAgICByZXR1cm4gdCAhPT0gYVtpIC0gMV07XG4gIH0pO1xufTtcblxuXG4vKipcbiAqIEFjY2VwdHMgdGhlIHJvb3RNYXJnaW4gdmFsdWUgZnJvbSB0aGUgdXNlciBjb25maWd1cmF0aW9uIG9iamVjdFxuICogYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlIGZvdXIgbWFyZ2luIHZhbHVlcyBhcyBhbiBvYmplY3QgY29udGFpbmluZ1xuICogdGhlIHZhbHVlIGFuZCB1bml0IHByb3BlcnRpZXMuIElmIGFueSBvZiB0aGUgdmFsdWVzIGFyZSBub3QgcHJvcGVybHlcbiAqIGZvcm1hdHRlZCBvciB1c2UgYSB1bml0IG90aGVyIHRoYW4gcHggb3IgJSwgYW5kIGVycm9yIGlzIHRocm93bi5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZz19IG9wdF9yb290TWFyZ2luIEFuIG9wdGlvbmFsIHJvb3RNYXJnaW4gdmFsdWUsXG4gKiAgICAgZGVmYXVsdGluZyB0byAnMHB4Jy5cbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59IEFuIGFycmF5IG9mIG1hcmdpbiBvYmplY3RzIHdpdGggdGhlIGtleXNcbiAqICAgICB2YWx1ZSBhbmQgdW5pdC5cbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9wYXJzZVJvb3RNYXJnaW4gPSBmdW5jdGlvbihvcHRfcm9vdE1hcmdpbikge1xuICB2YXIgbWFyZ2luU3RyaW5nID0gb3B0X3Jvb3RNYXJnaW4gfHwgJzBweCc7XG4gIHZhciBtYXJnaW5zID0gbWFyZ2luU3RyaW5nLnNwbGl0KC9cXHMrLykubWFwKGZ1bmN0aW9uKG1hcmdpbikge1xuICAgIHZhciBwYXJ0cyA9IC9eKC0/XFxkKlxcLj9cXGQrKShweHwlKSQvLmV4ZWMobWFyZ2luKTtcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Jvb3RNYXJnaW4gbXVzdCBiZSBzcGVjaWZpZWQgaW4gcGl4ZWxzIG9yIHBlcmNlbnQnKTtcbiAgICB9XG4gICAgcmV0dXJuIHt2YWx1ZTogcGFyc2VGbG9hdChwYXJ0c1sxXSksIHVuaXQ6IHBhcnRzWzJdfTtcbiAgfSk7XG5cbiAgLy8gSGFuZGxlcyBzaG9ydGhhbmQuXG4gIG1hcmdpbnNbMV0gPSBtYXJnaW5zWzFdIHx8IG1hcmdpbnNbMF07XG4gIG1hcmdpbnNbMl0gPSBtYXJnaW5zWzJdIHx8IG1hcmdpbnNbMF07XG4gIG1hcmdpbnNbM10gPSBtYXJnaW5zWzNdIHx8IG1hcmdpbnNbMV07XG5cbiAgcmV0dXJuIG1hcmdpbnM7XG59O1xuXG5cbi8qKlxuICogU3RhcnRzIHBvbGxpbmcgZm9yIGludGVyc2VjdGlvbiBjaGFuZ2VzIGlmIHRoZSBwb2xsaW5nIGlzIG5vdCBhbHJlYWR5XG4gKiBoYXBwZW5pbmcsIGFuZCBpZiB0aGUgcGFnZSdzIHZpc2liaWxpdHkgc3RhdGUgaXMgdmlzaWJsZS5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5fbW9uaXRvckludGVyc2VjdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLl9tb25pdG9yaW5nSW50ZXJzZWN0aW9ucykge1xuICAgIHRoaXMuX21vbml0b3JpbmdJbnRlcnNlY3Rpb25zID0gdHJ1ZTtcblxuICAgIC8vIElmIGEgcG9sbCBpbnRlcnZhbCBpcyBzZXQsIHVzZSBwb2xsaW5nIGluc3RlYWQgb2YgbGlzdGVuaW5nIHRvXG4gICAgLy8gcmVzaXplIGFuZCBzY3JvbGwgZXZlbnRzIG9yIERPTSBtdXRhdGlvbnMuXG4gICAgaWYgKHRoaXMuUE9MTF9JTlRFUlZBTCkge1xuICAgICAgdGhpcy5fbW9uaXRvcmluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoXG4gICAgICAgICAgdGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zLCB0aGlzLlBPTExfSU5URVJWQUwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuX2NoZWNrRm9ySW50ZXJzZWN0aW9ucywgdHJ1ZSk7XG4gICAgICBhZGRFdmVudChkb2N1bWVudCwgJ3Njcm9sbCcsIHRoaXMuX2NoZWNrRm9ySW50ZXJzZWN0aW9ucywgdHJ1ZSk7XG5cbiAgICAgIGlmICh0aGlzLlVTRV9NVVRBVElPTl9PQlNFUlZFUiAmJiAnTXV0YXRpb25PYnNlcnZlcicgaW4gd2luZG93KSB7XG4gICAgICAgIHRoaXMuX2RvbU9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zKTtcbiAgICAgICAgdGhpcy5fZG9tT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBTdG9wcyBwb2xsaW5nIGZvciBpbnRlcnNlY3Rpb24gY2hhbmdlcy5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5fdW5tb25pdG9ySW50ZXJzZWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5fbW9uaXRvcmluZ0ludGVyc2VjdGlvbnMpIHtcbiAgICB0aGlzLl9tb25pdG9yaW5nSW50ZXJzZWN0aW9ucyA9IGZhbHNlO1xuXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9tb25pdG9yaW5nSW50ZXJ2YWwpO1xuICAgIHRoaXMuX21vbml0b3JpbmdJbnRlcnZhbCA9IG51bGw7XG5cbiAgICByZW1vdmVFdmVudCh3aW5kb3csICdyZXNpemUnLCB0aGlzLl9jaGVja0ZvckludGVyc2VjdGlvbnMsIHRydWUpO1xuICAgIHJlbW92ZUV2ZW50KGRvY3VtZW50LCAnc2Nyb2xsJywgdGhpcy5fY2hlY2tGb3JJbnRlcnNlY3Rpb25zLCB0cnVlKTtcblxuICAgIGlmICh0aGlzLl9kb21PYnNlcnZlcikge1xuICAgICAgdGhpcy5fZG9tT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5fZG9tT2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIFNjYW5zIGVhY2ggb2JzZXJ2YXRpb24gdGFyZ2V0IGZvciBpbnRlcnNlY3Rpb24gY2hhbmdlcyBhbmQgYWRkcyB0aGVtXG4gKiB0byB0aGUgaW50ZXJuYWwgZW50cmllcyBxdWV1ZS4gSWYgbmV3IGVudHJpZXMgYXJlIGZvdW5kLCBpdFxuICogc2NoZWR1bGVzIHRoZSBjYWxsYmFjayB0byBiZSBpbnZva2VkLlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9jaGVja0ZvckludGVyc2VjdGlvbnMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJvb3RJc0luRG9tID0gdGhpcy5fcm9vdElzSW5Eb20oKTtcbiAgdmFyIHJvb3RSZWN0ID0gcm9vdElzSW5Eb20gPyB0aGlzLl9nZXRSb290UmVjdCgpIDogZ2V0RW1wdHlSZWN0KCk7XG5cbiAgdGhpcy5fb2JzZXJ2YXRpb25UYXJnZXRzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciB0YXJnZXQgPSBpdGVtLmVsZW1lbnQ7XG4gICAgdmFyIHRhcmdldFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QodGFyZ2V0KTtcbiAgICB2YXIgcm9vdENvbnRhaW5zVGFyZ2V0ID0gdGhpcy5fcm9vdENvbnRhaW5zVGFyZ2V0KHRhcmdldCk7XG4gICAgdmFyIG9sZEVudHJ5ID0gaXRlbS5lbnRyeTtcbiAgICB2YXIgaW50ZXJzZWN0aW9uUmVjdCA9IHJvb3RJc0luRG9tICYmIHJvb3RDb250YWluc1RhcmdldCAmJlxuICAgICAgICB0aGlzLl9jb21wdXRlVGFyZ2V0QW5kUm9vdEludGVyc2VjdGlvbih0YXJnZXQsIHJvb3RSZWN0KTtcblxuICAgIHZhciBuZXdFbnRyeSA9IGl0ZW0uZW50cnkgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeSh7XG4gICAgICB0aW1lOiBub3coKSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgYm91bmRpbmdDbGllbnRSZWN0OiB0YXJnZXRSZWN0LFxuICAgICAgcm9vdEJvdW5kczogcm9vdFJlY3QsXG4gICAgICBpbnRlcnNlY3Rpb25SZWN0OiBpbnRlcnNlY3Rpb25SZWN0XG4gICAgfSk7XG5cbiAgICBpZiAoIW9sZEVudHJ5KSB7XG4gICAgICB0aGlzLl9xdWV1ZWRFbnRyaWVzLnB1c2gobmV3RW50cnkpO1xuICAgIH0gZWxzZSBpZiAocm9vdElzSW5Eb20gJiYgcm9vdENvbnRhaW5zVGFyZ2V0KSB7XG4gICAgICAvLyBJZiB0aGUgbmV3IGVudHJ5IGludGVyc2VjdGlvbiByYXRpbyBoYXMgY3Jvc3NlZCBhbnkgb2YgdGhlXG4gICAgICAvLyB0aHJlc2hvbGRzLCBhZGQgYSBuZXcgZW50cnkuXG4gICAgICBpZiAodGhpcy5faGFzQ3Jvc3NlZFRocmVzaG9sZChvbGRFbnRyeSwgbmV3RW50cnkpKSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlZEVudHJpZXMucHVzaChuZXdFbnRyeSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSByb290IGlzIG5vdCBpbiB0aGUgRE9NIG9yIHRhcmdldCBpcyBub3QgY29udGFpbmVkIHdpdGhpblxuICAgICAgLy8gcm9vdCBidXQgdGhlIHByZXZpb3VzIGVudHJ5IGZvciB0aGlzIHRhcmdldCBoYWQgYW4gaW50ZXJzZWN0aW9uLFxuICAgICAgLy8gYWRkIGEgbmV3IHJlY29yZCBpbmRpY2F0aW5nIHJlbW92YWwuXG4gICAgICBpZiAob2xkRW50cnkgJiYgb2xkRW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgdGhpcy5fcXVldWVkRW50cmllcy5wdXNoKG5ld0VudHJ5KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHRoaXMpO1xuXG4gIGlmICh0aGlzLl9xdWV1ZWRFbnRyaWVzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrKHRoaXMudGFrZVJlY29yZHMoKSwgdGhpcyk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBBY2NlcHRzIGEgdGFyZ2V0IGFuZCByb290IHJlY3QgY29tcHV0ZXMgdGhlIGludGVyc2VjdGlvbiBiZXR3ZWVuIHRoZW5cbiAqIGZvbGxvd2luZyB0aGUgYWxnb3JpdGhtIGluIHRoZSBzcGVjLlxuICogVE9ETyhwaGlsaXB3YWx0b24pOiBhdCB0aGlzIHRpbWUgY2xpcC1wYXRoIGlzIG5vdCBjb25zaWRlcmVkLlxuICogaHR0cHM6Ly93M2MuZ2l0aHViLmlvL0ludGVyc2VjdGlvbk9ic2VydmVyLyNjYWxjdWxhdGUtaW50ZXJzZWN0aW9uLXJlY3QtYWxnb1xuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgVGhlIHRhcmdldCBET00gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IHJvb3RSZWN0IFRoZSBib3VuZGluZyByZWN0IG9mIHRoZSByb290IGFmdGVyIGJlaW5nXG4gKiAgICAgZXhwYW5kZWQgYnkgdGhlIHJvb3RNYXJnaW4gdmFsdWUuXG4gKiBAcmV0dXJuIHs/T2JqZWN0fSBUaGUgZmluYWwgaW50ZXJzZWN0aW9uIHJlY3Qgb2JqZWN0IG9yIHVuZGVmaW5lZCBpZiBub1xuICogICAgIGludGVyc2VjdGlvbiBpcyBmb3VuZC5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5fY29tcHV0ZVRhcmdldEFuZFJvb3RJbnRlcnNlY3Rpb24gPVxuICAgIGZ1bmN0aW9uKHRhcmdldCwgcm9vdFJlY3QpIHtcblxuICAvLyBJZiB0aGUgZWxlbWVudCBpc24ndCBkaXNwbGF5ZWQsIGFuIGludGVyc2VjdGlvbiBjYW4ndCBoYXBwZW4uXG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpLmRpc3BsYXkgPT0gJ25vbmUnKSByZXR1cm47XG5cbiAgdmFyIHRhcmdldFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QodGFyZ2V0KTtcbiAgdmFyIGludGVyc2VjdGlvblJlY3QgPSB0YXJnZXRSZWN0O1xuICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50Tm9kZSh0YXJnZXQpO1xuICB2YXIgYXRSb290ID0gZmFsc2U7XG5cbiAgd2hpbGUgKCFhdFJvb3QpIHtcbiAgICB2YXIgcGFyZW50UmVjdCA9IG51bGw7XG4gICAgdmFyIHBhcmVudENvbXB1dGVkU3R5bGUgPSBwYXJlbnQubm9kZVR5cGUgPT0gMSA/XG4gICAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBhcmVudCkgOiB7fTtcblxuICAgIC8vIElmIHRoZSBwYXJlbnQgaXNuJ3QgZGlzcGxheWVkLCBhbiBpbnRlcnNlY3Rpb24gY2FuJ3QgaGFwcGVuLlxuICAgIGlmIChwYXJlbnRDb21wdXRlZFN0eWxlLmRpc3BsYXkgPT0gJ25vbmUnKSByZXR1cm47XG5cbiAgICBpZiAocGFyZW50ID09IHRoaXMucm9vdCB8fCBwYXJlbnQgPT0gZG9jdW1lbnQpIHtcbiAgICAgIGF0Um9vdCA9IHRydWU7XG4gICAgICBwYXJlbnRSZWN0ID0gcm9vdFJlY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGhhcyBhIG5vbi12aXNpYmxlIG92ZXJmbG93LCBhbmQgaXQncyBub3QgdGhlIDxib2R5PlxuICAgICAgLy8gb3IgPGh0bWw+IGVsZW1lbnQsIHVwZGF0ZSB0aGUgaW50ZXJzZWN0aW9uIHJlY3QuXG4gICAgICAvLyBOb3RlOiA8Ym9keT4gYW5kIDxodG1sPiBjYW5ub3QgYmUgY2xpcHBlZCB0byBhIHJlY3QgdGhhdCdzIG5vdCBhbHNvXG4gICAgICAvLyB0aGUgZG9jdW1lbnQgcmVjdCwgc28gbm8gbmVlZCB0byBjb21wdXRlIGEgbmV3IGludGVyc2VjdGlvbi5cbiAgICAgIGlmIChwYXJlbnQgIT0gZG9jdW1lbnQuYm9keSAmJlxuICAgICAgICAgIHBhcmVudCAhPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcbiAgICAgICAgICBwYXJlbnRDb21wdXRlZFN0eWxlLm92ZXJmbG93ICE9ICd2aXNpYmxlJykge1xuICAgICAgICBwYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgZWl0aGVyIG9mIHRoZSBhYm92ZSBjb25kaXRpb25hbHMgc2V0IGEgbmV3IHBhcmVudFJlY3QsXG4gICAgLy8gY2FsY3VsYXRlIG5ldyBpbnRlcnNlY3Rpb24gZGF0YS5cbiAgICBpZiAocGFyZW50UmVjdCkge1xuICAgICAgaW50ZXJzZWN0aW9uUmVjdCA9IGNvbXB1dGVSZWN0SW50ZXJzZWN0aW9uKHBhcmVudFJlY3QsIGludGVyc2VjdGlvblJlY3QpO1xuXG4gICAgICBpZiAoIWludGVyc2VjdGlvblJlY3QpIGJyZWFrO1xuICAgIH1cbiAgICBwYXJlbnQgPSBnZXRQYXJlbnROb2RlKHBhcmVudCk7XG4gIH1cbiAgcmV0dXJuIGludGVyc2VjdGlvblJlY3Q7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcm9vdCByZWN0IGFmdGVyIGJlaW5nIGV4cGFuZGVkIGJ5IHRoZSByb290TWFyZ2luIHZhbHVlLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXhwYW5kZWQgcm9vdCByZWN0LlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9nZXRSb290UmVjdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFJlY3Q7XG4gIGlmICh0aGlzLnJvb3QpIHtcbiAgICByb290UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdCh0aGlzLnJvb3QpO1xuICB9IGVsc2Uge1xuICAgIC8vIFVzZSA8aHRtbD4vPGJvZHk+IGluc3RlYWQgb2Ygd2luZG93IHNpbmNlIHNjcm9sbCBiYXJzIGFmZmVjdCBzaXplLlxuICAgIHZhciBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICByb290UmVjdCA9IHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICByaWdodDogaHRtbC5jbGllbnRXaWR0aCB8fCBib2R5LmNsaWVudFdpZHRoLFxuICAgICAgd2lkdGg6IGh0bWwuY2xpZW50V2lkdGggfHwgYm9keS5jbGllbnRXaWR0aCxcbiAgICAgIGJvdHRvbTogaHRtbC5jbGllbnRIZWlnaHQgfHwgYm9keS5jbGllbnRIZWlnaHQsXG4gICAgICBoZWlnaHQ6IGh0bWwuY2xpZW50SGVpZ2h0IHx8IGJvZHkuY2xpZW50SGVpZ2h0XG4gICAgfTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXhwYW5kUmVjdEJ5Um9vdE1hcmdpbihyb290UmVjdCk7XG59O1xuXG5cbi8qKlxuICogQWNjZXB0cyBhIHJlY3QgYW5kIGV4cGFuZHMgaXQgYnkgdGhlIHJvb3RNYXJnaW4gdmFsdWUuXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjdCBUaGUgcmVjdCBvYmplY3QgdG8gZXhwYW5kLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgZXhwYW5kZWQgcmVjdC5cbiAqIEBwcml2YXRlXG4gKi9cbkludGVyc2VjdGlvbk9ic2VydmVyLnByb3RvdHlwZS5fZXhwYW5kUmVjdEJ5Um9vdE1hcmdpbiA9IGZ1bmN0aW9uKHJlY3QpIHtcbiAgdmFyIG1hcmdpbnMgPSB0aGlzLl9yb290TWFyZ2luVmFsdWVzLm1hcChmdW5jdGlvbihtYXJnaW4sIGkpIHtcbiAgICByZXR1cm4gbWFyZ2luLnVuaXQgPT0gJ3B4JyA/IG1hcmdpbi52YWx1ZSA6XG4gICAgICAgIG1hcmdpbi52YWx1ZSAqIChpICUgMiA/IHJlY3Qud2lkdGggOiByZWN0LmhlaWdodCkgLyAxMDA7XG4gIH0pO1xuICB2YXIgbmV3UmVjdCA9IHtcbiAgICB0b3A6IHJlY3QudG9wIC0gbWFyZ2luc1swXSxcbiAgICByaWdodDogcmVjdC5yaWdodCArIG1hcmdpbnNbMV0sXG4gICAgYm90dG9tOiByZWN0LmJvdHRvbSArIG1hcmdpbnNbMl0sXG4gICAgbGVmdDogcmVjdC5sZWZ0IC0gbWFyZ2luc1szXVxuICB9O1xuICBuZXdSZWN0LndpZHRoID0gbmV3UmVjdC5yaWdodCAtIG5ld1JlY3QubGVmdDtcbiAgbmV3UmVjdC5oZWlnaHQgPSBuZXdSZWN0LmJvdHRvbSAtIG5ld1JlY3QudG9wO1xuXG4gIHJldHVybiBuZXdSZWN0O1xufTtcblxuXG4vKipcbiAqIEFjY2VwdHMgYW4gb2xkIGFuZCBuZXcgZW50cnkgYW5kIHJldHVybnMgdHJ1ZSBpZiBhdCBsZWFzdCBvbmUgb2YgdGhlXG4gKiB0aHJlc2hvbGQgdmFsdWVzIGhhcyBiZWVuIGNyb3NzZWQuXG4gKiBAcGFyYW0gez9JbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5fSBvbGRFbnRyeSBUaGUgcHJldmlvdXMgZW50cnkgZm9yIGFcbiAqICAgIHBhcnRpY3VsYXIgdGFyZ2V0IGVsZW1lbnQgb3IgbnVsbCBpZiBubyBwcmV2aW91cyBlbnRyeSBleGlzdHMuXG4gKiBAcGFyYW0ge0ludGVyc2VjdGlvbk9ic2VydmVyRW50cnl9IG5ld0VudHJ5IFRoZSBjdXJyZW50IGVudHJ5IGZvciBhXG4gKiAgICBwYXJ0aWN1bGFyIHRhcmdldCBlbGVtZW50LlxuICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGEgYW55IHRocmVzaG9sZCBoYXMgYmVlbiBjcm9zc2VkLlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9oYXNDcm9zc2VkVGhyZXNob2xkID1cbiAgICBmdW5jdGlvbihvbGRFbnRyeSwgbmV3RW50cnkpIHtcblxuICAvLyBUbyBtYWtlIGNvbXBhcmluZyBlYXNpZXIsIGFuIGVudHJ5IHRoYXQgaGFzIGEgcmF0aW8gb2YgMFxuICAvLyBidXQgZG9lcyBub3QgYWN0dWFsbHkgaW50ZXJzZWN0IGlzIGdpdmVuIGEgdmFsdWUgb2YgLTFcbiAgdmFyIG9sZFJhdGlvID0gb2xkRW50cnkgJiYgb2xkRW50cnkuaXNJbnRlcnNlY3RpbmcgP1xuICAgICAgb2xkRW50cnkuaW50ZXJzZWN0aW9uUmF0aW8gfHwgMCA6IC0xO1xuICB2YXIgbmV3UmF0aW8gPSBuZXdFbnRyeS5pc0ludGVyc2VjdGluZyA/XG4gICAgICBuZXdFbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyB8fCAwIDogLTE7XG5cbiAgLy8gSWdub3JlIHVuY2hhbmdlZCByYXRpb3NcbiAgaWYgKG9sZFJhdGlvID09PSBuZXdSYXRpbykgcmV0dXJuO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50aHJlc2hvbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRocmVzaG9sZCA9IHRoaXMudGhyZXNob2xkc1tpXTtcblxuICAgIC8vIFJldHVybiB0cnVlIGlmIGFuIGVudHJ5IG1hdGNoZXMgYSB0aHJlc2hvbGQgb3IgaWYgdGhlIG5ldyByYXRpb1xuICAgIC8vIGFuZCB0aGUgb2xkIHJhdGlvIGFyZSBvbiB0aGUgb3Bwb3NpdGUgc2lkZXMgb2YgYSB0aHJlc2hvbGQuXG4gICAgaWYgKHRocmVzaG9sZCA9PSBvbGRSYXRpbyB8fCB0aHJlc2hvbGQgPT0gbmV3UmF0aW8gfHxcbiAgICAgICAgdGhyZXNob2xkIDwgb2xkUmF0aW8gIT09IHRocmVzaG9sZCA8IG5ld1JhdGlvKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSByb290IGVsZW1lbnQgaXMgYW4gZWxlbWVudCBhbmQgaXMgaW4gdGhlIERPTS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIHJvb3QgZWxlbWVudCBpcyBhbiBlbGVtZW50IGFuZCBpcyBpbiB0aGUgRE9NLlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9yb290SXNJbkRvbSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMucm9vdCB8fCBjb250YWluc0RlZXAoZG9jdW1lbnQsIHRoaXMucm9vdCk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSBjaGlsZCBvZiByb290LlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgVGhlIHRhcmdldCBlbGVtZW50IHRvIGNoZWNrLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSBjaGlsZCBvZiByb290LlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9yb290Q29udGFpbnNUYXJnZXQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgcmV0dXJuIGNvbnRhaW5zRGVlcCh0aGlzLnJvb3QgfHwgZG9jdW1lbnQsIHRhcmdldCk7XG59O1xuXG5cbi8qKlxuICogQWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGdsb2JhbCBJbnRlcnNlY3Rpb25PYnNlcnZlciByZWdpc3RyeSBpZiBpdCBpc24ndFxuICogYWxyZWFkeSBwcmVzZW50LlxuICogQHByaXZhdGVcbiAqL1xuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIucHJvdG90eXBlLl9yZWdpc3Rlckluc3RhbmNlID0gZnVuY3Rpb24oKSB7XG4gIGlmIChyZWdpc3RyeS5pbmRleE9mKHRoaXMpIDwgMCkge1xuICAgIHJlZ2lzdHJ5LnB1c2godGhpcyk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbnN0YW5jZSBmcm9tIHRoZSBnbG9iYWwgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgcmVnaXN0cnkuXG4gKiBAcHJpdmF0ZVxuICovXG5JbnRlcnNlY3Rpb25PYnNlcnZlci5wcm90b3R5cGUuX3VucmVnaXN0ZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW5kZXggPSByZWdpc3RyeS5pbmRleE9mKHRoaXMpO1xuICBpZiAoaW5kZXggIT0gLTEpIHJlZ2lzdHJ5LnNwbGljZShpbmRleCwgMSk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBwZXJmb3JtYW5jZS5ub3coKSBtZXRob2Qgb3IgbnVsbCBpbiBicm93c2Vyc1xuICogdGhhdCBkb24ndCBzdXBwb3J0IHRoZSBBUEkuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBlbGFwc2VkIHRpbWUgc2luY2UgdGhlIHBhZ2Ugd2FzIHJlcXVlc3RlZC5cbiAqL1xuZnVuY3Rpb24gbm93KCkge1xuICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlICYmIHBlcmZvcm1hbmNlLm5vdyAmJiBwZXJmb3JtYW5jZS5ub3coKTtcbn1cblxuXG4vKipcbiAqIFRocm90dGxlcyBhIGZ1bmN0aW9uIGFuZCBkZWxheXMgaXRzIGV4ZWN1dGlvbiwgc28gaXQncyBvbmx5IGNhbGxlZCBhdCBtb3N0XG4gKiBvbmNlIHdpdGhpbiBhIGdpdmVuIHRpbWUgcGVyaW9kLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgVGhlIGFtb3VudCBvZiB0aW1lIHRoYXQgbXVzdCBwYXNzIGJlZm9yZSB0aGVcbiAqICAgICBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIGFnYWluLlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCB0aW1lb3V0KSB7XG4gIHZhciB0aW1lciA9IG51bGw7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aW1lcikge1xuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmbigpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICB9LCB0aW1lb3V0KTtcbiAgICB9XG4gIH07XG59XG5cblxuLyoqXG4gKiBBZGRzIGFuIGV2ZW50IGhhbmRsZXIgdG8gYSBET00gbm9kZSBlbnN1cmluZyBjcm9zcy1icm93c2VyIGNvbXBhdGliaWxpdHkuXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIERPTSBub2RlIHRvIGFkZCB0aGUgZXZlbnQgaGFuZGxlciB0by5cbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBldmVudCBoYW5kbGVyIHRvIGFkZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0X3VzZUNhcHR1cmUgT3B0aW9uYWxseSBhZGRzIHRoZSBldmVuIHRvIHRoZSBjYXB0dXJlXG4gKiAgICAgcGhhc2UuIE5vdGU6IHRoaXMgb25seSB3b3JrcyBpbiBtb2Rlcm4gYnJvd3NlcnMuXG4gKi9cbmZ1bmN0aW9uIGFkZEV2ZW50KG5vZGUsIGV2ZW50LCBmbiwgb3B0X3VzZUNhcHR1cmUpIHtcbiAgaWYgKHR5cGVvZiBub2RlLmFkZEV2ZW50TGlzdGVuZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZm4sIG9wdF91c2VDYXB0dXJlIHx8IGZhbHNlKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2Ygbm9kZS5hdHRhY2hFdmVudCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgbm9kZS5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGZuKTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmVtb3ZlcyBhIHByZXZpb3VzbHkgYWRkZWQgZXZlbnQgaGFuZGxlciBmcm9tIGEgRE9NIG5vZGUuXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIERPTSBub2RlIHRvIHJlbW92ZSB0aGUgZXZlbnQgaGFuZGxlciBmcm9tLlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGV2ZW50IGhhbmRsZXIgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtib29sZWFufSBvcHRfdXNlQ2FwdHVyZSBJZiB0aGUgZXZlbnQgaGFuZGxlciB3YXMgYWRkZWQgd2l0aCB0aGlzXG4gKiAgICAgZmxhZyBzZXQgdG8gdHJ1ZSwgaXQgc2hvdWxkIGJlIHNldCB0byB0cnVlIGhlcmUgaW4gb3JkZXIgdG8gcmVtb3ZlIGl0LlxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudChub2RlLCBldmVudCwgZm4sIG9wdF91c2VDYXB0dXJlKSB7XG4gIGlmICh0eXBlb2Ygbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyID09ICdmdW5jdGlvbicpIHtcbiAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGZuLCBvcHRfdXNlQ2FwdHVyZSB8fCBmYWxzZSk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIG5vZGUuZGV0YXRjaEV2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICBub2RlLmRldGF0Y2hFdmVudCgnb24nICsgZXZlbnQsIGZuKTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW50ZXJzZWN0aW9uIGJldHdlZW4gdHdvIHJlY3Qgb2JqZWN0cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSByZWN0MSBUaGUgZmlyc3QgcmVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSByZWN0MiBUaGUgc2Vjb25kIHJlY3QuXG4gKiBAcmV0dXJuIHs/T2JqZWN0fSBUaGUgaW50ZXJzZWN0aW9uIHJlY3Qgb3IgdW5kZWZpbmVkIGlmIG5vIGludGVyc2VjdGlvblxuICogICAgIGlzIGZvdW5kLlxuICovXG5mdW5jdGlvbiBjb21wdXRlUmVjdEludGVyc2VjdGlvbihyZWN0MSwgcmVjdDIpIHtcbiAgdmFyIHRvcCA9IE1hdGgubWF4KHJlY3QxLnRvcCwgcmVjdDIudG9wKTtcbiAgdmFyIGJvdHRvbSA9IE1hdGgubWluKHJlY3QxLmJvdHRvbSwgcmVjdDIuYm90dG9tKTtcbiAgdmFyIGxlZnQgPSBNYXRoLm1heChyZWN0MS5sZWZ0LCByZWN0Mi5sZWZ0KTtcbiAgdmFyIHJpZ2h0ID0gTWF0aC5taW4ocmVjdDEucmlnaHQsIHJlY3QyLnJpZ2h0KTtcbiAgdmFyIHdpZHRoID0gcmlnaHQgLSBsZWZ0O1xuICB2YXIgaGVpZ2h0ID0gYm90dG9tIC0gdG9wO1xuXG4gIHJldHVybiAod2lkdGggPj0gMCAmJiBoZWlnaHQgPj0gMCkgJiYge1xuICAgIHRvcDogdG9wLFxuICAgIGJvdHRvbTogYm90dG9tLFxuICAgIGxlZnQ6IGxlZnQsXG4gICAgcmlnaHQ6IHJpZ2h0LFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xufVxuXG5cbi8qKlxuICogU2hpbXMgdGhlIG5hdGl2ZSBnZXRCb3VuZGluZ0NsaWVudFJlY3QgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBvbGRlciBJRS5cbiAqIEBwYXJhbSB7RWxlbWVudH0gZWwgVGhlIGVsZW1lbnQgd2hvc2UgYm91bmRpbmcgcmVjdCB0byBnZXQuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSAocG9zc2libHkgc2hpbW1lZCkgcmVjdCBvZiB0aGUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsKSB7XG4gIHZhciByZWN0O1xuXG4gIHRyeSB7XG4gICAgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBJZ25vcmUgV2luZG93cyA3IElFMTEgXCJVbnNwZWNpZmllZCBlcnJvclwiXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3czYy9JbnRlcnNlY3Rpb25PYnNlcnZlci9wdWxsLzIwNVxuICB9XG5cbiAgaWYgKCFyZWN0KSByZXR1cm4gZ2V0RW1wdHlSZWN0KCk7XG5cbiAgLy8gT2xkZXIgSUVcbiAgaWYgKCEocmVjdC53aWR0aCAmJiByZWN0LmhlaWdodCkpIHtcbiAgICByZWN0ID0ge1xuICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgIHJpZ2h0OiByZWN0LnJpZ2h0LFxuICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcbiAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgIHdpZHRoOiByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0LFxuICAgICAgaGVpZ2h0OiByZWN0LmJvdHRvbSAtIHJlY3QudG9wXG4gICAgfTtcbiAgfVxuICByZXR1cm4gcmVjdDtcbn1cblxuXG4vKipcbiAqIFJldHVybnMgYW4gZW1wdHkgcmVjdCBvYmplY3QuIEFuIGVtcHR5IHJlY3QgaXMgcmV0dXJuZWQgd2hlbiBhbiBlbGVtZW50XG4gKiBpcyBub3QgaW4gdGhlIERPTS5cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIGVtcHR5IHJlY3QuXG4gKi9cbmZ1bmN0aW9uIGdldEVtcHR5UmVjdCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwXG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIHRvIHNlZSBpZiBhIHBhcmVudCBlbGVtZW50IGNvbnRhaW5zIGEgY2hpbGQgZWxlbWVudCAoaW5jbHVkaW5nIGluc2lkZVxuICogc2hhZG93IERPTSkuXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCBUaGUgcGFyZW50IGVsZW1lbnQuXG4gKiBAcGFyYW0ge05vZGV9IGNoaWxkIFRoZSBjaGlsZCBlbGVtZW50LlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcGFyZW50IG5vZGUgY29udGFpbnMgdGhlIGNoaWxkIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGNvbnRhaW5zRGVlcChwYXJlbnQsIGNoaWxkKSB7XG4gIHZhciBub2RlID0gY2hpbGQ7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgaWYgKG5vZGUgPT0gcGFyZW50KSByZXR1cm4gdHJ1ZTtcblxuICAgIG5vZGUgPSBnZXRQYXJlbnROb2RlKG5vZGUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEdldHMgdGhlIHBhcmVudCBub2RlIG9mIGFuIGVsZW1lbnQgb3IgaXRzIGhvc3QgZWxlbWVudCBpZiB0aGUgcGFyZW50IG5vZGVcbiAqIGlzIGEgc2hhZG93IHJvb3QuXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIG5vZGUgd2hvc2UgcGFyZW50IHRvIGdldC5cbiAqIEByZXR1cm4ge05vZGV8bnVsbH0gVGhlIHBhcmVudCBub2RlIG9yIG51bGwgaWYgbm8gcGFyZW50IGV4aXN0cy5cbiAqL1xuZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShub2RlKSB7XG4gIHZhciBwYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG5cbiAgaWYgKHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT0gMTEgJiYgcGFyZW50Lmhvc3QpIHtcbiAgICAvLyBJZiB0aGUgcGFyZW50IGlzIGEgc2hhZG93IHJvb3QsIHJldHVybiB0aGUgaG9zdCBlbGVtZW50LlxuICAgIHJldHVybiBwYXJlbnQuaG9zdDtcbiAgfVxuICByZXR1cm4gcGFyZW50O1xufVxuXG5cbi8vIEV4cG9zZXMgdGhlIGNvbnN0cnVjdG9ycyBnbG9iYWxseS5cbndpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlciA9IEludGVyc2VjdGlvbk9ic2VydmVyO1xud2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyRW50cnkgPSBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5O1xuXG59KHdpbmRvdywgZG9jdW1lbnQpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=
window.fmmp = window.fmmp || {};

fmmp.ng = angular.module('fmmp.base', [
    'breakpointApp',
    'ngAnimate',
    'ngCookies',
    'ngTouch'
]);

fmmp.ng.config(['$rootScopeProvider', function ($rootScopeProvider) {
    // with increasing amount of angular compilations in WCM author mode, we need to increase
    // the threshold, default is 10
    $rootScopeProvider.digestTtl(15);
}]);


fmmp.ng.run(['$log', 'util', function ($log, util) {
    // fire angular compilation when content is available on author mode
    // also fires when components are created, moved, modified, or deleted
    angular.element('body').on('angular-refresh', function (event, elem) {
        angular.element('body').injector().invoke(['$compile', function ($compile) {
            var $scope = angular.element(elem).scope();
            $compile(elem)($scope);
            $scope.$digest();
            $log.debug('refreshed angular for ' + util.replaceBlank($(elem).find("> cq").data("path"), "(unknown)"));
        }]);
    });
}]);

// Similar to the above fix for the author edit mode, we need to $compile teaser elements that may contain angular code
// after they have been loaded into the DOM.
(function () {
    if (window.CQ_Analytics && CQ_Analytics.Utils && CQ_Analytics.Utils.loadTeaserElement) {
        // Save the original function to be called later
        var _loadTeaserElement = CQ_Analytics.Utils.loadTeaserElement;

        // override the existing function to add some of our code
        CQ_Analytics.Utils.loadTeaserElement = function (url, elemId) {
            var targetElement = $CQ('#' + elemId)[0];
            if (targetElement && targetElement.parentElement) {
                $CQ(targetElement.parentElement).on('target-dom-loaded', function (event) {
                    angular.element('body').trigger('angular-refresh', targetElement);
                });
            }

            // Continue on with the existing functionality to load and inject the targeted element into the DOM
            _loadTeaserElement(url, elemId);
        };
    }
})();

/**
 * Controller to check the available page segments. Mostly used by navigation to hide/show links.
 */
fmmp.ng.controller('segmentController', ['$scope', 'util', 'segments', function ($scope, util, segments) {

    /**
     * check if the segmentValue(s) defined in page props is/are in the list of segments currently on the page
     */
    $scope.checkSegment = function(segmentValue) {
        
        if (util.isBlank(segmentValue)) {
            return true;
        }
        
        var segmentArray = segmentValue.split(',');
        var returnVal = false;
        angular.forEach(segmentArray, function (value) {
            if (segments.pageSegments.indexOf(value) !== -1) {
                returnVal = true;
                return;
            }
        });

        return returnVal;
    };
    
    $scope.setPageSegments = function() {
        segments.pageSegments = CQ_Analytics.SegmentMgr.getResolved();
    };
    
}]);
// wrapper for hs2 `AEMUtil` so controllers don't have implicit references
fmmp.ng.factory('aem-util', function () {
    return AEMUtil;
});
/**
 * Factory used by the segmentController
 */
fmmp.ng.factory('segments', function() {
    return {
        pageSegments : []
    }
});
// wrapper for hs2 `Util` so controllers don't have implicit references
fmmp.ng.factory('util', function () {
    return Util;
});
fmmp.ng.filter('addressLine', ['util', function(util) {
    return function(address) {
        var addrPieces = [];
        if (address) {
            if (address) {
                util.isNotBlank(address.street) && addrPieces.push(address.street);
                util.isNotBlank(address.city) && addrPieces.push(address.city);
                util.isNotBlank(address.region) && addrPieces.push(address.region);
                util.isNotBlank(address.postalCode) && addrPieces.push(address.postalCode);
            }
        }
        return addrPieces.join(", ");
    };
}]);
fmmp.ng.filter('encodeURIComponent', function() {
    return window.encodeURIComponent;
});
fmmp.ng.filter('extension', [function() {
    var regex = /\.([^.]+)$/;
    return function (path) {
        var match = regex.exec(path);
        if (match) {
            return match[1];
        }
        return null;
    };
}]);
fmmp.ng.filter('isEmpty', ['util', function(util) {
    return function (obj) {
        if (obj == null) {
            return true;
        }
        if (typeof obj === 'string') {
            return util.isEmpty(obj);
        }
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    };
}]);
fmmp.ng.filter('values', ['util', function(util) {
    return function (map) {
        return util.getAll(map);
    };
}]);
fmmp.ng.factory('analytics', ['$window', '$log', 'util', 'aem-util', function ($window, $log, util, aemUtil) {
    return {
        trackEvent: function (category, action, label, value, opts) {
            var event = {
                event: "gtmCustomEvent",
                gtmEventCategory: category,
                gtmEventAction: action,
                gtmEventLabel: label,
                gtmEventValue: value
            };

            this.doTrackEvent(event, opts)
        },

        trackCampaignEvent: function (event, category, action, label, value, opts) {
            var dataRegionValue = $('body').data('region');

            var event;

            if (dataRegionValue === "loc-emea") {
                var valuesArray = label.split('|');
                event = {
                    event: event,
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: label,
                    eventData: {
                        category: valuesArray[0],
                        brand: valuesArray[1],
                        model: valuesArray[2],
                        variant: valuesArray[3],
                        motor: valuesArray[4]
                    },
                    eventValue: value,
                    eventNonInteraction: false
                };

            }
            else {

                event = {
                    event: event,
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: label,
                    eventValue: value,
                    eventNonInteraction: false
                };
            }

            $log.debug("Trying to push campaign GA event:", event);
            this.doTrackEvent(event, opts);

        },

        doTrackEvent: function (event, opts) {
            opts = opts || {};

            event = event || {};

            var pushEvent = function () {
                // If google tag manager is not added to the site, this
                // function will be a noop. However, we cannot skip the
                // rest of the trackEvent code because we need the callback
                // function (if specified) to still be executed.
                if ($window.dataLayer) {
                    $window.dataLayer.push(event);

                    if (aemUtil.isDevMode()) {
                        $log.debug(event);
                    }
                }
            };

            if (opts.callback) {
                var callbackExecuted = false;
                var doCallbackOnce = function () {
                    if (!callbackExecuted) {
                        callbackExecuted = true;
                        opts.callback();
                    }
                };

                // Push the event to google tag manager with a callback
                event.eventCallback = doCallbackOnce;
                pushEvent();

                if ($window.dataLayer && $window.google_tag_manager) {
                    // If google tag manager is loaded, wait a maximum of 2
                    // seconds before otherwise executing the callback manually.
                    setTimeout(function () {
                        doCallbackOnce();
                    }, 2000);
                } else {
                    // If google tag manager is not loaded, call the callback
                    // immediately instead of pointlessly waiting for 2 seconds.
                    // However, still do with setTimeout() so that the callback
                    // is executed asynchronously, to match the behavior of when
                    // it is a callback to an event.
                    setTimeout(function () {
                        doCallbackOnce();
                    }, 0);
                }
            } else {
                // If there is no callback, simply push the event
                pushEvent();
            }
        }
    }
}]);
fmmp.ng.factory('dataUtil', ['$rootScope', '$log', 'util', function ($rootScope, $log, util) {
    var _this = {
        /**
         * This will check part/fitment attribute/criteria types to determine if the type is "Supplementary X"
         * We have a hack in place to replace it with a translated value of "Additional Info"
         *
         * @param type
         * @returns {boolean}
         */
        isSupplementaryInfoType: function (type) {
            return type == 596 || type == 836;
        }
    };
    return _this;
}]);
(function($) {
    fmmp.ng.factory('scroll', ['$rootScope', 'util', function ($rootScope, util) {
        var scrollSvc = {
            extraWindowOffsetsTop: {},

            to: function (e) {
                var offset = e.offset().top;
                util.getAll(this.extraWindowOffsetsTop).forEach(function (extraOffset) {
                    offset -= extraOffset;
                });
                $('html, body').animate({scrollTop: Math.max(offset, 0)}, "fast");
            }
        };

        $rootScope.$on('windowOffsetTop.change', function (event, key, pixels) {
            scrollSvc.extraWindowOffsetsTop[key] = pixels;
        });

        return scrollSvc;
    }]);
})(jQuery);

fmmp.ng.factory('urlHash', ['$window', '$location', '$rootScope', '$log', 'util', function ($window, $location, $rootScope, $log, util) {
    var _this = {
        hashChangeListeners: null,

        onHashChange: function (fn, $scope) {
            if (!_this.hashChangeListeners) {
                _this.hashChangeListeners = [];

                var deregisterFnForLocationWatch = $rootScope.$watch(function () {
                    // Note that $location is needed for this $watch to work
                    return $window.location.hash;
                }, function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        var newParams = util.parseQueryString(newVal.substr(1));
                        var oldParams = util.parseQueryString(oldVal.substr(1));
                        // Doing a second equals check just in case the two were different only due to encoded characters
                        if (!angular.equals(newParams, oldParams)) {
                            for (var i = 0; i < _this.hashChangeListeners.length; i++) {
                                try {
                                    _this.hashChangeListeners[i](newParams, oldParams);
                                } catch (e) {
                                    $log.error(e);
                                }
                            }
                        }
                    }
                });

                $rootScope.$on('$destroy', function () {
                    deregisterFnForLocationWatch();
                });
            }

            // Add the function to the list of listeners
            var newIdx = _this.hashChangeListeners.length;
            _this.hashChangeListeners[newIdx] = fn;

            // If the function has a scope, effectively remove it from
            // the list of listeners on scope destroy
            if ($scope) {
                $scope.$on('$destroy', function () {
                    _this.hashChangeListeners[newIdx] = function () {
                        // no-op
                    };
                });
            }
        }
    };
    return _this;
}]);
fmmp.ng.factory('urlLocation', ['$window', 'util', function ($window, util) {
    return {
        redirect: function(url) {
            if (util.isAbsoluteHttpUrl(url)) {
                return $window.open(url, '_blank');
            } else {
                $window.location.href = url;
            }
        }
    };
}]);
/**
 * Created by alimoussa on 7/20/16.
 */
(function () {
    'use strict';

    fmmp.ng.factory('CookieService', ['$log', '$cookies', function ($log, $cookies) {

        var region = $("body").data("region") || "";

        var CookieService = {};
        var ACCEPT_COOKIE_NAME = "cookies-accepted";
        var DECLINE_COOKIE_NAME = "cookies-declined";

        CookieService.putObject = function(key, value, properties) {
            if ($cookies.getObject(ACCEPT_COOKIE_NAME)) {
                if (properties.expires) {
                    var expireDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                    if (properties.expires > expireDate) {
                        properties.expires = expireDate;
                    }
                }
            } else if (region !== "loc-na" && region !== "loc-apac" && region !== "loc-latam") {
                delete properties.expires;
            }

            $cookies.putObject(key, value, properties);
        };

        CookieService.getObject = function(key) {
            return $cookies.getObject(key);
        };

        CookieService.acceptCookies = function() {
            var expireDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
            $cookies.putObject(ACCEPT_COOKIE_NAME, true, {expires:expireDate, path:"/"});
        };

        CookieService.declineCookies = function() {
            $cookies.putObject(DECLINE_COOKIE_NAME, true);
        };

        CookieService.checkCookiesAcknowledged = function() {
            if (region === "loc-na" || region === "loc-apac" || region === "loc-latam"
                || $cookies.getObject(ACCEPT_COOKIE_NAME) || $cookies.getObject(DECLINE_COOKIE_NAME)) {
                // if cookies accepted or declined, don't show the message anymore
                return true;
            } else {
                // user hasn't selected one way or the other, show message
                return false;
            }
        };

        return CookieService;
    }]);

})();
(function () {
    /**
     * Using events, either hide or show a class.
     *
     * Usage: &lt;div add-remove-class="'hide-mobile'" applied-initially="'true'" removeEvents="['tabSelected']"&gt;
     *
     * This will initially add "hide-mobile" to the div, and remove it whenever it receives a "tabSelected" event.
     */
    fmmp.ng.directive('addRemoveClass', function () {
        return {
            restrict: 'A',
            scope: {
                classToToggle: '=addRemoveClass',
                appliedInitially: '=',
                removeEvents: '=',
                addEvents: '=',
                overrideHidden: '='
            },
            link: function ($scope, $element) {
                if ($scope.appliedInitially && !$scope.overrideHidden) {
                    $element.addClass($scope.classToToggle);
                }

                var eventListenerCancellers = [];

                if (angular.isDefined($scope.removeEvents)) {
                    for (var i = 0; i < $scope.removeEvents.length; i++) {
                        eventListenerCancellers.push(
                            $scope.$on($scope.removeEvents[i], function () {
                                $element.removeClass($scope.classToToggle);
                            })
                        );
                    }
                }

                if (angular.isDefined($scope.addEvents)) {
                    for (var i = 0; i < $scope.addEvents.length; i++) {
                        eventListenerCancellers.push(
                            $scope.$on($scope.addEvents[i], function () {
                                if (!$scope.overrideHidden) {
                                    $element.addClass($scope.classToToggle);
                                }
                            })
                        );
                    }
                }

                // Remove listeners on cleanup
                $scope.$on('$destroy', function () {
                    for (var i = 0; i < eventListenerCancellers.length; i++) {
                        var fn = eventListenerCancellers[i];
                        fn();
                    }
                });

            }
        };
    });

})();
/**
 * This is adds onclick event to go back one page in history for "back-History-Button" class
 */
fmmp.ng.directive('backHistoryButton', function () {
    return {
        restrict: 'C',
        /**
         * Link post compile
         * @param {$scope} $scope
         * @param {$element} $element
         */
        link: function ($scope, $element) {
            $element.on('click', function () {
                history.back(-1);
            });
        }
    }
});
/**
 * This provides the functionality for RTE-generated accordions 
 */
fmmp.ng.directive('rteAccordion', function () {

    return {
    	
        restrict: 'C',
        link: function ($scope, $element) {
        	
            // Trigger the show/hide on click of the accordion headline
            $( '.accordion-header', $element ).click(function(){

                var selected = $(this);

                //Expand or collapse this panel
                selected.next().slideToggle('fast');
                selected.parent().toggleClass('active');

                //Hide the other panels
                $( 'li', $element ).not(selected.parent()).removeClass('active');
                $( '.accordion-content', $element ).not(selected.next()).slideUp('fast');
            });
            
            var first = $( '.accordion-item', $element ).first();
            $( '.accordion-header', first ).click();
            
           
        }
    };
});
fmmp.ng.directive('bodyFrameContent', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'C',
        scope: true,
        /**
         * Handle open/closing off-canvas content and disable scrolling when the off canvas content is active
         * @param $scope
         * @param $element
         */
        link: function ($scope, $element) {
            var $body = angular.element('body');
            const mobileNavItems = document.getElementsByClassName('mobile-nav-items')[0];
            const mobileNavItemList = mobileNavItems.getElementsByClassName('root-item');
            const firstMobileNavItem= mobileNavItemList[0];
            const bodyFrameContent = document.getElementsByClassName('body-frame-content')[0];
            firstMobileNavItem.setAttribute('id', 'first-mobile-nav-link');

            $scope.sideContentActive = false;
            $scope.globalContentActive = false;

            // Mobile Navigation
            $rootScope.$on('side-content.open', function () {
                mobileNavItems.setAttribute('aria-expanded', 'true');
                $scope.globalContentActive = false;
                $scope.sideContentActive = $scope.sideContentActive ? false : true;
                $scope.sideContentActive ? $body.addClass('disable-scrolling') : $body.removeClass('disable-scrolling');
                if (bodyFrameContent) bodyFrameContent.classList.add('side-content-active');
                $(document).keyup((e) => {
                    if (e.key === 'Escape') {
                        $scope.$emit('side-content.close');
                        window.location.hash = 'hamburger-menu';
                    }
                });
            });

            // Global Navigation (Language Selection)
            $rootScope.$on('global-content.open', function () {
                $scope.globalContentActive = true;
                $scope.sideContentActive = false;
                $body.addClass('disable-scrolling');
            });

            $rootScope.$on('global-content.close', function () {
                $scope.globalContentActive = false;
                $scope.sideContentActive = true;
                $body.removeClass('disable-scrolling');
                if (bodyFrameContent) {
                    bodyFrameContent.classList.add('side-content-active');
                }
            });

            $rootScope.$on('side-content.close', function () {
                mobileNavItems.setAttribute('aria-expanded', 'false');
                $scope.globalContentActive = false;
                $scope.sideContentActive = false;
                $body.removeClass('disable-scrolling');
                if (bodyFrameContent) {
                    bodyFrameContent.classList.remove('side-content-active');
                }
            });

        }
    };
}]);
/**
 * This is to inject html if needed for icon moon icons.
 */
fmmp.ng.directive('iconCautionRte', function () {
    return {
        restrict: 'C', // matches by classname
        link: function ($scope, $element) {
            var activeCls = 'icon-caution';
            $element.removeClass("icon-caution-rte");
            $element.addClass("icon-caution");
            $element.html("<span class='path1'></span><span class='path2'></span>");
        }
    };
});
fmmp.ng.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
fmmp.ng.directive('trackEvent', ['$window', 'util', 'analytics', function ($window, util, analytics) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            if ($element[0].tagName.toUpperCase() != 'A') {
                return;
            }

            if (util.isBlank($attrs.trackEvent)) {
                return;
            }

            $element.bind("click", function (event) {
                var href = $(this).attr("href");
                if (util.isBlank(href)) {
                    return;
                }

                var eventParamsStr = $(this).data("track-event");
                if (util.isBlank(eventParamsStr)) {
                    return;
                }

                var target = $(this).attr("target");
                var eventParams = eventParamsStr.split('|');

                var eventOpts = {};
                var openingInCurrentWindow = util.isBlank(target) || target.toUpperCase() === '_SELF';
                if (openingInCurrentWindow) {
                    event.preventDefault();
                    eventOpts.callback = function () {
                        // Give other click events on this link the ability to
                        // cancel the page transition.
                        if (!event.preventDefaultAfterTracking) {
                            $window.location.href = href;
                        }
                    };
                }
                analytics.trackEvent(eventParams[0], eventParams[1], eventParams[2], util.parseInteger(eventParams[3]), eventOpts);
            });
        }
    }
}]);
/**
 * This directive creates a listener that will focus the element it is attached to when it is set to true
 */
fmmp.ng.directive('focusWhenTrue', [function() {
    return {
        scope: { trigger: '=focusWhenTrue' },
        link: function(scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            });
        }
    };
}]);
/**
 * loop through all elements in a given directive
 * and find all standalone IPR symbols and replace them
 */

function replaceIPRSymbols(elements) {
    angular.forEach(elements, function(el) {
        replaceSymbols(el);
    });
}

function replaceSymbols(el) {
    var text = $(el).html();
    // replace only elements not ending in <sup> or <span>
    // <span> elements are to avoid adding an extra span to elements that already
    // have them (RTE elements previous to this ticket that added them automatically)
    var rxp = new RegExp("(©|®|™)(?!((&nbsp;)*<\/sup>)|(&nbsp;)*<\/span>)","g");
    var newText = text.replace(rxp, function myFunction(match){
        if (match === "©") {
            return getCopyrightTag();
        } else if (match === "®") {
            return getRegisteredTag();
        } else if (match === "™") {
            return getTrademarkTag();
        }
    });

    $(el).html(newText);
}

function fixSupElements(elements) {
    angular.forEach(elements, function(o) {
        if (!$(o).hasClass("special_char_COPYRIGHT") && !$(o).hasClass("special_char_REGISTERED") && !$(o).hasClass("special_char_TM")) {
            if ( $(o).html() === "©") {
                $(o).addClass("special_char_COPYRIGHT");
            } else if ( $(o).html() === "®") {
                $(o).addClass("special_char_REGISTERED");
            } else if ( $(o).html() === "™") {
                $(o).addClass("special_char_TM");
            }
        }
    });
}

function getCopyrightTag () { return "<sup class='special_char_COPYRIGHT'>©</sup>"; }
function getRegisteredTag() { return "<sup class='special_char_REGISTERED'>®</sup>"; }
function getTrademarkTag () { return "<sup class='special_char_TM'>™</sup>"; }

//remove Line Separator and Paragraph Separator that only shows up in Chrome browser
document.body.innerHTML = document.body.innerHTML.replace(/\u2028/g, '');

function scopeLinkFunction() {
    return {
        priority: 1,
        restrict: 'E',
        compile: function compile($element) {
            return {
                pre: function preLink($scope, $element) {
                    replaceIPRSymbols($element);
                }
            }
        }
    };
}

function checkSupClasses() {
    return {
        restrict: 'E',
        link: function ($scope, $element) { fixSupElements($element); }
    };
}

fmmp.ng
    .directive('h1', scopeLinkFunction)
    .directive('h2', scopeLinkFunction)
    .directive('h3', scopeLinkFunction)
    .directive('h4', scopeLinkFunction)
    .directive('h5', scopeLinkFunction)
    .directive('h6', scopeLinkFunction)
    .directive('p' , scopeLinkFunction)
    .directive('sup', checkSupClasses);
/**
 * Directive could be used on `iframe` tags to show spinner before it's content is loaded
 *
 * @example
 * <iframe ng-src="https://some-link.com" show-iframe-spinner></iframe>
 *
 * Note:
 * Don't use this directive with `src` tag. In this case iframe content could be loaded before event listener is added.
 * In this case 'load' event won't be fired and spinner will stay visible.
 */
fmmp.ng.directive('showIframeSpinner', function() {
    return {
        restrict: 'A',
        link: function ($scope, $element) {
            $element
                .parent()
                .prepend('<div class="show-spinner show-spinner-iframe"><div class="three-quarters-loader">loading...</div></div>');

            $element.on('load', function() {
                $element.parent().find('.show-spinner-iframe').hide();
            });
        }
    }
});

$('table').each(function() {
    var headertext = [],
        headers = $("th", $(this)),
        tablebody = $("tbody", $(this));

    for ( var h = 0; h < headers.length; h++ ) {
        var current = headers[h];
        headertext.push( current.textContent.replace(/\r?\n|\r/,"") );
    }

    var offset = 0;
    for ( var i = 0; i < tablebody.length; i++ ) {
        if( i > 0 ) {
            offset=offset + tablebody[i-1].rows[0].cells.length;
        }
        for (var j = 0, row; row = tablebody[i].rows[j]; j++) {
            for (var k = 0, col; col = row.cells[k]; k++) {
                if ( headertext[k+offset] ) {
                    col.setAttribute("data-th", headertext[k+offset]);
                }
            }
        }
    }
});
