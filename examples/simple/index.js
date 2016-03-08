var helloWorld = require("./es/hello-world.es")

helloWorld(Math.random())

if (module.hot) {
  module.hot.accept()
}
