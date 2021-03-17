// Helper to clear screen
process.stdout.write('\033c ');

let logOutput = function(...args) {
  console.log('Output', ...args);
};

Promise.resolve(1)
  .then(() => 2)
  .then(() => 3)
  .then(() => 4)
  .then(() => {
    throw 'Foo';
  })
  .then(logOutput); // Unhandled Promise Rejection

// Catching

let logError = function(e) {
  console.error('Error', e);
};

Promise.resolve(1)
  .then(() => 2)
  .then(() => 3)
  .then(() => 4)
  .then(() => {
    throw 'Foo';
  })
  .catch(logError) // Error Foo
  .then(logOutput); // Output undefined

// Whith returning error

logError = function(e) {
  console.error('Error', e);
  return 'Error returned';
};
logOutput = function(...args) {
  console.log('Output', ...args);
};

Promise.resolve(1)
  .then(() => 2)
  .then(() => 3)
  .then(() => 4)
  .then(() => {
    throw 'Foo';
  })
  .catch(logError)
  .then(logOutput);

// Propagate errors

logError = function(e) {
  console.error('Error', e);
  throw e;
};
logOutput = function(...args) {
  console.log('Output', ...args);
};

Promise.resolve(1)
  .then(() => 2)
  .then(() => 3)
  .then(() => 4)
  .then(() => {
    throw 'Foo';
  })
  .catch(logError)
  .then(logOutput); // Unhandled Promise Rejection

// Same goes no matter where you throw exception

logError = function(e) {
  console.error('Error', e);
};
logOutput = function(...args) {
  console.log('Output', ...args);
};

Promise.resolve(1)
  .then(() => {
    throw 'Foo';
  })
  .then(() => 2) // will never run
  .then(() => 3) // will never run
  .then(() => 4) // will never run
  .catch(logError) // will catch run
  .then(logOutput); // Unhandled Promise Rejection

// But watch out if you catch error

Promise.resolve(1)
  .then(() => {
    throw 'Foo';
  })
  .catch(logError) // will catch run
  .then(() => 2) // will run
  .then(() => 3) // will run
  .then(() => 4) // will run
  .then(logOutput); // Unhandled Promise Rejection

// Can do fallback mechanisms

Promise.resolve(1)
  .then(() => Promise.reject('Crash'))
  .then(() => 4) // will never run
  .catch(() => 'Fallback') // will catch run
  .then(logOutput); // Output Fallback

// Different ways to add error handlers

Promise.resolve(1)
  .then(() => Promise.reject('Crash'))
  .then(() => 4, () => 'Fallback')
  .then(logOutput); // Output Fallback

// Reacts to previous error

Promise.resolve(1)
  .then(() => Promise.reject('Crash'), () => 'Fallback') // Will not fallback
  .then(logOutput); // Unhandled Promise Rejection

// Also works with runtime errors

Promise.resolve(1)
  .then(() => foo[1]) // Will not fallback
  .then(() => 4, () => 'Fallback')
  .then(logOutput); // Output Fallback

// Same with `.catch`

Promise.resolve(1)
  .then(() => foo[1]) // Will not fallback
  .catch(logError)
  .then(logOutput); // Output
