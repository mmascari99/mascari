const fs = require('fs').promises;
const getTimestamp = () => new Date().toISOString().replace('T', ' ').slice(0, 19);

async function writeStandard(log) {
    fs.appendFile('logs/standard-logs.txt', getTimestamp() + log + '\n', (err) => {
        if (err) {
            writeError('Error appending standard log');
        }
    });
}

async function writeWarning(log) {
    fs.appendFile('logs/warning-logs.txt', getTimestamp() + log + '\n', (err) => {
        if (err) {
            writeError('Error appending warning log');
        }
    });
}

async function writeError(log) {
    fs.appendFile('logs/warning-logs.txt', getTimestamp() + log + '\n', (err) => {
        if (err) {
            console.log('Error appending error file');
        }
    });
}

module.exports = { writeStandard, writeWarning, writeError };