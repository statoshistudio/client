import {Request, Response} from 'express';
import { call, callAsync, download, toFile } from '../helpers/utils';

export const getRawTransaction = async (req: Request, res: Response) => {
    const { txId } = req.params;
    try {
      const getrawtransaction: any = await callAsync(
        'bitcoin-cli',
        'getrawtransaction',
        [],
        []
      ).catch((e) => {
        throw e;
      });
      res.status(getrawtransaction.success ? 200 : 500).send(getrawtransaction);
    } catch (e) {
      console.log('ERROROR',e)
      if (e.message.includes('error') && !e.message.includes('exist')) {
        return res.status(500).send(e.message);
      }
    }
};