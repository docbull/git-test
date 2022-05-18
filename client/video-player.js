let socket;

function mainButton() {
    window.location.href = '/';
}

async function loadChunk(CID) {
    return new Promise(resolve => {
        socket.send(CID);

        socket.onmessage = function (event) {
            let data = event.data.split(',');
            let units = new Uint8Array(data);
            console.log(units);
            resolve(units);
        }
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    const address = '';
    socket = new WebSocket(address);

    socket.onopen = function(event) {        
        let state = window.location.search;
        let splitState = state.split('=');
        let CID = splitState[1];

        // When this page is on, run IPFS for video streaming
        initIPFS(CID);
    }
});
