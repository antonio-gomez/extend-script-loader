# extend-script-loader

This package allows for easy execution of ExtendScript (ES) files directly from a Adobe Common Extensibility Platform (CEP) panel.

## Why

The process for setting up bi-directional communication between CEP and ES is a bit tedious to work with. This improves that process by allowing you to simply import your ES code and run it directly from the presentation layer. We also get free hot reloading on ES files when used with Hot Module Reloading (HMR).

## Installation

```bash
npm install --save-dev extend-script-loader
```

## Usage

You'll need to add extend-script-loader to the list of loaders within your webpack configuration like so:

```javascript
module: {
  loaders: [
    {
      test: /\.es?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'extend-script', // 'extend-script-loader' is also a legal name to reference
    }
  ]
}
```

Make sure CSInterface is loaded in the CEP panel.

```html
<html>
  <head>
    <script src="CSInterface.js"></script>
  </head>
</html>
```

Then write your ES inside of an Immediately-Invoked Function Expression (IIFE):

```javascript
// hello-world.es
(function() {
  writeLn('Hello world!');
})();
```

Lastly, import and run the script inside your CEP panel:

```javascript
// app.js
import helloWorld from './hello-world.es'

helloWorld();
```

If run with After Effects as the target, you'll see ````Hello world!```` inside of the Info panel.


## Advanced Usage

It's also possible to send and receive data to scripts.

### Receiving data from CEP

Return a function inside the script that will accept parameters passed from CEP:

```javascript
// send-number.es
(function() {
  return function(number) {
    writeLn('Number from CEP: ' + number);
  };
})();
```

```javascript
// app.js
import sendNumber from './send-number.es'

sendNumber(Math.random() * 100);
```

### Receiving data from ES

Return a value inside the script that will be passed to CEP:

```javascript
// send-number.es
(function() {
  return function() {
    return Math.random() * 100
  };
})();
```

```javascript
// app.js
import receiveNumber from './send-number.es'

receiveNumber((err, result) => {
  console.log('Number from ES: ' + result);
});
```

__Note:__ You can return any JSON parseable data (including objects and arrays).

```javascript
// send-object.es
(function() {
  return function() {
    return {foo: 'bar'}
  };
})();
```

```javascript
// app.js
import sendObj from './send-object.es'

sendObj((err, result) => {
  console.log('Object from ES: ', result);
});
```

## Passing and receiving data inside CEP.

You can pass as many parameters as desired to the script. The callback will always be added as the last parameter.

```javascript
// app.js
import scriptWithManyParameters from './my-script.es'

scriptWithManyParameters('foo', 'bar', (err, result) => {
  // this is still called no matter how many parameters are passed to scriptWithManyParameters
});
```

## Exceptions

Currently, when any exception is thrown inside of an ES file it is caught and the error object is passed back to the CEP invocator's callback and also logged in the CEP console. This is because ExtendScript Toolkit is too slow and painful to work with and I've found it faster to just check the error's message and line number and then fix it in my text editor of choice. A configuration/query parameter to "unwrap" the try/catch to disable this could be added later if needed.

```javascript
// throw-exception.es
(function() {
  throw Error('MyError: an error happened here.');
})();
```

```javascript
// app.js
import throwException from './throw-exception.es'

throwException((err, result) => {
  if (err) {
    console.log(err.message); // MyError: an error happened here.
    console.log(err.line); // 2
    console.log(err.source); /* the entire script's source. this might be useful for some advanced
      CEP error displaying in the future.
    */
  }
});
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## License

The MIT License (MIT)
