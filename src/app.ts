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
import mongoose from "mongoose";
import { createProxyMiddleware } from 'http-proxy-middleware';
const app = express();

const jsonParser = bodyParser.json();
const options = {
  target: process.env.ORDINAL_HTTP_HOST, // target host
  changeOrigin: true, // needed for virtual hosted sites
  onProxyRes(proxyRes: any, req: any, res: any) {
    proxyRes.headers['Content-Type'] = 'application/json'; // add new header to respons
  },
  onError: (error: any, req: any, res: any) => {
    res.headers['Content-Type'] = 'application/json'; // add new header to respons
    console.log(error.message);
    res.status(500).send({meta: {success: false, message: "Upstream error"}, data: {}})
  }
};

// create the proxy (without context)
const ordinalProxy = createProxyMiddleware(options);
app.use('/api', ordinalProxy);
app.get('/',  (req: Request, res: Response) => {
  res.send('Hello World');
});
app.post('/inscribe', jsonParser, inscribe);
app.post('/create-wallet', jsonParser, createWallet);
// app.get('/get-raw-tx/:txId', jsonParser, getRawTransaction);
  
app.get('/:command/:action', async function (req, res) {

  await call(
    req.params.command,
    req.params.action,
    req.query.params as string[],
    req.query.flags as string[],
    (result: any) => {
      res.status(result?.success? 200: 400).send(result);
    }
  );
});

mongoose.connect(process.env.DB_URL, {autoCreate: true})
.then(()=> 
  {
    const server = app.listen(8081, '0.0.0.0', function () {
    const host = (server.address() as any).address;
    const port = (server.address() as any).port;
    console.log('Listening at http://%s:%s', host, port);
    })
  }
  );
