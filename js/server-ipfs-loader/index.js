const fs = require('fs');
const WebSocketServer = require('websocket').server;
const https = require('https');
const { catChunkFromIPFS } = require('./ipfs-loader.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = 3000;

let index = 0;
let runner = `ipfs-host`;

let pkey = fs.readFileSync("ssl/rootca.key");
let pcert = fs.readFileSync("ssl/rootca.crt");
let pca = fs.readFileSync("ssl/localhost.pem");
let serverOptions = {
    key : pkey,
    cert : pcert
};

let server = https.createServer(
    serverOptions,
    function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    }
);

server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port '+port);
});

let wsServer = new WebSocketServer({
    httpServer: server,
    ssl: true,
    key: pkey,
    cert: pcert
});

wsServer.on("request", async function (req) {
    var conn = req.accept();
    console.log(`New Client: ${conn.remoteAddress}`);

    conn.on('message', async function(message) {
        var start = performance.now();
        const CID = message.utf8Data;
        const mode = 'docker';
        if (mode === 'docker') {
            if (index > 0) {
                index = 0;
            }
            console.log(`Running IPFS node: ${runner}${index}`);
            let args = [
                'exec', `${runner}${index}`,
                'ipfs', 'cat', `${CID}`
            ]
            index++;
            let chunkData = await catChunkFromIPFS('docker', args);
            conn.send(chunkData); 
            var end = performance.now();
            console.log(`${CID} cat delay: ${end-start}`);
        } else {
            let args = [
                'cat', `${CID}`
            ]
            let chunkData = await catChunkFromIPFS('ipfs', args);
            conn.send(chunkData);
            var end = performance.now();
            console.log(`${CID} cat delay: ${end-start}`);
        }
    });
});

// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣫⣷⣿⣿⣦⡉⠻⣿⣿⣿⣿⣿⣿⣿⣾⣧⠀⠈⠙⢿⣿⣿⣿⣿⣿⣿⡋⠁⠀⠈⠉⢻⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⡟⠉⠁⠀⠈⠻⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⢻⣷⣿⣿⣿⣿⣿⣿⣿⠟⠩⣾⣿⣿⣿⣟⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⡿⡇⠄⢸⣿⣿⣿⣯⣿⣿⣿⣏⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⡅⠀⠀⠀⠀⠀⢻⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⡟⠀⠀⠀⠀⠀⡀⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⢾⣿⣿⣿⣻⣿⣿⣿⡇⠀⠘⣿⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⡎⠀⢸⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣧⠀⠀⠀⠀⠀⠈⣾⡿⣿⣿⣿⣿⠀⠀⠀⠀⣿⣿⣿⣿⣻⣿⣿⣿⡇⢀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⣤⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⣠⣾⣿⣿⣿⣿⣯⣻⣆⡀⠀⠀⣀⣼⣿⣿⣿⣿⣷⣄⡀⠀⠀⠀⢀⣤⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⢿⣿⢿⣿⣿⣿⣿⣿⣿⣄⡈⢿⣿⣿⡿⣫⣾⣿⣿⣿⣿⣿
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿