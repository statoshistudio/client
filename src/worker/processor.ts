import { Job } from "bull";

import axios from 'axios';
import config from 'config';
/**
 * processSacrificeJob
 * @param {*} job
 * @param {*} done
 */
export const processNewInscriptoin = async (job: Job, done: () => void) => {
    const data = job.data;
    console.log('processing...', data);
    axios.get(config.get('indexer'),  { params: data })
    .then(() => {
        done();
    })
    .catch(function (error) {
        if (error.response) {
          
          throw error;
          
        }
      });
};