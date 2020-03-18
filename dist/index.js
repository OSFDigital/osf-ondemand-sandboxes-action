module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
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
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(798);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 131:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 433:
/***/ (function() {

eval("require")("@actions/exec");


/***/ }),

/***/ 798:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(131);
const exec = __webpack_require__(433);

async function run() {
    try {
        const sandboxes = JSON.parse(core.getInput('sandboxes'));
        const event = core.getInput('event');
        const allowedEvents = ['start', 'stop', 'delete', 'restart', 'reset', 'list'];
        
        console.log(sandboxes);

        // Check if incoming event is allowed and
        // throw an error and exit this action if it's not  
        if (allowedEvents.includes(event) === false) {
            core.setFailed('Not a valid event input. Expected one of the following: start | stop | delete | restart | reset | list');
        }

        if (sandboxes !== undefined && sandboxes.length > 0) {
            // Loop through all sandboxes returned by previous action step
            for (let sandbox of sandboxes) {
                switch (event) {
                    case 'delete':
                        await exec.exec('sfcc-ci sandbox:delete -N -s', [sandbox.id]);
                        break;
                    case 'reset':
                        await exec.exec('sfcc-ci sandbox:reset -N -s', [sandbox.id]);
                        break;
                    case 'list':
                        await exec.exec('sfcc-ci sandbox:list -S state');
                        break;
                    default:
                        await exec.exec(`sfcc-ci sandbox:${event} -s`, [sandbox.id]);
                        break;
                }

                // Exit loop as we need to list sandboxes status only once
                if (event === 'list') {
                    break;
                }
            }
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();


/***/ })

/******/ });