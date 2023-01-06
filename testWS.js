require("./server.js")
const newman = require('newman'); // require newman in your project
const { exit } = require("process")

const runNewman = async (collectionName, reporter) => {
  return new Promise((resolve, reject) => {
    newman.run({
      collection: require(collectionName),
      environment: require('./wynsure.postman_environment.json'),
      reporters: ['junit', 'cli'],
    }, function (err, summary) {
      if (err) { reject(err) }
      console.log('collection run complete!')
      if (summary.error){
        reject(summary.error)
      }
      resolve()
    });
  })
}

const runTest = async function () {
  try {
    await runNewman('./TestWynsure.postman_collection.json')
    exit(0)
  } catch (e){
    console.error(e)
    exit(1)
  }
}

runTest()