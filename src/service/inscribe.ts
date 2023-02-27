import {Request, Response} from 'express';
import { callAsync, download } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, wallet } = req.body;
try{
    const savedFile = await download(
      file
    );
    console.log('SAVEDFILE', savedFile);
    const createWallet = await callAsync(
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
      console.log('CREATED_WALLET_RESPONSE', createWallet)

    res.status(200).send(savedFile);
}catch(e) {
    res.status(500).send(e.message)
}
}