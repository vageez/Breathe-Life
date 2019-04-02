const csv = require('csvtojson')
var { createWriteStream } = require('fs')
var { stringify } = require('JSONStream')
var { processData } = require('./scripts/businessRules.js')

const csvFile = `${__dirname}/input-2019-03.csv`
const destFile = `${__dirname}/output.json`

var transformStream = stringify()
var outPutStream = createWriteStream(destFile)
transformStream.pipe(outPutStream)

csv()
  .fromFile(csvFile)
  .subscribe(
    (json, _) => new Promise((resolve, reject) => {
        const data = processData(json)
        transformStream.write(data)
        resolve()
    }),
    err => {
      throw new Error(`Something is not right ${err}`)
    },
    () => {
      transformStream.end()
    }
  )
