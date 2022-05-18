// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  Hls.DefaultConfig.loader = IPFSHlsMultiChunk;
  Hls.DefaultConfig.debug = false;
  if (Hls.isSupported()) {
    const video = document.getElementById('video');
    const status = document.getElementById('status');
    const hls = new Hls();
    // hls.config.ipfs = node;
    hls.config.ipfsHash = CID;
    hls.loadSource('master.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      const message = document.createTextNode(`${CID}`);
      status.appendChild(message);
      video.play();
    });
  } else {
    const status = document.getElementById('status');
    const message = document.createTextNode('Sorry, your browser does not support HLS');
    status.appendChild(message);
  }
}
