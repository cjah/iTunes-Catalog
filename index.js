import express from 'express'
const app = express()
const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('*.js', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/javascript; charset=UTF-8',
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.get('*.css', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/css; charset=UTF-8',
  });
  res.end(fs.readFileSync(path.join(__dirname, req.url)));
});

app.listen(3000,() =>
console.log(`Server is listening on port 3000`))


module.exports = app;
