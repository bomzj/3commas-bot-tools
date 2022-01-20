import threeCommasAPI from '3commas-api-node'

export default class TradeAsapSignal {
  api = undefined
  
  constructor(apiKey, apiSecret) {
    this.api = new threeCommasAPI({
      apiKey,
      apiSecret
    })
  }

  async notifyBotsToStartTradingAsap(...botIds) {
    botIds?.forEach(id => this.notifyBotToStartTradingAsap(id))
  }
  
  async notifyBotToStartTradingAsap(botId) {
    let pairs = await this.getBotPairs(id)
    pairs.forEach(p => this.notifyBotToStartTradingSinglePairAsap(botId, p))
  }

  async notifyBotToStartTradingSinglePairAsap(botId, pair) {
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