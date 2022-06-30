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
	
			const getQuotes = await axios.get('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			});

			name = getQuotes.data.quoteResponse.result[0].longName;
			price = getQuotes.data.quoteResponse.result[0].regularMarketPrice;
			currency = getQuotes.data.quoteResponse.result[0].currency;

			const getStatistics = await axios.get('https://yh-finance.p.rapidapi.com/stock/v3/get-statistics?symbol=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			});

			hash['Beta (5Y Monthly)'] = _.get(getQuotes, 'data.quoteResponse.result[0].beta', 'N/A');
			hash['EPS Current Year'] = _.get(getQuotes, 'data.quoteResponse.result[0].epsCurrentYear', 'N/A');
			hash['EPS (TTM)'] = _.get(getQuotes, 'data.quoteResponse.result[0].epsTrailingTwelveMonths', 'N/A');
			hash['Forward PE'] = _.get(getQuotes, 'data.quoteResponse.result[0].forwardPE', 'N/A');
			hash['PE Ratio (TTM)'] = _.get(getQuotes, 'data.quoteResponse.result[0].trailingPE', 'N/A');

			hash['Trailing P/E'] = _.get(getStatistics, 'data.timeSeries.trailingPeRatio[0].reportedValue.fmt', 'N/A');
			hash['Forward P/E (TTM)'] = _.get(getStatistics, 'data.timeSeries.trailingForwardPeRatio[0].reportedValue.fmt', 'N/A');
			hash['PEG Ratio (5 yr expected)'] = _.get(getStatistics, 'data.timeSeries.trailingPegRatio[0].reportedValue.fmt', 'N/A');

//			console.log("STAT =>\n" + JSON.stringify(getStatistics.data, null, 2) + "\n\n");
		
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