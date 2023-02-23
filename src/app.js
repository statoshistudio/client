require('dotenv').config();
const express = require('express');
const app = express();
const { exec } = require('child_process');
const { ValidCommands, AppError } = require('./constants');
const { call } = require('./utils');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.get('/', function (req, res) {
  res.send('Hello World');
});
app.post('/create-descriptors', jsonParser, async function (req, res) {
  const { tr, wallet } = req.body;
  await call(
    'bitcoin-cli',
    'getdescriptorinfo',
    [`"tr(${tr}/0/*)"`],
    [],
    async (result1) => {
      await call(
        'bitcoin-cli',
        'getdescriptorinfo',
        [`"tr(${tr}/1/*)"`],
        [],
        async (result2) => {
          const template = [
            {
              desc: '',
              timestamp: 'now',
              active: true,
              internal: true,
              range: [0, 999],
              next: 0,
            },
            {
              desc: '',
              timestamp: 'now',
              active: true,
              internal: false,
              range: [0, 999],
              next: 0,
            },
          ];
          template[0].desc = JSON.parse(result1.result).descriptor;
          template[1].desc = JSON.parse(result2.result).descriptor;

          await call(
            'bitcoin-cli',
            'importdescriptors',
            [`'${JSON.stringify(template).replace(/'/g, `'\\''`)}'`],
            [{ rpcwallet: wallet }],
            async (result2) => {
              res.status(result2.success ? 200 : 500).send(template);
            }
          );
        }
      );
      // res.status(result.status).send(result);
    }
  );
});
app.get('/:command/:action', async function (req, res) {
  console.log(req.params, req.query.params);
  await call(
    req.params.command,
    req.params.action,
    req.query.params,
    req.query.flags,
    async (result) => {
      res.status(result.status).send(result);
    }
  );
});

var server = app.listen(8081, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
