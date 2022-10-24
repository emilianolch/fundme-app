import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

document.getElementById("connect").onclick = connect;
document.getElementById("balance").onclick = getBalance;
document.getElementById("fund").onclick = fund;
document.getElementById("withdraw").onclick = withdraw;
const status = document.getElementById("status");

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

async function withdraw() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  contract
    .withdraw()
    .then((transaction) => {
      log("Transaction sent. Waiting for confirmation...");
      return transaction.wait(1);
    })
    .then((transactionReceipt) => {
      log("Confirmed!");
    })
    .catch((error) => log(error.message));
}

function getBalance() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  provider
    .getBalance(contractAddress)
    .then((balance) => log(`${ethers.utils.formatEther(balance)} ETH`));
}

function log(message) {
  status.innerHTML = message;
}
