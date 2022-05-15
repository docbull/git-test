let WebSocketServer = require('websocket').server;
let https = require('https');
let port = 3000;

let fs = require('fs');
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
});

server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port '+port);
});

let wsServer = new WebSocketServer({
    httpServer: server,
    ssl: true,
    key: pkey,
    cert: pcert
});

// 
wsServer.on("request", function (req) {
    var conn = req.accept();
    console.log(`New Client: ${conn.remoteAddress}`);

    conn.on('message', function(message) {
        conn.sendUTF(message.utf8Data);
        console.log(message.utf8Data);
    });
});
