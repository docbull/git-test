// const fs = require('fs');
const { spawn } = require('child_process');

let length = 0;

async function execac(command, args) {
    length = 0;
    return new Promise(resolve => {
        let chunk = [];
        const proc = spawn(command, args);

        proc.stdout.on('data', (data) => {
            length += data.length;
            chunk.push(data);
        });
        
        proc.stderr.setEncoding("utf8");
        proc.stderr.on('data', (data) => {
            console.log(data);
        });

        proc.on('close', () => {
            resolve(chunk);
        });
    })
}

// async function readChunk(file) {
//     return new Promise(resolve => {
//         fs.readFile(`./${file}`, (err, data) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             let units = new Uint8Array(data);
//             resolve(units);
//         });
//     })
// }

exports.catChunkFromIPFS = async function (command, args) {
    let data = await execac(command, args);
    return new Promise(resolve => {
        console.log('length:', length);
        let value = new Uint8Array(length);
        let offset = 0;
        for (const buf of data) {
            value.set(buf, offset);
            offset += buf.length;
        }
        resolve(value);
    })
}

// exports.getChunkFromIPFS = async function (command, args) {
//     await execac(command, args);
//     return new Promise(resolve => {
//         let chunk = args[1].split('/');
//         readChunk(chunk[1]).then(function(result) {
//             resolve(result);
//         });
//     })
// }
