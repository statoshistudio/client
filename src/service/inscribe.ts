import {Request, Response} from 'express';
import { call, download, toFile } from '../helpers/utils';

export const inscribe = async (req: Request, res: Response) => {
    const { file, data, wallet, feeRate, platformFee, platformFeeAddress, reveal_priv_key, commit_tx, destination, change_addresses } = req.body;
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
    if(commit_tx) {
        params.push(`--commit-tx ${commit_tx}`)
    }
    if(destination) {
        params.push(`--destination ${destination}`)
    }
    if(change_addresses) {
        params.push(`--change-address-1 ${change_addresses[0]}`)
        params.push(`--change-address-2 ${change_addresses[1]}`)
    }
    console.log('PARAMS', params, wallet);
    call( 'ord',
    'wallet',
    params,
    [{wallet}], (inscribe=> {
        console.log('INSCRIBE RESPONSE', inscribe.result);
        if(inscribe.success) {
            inscribe.result = JSON.parse(inscribe.result)
            res.status(200).send(inscribe);
            return;
        } else{
            res.status(500).send(inscribe); 
        }
    }) )
    // const inscribe: any = await call(
    //     'ord',
    //     'wallet',
    //     params,
    //     [{wallet}]
    //   ).catch((e) => {
    //     console.error(e)
    //     throw e;
    //   });
    //   console.log('INSCRIBE RESPONSE', inscribe.result);
    //   try{
    //   console.log('INSCRIBE RESPONSE', JSON.parse(inscribe.result));
    //   inscribe.result = JSON.parse(inscribe.result)
    //   }catch(e) {
    //     res.status(500).send(e.message);
    //     return;
    //   }
    // console.log( inscribe);
    // res.status(200).send(inscribe);
}catch(e) {
    res.status(500).send(e.message)
}
}