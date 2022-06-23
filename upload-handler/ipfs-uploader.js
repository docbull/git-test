const path = require('path');
const execa = require('execa');
const fs = require('fs');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const crypto = require('crypto');

let filePaths = [];

function execac(command, args) {
    return new Promise((resolve, reject) => {
        const proc = execa(command, args);

        proc.stdout.on('data', (data) => {
            console.log(data);
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

async function readDirectory(videoName) {
    const algorithm = "aes-256-cbc";
    const password = "docbullwatson";
    
    return new Promise((resolve) => {
        fs.readdir(path.join(videoName), (err, files) => {
            if (files) {
                files.forEach(file => {
                    let chunk = fs.readFileSync(`${videoName}/${file}`);
                    var cipher = crypto.createCipher(algorithm, password);
                    var encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);
                    try {
                        fs.writeFileSync(`${videoName}/${file}`, encrypted);
                    } catch (err) {
                        console.error(err);
                    }
                    filePaths.push(`${videoName}/${file}`);
                });
                resolve('successfully read the directory');
            }
        });
    });
}

// Web3StorageUploader uploads video chunks into IPFS network using Web3.Storage.
async function Web3StorageUploader(web3Token) {
    const token = web3Token;

    if (!token) {
        return console.error('🔖 A token is needed. You can create one on https://web3.storage');
    }

    if (filePaths.length < 1) {
        return console.error('😅 Please supply the path to a file or directory');
    }

    return new Promise(async function (resolve) {
        const storage = new Web3Storage({ token });
        const files = []
        for (const path of filePaths) {
            const pathFiles = await getFilesFromPath(path);
            files.push(...pathFiles);
        }
    
        console.log(`📤 Uploading ${files.length} files`);
        const cid = await storage.put(files);
        console.log(`📦 Video chunks are added with CIDv1: "${cid}"`);

        console.log('🎉 The video is successfully uploaded!');
        resolve(cid);
    })
}

// IPFSUploader uploads video chunks to IPFS network using Web3.Storage, a Filecoin-backed
// Pinning Service
async function IPFSUploader(web3Token, videoName) {
    await readDirectory(`./${videoName}`);
    const res = Web3StorageUploader(web3Token);
    return new Promise(resolve => {
        resolve(res);
    })
}

// encodesHLS encodes the video using HLS protocol based on ffmpeg that installed in media server
async function encodeHLS(videoUrl, videoName) {
    let args = [ `${videoName}` ];
    execac('mkdir', args);

    return new Promise((resolve) => {
        ffmpeg(videoUrl)
            .setFfmpegPath(ffmpeg_static)
            .addOptions([
                '-i', videoUrl,
                '-profile:v', 'baseline',
                '-level', '3.0',
                '-start_number', '0',
                '-hls_time', '2',
                '-hls_list_size', '0',
                '-f', 'hls'
            ]).output(`./${videoName}/master.m3u8`)
                .on('end', () => {
                    resolve('📼 HLS encoded!');
                })
        .run();
    });
}

exports.uploader = async function (videoUrl, videoFile) {
    const web3Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJlODkxZDY3MjJlOTBCNjVhM2Q2MDI1QURlNTEyMDU4MDJBMjQzN0IiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDc5Mjc1OTQ1ODAsIm5hbWUiOiJJTkxhYiJ9.k-W6-uizB3gwbUChR5gbkpFFnXamKRvmfm--atohh24";
    console.log("web3Token:", web3Token);
    const videoName = videoFile.split(".")[0];
    await encodeHLS(videoUrl, videoName).then(result => console.log(result));
    const CID = await IPFSUploader(web3Token, videoName);
    return new Promise(resolve => {
        resolve(CID);
    })
}