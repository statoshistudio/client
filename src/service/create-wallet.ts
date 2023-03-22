import {Request, Response} from 'express';
import { trusted } from 'mongoose';
import { call, callAsync, download, toFile } from '../helpers/utils';
import Wallet from '../models/wallet.schema'

export const createWallet = async (req: Request, res: Response) => {
    const { tr, name } = req.body;
    const exists = await Wallet.findOneAndUpdate({name}, {$setOnInsert: {name, descriptor: tr}});
    try {
      const createWallet = await callAsync(
        'bitcoin-cli',
        'createwallet',
        [
          `wallet_name=${name}`,
          'blank=true',
          'disable_private_keys=true',
          'descriptors=true',
        ],
        ['named']
      ).catch((e) => {
        throw e;
      });
    } catch (e) {
      console.log('ERROROR',e)
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
              [{ rpcwallet: name }],
              async (result3: any) => {
                res.status(result3.success ? 200 : 500).send(template);
              }
            );
            await Wallet.findOneAndUpdate({name}, {$setOnInsert: {name, descriptor: tr}, $set: {imported: true}});
          }
        );
        // res.status(result.status).send(result);
      }
    );
};