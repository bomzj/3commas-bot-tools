import TradeAsapSignal from '../../src/trade-asap-signal.js'

exports.handler = async (event, context) => {
  
  let { subject, from, to, body } = event.queryStringParameters
  
  console.log('keke')
  return {
    statusCode: 200,
    body: JSON.stringify({message: "Hello World"})
  }
  // callback(null, {
  //   statusCode: 200,
  //   body: 'keke'
  // })
}