// note: these module specifiers come from the import-map
//    in index.html; swap "src" for "dist" here to test
//    against the dist/* files
import * as IDBStore from "client-storage/src/adapter-idb";
import * as LSStore from "client-storage/src/adapter-local-storage";
import * as SSStore from "client-storage/src/adapter-session-storage";
import * as CookieStore from "client-storage/src/adapter-cookie";
import * as OPFSStore from "client-storage/src/adapter-opfs";


// ***********************

const storageTypes = {
	"idb": [ "IndexedDB", IDBStore, ],
	"local-storage": [ "Local Storage", LSStore, ],
	"session-storage": [ "Session Storage", SSStore, ],
	"cookie": [ "Cookies", CookieStore, ],
	"opfs": [ "Origin Private FS", OPFSStore, ],
};

var runTestsBtn;
var testResultsEl;

var currentVault;

if (document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded",ready,false);
}
else {
	ready();
}


// ***********************

async function ready() {
	runTestsBtn = document.getElementById("run-tests-btn");
	testResultsEl = document.getElementById("test-results");

	runTestsBtn.addEventListener("click",runTests,false);
}

function logError(err,returnLog = false) {
	var err = `${
			err.stack ? err.stack : err.toString()
		}${
			err.cause ? `\n${logError(err.cause,/*returnLog=*/true)}` : ""
	}`;
	if (returnLog) return err;
	else console.error(err);
}

async function runTests() {
	var expectedResults = [
		[ "idb", "has(1)", false ],
		[ "idb", "get(1)", null ],
		[ "idb", "set", true ],
		[ "idb", "has(2)", true ],
		[ "idb", "get(2)", "world" ],
		[ "idb", "keys(1)", [ "hello", ], ],
		[ "idb", "entries", [ [ "hello", "world", ], ], ],
		[ "idb", "remove", true ],
		[ "idb", "keys(2)", [], ],
		[ "local-storage", "has(1)", false ],
		[ "local-storage", "get(1)", null ],
		[ "local-storage", "set", true ],
		[ "local-storage", "has(2)", true ],
		[ "local-storage", "get(2)", "world" ],
		[ "local-storage", "keys(1)", [ "hello", ], ],
		[ "local-storage", "entries", [ [ "hello", "world", ], ], ],
		[ "local-storage", "remove", true ],
		[ "local-storage", "keys(2)", [], ],
		[ "session-storage", "has(1)", false ],
		[ "session-storage", "get(1)", null ],
		[ "session-storage", "set", true ],
		[ "session-storage", "has(2)", true ],
		[ "session-storage", "get(2)", "world" ],
		[ "session-storage", "keys(1)", [ "hello", ], ],
		[ "session-storage", "entries", [ [ "hello", "world", ], ], ],
		[ "session-storage", "remove", true ],
		[ "session-storage", "keys(2)", [], ],
		[ "cookie", "has(1)", false ],
		[ "cookie", "get(1)", null ],
		[ "cookie", "set", true ],
		[ "cookie", "has(2)", true ],
		[ "cookie", "get(2)", "world" ],
		[ "cookie", "keys(1)", [ "hello", ], ],
		[ "cookie", "entries", [ [ "hello", "world", ], ], ],
		[ "cookie", "remove", true ],
		[ "cookie", "keys(2)", [], ],
		[ "opfs", "has(1)", false ],
		[ "opfs", "get(1)", null ],
		[ "opfs", "set", true ],
		[ "opfs", "has(2)", true ],
		[ "opfs", "get(2)", "world" ],
		[ "opfs", "keys(1)", [ "hello", ], ],
		[ "opfs", "entries", [ [ "hello", "world", ], ], ],
		[ "opfs", "remove", true ],
		[ "opfs", "keys(2)", [], ],
	];
	var testResults = [];

	testResultsEl.innerHTML = "Client Storage tests running...<br>";

	var stores = [ IDBStore, LSStore, SSStore, CookieStore, OPFSStore ];
	for (let store of stores) {
		testResults.push([ storageTypes[store.storageType][0], "has(1)", await store.has("hello"), ]);
		testResults.push([ storageTypes[store.storageType][0], "get(1)", await store.get("hello"), ]);
		testResults.push([ storageTypes[store.storageType][0], "set", await store.set("hello","world"), ]);
		testResults.push([ storageTypes[store.storageType][0], "has(2)", await store.has("hello"), ]);
		testResults.push([ storageTypes[store.storageType][0], "get(2)", await store.get("hello"), ]);
		testResults.push([ storageTypes[store.storageType][0], "keys(1)", await store.keys(), ]);
		testResults.push([ storageTypes[store.storageType][0], "entries", await store.entries(), ]);
		testResults.push([ storageTypes[store.storageType][0], "remove", await store.remove("hello"), ]);
		testResults.push([ storageTypes[store.storageType][0], "keys(2)", await store.keys(), ]);
	}
	var testsPassed = true;
	for (let [ testIdx, testResult ] of testResults.entries()) {
		if (JSON.stringify(testResult[2]) == JSON.stringify(expectedResults[testIdx][2])) {
			testResultsEl.innerHTML += `(${testIdx}) ${testResult[0]}:${testResult[1]} passed<br>`;
		}
		else {
			testsPassed = false;
			testResultsEl.innerHTML += `<strong>(${testIdx}) ${testResult[0]}:${testResult[1]} failed</strong><br>`;
			testResultsEl.innerHTML += `&nbsp;&nbsp;&nbsp;Expected: <strong>${expectedResults[testIdx][2]}</strong>, but found: <strong>${testResult[2]}</strong><br>`;
		}
	}
	if (testsPassed) {
		testResultsEl.innerHTML += "<strong>...ALL PASSED.</strong><br>";
	}
	else {
		testResultsEl.innerHTML += "<strong>...Some tests failed.</strong><br>";
	}
}