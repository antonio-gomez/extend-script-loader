var helloWorld = require("./es/hello-world.es")
// var helloOtherWorld = require("./es/hello-world.es")

console.log(helloWorld);

// helloWorld(Math.random())
helloWorld()

if (module.hot) {
  module.hot.accept()
}
