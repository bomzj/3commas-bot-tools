import threeCommasAPI from '3commas-api-node'

export default class TradeAsapSignal {
  api = undefined
  
  constructor(apiKey, apiSecret, isPaperTrading) {
    this.api = new threeCommasAPI({
      apiKey,
      apiSecret,
      forcedMode: isPaperTrading ? 'paper' : 'real'
    })
  }

  async tradeAllPairs(botId) {
    let pairs = await this.getBotPairs(botId)
    pairs.forEach(p => this.tradePair(botId, p))
  }
  
  async tradePair(botId, pair) {
    return await this.api.botStartNewDeal({
      bot_id: botId,
      skip_signal_checks: true,
      pair
    })
  }
  
  async getBotPairs(botId) {
    let response = await this.api.botShow(botId)
    return response.pairs
  }
}