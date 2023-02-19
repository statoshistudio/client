const express = require('express');
const app = express();
const { exec } = require('child_process');
const { ValidCommands, AppError } = require('./constants');
const { call } = require('./utils');

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.get('/:command/:action', async function (req, res) {
  console.log(req.params, req.query.params);
  await call(
    req.params.command,
    req.params.action,
    req.query.params,
    async (result) => {
      res.status(result.status).send(result);
    }
  );
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
