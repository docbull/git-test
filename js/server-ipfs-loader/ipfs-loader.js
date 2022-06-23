const { spawn } = require('child_process');
const crypto = require('crypto');

import { spawn } from 'child_process';
import crypto from 'crypto';

// runIPFS runs IPFS node for getting video chunks, and
// it returns buffer array that contains chunk data
async function runIPFS(command, args) {
    let length = 0;
    let offset = 0;
    return new Promise(resolve => {
        const algorithm = "aes-256-cbc";
        const password = "docbullwatson";
        
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
            let lengthOfChunk = 0;
            for (var i=0; i<chunk.length; i++) {
                lengthOfChunk += chunk[i].length;
            }
            var data = Buffer.concat(chunk);
            try {
                var decipher = crypto.createDecipher(algorithm, password);
                var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
                let value = new Uint8Array(length);
                value.set(decrypted, offset);
                resolve(value);
            } catch (err) {
                console.log(err);
                return;
            }
            // resolve(decrypted);
        });
    })
}

// export async function catChunkFromIPFS (command, args) {
//     return await runIPFS(command, args);
// }

exports.catChunkFromIPFS = async function (command, args) {
    return await runIPFS(command, args);
}

// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣫⣷⣿⣿⣦⡉⠻⣿⣿⣿⣿⣿⣿⣿⣾⣧⠀⠈⠙⢿⣿⣿⣿⣿⣿⣿⡋⠁⠀⠈⠉⢻⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⡟⠉⠁⠀⠈⠻⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⢻⣷⣿⣿⣿⣿⣿⣿⣿⠟⠩⣾⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⡿⡇⠄⢸⣿⣿⣿⣯⣿⣿⣿⣏⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⡅⠀⠀⠀⠀⠀⢻⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⡟⠀⠀⠀⠀⠀⡀⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⢾⣿⣿⣿⣻⣿⣿⣿⡇⠀⠘⣿⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⡎⠀⢸⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣧⠀⠀⠀⠀⠀⠈⣾⡿⣿⣿⣿⣿⠀⠀⠀⠀⣿⣿⣿⣿⣻⣿⣿⣿⡇⢀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⣤⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⣠⣾⣿⣿⣿⣿⣯⣻⣆⡀⠀⠀⣀⣼⣿⣿⣿⣿⣷⣄⡀⠀⠀⠀⢀⣤⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⢿⣿⢿⣿⣿⣿⣿⣿⣿⣄⡈⢿⣿⣿⡿⣫⣾⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿