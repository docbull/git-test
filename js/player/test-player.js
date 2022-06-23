import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import loadVideoLists from "../topVideoList.js";

const firebaseConfig = {
    apiKey: "AIzaSyDqOJb8cTxdERHnOwy6XFuLA-7kfasV-l4",
    authDomain: "inlab-ipfs-streaming.firebaseapp.com",
    projectId: "inlab-ipfs-streaming",
    storageBucket: "inlab-ipfs-streaming.appspot.com",
    messagingSenderId: "802847540334",
    appId: "1:802847540334:web:685427d2226451ccc1527f",
    measurementId: "G-B0JTG8PMSL"
};
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function selectFromDB(txHash) {
    const querySnapshot = await getDocs(collection(db, "INLabVideoStreaming"));
  // getting all data from firebase DB
  for (var videoIndex=0; videoIndex<querySnapshot.docs.length; videoIndex++) {
    let Doc = querySnapshot.docs[videoIndex];

    const title = Doc.data().videoTitle;
    const description = Doc.data().videoDescription;
    const account = Doc.data().account;
    const DBtxHash = Doc.data().TxHash;
    const views = Doc.data().views;
    const timestamp = Doc.data().timestamp;

    const addr1 = account.toString().slice(0, 5);
    const addr2 = account.toString().slice(-4, account.toString().length);

    if(DBtxHash == txHash) {
        document.getElementById('play_title').innerText = title;
        document.getElementById('play_account').innerText = addr1 + "..." + addr2; 
        document.getElementById('play_views').innerText = "views " + views + " |";
        document.getElementById('play_timestamp').innerText = timestamp.toDate().toString().split("GMT")[0];;
        document.getElementById('play_description').innerText = description;
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
    let state = window.location.search;
    let splitState = state.split('=');
    let txHash = splitState[1];
    console.log(txHash);
    selectFromDB(txHash);
});