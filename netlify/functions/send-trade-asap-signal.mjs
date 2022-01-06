import TradeAsapSignal from '../../src/trade-asap-signal.js'

export async function handler(event, context) {
  let {apiKey, apiSecret, botId, isPaperTrading} = JSON.parse(event.body)
  let signal = new TradeAsapSignal(apiKey, apiSecret, isPaperTrading)
  console.log(event.body)
  await signal.tradeAllPairs(botId)
  console.log('before return')
  return {
    statusCode: 200,
    body: JSON.stringify({message: `Sent trade all pairs ASAP signal to 3Commas bot (id:${botId})`})
  }
}