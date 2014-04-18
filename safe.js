(function(window, undefined) {
    "use strict";
    var History = window.History = window.History || {}, jQuery = window.jQuery;
    if (typeof History.Adapter !== "undefined") {
        throw new Error("History.js Adapter has already been loaded...");
    }
    History.Adapter = {
        bind: function(el, event, callback) {
            jQuery(el).bind(event, callback);
        },
        trigger: function(el, event, extra) {
            jQuery(el).trigger(event, extra);
        },
        extractEventData: function(key, event, extra) {
            var result = event && event.originalEvent && event.originalEvent[key] || extra && extra[key] || undefined;
            return result;
        },
        onDomLoad: function(callback) {
            jQuery(callback);
        }
    };
    if (typeof History.init !== "undefined") {
        History.init();
    }
})(window);

(function(window, undefined) {
    "use strict";
    var console = window.console || undefined, document = window.document, navigator = window.navigator, sessionStorage = false, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, setInterval = window.setInterval, clearInterval = window.clearInterval, JSON = window.JSON, alert = window.alert, History = window.History = window.History || {}, history = window.history;
    try {
        sessionStorage = window.sessionStorage;
        sessionStorage.setItem("TEST", "1");
        sessionStorage.removeItem("TEST");
    } catch (e) {
        sessionStorage = false;
    }
    JSON.stringify = JSON.stringify || JSON.encode;
    JSON.parse = JSON.parse || JSON.decode;
    if (typeof History.init !== "undefined") {
        throw new Error("History.js Core has already been loaded...");
    }
    History.init = function(options) {
        if (typeof History.Adapter === "undefined") {
            return false;
        }
        if (typeof History.initCore !== "undefined") {
            History.initCore();
        }
        if (typeof History.initHtml4 !== "undefined") {
            History.initHtml4();
        }
        return true;
    };
    History.initCore = function(options) {
        if (typeof History.initCore.initialized !== "undefined") {
            return false;
        } else {
            History.initCore.initialized = true;
        }
        History.options = History.options || {};
        History.options.hashChangeInterval = History.options.hashChangeInterval || 100;
        History.options.safariPollInterval = History.options.safariPollInterval || 500;
        History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;
        History.options.disableSuid = History.options.disableSuid || false;
        History.options.storeInterval = History.options.storeInterval || 1e3;
        History.options.busyDelay = History.options.busyDelay || 250;
        History.options.debug = History.options.debug || false;
        History.options.initialTitle = History.options.initialTitle || document.title;
        History.options.html4Mode = History.options.html4Mode || false;
        History.options.delayInit = History.options.delayInit || false;
        History.intervalList = [];
        History.clearAllIntervals = function() {
            var i, il = History.intervalList;
            if (typeof il !== "undefined" && il !== null) {
                for (i = 0; i < il.length; i++) {
                    clearInterval(il[i]);
                }
                History.intervalList = null;
            }
        };
        History.debug = function() {
            if (History.options.debug || false) {
                History.log.apply(History, arguments);
            }
        };
        History.log = function() {
            var consoleExists = !(typeof console === "undefined" || typeof console.log === "undefined" || typeof console.log.apply === "undefined"), textarea = document.getElementById("log"), message, i, n, args, arg;
            if (consoleExists) {
                args = Array.prototype.slice.call(arguments);
                message = args.shift();
                if (typeof console.debug !== "undefined") {
                    console.debug.apply(console, [ message, args ]);
                } else {
                    console.log.apply(console, [ message, args ]);
                }
            } else {
                message = "\n" + arguments[0] + "\n";
            }
            for (i = 1, n = arguments.length; i < n; ++i) {
                arg = arguments[i];
                if (typeof arg === "object" && typeof JSON !== "undefined") {
                    try {
                        arg = JSON.stringify(arg);
                    } catch (Exception) {}
                }
                message += "\n" + arg + "\n";
            }
            if (textarea) {
                textarea.value += message + "\n-----\n";
                textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
            } else if (!consoleExists) {
                alert(message);
            }
            return true;
        };
        History.getInternetExplorerMajorVersion = function() {
            var result = History.getInternetExplorerMajorVersion.cached = typeof History.getInternetExplorerMajorVersion.cached !== "undefined" ? History.getInternetExplorerMajorVersion.cached : function() {
                var v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
                while ((div.innerHTML = "<!--[if gt IE " + ++v + "]><i></i><![endif]-->") && all[0]) {}
                return v > 4 ? v : false;
            }();
            return result;
        };
        History.isInternetExplorer = function() {
            var result = History.isInternetExplorer.cached = typeof History.isInternetExplorer.cached !== "undefined" ? History.isInternetExplorer.cached : Boolean(History.getInternetExplorerMajorVersion());
            return result;
        };
        if (History.options.html4Mode) {
            History.emulated = {
                pushState: true,
                hashChange: true
            };
        } else {
            History.emulated = {
                pushState: !Boolean(window.history && window.history.pushState && window.history.replaceState && !(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(navigator.userAgent) || /AppleWebKit\/5([0-2]|3[0-2])/i.test(navigator.userAgent))),
                hashChange: Boolean(!("onhashchange" in window || "onhashchange" in document) || History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
            };
        }
        History.enabled = !History.emulated.pushState;
        History.bugs = {
            setHash: Boolean(!History.emulated.pushState && navigator.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
            safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === "Apple Computer, Inc." && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
            ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),
            hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
        };
        History.isEmptyObject = function(obj) {
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    return false;
                }
            }
            return true;
        };
        History.cloneObject = function(obj) {
            var hash, newObj;
            if (obj) {
                hash = JSON.stringify(obj);
                newObj = JSON.parse(hash);
            } else {
                newObj = {};
            }
            return newObj;
        };
        History.getRootUrl = function() {
            var rootUrl = document.location.protocol + "//" + (document.location.hostname || document.location.host);
            if (document.location.port || false) {
                rootUrl += ":" + document.location.port;
            }
            rootUrl += "/";
            return rootUrl;
        };
        History.getBaseHref = function() {
            var baseElements = document.getElementsByTagName("base"), baseElement = null, baseHref = "";
            if (baseElements.length === 1) {
                baseElement = baseElements[0];
                baseHref = baseElement.href.replace(/[^\/]+$/, "");
            }
            baseHref = baseHref.replace(/\/+$/, "");
            if (baseHref) baseHref += "/";
            return baseHref;
        };
        History.getBaseUrl = function() {
            var baseUrl = History.getBaseHref() || History.getBasePageUrl() || History.getRootUrl();
            return baseUrl;
        };
        History.getPageUrl = function() {
            var State = History.getState(false, false), stateUrl = (State || {}).url || History.getLocationHref(), pageUrl;
            pageUrl = stateUrl.replace(/\/+$/, "").replace(/[^\/]+$/, function(part, index, string) {
                return /\./.test(part) ? part : part + "/";
            });
            return pageUrl;
        };
        History.getBasePageUrl = function() {
            var basePageUrl = History.getLocationHref().replace(/[#\?].*/, "").replace(/[^\/]+$/, function(part, index, string) {
                return /[^\/]$/.test(part) ? "" : part;
            }).replace(/\/+$/, "") + "/";
            return basePageUrl;
        };
        History.getFullUrl = function(url, allowBaseHref) {
            var fullUrl = url, firstChar = url.substring(0, 1);
            allowBaseHref = typeof allowBaseHref === "undefined" ? true : allowBaseHref;
            if (/[a-z]+\:\/\//.test(url)) {} else if (firstChar === "/") {
                fullUrl = History.getRootUrl() + url.replace(/^\/+/, "");
            } else if (firstChar === "#") {
                fullUrl = History.getPageUrl().replace(/#.*/, "") + url;
            } else if (firstChar === "?") {
                fullUrl = History.getPageUrl().replace(/[\?#].*/, "") + url;
            } else {
                if (allowBaseHref) {
                    fullUrl = History.getBaseUrl() + url.replace(/^(\.\/)+/, "");
                } else {
                    fullUrl = History.getBasePageUrl() + url.replace(/^(\.\/)+/, "");
                }
            }
            return fullUrl.replace(/\#$/, "");
        };
        History.getShortUrl = function(url) {
            var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();
            if (History.emulated.pushState) {
                shortUrl = shortUrl.replace(baseUrl, "");
            }
            shortUrl = shortUrl.replace(rootUrl, "/");
            if (History.isTraditionalAnchor(shortUrl)) {
                shortUrl = "./" + shortUrl;
            }
            shortUrl = shortUrl.replace(/^(\.\/)+/g, "./").replace(/\#$/, "");
            return shortUrl;
        };
        History.getLocationHref = function(doc) {
            doc = doc || document;
            if (doc.URL === doc.location.href) return doc.location.href;
            if (doc.location.href === decodeURIComponent(doc.URL)) return doc.URL;
            if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash) return doc.location.href;
            if (doc.URL.indexOf("#") == -1 && doc.location.href.indexOf("#") != -1) return doc.location.href;
            return doc.URL || doc.location.href;
        };
        History.store = {};
        History.idToState = History.idToState || {};
        History.stateToId = History.stateToId || {};
        History.urlToId = History.urlToId || {};
        History.storedStates = History.storedStates || [];
        History.savedStates = History.savedStates || [];
        History.normalizeStore = function() {
            History.store.idToState = History.store.idToState || {};
            History.store.urlToId = History.store.urlToId || {};
            History.store.stateToId = History.store.stateToId || {};
        };
        History.getState = function(friendly, create) {
            if (typeof friendly === "undefined") {
                friendly = true;
            }
            if (typeof create === "undefined") {
                create = true;
            }
            var State = History.getLastSavedState();
            if (!State && create) {
                State = History.createStateObject();
            }
            if (friendly) {
                State = History.cloneObject(State);
                State.url = State.cleanUrl || State.url;
            }
            return State;
        };
        History.getIdByState = function(newState) {
            var id = History.extractId(newState.url), str;
            if (!id) {
                str = History.getStateString(newState);
                if (typeof History.stateToId[str] !== "undefined") {
                    id = History.stateToId[str];
                } else if (typeof History.store.stateToId[str] !== "undefined") {
                    id = History.store.stateToId[str];
                } else {
                    while (true) {
                        id = new Date().getTime() + String(Math.random()).replace(/\D/g, "");
                        if (typeof History.idToState[id] === "undefined" && typeof History.store.idToState[id] === "undefined") {
                            break;
                        }
                    }
                    History.stateToId[str] = id;
                    History.idToState[id] = newState;
                }
            }
            return id;
        };
        History.normalizeState = function(oldState) {
            var newState, dataNotEmpty;
            if (!oldState || typeof oldState !== "object") {
                oldState = {};
            }
            if (typeof oldState.normalized !== "undefined") {
                return oldState;
            }
            if (!oldState.data || typeof oldState.data !== "object") {
                oldState.data = {};
            }
            newState = {};
            newState.normalized = true;
            newState.title = oldState.title || "";
            newState.url = History.getFullUrl(oldState.url ? oldState.url : History.getLocationHref());
            newState.hash = History.getShortUrl(newState.url);
            newState.data = History.cloneObject(oldState.data);
            newState.id = History.getIdByState(newState);
            newState.cleanUrl = newState.url.replace(/\??\&_suid.*/, "");
            newState.url = newState.cleanUrl;
            dataNotEmpty = !History.isEmptyObject(newState.data);
            if ((newState.title || dataNotEmpty) && History.options.disableSuid !== true) {
                newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/, "");
                if (!/\?/.test(newState.hash)) {
                    newState.hash += "?";
                }
                newState.hash += "&_suid=" + newState.id;
            }
            newState.hashedUrl = History.getFullUrl(newState.hash);
            if ((History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState)) {
                newState.url = newState.hashedUrl;
            }
            return newState;
        };
        History.createStateObject = function(data, title, url) {
            var State = {
                data: data,
                title: title,
                url: url
            };
            State = History.normalizeState(State);
            return State;
        };
        History.getStateById = function(id) {
            id = String(id);
            var State = History.idToState[id] || History.store.idToState[id] || undefined;
            return State;
        };
        History.getStateString = function(passedState) {
            var State, cleanedState, str;
            State = History.normalizeState(passedState);
            cleanedState = {
                data: State.data,
                title: passedState.title,
                url: passedState.url
            };
            str = JSON.stringify(cleanedState);
            return str;
        };
        History.getStateId = function(passedState) {
            var State, id;
            State = History.normalizeState(passedState);
            id = State.id;
            return id;
        };
        History.getHashByState = function(passedState) {
            var State, hash;
            State = History.normalizeState(passedState);
            hash = State.hash;
            return hash;
        };
        History.extractId = function(url_or_hash) {
            var id, parts, url, tmp;
            if (url_or_hash.indexOf("#") != -1) {
                tmp = url_or_hash.split("#")[0];
            } else {
                tmp = url_or_hash;
            }
            parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
            url = parts ? parts[1] || url_or_hash : url_or_hash;
            id = parts ? String(parts[2] || "") : "";
            return id || false;
        };
        History.isTraditionalAnchor = function(url_or_hash) {
            var isTraditional = !/[\/\?\.]/.test(url_or_hash);
            return isTraditional;
        };
        History.extractState = function(url_or_hash, create) {
            var State = null, id, url;
            create = create || false;
            id = History.extractId(url_or_hash);
            if (id) {
                State = History.getStateById(id);
            }
            if (!State) {
                url = History.getFullUrl(url_or_hash);
                id = History.getIdByUrl(url) || false;
                if (id) {
                    State = History.getStateById(id);
                }
                if (!State && create && !History.isTraditionalAnchor(url_or_hash)) {
                    State = History.createStateObject(null, null, url);
                }
            }
            return State;
        };
        History.getIdByUrl = function(url) {
            var id = History.urlToId[url] || History.store.urlToId[url] || undefined;
            return id;
        };
        History.getLastSavedState = function() {
            return History.savedStates[History.savedStates.length - 1] || undefined;
        };
        History.getLastStoredState = function() {
            return History.storedStates[History.storedStates.length - 1] || undefined;
        };
        History.hasUrlDuplicate = function(newState) {
            var hasDuplicate = false, oldState;
            oldState = History.extractState(newState.url);
            hasDuplicate = oldState && oldState.id !== newState.id;
            return hasDuplicate;
        };
        History.storeState = function(newState) {
            History.urlToId[newState.url] = newState.id;
            History.storedStates.push(History.cloneObject(newState));
            return newState;
        };
        History.isLastSavedState = function(newState) {
            var isLast = false, newId, oldState, oldId;
            if (History.savedStates.length) {
                newId = newState.id;
                oldState = History.getLastSavedState();
                oldId = oldState.id;
                isLast = newId === oldId;
            }
            return isLast;
        };
        History.saveState = function(newState) {
            if (History.isLastSavedState(newState)) {
                return false;
            }
            History.savedStates.push(History.cloneObject(newState));
            return true;
        };
        History.getStateByIndex = function(index) {
            var State = null;
            if (typeof index === "undefined") {
                State = History.savedStates[History.savedStates.length - 1];
            } else if (index < 0) {
                State = History.savedStates[History.savedStates.length + index];
            } else {
                State = History.savedStates[index];
            }
            return State;
        };
        History.getCurrentIndex = function() {
            var index = null;
            if (History.savedStates.length < 1) {
                index = 0;
            } else {
                index = History.savedStates.length - 1;
            }
            return index;
        };
        History.getHash = function(doc) {
            var url = History.getLocationHref(doc), hash;
            hash = History.getHashByUrl(url);
            return hash;
        };
        History.unescapeHash = function(hash) {
            var result = History.normalizeHash(hash);
            result = decodeURIComponent(result);
            return result;
        };
        History.normalizeHash = function(hash) {
            var result = hash.replace(/[^#]*#/, "").replace(/#.*/, "");
            return result;
        };
        History.setHash = function(hash, queue) {
            var State, pageUrl;
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.setHash,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            State = History.extractState(hash, true);
            if (State && !History.emulated.pushState) {
                History.pushState(State.data, State.title, State.url, false);
            } else if (History.getHash() !== hash) {
                if (History.bugs.setHash) {
                    pageUrl = History.getPageUrl();
                    History.pushState(null, null, pageUrl + "#" + hash, false);
                } else {
                    document.location.hash = hash;
                }
            }
            return History;
        };
        History.escapeHash = function(hash) {
            var result = History.normalizeHash(hash);
            result = window.encodeURIComponent(result);
            if (!History.bugs.hashEscape) {
                result = result.replace(/\%21/g, "!").replace(/\%26/g, "&").replace(/\%3D/g, "=").replace(/\%3F/g, "?");
            }
            return result;
        };
        History.getHashByUrl = function(url) {
            var hash = String(url).replace(/([^#]*)#?([^#]*)#?(.*)/, "$2");
            hash = History.unescapeHash(hash);
            return hash;
        };
        History.setTitle = function(newState) {
            var title = newState.title, firstState;
            if (!title) {
                firstState = History.getStateByIndex(0);
                if (firstState && firstState.url === newState.url) {
                    title = firstState.title || History.options.initialTitle;
                }
            }
            try {
                document.getElementsByTagName("title")[0].innerHTML = title.replace("<", "&lt;").replace(">", "&gt;").replace(" & ", " &amp; ");
            } catch (Exception) {}
            document.title = title;
            return History;
        };
        History.queues = [];
        History.busy = function(value) {
            if (typeof value !== "undefined") {
                History.busy.flag = value;
            } else if (typeof History.busy.flag === "undefined") {
                History.busy.flag = false;
            }
            if (!History.busy.flag) {
                clearTimeout(History.busy.timeout);
                var fireNext = function() {
                    var i, queue, item;
                    if (History.busy.flag) return;
                    for (i = History.queues.length - 1; i >= 0; --i) {
                        queue = History.queues[i];
                        if (queue.length === 0) continue;
                        item = queue.shift();
                        History.fireQueueItem(item);
                        History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
                    }
                };
                History.busy.timeout = setTimeout(fireNext, History.options.busyDelay);
            }
            return History.busy.flag;
        };
        History.busy.flag = false;
        History.fireQueueItem = function(item) {
            return item.callback.apply(item.scope || History, item.args || []);
        };
        History.pushQueue = function(item) {
            History.queues[item.queue || 0] = History.queues[item.queue || 0] || [];
            History.queues[item.queue || 0].push(item);
            return History;
        };
        History.queue = function(item, queue) {
            if (typeof item === "function") {
                item = {
                    callback: item
                };
            }
            if (typeof queue !== "undefined") {
                item.queue = queue;
            }
            if (History.busy()) {
                History.pushQueue(item);
            } else {
                History.fireQueueItem(item);
            }
            return History;
        };
        History.clearQueue = function() {
            History.busy.flag = false;
            History.queues = [];
            return History;
        };
        History.stateChanged = false;
        History.doubleChecker = false;
        History.doubleCheckComplete = function() {
            History.stateChanged = true;
            History.doubleCheckClear();
            return History;
        };
        History.doubleCheckClear = function() {
            if (History.doubleChecker) {
                clearTimeout(History.doubleChecker);
                History.doubleChecker = false;
            }
            return History;
        };
        History.doubleCheck = function(tryAgain) {
            History.stateChanged = false;
            History.doubleCheckClear();
            if (History.bugs.ieDoubleCheck) {
                History.doubleChecker = setTimeout(function() {
                    History.doubleCheckClear();
                    if (!History.stateChanged) {
                        tryAgain();
                    }
                    return true;
                }, History.options.doubleCheckInterval);
            }
            return History;
        };
        History.safariStatePoll = function() {
            var urlState = History.extractState(History.getLocationHref()), newState;
            if (!History.isLastSavedState(urlState)) {
                newState = urlState;
            } else {
                return;
            }
            if (!newState) {
                newState = History.createStateObject();
            }
            History.Adapter.trigger(window, "popstate");
            return History;
        };
        History.back = function(queue) {
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.back,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            History.doubleCheck(function() {
                History.back(false);
            });
            history.go(-1);
            return true;
        };
        History.forward = function(queue) {
            if (queue !== false && History.busy()) {
                History.pushQueue({
                    scope: History,
                    callback: History.forward,
                    args: arguments,
                    queue: queue
                });
                return false;
            }
            History.busy(true);
            History.doubleCheck(function() {
                History.forward(false);
            });
            history.go(1);
            return true;
        };
        History.go = function(index, queue) {
            var i;
            if (index > 0) {
                for (i = 1; i <= index; ++i) {
                    History.forward(queue);
                }
            } else if (index < 0) {
                for (i = -1; i >= index; --i) {
                    History.back(queue);
                }
            } else {
                throw new Error("History.go: History.go requires a positive or negative integer passed.");
            }
            return History;
        };
        if (History.emulated.pushState) {
            var emptyFunction = function() {};
            History.pushState = History.pushState || emptyFunction;
            History.replaceState = History.replaceState || emptyFunction;
        } else {
            History.onPopState = function(event, extra) {
                var stateId = false, newState = false, currentHash, currentState;
                History.doubleCheckComplete();
                currentHash = History.getHash();
                if (currentHash) {
                    currentState = History.extractState(currentHash || History.getLocationHref(), true);
                    if (currentState) {
                        History.replaceState(currentState.data, currentState.title, currentState.url, false);
                    } else {
                        History.Adapter.trigger(window, "anchorchange");
                        History.busy(false);
                    }
                    History.expectedStateId = false;
                    return false;
                }
                stateId = History.Adapter.extractEventData("state", event, extra) || false;
                if (stateId) {
                    newState = History.getStateById(stateId);
                } else if (History.expectedStateId) {
                    newState = History.getStateById(History.expectedStateId);
                } else {
                    newState = History.extractState(History.getLocationHref());
                }
                if (!newState) {
                    newState = History.createStateObject(null, null, History.getLocationHref());
                }
                History.expectedStateId = false;
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                    return false;
                }
                History.storeState(newState);
                History.saveState(newState);
                History.setTitle(newState);
                History.Adapter.trigger(window, "statechange");
                History.busy(false);
                return true;
            };
            History.Adapter.bind(window, "popstate", History.onPopState);
            History.pushState = function(data, title, url, queue) {
                if (History.getHashByUrl(url) && History.emulated.pushState) {
                    throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.pushState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url);
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                } else {
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
                    history.pushState(newState.id, newState.title, newState.url);
                    History.Adapter.trigger(window, "popstate");
                }
                return true;
            };
            History.replaceState = function(data, title, url, queue) {
                if (History.getHashByUrl(url) && History.emulated.pushState) {
                    throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");
                }
                if (queue !== false && History.busy()) {
                    History.pushQueue({
                        scope: History,
                        callback: History.replaceState,
                        args: arguments,
                        queue: queue
                    });
                    return false;
                }
                History.busy(true);
                var newState = History.createStateObject(data, title, url);
                if (History.isLastSavedState(newState)) {
                    History.busy(false);
                } else {
                    History.storeState(newState);
                    History.expectedStateId = newState.id;
                    history.replaceState(newState.id, newState.title, newState.url);
                    History.Adapter.trigger(window, "popstate");
                }
                return true;
            };
        }
        if (sessionStorage) {
            try {
                History.store = JSON.parse(sessionStorage.getItem("History.store")) || {};
            } catch (err) {
                History.store = {};
            }
            History.normalizeStore();
        } else {
            History.store = {};
            History.normalizeStore();
        }
        History.Adapter.bind(window, "unload", History.clearAllIntervals);
        History.saveState(History.storeState(History.extractState(History.getLocationHref(), true)));
        if (sessionStorage) {
            History.onUnload = function() {
                var currentStore, item, currentStoreString;
                try {
                    currentStore = JSON.parse(sessionStorage.getItem("History.store")) || {};
                } catch (err) {
                    currentStore = {};
                }
                currentStore.idToState = currentStore.idToState || {};
                currentStore.urlToId = currentStore.urlToId || {};
                currentStore.stateToId = currentStore.stateToId || {};
                for (item in History.idToState) {
                    if (!History.idToState.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.idToState[item] = History.idToState[item];
                }
                for (item in History.urlToId) {
                    if (!History.urlToId.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.urlToId[item] = History.urlToId[item];
                }
                for (item in History.stateToId) {
                    if (!History.stateToId.hasOwnProperty(item)) {
                        continue;
                    }
                    currentStore.stateToId[item] = History.stateToId[item];
                }
                History.store = currentStore;
                History.normalizeStore();
                currentStoreString = JSON.stringify(currentStore);
                try {
                    sessionStorage.setItem("History.store", currentStoreString);
                } catch (e) {
                    if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
                        if (sessionStorage.length) {
                            sessionStorage.removeItem("History.store");
                            sessionStorage.setItem("History.store", currentStoreString);
                        } else {}
                    } else {
                        throw e;
                    }
                }
            };
            History.intervalList.push(setInterval(History.onUnload, History.options.storeInterval));
            History.Adapter.bind(window, "beforeunload", History.onUnload);
            History.Adapter.bind(window, "unload", History.onUnload);
        }
        if (!History.emulated.pushState) {
            if (History.bugs.safariPoll) {
                History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
            }
            if (navigator.vendor === "Apple Computer, Inc." || (navigator.appCodeName || "") === "Mozilla") {
                History.Adapter.bind(window, "hashchange", function() {
                    History.Adapter.trigger(window, "popstate");
                });
                if (History.getHash()) {
                    History.Adapter.onDomLoad(function() {
                        History.Adapter.trigger(window, "hashchange");
                    });
                }
            }
        }
    };
    if (!History.options || !History.options.delayInit) {
        History.init();
    }
})(window);

(function($) {
    $.fn.ajax_url = function(custom_trigger, on_trigger) {
        var element = this;
        element.tappable(function(event) {
            var custom_trigger_return = null;
            if (custom_trigger != null) {
                custom_trigger_return = custom_trigger(event);
            }
            if (custom_trigger_return == null || custom_trigger_return === true) {
                if (on_trigger != null) {
                    on_trigger(event);
                }
                if (event.metaKey === true) {} else {
                    if (Site.history_state_supported) {
                        if (!event.isDefaultPrevented()) {
                            event.preventDefault();
                            Site.load_url($(element).attr("href"), true);
                        }
                    }
                }
            } else {
                event.preventDefault();
            }
        });
        return element;
    };
})(jQuery);

(function($) {
    var touchSupported = "ontouchstart" in window;
    $.fn.tappable = function(options) {
        var cancelOnMove = true, onlyIf = function() {
            return true;
        }, touchDelay = 0, callback;
        switch (typeof options) {
          case "function":
            callback = options;
            break;

          case "object":
            callback = options.callback;
            if (typeof options.cancelOnMove != "undefined") {
                cancelOnMove = options.cancelOnMove;
            }
            if (typeof options.onlyIf != "undefined") {
                onlyIf = options.onlyIf;
            }
            if (typeof options.touchDelay != "undefined") {
                touchDelay = options.touchDelay;
            }
            break;

          default:
            break;
        }
        var fireCallback = function(el, event) {
            if (typeof callback == "function" && onlyIf(el)) {
                callback.call(el, event);
                event.preventDefault();
                event.stopPropagation();
            }
        };
        if (touchSupported) {
            this.unbind("touchstart");
            this.bind("touchstart", function(event) {
                var el = this;
                if (onlyIf(this)) {
                    $(el).addClass("touch-started");
                    window.setTimeout(function() {
                        if ($(el).hasClass("touch-started")) {
                            $(el).addClass("touched");
                        }
                    }, touchDelay);
                }
                return true;
            });
            this.unbind("touchend");
            this.bind("touchend", function(event) {
                var el = this;
                if ($(el).hasClass("touch-started")) {
                    $(el).removeClass("touched").removeClass("touch-started");
                    if ($(event.target).is('input[type="checkbox"]')) {
                        $(event.target).attr("checked", !$(event.target).is(":checked"));
                    }
                    if ($(event.target).is("label")) {
                        var forId = $(event.target).attr("for");
                        var forEl = $("#" + forId);
                        if (forEl.is(":checkbox")) {
                            forEl.attr("checked", !forEl.is(":checked"));
                        } else {
                            forEl.focus();
                        }
                    }
                    if ($(event.target).is("a")) {
                        var target = $(event.target);
                        var href = target.attr("href");
                        if (href !== "" && href !== "javascript:;" && href.indexOf("#") < 0) {
                            if (target.attr("target") === "_blank") {
                                window.open(target.attr("href"));
                            } else {
                                window.location.href = target.attr("href");
                            }
                            return false;
                        }
                    }
                    fireCallback(el, event);
                }
                return true;
            });
            this.unbind("click");
            this.bind("click", function(event) {
                event.preventDefault();
            });
            if (cancelOnMove) {
                this.unbind("touchmove");
                this.bind("touchmove", function() {
                    $(this).removeClass("touched").removeClass("touch-started");
                });
            }
        } else if (typeof callback == "function") {
            this.unbind("click");
            this.bind("click", function(event) {
                if (onlyIf(this)) {
                    callback.call(this, event);
                }
            });
        }
        return this;
    };
})(jQuery);

function Page() {
    var page = this;
    page.element = $("<div />");
}

Page.prototype.new_url = function() {
    return "NOT_SET";
};

Page.prototype.get_title = function() {
    return null;
};

Page.prototype.resize = function(resize_obj) {};

Page.prototype.init = function() {};

Page.prototype.remove = function() {};

function SAFE() {
    var sf = this;
    Site = this;
    sf.debug = false;
    sf.initial_url = true;
    sf.map = {};
    sf.ignore_next_url = false;
    sf.origin = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port != "") {
        sf.origin += ":" + window.location.port;
    }
    sf.path = "";
    sf.url_changed_callback = function(url) {};
    sf.transition_page_callback = function(new_page, old_page) {
        return false;
    };
    sf.pre_load_callback = function(class_name, parameters, url, wildcard_contents) {
        return null;
    };
    sf.on_resize = function(resize_obj) {};
    sf.scroll_bar_width_value = -1;
    sf.element = $("<div />");
    sf.is_touchscreen = "ontouchstart" in document.documentElement;
    sf.history_state_supported = !!(window.history && window.history.pushState);
    sf.current_page = null;
    sf.no_page_found_class = null;
}

SAFE.console = console;

if (typeof SAFE.console === "undefined") {
    var cons = {};
    cons.log = cons.error = cons.info = cons.debug = cons.warn = cons.trace = cons.dir = cons.dirxml = cons.group = cons.groupEnd = cons.time = cons.timeEnd = cons.assert = cons.profile = function() {};
    SAFE.console = cons;
}

SAFE.prototype.extend = function(sub, sup) {
    function emptyclass() {}
    emptyclass.prototype = sup.prototype;
    sub.prototype = new emptyclass();
    sub.prototype.constructor = sub;
    sub.superConstructor = sup;
    sub.superClass = sup.prototype;
};

SAFE.prototype.build_query_string = function(params) {
    var query_string = "";
    var had_query_params = false;
    var ret = [];
    for (var d in params) {
        had_query_params = true;
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(params[d]));
    }
    if (had_query_params) {
        query_string = "?" + ret.join("&");
    }
    return query_string;
};

SAFE.prototype.use_page_class = function(class_name, parameters, url, wildcard_contents) {
    var sf = this;
    if (class_name == null) {
        if (sf.no_page_found_class == null) {
            if (sf.current_page != null) {
                sf.current_page.remove();
                sf.current_page = null;
                sf.previous_class_name = null;
            }
            sf.element.text("No 404 page set. Use Site.set_no_page_found_class(class_name) to set one.");
            return;
        } else {
            class_name = sf.no_page_found_class;
        }
    }
    if (class_name == sf.previous_class_name) {
        var new_url_response = sf.current_page.new_url(parameters, url, wildcard_contents);
        if (new_url_response != "NOT_SET") {
            return;
        }
    }
    var old_page = null;
    if (sf.current_page != null) {
        sf.current_page.remove();
        old_page = sf.current_page;
    }
    var pre_load_response = sf.pre_load_callback(class_name, parameters, url, wildcard_contents);
    if (pre_load_response != null) {
        sf.load_url(pre_load_response, true);
        return;
    }
    sf.current_page = new_page = new class_name(parameters, url, wildcard_contents);
    sf.previous_class_name = class_name;
    var transition_response = sf.transition_page_callback(sf.current_page, old_page);
    if (transition_response === true) {} else {
        sf.element.empty();
        sf.element.append(sf.current_page.element);
    }
    sf.current_page.init();
    sf.resize();
};

SAFE.prototype.set_no_page_found_class = function(class_name) {
    var sf = this;
    sf.no_page_found_class = class_name;
};

SAFE.prototype.ajax_post = function(request) {
    request.cache = false;
    request.type = "post";
    request.contentType = "application/json; charset=utf-8", request.data = JSON.stringify(request.data);
    request.dataType = "json";
    return $.ajax(request);
};

SAFE.prototype.ajax_get = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "get";
    return $.ajax(request);
};

SAFE.prototype.ajax_delete = function(request) {
    request.cache = false;
    request.dataType = "json";
    request.type = "delete";
    return $.ajax(request);
};

SAFE.prototype.resize = function() {
    var sf = this;
    var doc_width = $(window).width() - sf.scroll_bar_width();
    var doc_height = $(window).height();
    var resize_obj = {
        scroll_bar_width: sf.scroll_bar_width(),
        doc_width: doc_width,
        doc_height: doc_height
    };
    sf.on_resize(resize_obj);
    if (sf.current_page != null) {
        sf.current_page.resize(resize_obj);
    }
};

SAFE.prototype.init = function(desired_url) {
    var sf = this;
    var path_name = window.location.pathname;
    if (window.location.search != null) {
        path_name += window.location.search;
    }
    var current_url = decodeURIComponent(path_name);
    if (desired_url != null) {
        if (desired_url != current_url) {
            current_url = desired_url;
            if (!sf.history_state_supported) {
                window.location = desired_url;
                return;
            }
        }
    }
    if (sf.history_state_supported) {
        History.replaceState(null, "", Site.origin + current_url);
        History.Adapter.bind(window, "statechange", function() {
            if (sf.ignore_next_url) {
                sf.ignore_next_url = false;
                return;
            }
            var state = History.getState();
            if (state != null) {
                sf.load_url(decodeURIComponent(state.url), false);
            }
        });
    }
    $(window).resize(function() {
        sf.resize();
    }).resize();
    if (current_url == null) {
        current_url = "";
    }
    sf.load_url(current_url, false);
};

SAFE.prototype.reload_page = function() {
    var sf = this;
    sf.use_page_class(sf.current_class_and_details.class_name, sf.current_class_and_details.parameters, sf.current_class_and_details.url, sf.current_class_and_details.wildcard_contents);
};

SAFE.prototype.replace_current_url = function(new_url) {
    var sf = this;
    History.replaceState(null, "", Site.origin + new_url);
    sf.url_changed_callback(window.location.toString(), window.location.pathname, window.location.toString().substring(Site.origin.length), false);
};

SAFE.prototype.add_url = function(url, class_name) {
    var sf = this;
    sf.map[url] = class_name;
};

SAFE.prototype.scroll_bar_width = function() {
    var sf = this;
    if (sf.scroll_bar_width_value != -1) {
        return sf.scroll_bar_width_value;
    }
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
    $("body").append(div);
    var w1 = $("div", div).innerWidth();
    div.css("overflow-y", "scroll");
    var w2 = $("div", div).innerWidth();
    div.remove();
    sf.scroll_bar_width_value = w1 - w2;
    return sf.scroll_bar_width_value;
};

SAFE.prototype.parse_query_string = function(query_string) {
    var query_split = query_string.split("&");
    var params = {};
    for (var i = 0; i < query_split.length; i++) {
        pair = query_split[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
};

SAFE.prototype.get_class_for_url = function(url_with_parameters) {
    var sf = this;
    var class_and_details = sf.get_class_and_details_for_url(url_with_parameters);
    if (class_and_details != null) {
        return class_and_details.class_name;
    }
    return null;
};

SAFE.prototype.get_class_and_details_for_url = function(url_with_parameters) {
    var sf = this;
    var parameters = {};
    var url_split = url_with_parameters.split("?");
    if (url_split.length > 1) {
        parameters = sf.parse_query_string(url_split[1]);
    }
    url = url_split[0];
    if (url.length >= sf.origin.length) {
        if (url.substring(0, sf.origin.length) == sf.origin) {
            url = url.substring(sf.origin.length);
        }
    }
    var effective_path = sf.path;
    if (effective_path != "") {
        if (effective_path[effective_path.length - 1] != "/") {
            effective_path += "/";
        }
    }
    if (effective_path.length > 0) {
        if (effective_path.length > url.length || url.substring(0, effective_path.length) != effective_path) {
            SAFE.console.error("The requested url (" + url_with_parameters + ") was not relative to the domain/origin and within the Site.path scope");
            return null;
        }
        url = url.substring(effective_path.length - 1);
    }
    var class_name = sf.map[url];
    var wildcard_contents = null;
    var wildcard_contents = null;
    if (class_name == null) {
        for (var map_url in sf.map) {
            var index_of_wildcard = map_url.indexOf("*");
            if (index_of_wildcard != -1) {
                var url_substring = map_url.substring(0, index_of_wildcard);
                if (url_substring.length < url.length) {
                    if (url_substring == url.substring(0, url_substring.length)) {
                        class_name = sf.map[map_url];
                        wildcard_contents = url.substring(url_substring.length);
                        url = url_substring + "*";
                    }
                }
            }
        }
    }
    return {
        class_name: class_name,
        parameters: parameters,
        url: url,
        wildcard_contents: wildcard_contents
    };
};

SAFE.prototype.load_url = function(url_with_parameters, push_state) {
    var sf = this;
    if (!sf.history_state_supported) {
        var target = encodeURI(Site.origin + url_with_parameters);
        if (window.location != target) {
            window.location = target;
            return;
        }
    } else {
        if (push_state) {
            sf.ignore_next_url = true;
            History.pushState(null, "", Site.origin + url_with_parameters);
        }
    }
    sf.current_class_and_details = sf.get_class_and_details_for_url(url_with_parameters);
    if (sf.current_class_and_details.class_name != null) {
        sf.use_page_class(sf.current_class_and_details.class_name, sf.current_class_and_details.parameters, sf.current_class_and_details.url, sf.current_class_and_details.wildcard_contents);
    } else {
        SAFE.console.error("Page not found for url (" + sf.current_class_and_details.url + "). The full url was (" + url_with_parameters + ")");
        sf.use_page_class(null);
    }
    sf.url_changed_callback(window.location.toString(), window.location.pathname, window.location.toString().substring(Site.origin.length), sf.initial_url);
    sf.initial_url = false;
    sf.previous_class_name = sf.current_class_and_details.class_name;
};

var Site;

new SAFE();