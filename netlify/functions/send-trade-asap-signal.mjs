import TradeAsapSignal from '../../src/trade-asap-signal.js'

export async function handler(event, context) {
  console.log('Trade ASAP request parameters:' + event.body)
  
  let {apiKey, apiSecret, botIds} = JSON.parse(event.body)
  let signal = new TradeAsapSignal(apiKey, apiSecret)
  await signal.notifyBotsToStartTradingAsap(botIds)
  
  const response = `'Trade ASAP' signal sent to ${botIds.join(', ')} bots`
  console.log(response) 
  
  return {
    statusCode: 200,
    body: JSON.stringify({message: response})
  }
}