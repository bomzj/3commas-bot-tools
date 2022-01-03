import threeCommasAPI from '3commas-api-node'

let [apiKey, apiSecret, botId, isPaperAccountBot] = process.argv.slice(2)

// Send ASAP indicator at some meaningful rate without risking to get banned by 3commas
let interval = setInterval(sendTradeAllPairsAsapSignal.bind(this, botId), 5000)

console.log('Sending start deal ASAP signals to 3commas bot...')

const api = new threeCommasAPI({
  apiKey,
  apiSecret,
  forcedMode: isPaperAccountBot ? 'paper' : 'real'
})

async function sendTradeAllPairsAsapSignal(botId) {
  try {
    let pairs = await getBotPairs(botId)
    pairs.forEach(p => sendTradeAsapSignal(botId, p))
  } catch (e) {
    handleApiException(e)
  }
}

async function sendTradeAsapSignal(botId, pair) {
  try {
    let response = await api.botStartNewDeal({
      bot_id: botId,
      skip_signal_checks: true,
      pair
    })
    handleApiError(response)
  } catch (e) {
    handleApiException(e)
  }
}

async function getBotPairs(botId) {
  let response = await api.botShow(botId)
  handleApiError(response)
  return response.pairs
}

function handleApiError(apiResponse) {
  //if (apiResponse.error) console.error(apiResponse.error)
}

function handleApiException(e) {
  console.error(e)
  // End script work, just in case we didn't DDoS
  clearInterval(interval)
}