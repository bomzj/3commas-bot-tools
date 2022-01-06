import TradeAsapSignal from '../../src/trade-asap-signal.js'

export async function handler(event, context) {
  let {apiKey, apiSecret, botId, isPaperTrading} = JSON.parse(event.body)
  let signal = new TradeAsapSignal(apiKey, apiSecret, isPaperTrading)
  await signal.tradeAllPairs(botId)
  
  return {
    statusCode: 200,
    body: JSON.stringify({message: `Sent trade all pairs ASAP signal to 3Commas bot (id:${botId})`})
  }
}