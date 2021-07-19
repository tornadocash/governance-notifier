require('dotenv').config()
const cron = require('cron')
const ethers = require('ethers')
const fs = require('fs')
const TelegramClient = require('./telegramClient')
const telegram = new TelegramClient()
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

async function welcome() {
  try {
    await telegram.send('Bot started')
  } catch (e) {
    console.log(e)
    // telegram.sendError(e).catch(console.error)
  }
}

async function checkProposals() {
  console.log(`Checking proposals...`)
  const lastBlock = fs.existsSync('./lastBlock') ? parseInt(fs.readFileSync('./lastBlock')) + 1: await provider.getBlockNumber()
  const governance = new ethers.Contract('0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce', require('./abi/governance.json'), provider)
  const filter = governance.filters.ProposalCreated()
  const proposalEvents = await governance.queryFilter(filter, lastBlock)
  for (const event of proposalEvents) {
    const { title, description } = JSON.parse(event.args.description)
    console.log(`New proposal: ${title}`)
    const proposalMessage = `*New Tornado.Cash Governance Proposal #${event.args.id}: ${title.replace(/Proposal #\d: /, '')}*

${description}

*Proposal address:* [${event.args.target}](https://etherscan.io/address/${event.args.target})
*Proposed by:* [${event.args.proposer}](https://etherscan.io/tx/${event.transactionHash}),
*Time:* ${new Date(event.args.startTime * 1000).toUTCString()} - ${new Date(event.args.endTime * 1000).toUTCString()}`
    await telegram.send(proposalMessage)
  }
  fs.writeFileSync('./lastBlock', lastBlock.toString())
  console.log(`Checked proposals. Last block: ${lastBlock}`)
}

welcome()
cron.job(process.env.CRON_EXPRESSION, checkProposals, null, true, null, null, true)