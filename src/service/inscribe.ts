import {Request, Response} from 'express';
import { callAsync, download } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, wallet } = req.body;
try{
    const savedFile = await download(
      file
    );
    console.log('SAVEDFILE', savedFile);
    const createWallet: string = await callAsync(
        'ord',
        'wallet',
        [
            'inscribe',
          `${savedFile}`,
          `--dry-run`,
           `--no-backup`,
        ],
        [{wallet}]
      ).catch((e) => {
        throw e;
      });
      // console.log('CREATED_WALLET_RESPONSE', JSON.parse(String(createWallet)))
console.log( createWallet);
    res.status(200).send(JSON.parse(createWallet));
}catch(e) {
    res.status(500).send(e.message)
}
}