import config from 'config';
import express from 'express';
import mongoose from "mongoose";
import Bull from "bull";
import { processNewInscriptoin } from './worker/processor';

const app = express();
const quePrefix = config.get('app.prefix');

const newInscriptionQueue = new Bull(`${quePrefix}-sac-queue`, config.get('redis.url'));
newInscriptionQueue.process(async (job, done) => {
	processNewInscriptoin(job, done);
});


mongoose.connect(process.env.DB_URL, {autoCreate: true})
.then(()=> 
  {
    const host =  '0.0.0.0';
    const port = Number(process.env.WORKER_PORT ?? 8082);
    app.listen(port, host, function () {
    console.log('Worker Listening at http://%s:%d', host, port);
    })
  }
);