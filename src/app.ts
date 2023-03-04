import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';

import { exec } from 'child_process';
import { call, callAsync, download } from './helpers/utils';
import bodyParser from 'body-parser';
import { nanoid } from 'nanoid';
import { inscribe } from './service/inscribe';
import { createWallet } from './service/create-wallet';
import { getRawTransaction } from './service/get-raw-tx';
const app = express();

const jsonParser = bodyParser.json();

app.get('/',  (req: Request, res: Response) => {
  res.send('Hello World');
});
app.post('/inscribe', jsonParser, inscribe);
app.post('/create-wallet', jsonParser, createWallet);
app.post('/get-raw-tx', jsonParser, getRawTransaction);
  
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
