const { promisify } = require('util')
const { exec } = require('child_process')
const EXEC = promisify(exec)

const convert = csvFile => async destFile => {
    try{
        const { err } = await EXEC(`cat ${csvFile} | ./node_modules/.bin/csvtojson > ${destFile}`)
        if(err) {
            return err
        } else return destFile
    } catch (err) {
        return err
    }
}

module.exports = { convert }