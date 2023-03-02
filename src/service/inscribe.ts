import {Request, Response} from 'express';
import { callAsync, download, toFile } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, data, wallet, feeRate } = req.body;
try{
    let savedFile;
    if(file) {
        savedFile = await download(file);
    }
    if(data) {
        savedFile = await toFile(data)
    }
    const params: string[] =[
        'inscribe',
      `${savedFile}`,
      `--dry-run`,
       `--no-backup`,
    ];
    if(feeRate) {
        params.push(`--fee_rate ${feeRate}`)
    }
    const inscribe: any = await callAsync(
        'ord',
        'wallet',
        params,
        [{wallet}]
      ).catch((e) => {
        throw e;
      });
      // console.log('CREATED_WALLET_RESPONSE', JSON.parse(String(createWallet)))
      inscribe.result = JSON.parse(inscribe.result)
    console.log( inscribe);
    res.status(200).send(inscribe);
}catch(e) {
    res.status(500).send(e.message)
}
}