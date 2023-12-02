import './style.css'
import { ethers } from "ethers"
import VRFHost from "./VRFHost.json"
import banana from "./banana400.png"

const RPC = "https://rpc.testnet.lukso.network"
const contractAddress = "0xD061CEb1F6BE5b6822762893e229FFce5C62C283"

const RoundState = ["Empty", "Proposal", "Final"]

async function setup() {
  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const contract = new ethers.Contract(contractAddress, VRFHost.abi, provider)

  const blockNumber = await provider.getBlockNumber()
  const currentRoundId = await contract.getCurrentRoundId() as number
  const [proposer, randomNumber, , ,height] = await contract.getRound(currentRoundId - 1)

  const [,,,currentState] = await contract.getRound(currentRoundId)



  roundState!.innerText = "Current round state: " + RoundState[currentState]
  randomNumberField!.innerText = randomNumber.toString()
  proposerField!.innerText = "Proposer: " + proposer
  roundIdField!.innerText = "Round id: " +(currentRoundId - 1)
  blockSince!.innerText = `Blocks since previous round (start): ${blockNumber - Number(height)}`
  randomNumberTitle!.style.visibility = "visible"

  contract.on("NewRound", async (id:number) => {
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
    <div id="banana-img">
      <img class="rotate" src="${banana}" />
    </div>
    <div id="info">
      <p id="randomNumberTitle">Generated number:</p>
      <p id="randomNumber"></p>
      <p id="roundId"></p>
      <p id="proposer"></p>
      <p id="blockSince"></p>
      <p id="roundState"></p>
      <a href="https://explorer.consensus.testnet.lukso.network/address/D061CEb1F6BE5b6822762893e229FFce5C62C283">Blockchain Explorer</a>
    </div>
`



const randomNumberField = document.getElementById("randomNumber")
const proposerField = document.getElementById("proposer")
const roundIdField = document.getElementById("roundId")
const blockSince = document.getElementById("blockSince")
const roundState = document.getElementById("roundState")
const randomNumberTitle = document.getElementById("randomNumberTitle")


