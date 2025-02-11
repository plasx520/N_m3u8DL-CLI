// logging.js - JS to control console logging and error handling
// (C) 2021 Richard Stam, SigmaFxDx Software
var stealthRelease = true;
var devDebugging = false;
var devVerboseLog = false;
var logRuntimeErrors = false;
var alertRuntimeErrors = false;
var squelchRuntimeErrors = true;
var logRuntimeExceptions = false;
var alertRuntimeExceptions = false;
var squelchRuntimeExceptions = true;

// Check for chrome.runtime.lastError
function checkLastError(caller) {
    var lastError = chrome.runtime.lastError;
    if (lastError) logRuntimeError("checkLastError = " + lastError.message);
    return lastError;
};

// devDubugging = true/false;
function devLog(...args) {
    if (!stealthRelease) console.log(...args);
}
function devInfo(...args) {
    if (!stealthRelease) console.info(...args);
}
function devDebug(...args) {
    if (devDebugging && !stealthRelease) console.info(...args);
}
function devVerbose(...args) {
    if (devVerboseLog && !stealthRelease) console.debug(...args);
}

//logRuntimeErrors = true/false;
//alertRuntimeErrors = true/false;
function logRuntimeError(...args) {
    if (!stealthRelease) {
        if (logRuntimeErrors) {
            console.groupCollapsed("ERROR: " + args[0] + " ...");
            console.log(...args); console.trace();
            console.groupEnd();
        }
        if (alertRuntimeErrors) alertRuntimeError(...args);
    }
}
function alertRuntimeError(...args) {
    if (alertRuntimeErrors && !stealthRelease) {
        alert("ERROR: " + args.join(' '));
    }
}

//logRuntimeExceptions = true/false;
//alertRuntimeExceptions = true/false;
function logRuntimeException(...args) {
    if (!stealthRelease) {
        if (logRuntimeExceptions) {
            console.groupCollapsed("ERROR: (Exception) " + args[0] + " ...");
            console.log(...args); console.trace();
            console.groupEnd();
        }
        if (alertRuntimeExceptions) alertRuntimeException(...args);
    }
}
function alertRuntimeException(...args) {
    if (alertRuntimeExceptions && !stealthRelease) {
        alert("ERROR (Exception): " + args.join(' '));
    }
}


//#region Catch generic runtime errors
// medium.com/@jacobwarduk/
//how-to-correctly-use-preventdefault-stoppropagation
//-or-return-false-on-events-6c4e3f31aedb

// Handles normal (sync) runtime errors
window.addEventListener('error', function(event) {
    logRuntimeError("window error event =", event);
    if (squelchRuntimeErrors || stealthRelease) event.preventDefault();
});

// Handles async (Promise) runtime errors (Exceptions)
window.addEventListener('unhandledrejection', function (event) {
    logRuntimeException("window unhandledrejection event =", event);
    if (squelchRuntimeExceptions || stealthRelease) event.preventDefault();
});
//#endregion
