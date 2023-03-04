import {Request, Response} from 'express';
import { callAsync, download, toFile } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, data, wallet, feeRate, platformFee, platformFeeAddress, reveal_priv_key } = req.body;
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
        console.log('FEERATE', feeRate)
        params.push(`--fee-rate ${feeRate}`)
    }
    if(platformFee && platformFeeAddress) {
        params.push(`--platform-fee ${platformFee}`)
        params.push(`--platform-fee-address ${platformFeeAddress}`)
    }
    if(reveal_priv_key) {
        params.push(`--reveal-priv-key ${reveal_priv_key}`)
    }
    console.log('PARAMS', params, wallet);
    const inscribe: any = await callAsync(
        'ord',
        'wallet',
        params,
        [{wallet}]
      ).catch((e) => {
        console.error(e)
        throw e;
      });
      console.log('INSCRIBE RESPONSE', inscribe.result);
      try{
      console.log('INSCRIBE RESPONSE', JSON.parse(inscribe.result));
      inscribe.result = JSON.parse(inscribe.result)
      }catch(e) {
        res.status(500).send(e.message);
        return;
      }
    console.log( inscribe);
    res.status(200).send(inscribe);
}catch(e) {
    res.status(500).send(e.message)
}
}