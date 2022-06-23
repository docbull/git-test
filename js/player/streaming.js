// initIPFS gets video chunks from IPFS using it's own CID. 
async function initIPFS(CID) {
  Hls.DefaultConfig.loader = IPFSHlsMultiChunk;
  Hls.DefaultConfig.debug = false;
  if (Hls.isSupported()) {
    const video = document.getElementById('video');
    const status = document.getElementById('status');
    const hls = new Hls();
    hls.config.ipfsHash = CID;
    hls.loadSource('master.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  } else {
    const message = document.createTextNode('📼 Sorry, your browser does not support HLS');
    console.log(message);
  }
}
