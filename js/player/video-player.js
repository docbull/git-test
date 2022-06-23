const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/rbMCSk1QEzIwKvEPVEzlJquYNOqa9bWl";
const web3 = AlchemyWeb3.createAlchemyWeb3(alchemyKey);
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";

let socket;

async function loadCID(txHash) {
    const res = await web3.eth.getTransactionReceipt(txHash);
    const tokenId = web3.utils.hexToNumber(res.logs[0].topics[3]);
    const metadata = await web3.alchemy.getNftMetadata({
        contractAddress: contractAddress,
        tokenId: tokenId,
    })
    console.log(metadata);
    console.log(metadata.metadata.image);

    initIPFS(metadata.metadata.image);
}

async function loadChunk(CID) {
    return new Promise(resolve => {
        socket.send(CID);
        socket.onmessage = function (event) {
            let data = event.data.split(',');
            let units = new Uint8Array(data);
            // need to record chunk requesting for micropayment
            resolve(units);
        }
    })
}

document.addEventListener('DOMContentLoaded', async function () {
    const address = 'wss://203.247.240.228:3000'
    socket = new WebSocket(address);
    socket.onopen = function (event) {
        let state = window.location.search;
        let splitState = state.split('=');
        let txHash = splitState[1];
        console.log(txHash);
        loadCID(txHash);
    }
});