import {Request, Response} from 'express';
import { callAsync, download } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, wallet } = req.body;
try{
    const savedFile = await download(
      file
    );
    console.log('SAVEDFILE', savedFile);
    const createWallet: any = await callAsync(
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
      createWallet.result = JSON.parse(createWallet.result)
    console.log( createWallet);
    res.status(200).send(createWallet);
}catch(e) {
    res.status(500).send(e.message)
}
}