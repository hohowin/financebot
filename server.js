const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');

const app = express();
const port = 3000

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

// Routes
const quotesRouter = require('./routes/quotes');
app.use('/', quotesRouter);
app.use('/stock', quotesRouter);

// about page
app.get('/about', function (req, res) {
  res.render('pages/about');
});

app.listen(port, () => console.log(`Listening on port ${port}`));