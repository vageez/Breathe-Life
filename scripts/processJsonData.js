var { createReadStream, createWriteStream } = require('fs')
var { parse, stringify } = require('JSONStream')
var { processData } = require('./businessRules.js')

const processJsonData = inputFileName => outPutFile => {
  var transformStream = parse('*')
  var inputStream = createReadStream(inputFileName)

  var transformStream2 = stringify()
  var outPutStream = createWriteStream(outPutFile)

  transformStream2.pipe(outPutStream)

  inputStream
    .pipe(transformStream)
    .on('data', data => {
      var processedData = processData(data)
      transformStream2.write(processedData)
    })
    .on('end', () => transformStream2.end())
}

module.exports = { processJsonData }
