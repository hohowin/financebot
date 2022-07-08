const _ = require('lodash')
const express = require('express')
const quotesRouter = express.Router()
const axios = require('axios')
require('dotenv').config({ path: './.env' });
const TOKEN = process.env.TOKEN;

quotesRouter.get('/', (req, res) => {
	res.redirect('/stock');
});

quotesRouter.get('/stock', async (req, res) => {

	const symbol = req.query.symbol;
	let result;
	let name;
	let price;
	let currency;
	let hash = {};
	let date = new Date();  
	let options = {  
    	weekday: "long", year: "numeric", month: "short",  
    	day: "numeric", hour: "2-digit", minute: "2-digit"  
	};

	if (!!symbol) {

		symbolUpper = symbol.toUpperCase().trim();
		result = symbolUpper;
		console.log(`searching for ${symbolUpper}...`);

		try {

			await axios.get('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			}).then(
				(val) => {
					name = val.data.quoteResponse.result[0].longName;
					price = val.data.quoteResponse.result[0].regularMarketPrice;
					currency = val.data.quoteResponse.result[0].currency;

					hash['Beta (5Y Monthly)'] = _.get(val, 'data.quoteResponse.result[0].beta', 'N/A');
					hash['EPS Current Year'] = _.get(val, 'data.quoteResponse.result[0].epsCurrentYear', 'N/A');
					hash['EPS (TTM)'] = _.get(val, 'data.quoteResponse.result[0].epsTrailingTwelveMonths', 'N/A');
					hash['Forward PE'] = _.get(val, 'data.quoteResponse.result[0].forwardPE', 'N/A');
					hash['PE Ratio (TTM)'] = _.get(val, 'data.quoteResponse.result[0].trailingPE', 'N/A');
				}
			);

			await axios.get('https://yh-finance.p.rapidapi.com/stock/v3/get-statistics?symbol=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			}).then(
				(val) => {
					hash['Trailing P/E'] = _.get(val, 'data.timeSeries.trailingPeRatio[0].reportedValue.fmt', 'N/A');
					hash['Forward P/E (TTM)'] = _.get(val, 'data.timeSeries.trailingForwardPeRatio[0].reportedValue.fmt', 'N/A');
					hash['PEG Ratio (5 yr expected)'] = _.get(val, 'data.timeSeries.trailingPegRatio[0].reportedValue.fmt', 'N/A');

					hash['Price/Sales (ttm)'] = _.get(val, 'data.timeSeries.trailingPsRatio[0].reportedValue.fmt', 'N/A');
					hash['Price/Book (mrq)'] = _.get(val, 'data.timeSeries.trailingPbRatio[0].reportedValue.fmt', 'N/A');
					hash['Return on Assets (ttm)'] = _.get(val, 'data.financialData.returnOnAssets.fmt', 'N/A');
					hash['Return on Equity (ttm)'] = _.get(val, 'data.financialData.returnOnEquity.fmt', 'N/A');
					hash['Profit Margin'] = _.get(val, 'data.defaultKeyStatistics.profitMargins.fmt', 'N/A');
					hash['Operating Margin (ttm)'] = _.get(val, 'data.financialData.operatingMargins.fmt', 'N/A');
					hash['Current Ratio (mrq)'] = _.get(val, 'data.financialData.currentRatio.fmt', 'N/A');	
				}
			);

			console.log(JSON.stringify(hash, null, 2));

		} catch (err) {
			if (err.response) {
				console.log(err.response.data)
				console.log(err.response.status)
				console.log(err.response.headers)
			} else if (err.request) {
				console.log(err.requiest)
			} else {
				console.error('Error', err.message)
			}
		}
	}

	res.render('pages/stock', {
		result: result,
		name: name,
		price: price,
		currency: currency,
		date: date.toLocaleTimeString("en-us", options),
		resultMap: hash
	});
});

module.exports = quotesRouter;