// in nodejs
// require()

// in front-end javascript you can't use "require"
// Use "import" instead.
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefinied") {
        await ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "You Are Connected!"
    } else {
        connectButton.innerHTML =
            "I am so sorry. You don't have Metamask. Please, Download and Install Metamask!"
    }
}

// get balance function
async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.provider.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contactAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefinied") {
        // provider / connection to the Blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone with some gas
        const signer = provider.getSigner()
        // contract that we are interacting with
        const contract = new ethers.Contract(contractAddress, abi, signer)
        // ^ ABI & Address
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // listen for the tx to be mined
            // listed for an event
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Funded")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // return new Promise()
    // create a listener for the blockchain
    // listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

// withdraw
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing fundings...")
        const provider = new ethers.provider.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        // contract that we are interacting with
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw(
                await listenForTransactionMine(transactionResponse, provider)
            )
        } catch (error) {
            console.log(error)
        }
    }
}
