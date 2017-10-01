/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "f13cb9826a1c09da3096"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "snake/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(2)(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var UP = exports.UP = 'up';
var DOWN = exports.DOWN = 'down';
var LEFT = exports.LEFT = 'left';
var RIGHT = exports.RIGHT = 'right';
var SQUARE_SIZE = exports.SQUARE_SIZE = 16;
var ATE_IT_EVENT = exports.ATE_IT_EVENT = "ATE_IT";
var BLINK_OFF = exports.BLINK_OFF = 300;
var BLINK_ON = exports.BLINK_ON = 800;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unitVectors;

var _constants = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var unitVectors = (_unitVectors = {}, _defineProperty(_unitVectors, _constants.UP, [0, 1]), _defineProperty(_unitVectors, _constants.DOWN, [0, -1]), _defineProperty(_unitVectors, _constants.LEFT, [1, 0]), _defineProperty(_unitVectors, _constants.RIGHT, [-1, 0]), _unitVectors);

var followDist = _constants.SQUARE_SIZE + 2;

var Square = function () {
    function Square(pos) {
        _classCallCheck(this, Square);

        this.pos = pos;
    }

    _createClass(Square, [{
        key: 'move',
        value: function move(dirMarker, delta) {
            this.pos = dirMarker.move(this.pos, delta);
        }
    }, {
        key: 'follow',
        value: function follow(dir, leaderPos) {
            // method maintains spacing
            switch (dir) {
                case _constants.UP:
                case _constants.DOWN:
                    this.pos = [leaderPos[0], leaderPos[1] + unitVectors[dir][1] * followDist];
                    break;
                case _constants.RIGHT:
                case _constants.LEFT:
                    this.pos = [leaderPos[0] + unitVectors[dir][0] * followDist, leaderPos[1]];
                    break;
            }
        }
    }, {
        key: 'isCollision',
        value: function isCollision(pos) {
            var distX = Math.abs(pos[0] - this.pos[0]);
            var distY = Math.abs(pos[1] - this.pos[1]);
            var squareOverlap = _constants.SQUARE_SIZE / 2;
            return distX < squareOverlap && distY < squareOverlap; // if its less then half a square in both directions it must be a collision 
        }
    }, {
        key: 'draw',
        value: function draw() {
            return [].concat(_toConsumableArray(this.pos), [_constants.SQUARE_SIZE, _constants.SQUARE_SIZE]);
        }
    }]);

    return Square;
}();

exports.default = Square;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Renderer = __webpack_require__(3);

var _Renderer2 = _interopRequireDefault(_Renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderer = new _Renderer2.default();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = __webpack_require__(4);

var _renderer2 = _interopRequireDefault(_renderer);

var _Snake = __webpack_require__(5);

var _Snake2 = _interopRequireDefault(_Snake);

var _FoodSupply = __webpack_require__(7);

var _FoodSupply2 = _interopRequireDefault(_FoodSupply);

var _constants = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
    function Renderer() {
        _classCallCheck(this, Renderer);

        this.sizeCanvas();
        this.initialDomSetup();
        this.bindEventHandlers();
        this.ateIt = new window.Event(_constants.ATE_IT_EVENT);
        document.addEventListener('keyup', this.startGame);
    }

    _createClass(Renderer, [{
        key: 'sizeCanvas',
        value: function sizeCanvas() {
            var smallDim = Math.min(window.innerWidth, window.innerHeight - 35);
            var numRows = Math.floor(smallDim / _constants.SQUARE_SIZE);
            if (numRows % 2 === 0) {
                //has to be odd so that there is a middle
                numRows--;
            }
            this.numRows = numRows;
            this.canvasSize = numRows * _constants.SQUARE_SIZE;
        }
    }, {
        key: 'bindEventHandlers',
        value: function bindEventHandlers() {
            this.startGame = this.startGame.bind(this);
            this.arrowEvent = this.arrowEvent.bind(this);
            this.draw = this.draw.bind(this);
        }
    }, {
        key: 'createInstructionOverlay',
        value: function createInstructionOverlay() {
            var instructionOverlay = document.createElement('div');
            instructionOverlay.textContent = "Press Space To Begin";
            instructionOverlay.className = _renderer2.default.instructionOverlay;
            return instructionOverlay;
        }
    }, {
        key: 'createBottomInstructions',
        value: function createBottomInstructions() {
            var div = document.createElement('div');
            div.textContent = "← ↑ ↓ → to change direction";
            div.className = _renderer2.default.arrowInstructions;
            return div;
        }
    }, {
        key: 'createCanvasContext',
        value: function createCanvasContext() {
            var canvas = document.createElement('canvas');
            canvas.className = _renderer2.default.canvas;
            var ctx = canvas.getContext('2d');
            ctx.canvas.height = this.canvasSize;
            ctx.canvas.width = this.canvasSize;
            return ctx;
        }
    }, {
        key: 'arrowEvent',
        value: function arrowEvent(e) {
            switch (e.keyCode) {
                case 38:
                    this.snake.queueDirection(_constants.UP);
                    break;
                case 40:
                    this.snake.queueDirection(_constants.DOWN);
                    break;
                case 39:
                    this.snake.queueDirection(_constants.RIGHT);
                    break;
                case 37:
                    this.snake.queueDirection(_constants.LEFT);
                    break;
            }
        }
    }, {
        key: 'startGame',
        value: function startGame(e) {
            if (e.keyCode === 32) {
                document.removeEventListener('keyup', this.startGame);
                this.instructionOverlay.remove();
                this.bottomInstructions = this.createBottomInstructions();
                document.addEventListener('keydown', this.arrowEvent);
                document.body.append(this.bottomInstructions);
                this.snake = new _Snake2.default(this.canvasSize, this.ateIt);
                this.foodSupply = new _FoodSupply2.default(this.numRows);
                window.requestAnimationFrame(this.draw);
            }
        }
    }, {
        key: 'initialDomSetup',
        value: function initialDomSetup() {
            this.ctx = this.createCanvasContext();
            this.instructionOverlay = this.createInstructionOverlay();
            document.body.append(this.ctx.canvas);
            document.body.append(this.instructionOverlay);
        }
    }, {
        key: 'playAgainPrompt',
        value: function playAgainPrompt() {
            this.bottomInstructions.remove();
            this.foodSupply.cleanUp();
            document.removeEventListener('keydown', this.arrowEvent);
            document.body.append(this.instructionOverlay);
            document.addEventListener('keyup', this.startGame);
        }
    }, {
        key: 'draw',
        value: function draw(time) {
            var _this = this;

            if (!this.prevTime) {
                this.prevTime = time;
            }
            this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
            this.ctx.fillStyle = "#99c2ff";

            var drawFood = this.foodSupply.draw(time);
            if (drawFood) {
                var _ctx;

                (_ctx = this.ctx).fillRect.apply(_ctx, _toConsumableArray(drawFood));
            }

            this.snake.setDirection();
            this.snake.move(time - this.prevTime);
            this.snake.draw().forEach(function (item) {
                var _ctx2;

                (_ctx2 = _this.ctx).fillRect.apply(_ctx2, _toConsumableArray(item));
            });
            this.snake.eats(this.foodSupply.square);
            this.snake.cleanDirMarkers();

            this.prevTime = time;
            if (!this.snake.isGameOver()) {
                window.requestAnimationFrame(this.draw);
            } else {
                this.playAgainPrompt();
            }
        }
    }]);

    return Renderer;
}();

exports.default = Renderer;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin
module.exports = {"instructionOverlay":"renderer__instructionOverlay__gNzPG","arrowInstructions":"renderer__arrowInstructions__6lUSg","canvas":"renderer__canvas__2l-qQ"};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _opposites;

var _Square = __webpack_require__(1);

var _Square2 = _interopRequireDefault(_Square);

var _DirectionMarker = __webpack_require__(6);

var _DirectionMarker2 = _interopRequireDefault(_DirectionMarker);

var _constants = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var opposites = (_opposites = {}, _defineProperty(_opposites, _constants.UP, _constants.DOWN), _defineProperty(_opposites, _constants.DOWN, _constants.UP), _defineProperty(_opposites, _constants.LEFT, _constants.RIGHT), _defineProperty(_opposites, _constants.RIGHT, _constants.LEFT), _opposites);

var Snake = function () {
    function Snake(size, eatEvent) {
        _classCallCheck(this, Snake);

        this.size = size;
        this.eatEvent = eatEvent;
        this.squares = [];
        this.dirMarkers = [];
        this.squares.push(new _Square2.default([this.size / 2 - _constants.SQUARE_SIZE / 2, size / 2 - _constants.SQUARE_SIZE / 2]));
    }

    _createClass(Snake, [{
        key: 'speed',
        value: function speed() {
            return 120 * Math.log10(10 * this.squares.length); // diminishing returns on the speed boost.\
        }
    }, {
        key: 'isReverse',
        value: function isReverse(dir) {
            return this.dirMarkers.length && this.dirMarkers[this.dirMarkers.length - 1].dir === opposites[dir];
        }
    }, {
        key: 'isSameDir',
        value: function isSameDir(dir) {
            return this.dirMarkers.length && this.dirMarkers[this.dirMarkers.length - 1].dir === dir;
        }
    }, {
        key: 'queueDirection',
        value: function queueDirection(dir) {
            if (this.isReverse(dir) || this.isSameDir(dir)) {
                return;
            }
            this.nextDir = dir; // do the actual change in request animation frame
        }
    }, {
        key: 'setDirection',
        value: function setDirection() {
            if (!this.nextDir) {
                return;
            }
            var dirMarker = void 0;
            if (this.dirMarkers.length === 0) {
                dirMarker = new _DirectionMarker2.default(this.nextDir, this.squares[0].pos, this.squares.length);
            } else {
                dirMarker = new _DirectionMarker2.default(this.nextDir, this.squares[0].pos, 0, this.dirMarkers[this.dirMarkers.length - 1].dir // need the previous direction to help discern when to redirect
                );
            }
            this.dirMarkers.push(dirMarker);
            this.nextDir = null;
        }

        // get rid of passed markers

    }, {
        key: 'cleanDirMarkers',
        value: function cleanDirMarkers() {
            var _this = this;

            var index = this.dirMarkers.reduceRight(function (acc, item, index) {
                if (item.count === _this.squares.length && acc === -1) {
                    acc = index;
                }
                return acc;
            }, -1);
            if (index !== -1) {
                this.dirMarkers = this.dirMarkers.slice(index, this.dirMarkers.length);
            }
        }
    }, {
        key: 'moveChain',
        value: function moveChain(chain, delta, dirMarker, nextDirMarker) {
            chain.forEach(function (square, index) {
                if (index === 0) {
                    if (nextDirMarker && nextDirMarker.test(square.pos)) {
                        nextDirMarker.incrementCount();
                    }
                    square.move(dirMarker, delta, nextDirMarker);
                } else {
                    square.follow(dirMarker.dir, chain[index - 1].pos);
                }
            });
        }

        // idea is break the snake into sections controlled by invisible direction objects

    }, {
        key: 'move',
        value: function move(timeDelta) {
            var delta = timeDelta / 1000 * this.speed();
            if (this.dirMarkers.length === 1) {
                this.moveChain(this.squares, delta, this.dirMarkers[0]);
            } else if (this.dirMarkers.length > 1) {
                var sections = this.dirMarkers.map(function (item) {
                    return item.count;
                });
                for (var i = sections.length - 1; i >= 0; i--) {
                    this.moveChain(this.squares.slice(sections[i + 1] || 0, sections[i]), delta, this.dirMarkers[i], this.dirMarkers[i + 1]);
                }
            }
        }
    }, {
        key: 'isGameOver',
        value: function isGameOver() {
            return this.outOfboundsX() || this.outOfboundsY() || this.ateSelf();
        }
    }, {
        key: 'outOfboundsY',
        value: function outOfboundsY() {
            var pos = this.squares[0].pos;
            var buffer = _constants.SQUARE_SIZE / 2;
            return pos[1] + buffer < 0 || pos[1] + buffer > this.size;
        }
    }, {
        key: 'outOfboundsX',
        value: function outOfboundsX() {
            var pos = this.squares[0].pos;
            var buffer = _constants.SQUARE_SIZE / 2;
            return pos[0] + buffer < 0 || pos[0] + buffer > this.size;
        }
    }, {
        key: 'ateSelf',
        value: function ateSelf() {
            if (this.dirMarkers.length < 4 || this.squares.length < 4) {
                // has to be at least 4 turns to make a loop
                return false;
            }
            var checkAgainst = this.squares.slice(this.dirMarkers[this.dirMarkers.length - 3].count, this.squares.length);
            var leader = this.squares[0];
            return checkAgainst.reduce(function (acc, square) {
                if (!acc) {
                    acc = square.isCollision(leader.pos);
                }
                return acc;
            }, false);
        }
    }, {
        key: 'eats',
        value: function eats(square) {
            if (square.isCollision(this.squares[0].pos)) {
                var newSquare = new _Square2.default([0, 0]);
                this.squares.push(newSquare);
                this.dirMarkers[0].count = this.squares.length;
                document.dispatchEvent(this.eatEvent);
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            return this.squares.map(function (square) {
                return square.draw();
            });
        }
    }]);

    return Snake;
}();

exports.default = Snake;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dirDecisionMethods;

var _constants = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dirDecisionMethods = (_dirDecisionMethods = {}, _defineProperty(_dirDecisionMethods, _constants.UP, function (startPos) {
    return function (newPos) {
        return newPos[1] <= startPos[1];
    };
}), _defineProperty(_dirDecisionMethods, _constants.DOWN, function (startPos) {
    return function (newPos) {
        return newPos[1] >= startPos[1];
    };
}), _defineProperty(_dirDecisionMethods, _constants.LEFT, function (startPos) {
    return function (newPos) {
        return newPos[0] <= startPos[0];
    };
}), _defineProperty(_dirDecisionMethods, _constants.RIGHT, function (startPos) {
    return function (newPos) {
        return newPos[0] >= startPos[0];
    };
}), _defineProperty(_dirDecisionMethods, 'initial', function initial() {
    return false;
}), _dirDecisionMethods);

var DirectionMarker = function () {
    function DirectionMarker(dir, pos, count, prevDir) {
        _classCallCheck(this, DirectionMarker);

        this.dir = dir;
        this.pos = this.posOnGrid(pos, dir, prevDir);
        this.count = count;
        this.test = prevDir ? dirDecisionMethods[prevDir](this.pos) : dirDecisionMethods['initial'];
        this.move = this[this.dir];
    }

    _createClass(DirectionMarker, [{
        key: _constants.UP,
        value: function value(pos, delta) {
            return [this.pos[0], pos[1] - delta];
        }
    }, {
        key: _constants.DOWN,
        value: function value(pos, delta) {
            return [this.pos[0], pos[1] + delta];
        }
    }, {
        key: _constants.LEFT,
        value: function value(pos, delta) {
            return [pos[0] - delta, this.pos[1]];
        }
    }, {
        key: _constants.RIGHT,
        value: function value(pos, delta) {
            return [pos[0] + delta, this.pos[1]];
        }
    }, {
        key: 'incrementCount',
        value: function incrementCount() {
            this.count++;
        }
    }, {
        key: 'posOnGrid',
        value: function posOnGrid(pos, dir, prevDir) {
            if (!prevDir) {
                return pos;
            }
            var additional = void 0;
            switch (prevDir) {
                case _constants.UP:
                    additional = pos[1] % _constants.SQUARE_SIZE;
                    return [pos[0], pos[1] - additional];
                case _constants.DOWN:
                    additional = _constants.SQUARE_SIZE - pos[1] % _constants.SQUARE_SIZE;
                    return [pos[0], pos[1] + additional];
                case _constants.LEFT:
                    additional = pos[0] % _constants.SQUARE_SIZE;
                    return [pos[0] - additional, pos[1]];
                case _constants.RIGHT:
                    additional = _constants.SQUARE_SIZE - pos[0] % _constants.SQUARE_SIZE;
                    return [pos[0] + additional, pos[1]];
            }
        }
    }]);

    return DirectionMarker;
}();

exports.default = DirectionMarker;
;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(0);

var _Square = __webpack_require__(1);

var _Square2 = _interopRequireDefault(_Square);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FoodSupply = function () {
    function FoodSupply(rowCount) {
        _classCallCheck(this, FoodSupply);

        this.rowCount = rowCount;
        this.blinkSettings = [_constants.BLINK_OFF, _constants.BLINK_ON];
        this.blinkState = 1;
        this.updatePosition = this.updatePosition.bind(this);
        document.addEventListener(_constants.ATE_IT_EVENT, this.updatePosition, false);
        this.updatePosition();
    }

    _createClass(FoodSupply, [{
        key: 'updatePosition',
        value: function updatePosition() {
            this.square = new _Square2.default([Math.floor(Math.random() * this.rowCount) * _constants.SQUARE_SIZE, Math.floor(Math.random() * this.rowCount) * _constants.SQUARE_SIZE]);
        }
    }, {
        key: 'getBlinkState',
        value: function getBlinkState(time) {
            if (!this.prevTime) {
                this.prevTime = time;
            }
            if (time - this.prevTime > this.blinkSettings[this.blinkState]) {
                this.blinkState = this.blinkState ? 0 : 1;
                this.prevTime = time;
            }
            return this.blinkState;
        }
    }, {
        key: 'draw',
        value: function draw(time) {
            var blinkState = this.getBlinkState(time);
            if (!blinkState) {
                return null;
            }
            return [].concat(_toConsumableArray(this.square.pos), [_constants.SQUARE_SIZE, _constants.SQUARE_SIZE]);
        }
    }, {
        key: 'cleanUp',
        value: function cleanUp() {
            document.removeEventListener(_constants.ATE_IT_EVENT, this.updatePosition);
        }
    }]);

    return FoodSupply;
}();

exports.default = FoodSupply;

/***/ })
/******/ ]);