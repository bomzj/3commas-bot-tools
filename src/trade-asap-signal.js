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
    let requests = botIds?.map(id => this.notifyBotToStartTradingAsap.bind(this, id))
    return Promise.all(requests)
  }
  
  async notifyBotToStartTradingAsap(botId) {
    let pairs = await this.getBotPairs(botId)
    let requests = pairs.map(p => this.notifyBotToStartTradingSinglePairAsap.bind(this, botId, p))
    return Promise.all(requests)
  }

  async notifyBotToStartTradingSinglePairAsap(botId, pair) {
    return this.api.botStartNewDeal({
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