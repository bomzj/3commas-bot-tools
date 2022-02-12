import axios from "axios"

export default class LunarCrush {
  axios = undefined

  constructor(apiKey, userAgentHeader) {
    this.axios = axios.create({
      //baseURL: 'https://some-domain.com/api/',
      params: {
        key: apiKey
      },
      headers: {'User-Agent': userAgentHeader}
    })
  }

  getAllCoins() {

  }

  async getMyFavoriteCoins() {
    try {
      // Sort coins by Altrank(acr) by default e.g. 'vt' is sorting by volatility
      let getAllCoins = this.axios('https://api2.lunarcrush.com/v2?data=market&type=fast&sort=acr&asc=True')
      let getfavCoins = this.axios('https://api.lunarcrush.com/v2?data=user&action=get-profile')
      let responses = await Promise.all([getAllCoins, getfavCoins])

      let coins = responses[0].data.data
      let favCoinIds = responses[1].data.data.favorites.coins

      let favCoins = favCoinIds
        .map(id => coins.find(c => c.id == id))
        .sort((a, b) => a.acr - b.acr)
      
      this.fixCoinShortNames(favCoins)

      return favCoins
    } catch(e) {
      console.error(e)
    }
  }

  fixCoinShortNames(coins) {
    for (let coin of coins) {
      if (coin.s == 'IMX2') coin.s = 'IMX'
    }
  }
}