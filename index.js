const { convert } = require('./scripts/convertCsvToJsonFile')
const { processJsonData } = require('./scripts/processJsonData')

const csvFile = `${__dirname}/input-2019-03.csv`
const destFile = `${__dirname}/input-2019-03.json`
const finalFile = `${__dirname}/output.json`

const jsonData = convert(csvFile)(destFile)

jsonData.then(fileName => {
    processJsonData(destFile)(finalFile)
})
  
