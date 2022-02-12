import threeCommasAPI from '3commas-api-node'
import LunarCrush from '../../src/lunarcrush.js'

export async function handler(event, context) {
  let { botIds, numberOfPairs, threeCommasApiSettings, lunarCrushApiSettings } = JSON.parse(event.body)

  // threeCommas must be globally defined since there are a few functions that use it at the end of file
  threeCommas = new threeCommasAPI({
    apiKey: threeCommasApiSettings.apiKey, 
    apiSecret: threeCommasApiSettings.apiSecret
  })

  let lunarCrush = new LunarCrush(lunarCrushApiSettings.apiKey, lunarCrushApiSettings.userAgentHeader)

  await Promise.all(botIds.map(id => updateBotPairsWithAltrank(id, 
                                                              numberOfPairs, 
                                                              threeCommas, 
                                                              lunarCrush)))
  return {
    statusCode: 200,
    body: JSON.stringify({result: 'success'})
  }
}

async function updateBotPairsWithAltrank(botId, numberOfPairs, threeCommas, lunarCrush) {
  console.log(`Starting to update pairs with Altrank for bot ${botId}...`)
  
  // 1. Get my favorite coins from LunarCrush
  let getMyFavCoins = lunarCrush.getMyFavoriteCoins()

  // 2. Get Bot Info
  let getBotInfo = threeCommas.botShow(botId)

  // We triggered 2 async requests lets wait their response
  let responses = await Promise.all([getMyFavCoins, getBotInfo])
  let myFavCoins = responses[0]
  let botInfo = responses[1]
  
  console.log(`My favorite coins: [${myFavCoins.map(c => c.s).join(', ')}]`)
  console.log(`Received top ${numberOfPairs} coins by Altrank: [${
    myFavCoins.map(c => c.s)
    .slice(0, numberOfPairs)
    .join(', ')
  }]`)

  // 3. Get bot's base currency
  let baseCurrency = ''
  try {
    let firstPair = botInfo.pairs[0]
    baseCurrency = firstPair.substring(0, firstPair.indexOf('_'))
    console.log('Determined bot\'s base currency: ' + baseCurrency)
  } catch (e) {
    console.error('Failed to determine base currency!')
    return
  }

  // 4. Create favorite pairs based on lunarcrush results and base currency
  let favPairs = myFavCoins.map(c => `${baseCurrency}_${c.s}`)

  // 5. Filter out favorite pairs that are not supported by the exchange
  let accountInfo = await getAccountInfo(botInfo.account_id)
  let availableMarketPairs = await getMarketPairs(accountInfo.market_code)
  let altrankPairs = favPairs
    .filter(fp => availableMarketPairs.some(mp => mp == fp))
    .slice(0, numberOfPairs)
  console.log(`Created Altrank top pairs: [${altrankPairs.join(', ')}]`)

  // 6. Update bot with new pairs
  botInfo.pairs = altrankPairs.join()
  botInfo.max_active_deals = altrankPairs.length
  
  botInfo = await updateBot(botInfo)
  
  console.log(`Bot ${botInfo.id} updated with new pairs: [${botInfo.pairs.join(', ')}]`)
  console.log('Update finished succesfully!')
}

async function getMarketPairs(marketCode) {
  return await threeCommas.makeRequest(
    'GET', '/public/api/ver1/accounts/market_pairs?', {market_code: marketCode})
}

async function updateBot(params) {
  return await threeCommas.makeRequest(
    'PATCH', `/public/api/ver1/bots/${params.id}/update?`, params)
}

async function getAccountInfo(accountId) {
  return await threeCommas.makeRequest('GET', `/public/api/ver1/accounts/${accountId}`, null)
}