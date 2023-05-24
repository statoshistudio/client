import { Request, Response } from 'express';
import { call, download, toFile } from '../helpers/utils';
import crypto from "crypto";
import axios from "axios";
import http from "http";
import https from "https";
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });
const instance = axios.create({
  httpAgent,  // httpAgent: httpAgent -> for non es6 syntax
  httpsAgent,
});

type Inscribe = {
 // satpoint: string,
 fee_rate: string,
 // commit_fee_rate: string,
 file: string,
 //  no_backup?: boolean,
// no_limit: boolean,
wallet: string;
dry_run: boolean;
 platform_fee_address: string,
  platform_fee: string,
  destination?: string,
  verbose?: boolean,
  commit_tx?: string,
   change_address_1?: string,
  change_address_2?: string,
  creator_wallet?: string,
  creator_fee?: string,
}
export const inscribe = async (req: Request, res: Response) => {
  const {
    file,
    data,
    wallet,
    feeRate,
    creatorFee,
    creatorWallet,
    platformFee,
    platformFeeAddress,
    commit_tx,
    destination,
    change_addresses,
  } = req.body;
  try {
  
    let savedFile;
    if (file) {
      const fileName =  `${process.env.ORD_FILE_DIR ?? '/tmp'}/${crypto.createHash('md5').update(file).digest("hex")}-${file.substring(
        file.length - 5,
        file.length
      )}`
      savedFile = await download(file, fileName);
    }
    if (data) {
      const fileName =  `${process.env.ORD_FILE_DIR ?? '/tmp'}/${crypto.createHash('md5').update(data).digest("hex")}.json`
      savedFile = await toFile(data, fileName);
    }
    // const params: string[] = [
    //   'inscribe',
    //   `${savedFile}`,
    //   `--dry-run`,
    //   `--no-backup`,
    // ];
    // if (feeRate) {
    //   console.log('FEERATE', feeRate);
    //   params.push(`--fee-rate ${feeRate}`);
    // }
    // if (platformFee && platformFeeAddress) {
    //   params.push(`--platform-fee ${platformFee}`);
    //   params.push(`--platform-fee-address ${platformFeeAddress}`);
    // }
    // if (creatorFee && creatorWallet) {
    //   params.push(`--creator-fee ${creatorFee}`);
    //   params.push(`--creator-wallet ${creatorWallet}`);
    // }
    // if (reveal_priv_key) {
    //   params.push(`--reveal-priv-key ${reveal_priv_key}`);
    // }
    // if (commit_tx) {
    //   params.push(`--commit-tx ${commit_tx}`);
    // }
    // if (destination) {
    //   params.push(`--destination ${destination}`);
    // }
    // if (change_addresses) {
    //   params.push(`--change-address-1 ${change_addresses[0]}`);
    //   params.push(`--change-address-2 ${change_addresses[1]}`);
    // }
    
    const query: Inscribe = {
     // satpoint: string,
      fee_rate: feeRate,
      file: savedFile,

      platform_fee_address: platformFeeAddress,
        platform_fee: platformFee,
        dry_run:true,
        wallet: wallet,
        destination: destination,
    
        commit_tx: commit_tx,
        change_address_1: change_addresses?.[0],
        change_address_2: change_addresses?.[1],
        creator_wallet: creatorWallet,
        creator_fee: creatorFee,
    };
   const url = `${process.env.ORDINAL_HTTP_HOST}/api/inscribe`;
    const inscribe = await axios.get(url, { params: {...query}, httpAgent, httpsAgent });
    // console.log('REsonse', inscribe.data);
    res.status(200).send(inscribe.data);
  } catch (e) {
    console.log('ERRORR', e.message, process.env.ORDINAL_HTTP_HOST)
    res.status(500).send(e.message);
  }
};
