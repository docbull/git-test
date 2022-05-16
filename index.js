const fs = require('fs');
const WebSocketServer = require('websocket').server;
const https = require('https');
const { getChunkFromIPFS } = require('./ipfs-loader.js');

const port = 3000;

let pkey = fs.readFileSync("ssl/rootca.key");
let pcert = fs.readFileSync("ssl/rootca.crt");
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
        let args = [
            'get', `${message.utf8Data}`
        ]
        let chunkData = await getChunkFromIPFS('ipfs', args);
        conn.send(chunkData);
    });
});
