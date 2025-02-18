const fs = require('fs').promises;
const getTimestamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

async function writeStandard(log) {
    log = getTimestamp() + ' ' + log + '\n';
    fs.appendFile('logs/standard-logs.txt', log, (err) => {
        if (err) {
            writeError('Error appending standard log');
        }
    });
    console.log(log);
}

async function writeWarning(log) {
    log = getTimestamp() + ' ' + log + '\n';
    fs.appendFile('logs/warning-logs.txt', log, (err) => {
        if (err) {
            writeError('Error appending warning log');
        }
    });
    console.log(log);
}

async function writeError(log) {
    log = getTimestamp() + ' ' + log + '\n';
    fs.appendFile('logs/warning-logs.txt', log, (err) => {
        if (err) {
            console.log('Error appending error file');
        }
    });
    console.error(log);
}

module.exports = { writeStandard, writeWarning, writeError };