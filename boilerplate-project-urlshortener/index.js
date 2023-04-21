require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


// TODO
const bodyParser = require('body-parser');
const dns = require('dns');
const memo = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/shorturl", function(req, res) {
  let splitURL = req.body.url.split("/")[2];
  let obj = {
    original_url: '',
    short_url: 0
  }
  
  dns.lookup(splitURL, (error, data) => {
    if (error || !splitURL) {
      res.json({ error: 'invalid url' })
    } else {
      let found = false;
      for (let val in memo) {
        if (memo[val].original_url == req.body.url) {
          found = true;
        }
      }
      if (!found) {
        obj.original_url = req.body.url;
        obj.short_url = memo.length + 1;
        memo.push(obj);
        res.json(obj);
      } else {
        obj.original_url = req.body.url;
        obj.short_url = memo.filter(item => item.original_url == req.body.url)[0].short_url;
        res.json(obj);
      }
    } 
  });
});

app.get("/api/shorturl/:shortURL", function(req, res) {
  let address = memo.filter(item => item.short_url == req.params.shortURL)[0].original_url;
  res.redirect(address);
});