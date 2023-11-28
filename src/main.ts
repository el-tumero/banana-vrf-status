import './style.css'
import { ethers } from "ethers"
import VRFHost from "./VRFHost.json"

const RPC = "https://rpc.testnet.lukso.network"
const contractAddress = "0xD061CEb1F6BE5b6822762893e229FFce5C62C283"

async function setup() {
  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const contract = new ethers.Contract(contractAddress, VRFHost.abi, provider)

  const blockNumber = await provider.getBlockNumber()
  const currentRoundId = await contract.getCurrentRoundId() as number
  const [proposer, randomNumber, , ,height] = await contract.getRound(currentRoundId - 1)

  randomNumberField!.innerText = randomNumber.toString()
  proposerField!.innerText = "Proposer: " + proposer
  roundIdField!.innerText = "Round id: " +(currentRoundId - 1)
  blockSince!.innerText = `Blocks since previous round (start): ${blockNumber - Number(height)}`

  contract.on("NewRound", async (id) => {
  const [proposer, randomNumber, , ,height] = await contract.getRound(id - 1)
    const blockNumber = await provider.getBlockNumber()
    randomNumberField!.innerText = randomNumber.toString()
    proposerField!.innerText = "Proposer: " + proposer
    roundIdField!.innerText = "Round id: " +(id - 1)
    blockSince!.innerText = `Blocks since previous round (start): ${blockNumber - Number(height)}`
  })
}

setup()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2 id="randomNumber"></h2>
    <h4 id="roundId"></h4>
    <h3 id="proposer"></h3>
    <h5 id="blockSince"></h5>
  </div>
`

const randomNumberField = document.getElementById("randomNumber")
const proposerField = document.getElementById("proposer")
const roundIdField = document.getElementById("roundId")
const blockSince = document.getElementById("blockSince")
