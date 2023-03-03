import { exec } from 'child_process';
import { promises as fs } from "fs";
import fetch from 'node-fetch';

import { nanoid } from 'nanoid/non-secure'

import { ValidCommands, AppResponse, ValidActions, Flags } from './constants';

export const callAsync = async function (
  command: string,
  action: string,
  args: string[] = [],
  flags: string[] | Record<string,any>[] = []
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      call(command, action, args, flags, (result: any) => {
        if (!result.success) reject(result);
        else resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const call = function ( command: string,
  action: string,
  args: string[] = [],
  flags: string[] | Record<string,any>[] = [], cb: (_: any)=>void) {
  if (!ValidCommands.includes(command)) {
    return cb(AppResponse.INVALID_INPUT());
  }

  if (!ValidActions[command].includes(action)) {
    return cb(AppResponse.INVALID_INPUT());
  }
  args = Array.isArray(args) ? args : JSON.parse(args ?? '[]');
  // console.log('ARGS', args);
  const params = args.join(' ');
  // console.log('flags', typeof flags);
  flags = Array.isArray(flags) ? flags : JSON.parse(flags ?? '[]');
  let flagString = '';
  const flagPrefix = command === 'ord' ? '--' : '-';
  flags.forEach((v) => {
    const key = typeof v === 'object' ? Object.keys(v)[0] : v;
    flagString +=
      typeof v === 'string'
        ? `${flagPrefix}${key} `
        : `${flagPrefix}${key}=${Flags[command][key] ?? Object.values(v)[0]} `;
  });
  Object.keys(Flags[command]).forEach((k) => {
    flagString += `${flagPrefix}${k}=${Flags[command][k]} `;
  });

  const fullCommand = `${command} ${flagString} ${action} ${params}`;
  console.log('COMMAND:::::', fullCommand);
  exec(`${fullCommand}`, async (error, stdout, stderr) => {
    console.log('EXECUTED...');
    if (error) {
      await cb(AppResponse.SERVER_ERROR(error.message));
      console.error(error);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      await cb(AppResponse.SERVER_ERROR(error.message));
      return;
    }

    await cb({ success: true, result: stdout });
  });
};

export const download = async function (url: string,  fileName?: string, callback?: (_: any)=>void) {
  try{
    const response = await fetch(url);
   // const blob = await response.blob();
     const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fileName =  fileName ?? `/tmp/${nanoid()}-${Date.now()}+${url.substring(
      url.length - 5,
      url.length
    )}`
    await fs.writeFile(fileName, buffer);
    return fileName;
  }catch(e) {
    throw e;
  }
};

export const toFile = async function (data: string,  fileName?: string, callback?: (_: any)=>void) {
  try{
    const buffer = Buffer.from(data, "utf-8");
    fileName =  fileName ?? `/tmp/${nanoid()}-${Date.now()}.txt`
    await fs.writeFile(fileName, buffer);
    return fileName;
  }catch(e) {
    throw e;
  }
};
