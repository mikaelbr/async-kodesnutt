// JavaScript is single threaded.

console.time();
for (let i = 0; i < 100000000; i++);
console.timeEnd(); // Takes a long time

// So when doing things like fetching
// external resources, doing it synchronously
// is very bad practise

const fs = require('fs');

console.time('fileSync');
fs.readFileSync('demo.data').toString();
console.timeEnd('fileSync');

// This is bad as we stop execution of
// everything. Even UI in the browser.

// A solution to that is to run asyncronous.

console.time('readFile');
fs.readFile('demo.data', function() {
  console.log('done');
});
console.timeEnd('readFile');

// Still takes the same amount of time,
// but order has changed.
console.time('readFile2');
fs.readFile('demo.data', function() {
  console.timeEnd('readFile2');
});

// The function passed to readFile is
// popularly called a callback. As it
// is a message you pass and say they
// should call you back.

// A callback can be implemented such as:

function ajax(url, callback) {
  const content = getSomeContent();
  callback(null, content);
}

// Just where getSomeContent is actually async
// fetching something from an external source.
// Key here is that async functions taking
// callbacks don't actually run in the same
// context. It doesn't run in the JavaScript
// single thread, but it runs in the runtime.
// For the browser that is in the browser,
// but in Node.js it is in a C++ API.
// More on this in a later episode about the
// event loop.

// Not all callback functions passed as arguments
// are async callbacks.

// E.g. here we have callback onNumber, but
// it's not async

function doSomething(onNumber) {
  if (2 === 2) onNumber('All is right. 2 is 2');

  if (3 === 3) onNumber('Still right. 3 is in fact 3');
}

// Here we also see that we there is nothing forcing
// us to name callbacks `callback`, it's just a
// convenience convention. In fact, in the example
// above naming it callback would be confusing. Here
// it acts more as a event listener (which is a form of)
// callbacks. So naming it `onNumber` is more appropriate.

// Types of tings that are async:
// - Event listeners
// - File I/O
// - ajax/requests
// - setTimeout/setInterval/nextTick

// In node callbacks usually follow the pattern
// of two arguments to the callback:
// - Error (or null if none)
// - The result
fs.readFile('demo.data', function(error, a) {
  console.log('Demo length:', a.length);
});

// So when we get an error, we see the
// error info in the error object
fs.readFile('demo.data2', function(error, a) {
  console.log('Demo error:', error);
});

// So a common pattern when using callbacks
// is to check for error, and propagate
// if it exist.

function getDataLength(callback) {
  fs.readFile('demo.data2', function(error, a) {
    if (error) return callback(error);
    callback(null, a.length);
  });
}

// With callbacks you can sometimes get what
// is referred to as "callback hell" or
// boomerang code.
function getDataLength(callback) {
  fs.readFile('demo.data', function(err1, a) {
    fs.readFile('demo.data', function(err2, b) {
      const all = a + b;
      console.log('Finished:', all.length);
    });
  });
}

// This will make it harder to read and reason
// about the code you see and difficult
// to track data flow.

// But this is the same as with regular
// sequential code also, with too much indentation.

// One way to avoid this is splitting
// all callbacks up in function declerations
function getDataLength(callback) {
  fs.readFile('demo.data', getALength);
}

function getALength(err, a) {
  if (err) return 0;
  fs.readFile('demo.data', (...args) => getBLength(a, ...args));
}

function getBLength(a, err, b) {
  if (err) return a;
  const all = a + b;
  console.log('Finished:', all.length);
}

// As a added bonus with this, you can structure
// the code by importance (using hoisting to your)
// advantage. Also, errors will be better as
// stacktraces will be named. Often
// with callbacks we use anonymous functions,
// which hurts stacktraces:

process.nextTick(function() {
  throw new Error('Hello');
});

// Will not show any function name and
// makes it harder to track.

process.nextTick(function inNextTick() {
  throw new Error('Hello');
});

// Summary:
// 1. Callbacks are functions something else can invoke for you
// 2. Async callbacks are callbacks called by the runtime (e.g. Node or Browser).
// 3. In Node, callbacks usually follow the argument list [error, ...results].
// 4. You don't have to call them callbacks.
// 5. Callback hell can be avoided by restructuring.
// 6. Name your callbacks to better debug and follow stack traces.
