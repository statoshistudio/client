const { exec } = require('child_process');

const {
  ValidCommands,
  AppResponse,
  ValidActions,
  Flags,
} = require('./constants');

const callAsync = async function (command, action, args = [], flags = []) {
  return new Promise((resolve, reject) => {
    try {
      call(command, action, args, flags, (result) => {
        if (!result.success) reject(result);
        else resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const call = function (command, action, args = [], flags = [], cb) {
  if (!ValidCommands.includes(command)) {
    return cb(AppResponse.INVALID_INPUT());
  }

  if (!ValidActions[command].includes(action)) {
    return cb(AppResponse.INVALID_INPUT());
  }
  args = Array.isArray(args) ? args : JSON.parse(args ?? '[]');
  // console.log('ARGS', args);
  let params = args.join(' ');
  // console.log('flags', typeof flags);
  flags = Array.isArray(flags) ? flags : JSON.parse(flags ?? '[]');
  let flagString = '';
  const flagPrefix = command == 'ord' ? '--' : '-';
  flags.forEach((v) => {
    let key = typeof v == 'object' ? Object.keys(v)[0] : v;
    flagString +=
      typeof v == 'string'
        ? `${flagPrefix}${key} `
        : `${flagPrefix}${key}=${Flags[command][key] ?? Object.values(v)[0]} `;
  });
  Object.keys(Flags[command]).forEach((k) => {
    flagString += `${flagPrefix}${k}=${Flags[command][k]} `;
  });

  const fullCommand = `${command} ${flagString} ${action} ${params}`;
  console.log('COMMAND:::::', fullCommand);
  exec(`${fullCommand}`, async (error, stdout, stderr) => {
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

    console.log(`stdout: ${stdout}`);
  });
};

module.exports = {
  call,
  callAsync,
};
