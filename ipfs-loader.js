const fs = require('fs');
const { spawn } = require('child_process');

async function execac(command, args) {
    return new Promise(resolve => {
        const proc = spawn(command, args);

        proc.stdout.on('data', (data) => {
            //console.log('data:', data);
        });
        
        proc.stderr.setEncoding("utf8");
        proc.stderr.on('data', (data) => {
            console.log(data);
        });

        proc.on('close', () => {
            resolve(`${command} end`);
        });
    })
}

async function readChunk(file) {
    return new Promise(resolve => {
        fs.readFile(`./${file}`, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let units = new Uint8Array(data);
            resolve(units);
        });
    })
}

exports.getChunkFromIPFS = async function (command, args) {
    await execac(command, args);
    return new Promise(resolve => {
        let chunk = args[1].split('/');
        readChunk(chunk[1]).then(function(result) {
            resolve(result);
        });
    })
}
