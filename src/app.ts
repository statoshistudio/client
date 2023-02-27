import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';

import { exec } from 'child_process';
import { call, callAsync, download } from './helpers/utils';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import { inscribe } from './service/inscribe';
const app = express();

const jsonParser = bodyParser.json();

app.get('/',  (req: Request, res: Response) => {
  res.send('Hello World');
});
app.post('/inscribe', jsonParser, inscribe);
app.post('/create-descriptors', jsonParser, async function (req, res) {
  const { tr, wallet } = req.body;
  try {
    const createWallet = await callAsync(
      'bitcoin-cli',
      'createwallet',
      [
        `wallet_name=${wallet}`,
        'blank=true',
        'disable_private_keys=true',
        'descriptors=true',
      ],
      ['named']
    ).catch((e) => {
      throw e;
    });
  } catch (e) {
    if (e.message.includes('error') && !e.message.includes('exist')) {
      return res.status(500).send(e);
    }
  }
  await call(
    'bitcoin-cli',
    'getdescriptorinfo',
    [`"tr(${tr}/0/*)"`],
    [],
    async (result1: any) => {
      await call(
        'bitcoin-cli',
        'getdescriptorinfo',
        [`"tr(${tr}/1/*)"`],
        [],
        async (result2: any) => {
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
            async (result3: any) => {
              res.status(result3.success ? 200 : 500).send(template);
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
    req.query.params as string[],
    req.query.flags as string[],
    async (result: any) => {
      res.status(result.status).send(result);
    }
  );
});

const server = app.listen(8081, '0.0.0.0', function () {
  const host = (server.address() as any).address;
  const port = (server.address() as any).port;
   console.log('Listening at http://%s:%s', host, port);
});
