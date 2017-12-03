// Helper to clear screen
process.stdout.write('\033c ');

// // In the last episode we made our own
// // future, like:
// const myFuture = future(function(res) {
//   res(42);
// });
// myFuture.onValue(console.log);

// This is a read only async construct
// for passing around values.

// We can use Promise for the same, but
// that also has more features. And
// isn't read only in the same way.

const myPromise = Promise.resolve(42);

myPromise.then(console.log); //=> 42

// But now we can also create a new promise
// based on the old promise, easily:

const mySecondPromise = myPromise.then(num => num * 2);
mySecondPromise.then(console.log);

// None of this is async. As you see in line 18, we
// just wrap a sync value inside a promise.
// This means we can treat sync values and async
// values the same. Essentially taking the
// time out of the equation. Which is very powerfull.

// But how do we create async values with promises?
// Much like we saw with out future:

const myAsync = new Promise(function(resolve) {
  setTimeout(function() {
    resolve(42);
  }, 1000);
});

myAsync.then(console.log);

// Promises are eager in values. Even though no one is listening
// the tree makes a sound.

const myAsync = new Promise(function(resolve) {
  setTimeout(function() {
    resolve(42);
    console.log('Value has been created');
  }, 1000);
});

setTimeout(() => myAsync.then(console.log), 1500);

// We can create new promises based on the async
// promise just as before:

myAsync
  .then(i => i * 2)
  .then(function(i) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(i + 42);
      }, 1000);
    });
  })
  .then(console.log);

// Same as with our future (last episode), error
// handling is done in a different way than a
// try-catch. We have a rejection, where our promise
// is rejected.

const myRejectedPromise = Promise.reject(new Error('Not working'));
myRejectedPromise.catch(console.error);

// And the rejection can also be async, ofcourse.
const myAsyncReject = new Promise(function(resolve, reject) {
  setTimeout(function() {
    reject(42);
  }, 1000);
});
myAsyncReject.catch(console.error);
