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
	let hash = {};

	if (!!symbol) {

		symbolUpper = symbol.toUpperCase().trim();
		result = `SYMBOL: ${symbolUpper}`;
		console.log(`searching for ${symbolUpper}...`);

		try {
	
			const getQuotes = await axios.get('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			});

			const getStatistics = await axios.get('https://yh-finance.p.rapidapi.com/stock/v3/get-statistics?symbol=' + symbol, {
				headers: {
					'X-RapidAPI-Key': TOKEN,
					'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
				}
			});

			hash['Beta (5Y Monthly)'] = getQuotes.data.quoteResponse.result[0].beta;
			hash['EPS Current Year'] = getQuotes.data.quoteResponse.result[0].epsCurrentYear;
			hash['EPS (TTM)'] = getQuotes.data.quoteResponse.result[0].epsTrailingTwelveMonths;
			hash['Forward PE'] = getQuotes.data.quoteResponse.result[0].forwardPE;
			hash['PE Ratio (TTM)'] = getQuotes.data.quoteResponse.result[0].trailingPE;

			hash['Trailing P/E'] = getStatistics.data.timeSeries.trailingPeRatio[0].reportedValue.fmt;
			hash['Forward P/E'] = getStatistics.data.timeSeries.trailingForwardPeRatio[0].reportedValue.fmt;
			hash['PEG Ratio (5 yr expected)'] = getStatistics.data.timeSeries.trailingPegRatio[0].reportedValue.fmt;
		
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
		resultMap: hash
	});
});

module.exports = quotesRouter;