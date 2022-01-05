import TradeAsapSignal from '../trade-asap-signal.js'

// Detect environment our script running in
const isMainModule = import.meta.url == process.argv[1]
const isLambdaEnv = !!(process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function main() {
  if (process.argv.length < 4) {
    console.log(
      'Missing loading parameters: apiKey, apiSecret, botId, [timeIntervalBetweenSignals], [isPaperTrading]')
    
    process.exit()
  }
  let [apiKey, apiSecret, botId, timeIntervalBetweenSignals, isPaperTrading] = process.argv.slice(2)
  let signal = new TradeAsapSignal(apiKey, apiSecret, isPaperTrading)
    
  if (timeIntervalBetweenSignals > 0) {
    // Send ASAP indicator at some meaningful rate without risking to get banned by 3commas
    let interval = setInterval(signal.tradeAllPairs.bind(signal, botId), timeIntervalBetweenSignals || 60 * 1000)
    
    console.log('Sending start deal ASAP signals to 3Commas bot...')
  } else {
    signal.tradeAllPairs(botId)
    console.log('Sent start deal ASAP signal to 3Commas bot')
  }
}

main()