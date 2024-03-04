const express = require('express');
const app = express();
const cookie = require('cookie-parser');
const cors = require('cors');

const text = require('./routes/textanalysis');
const sentiment = require('./routes/sentiment');
const program = require('./routes/program');
const auth = require('./routes/auth');

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookie());

app.use('/api', text);
app.use('/api', sentiment);
app.use('/api', program);
app.use('/api', auth);

module.exports = app;