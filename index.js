import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connect");
const fundBtn = document.getElementById("fund");
const status = document.getElementById("status");

connectBtn.addEventListener("click", connect);
fundBtn.addEventListener("click", fund);

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    status.innerHTML = "Connected";
  } else {
    status.innerHTML = "Please install Metamask";
  }
}

async function fund() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);
  const amount = document.getElementById("amount").value;

  if (amount === "") return;

  contract
    .fund({ value: ethers.utils.parseEther(amount) })
    .then((transaction) => {
      log("Transaction sent. Waiting for confirmation...");
      return transaction.wait(1);
    })
    .then((transactionReceipt) => {
      log("Confirmed!");
    })
    .catch((error) => log(error.message));
}

function log(message) {
  status.innerHTML = message;
}
