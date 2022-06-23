const uploader = require('../upload-handler/ipfs-uploader');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

const router = express.Router();
const proxy = createProxyMiddleware({
    target: process.env.SERVER_IP,
    changeOrigin: true,
})

router.post('/upload', async (req, res) => {
    console.log("🧙‍♂️: The video is successfully uploaded to Firebase Storage!");
    console.log("🧙‍♂️: Start to encode the video");
    if(req.originalUrl) {
        const videoName = req.body.videoName;
        const videoUrl = req.body.videoURL;

        await uploader.uploader(videoUrl, videoName).then(function (result) {
            console.log("🎁 CID:", result);
            res.send(JSON.stringify({CID: result}));
        });
    }
})

router.put('/uploader', function (req, res) {

})

router.get('/player', function (req, res) {
    res.render('player.html');
})

// router.post('/load', async (req, res) => {
//     console.log(`🧙‍♂️: loading ${req.body.chunk}`);

// })

router.use(proxy);

module.exports = router;