import {Request, Response} from 'express';
import { callAsync, download, toFile } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, data, wallet } = req.body;
try{
    let savedFile;
    if(file) {
        savedFile = await download(file);
    }
    if(data) {
        savedFile = await toFile(data)
    }
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