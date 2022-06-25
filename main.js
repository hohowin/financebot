require('dotenv').config({ path: './.env' });
const axios = require('axios');
const TOKEN = process.env.TOKEN;

axios.get('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=GOOG',{
    headers: {
        'X-RapidAPI-Key': TOKEN,
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
    }
}).then(resp => {
    console.log('Beta (5Y Monthly): ' + resp.data.quoteResponse.result[0].beta);
    console.log('EPS Current Year: ' + resp.data.quoteResponse.result[0].epsCurrentYear);
    console.log('EPS (TTM): ' + resp.data.quoteResponse.result[0].epsTrailingTwelveMonths);
    console.log('Forward PE: ' + resp.data.quoteResponse.result[0].forwardPE);
    console.log('PE Ratio (TTM): ' + resp.data.quoteResponse.result[0].trailingPE);
}).catch((error) => {
    console.error(error)
  });


axios.get('https://yh-finance.p.rapidapi.com/stock/v3/get-statistics?symbol=GOOG',{
    headers: {
        'X-RapidAPI-Key': TOKEN,
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
    }
}).then(resp => {
    console.log('Trailing P/E: ' + resp.data.timeSeries.trailingPeRatio[0].reportedValue.fmt);
    console.log('Forward P/E: ' + resp.data.timeSeries.trailingForwardPeRatio[0].reportedValue.fmt);
    console.log('PEG Ratio (5 yr expected): ' + resp.data.timeSeries.trailingPegRatio[0].reportedValue.fmt);
}).catch((error) => {
    console.error(error)
  });
