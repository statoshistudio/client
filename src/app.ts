import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response} from 'express';
import { call} from './helpers/utils';
import bodyParser from 'body-parser';
import { inscribe } from './service/inscribe';
import { createWallet } from './service/create-wallet';
import mongoose from "mongoose";
import { createProxyMiddleware } from 'http-proxy-middleware';
import Bull from "bull";
import config from 'config';
const quePrefix = config.get('app.prefix');
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

const newInscriptionQueue = new Bull(`${quePrefix}-sac-queue`, config.get('redis.url'));

// create the proxy (without context)
const ordinalProxy = createProxyMiddleware(options);
app.use('/api', ordinalProxy);
app.get('/',  (req: Request, res: Response) => {
  res.send('Hello World');
});
app.post('/inscribe', jsonParser, inscribe);
app.post('/create-wallet', jsonParser, createWallet);
// app.get('/get-raw-tx/:txId', jsonParser, getRawTransaction);
app.get('/new-inscription',  (req: Request, res: Response) => {
  newInscriptionQueue.add(req.query as any, {attempts: 10, delay: 2000, BackoffOpts: {
    type: 'exponential',
    delay: 10000
  }});
  res.json().send({success: true});
});

mongoose.connect(process.env.DB_URL, {autoCreate: true})
.then(()=> 
  {
    const server = app.listen(8081, '0.0.0.0', function () {
    const host = (server.address() as any).address;
    const port = (server.address() as any).port;
    console.log('API listening at http://%s:%s', host, port);
    })
  }
  );
