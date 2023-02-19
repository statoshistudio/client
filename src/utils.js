const { exec } = require('child_process');

const {
  ValidCommands,
  AppResponse,
  ValidActions,
  Flags,
} = require('./constants');

const call = async function (command, action, args = [], flags = [], cb) {
  if (!ValidCommands.includes(command)) {
    return await cb(AppResponse.INVALID_INPUT());
  }

  if (!ValidActions[command].includes(action)) {
    return await cb(AppResponse.INVALID_INPUT());
  }
  args = JSON.parse(args);
  console.log(args);
  let params = args.join(' ');
  flags = JSON.parse(flags);
  let flagString = '';
  const flagPrefix = command == 'ord' ? '--' : '-';
  flags.forEach((v) => {
    let key = typeof v == 'object' ? Object.keys(v)[0] : v;
    flagString += `${flagPrefix}${key}=${
      Flags[command][key] ?? Object.values(v)[0]
    } `;
  });
  Object.keys(Flags[command]).forEach((k) => {
    flagString += `${flagPrefix}${k}=${Flags[command][k]} `;
  });

  const fullCommand = `${command} ${flagString} ${action} ${params}`;
  console.log(fullCommand);
  exec(`${fullCommand}`, async (error, stdout, stderr) => {
    if (error) {
      await cb(AppResponse.SERVER_ERROR(error.message));
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      await cb(AppResponse.SERVER_ERROR(error.message));
      return;
    }

    await cb({ success: true, result: stdout });

    console.log(`stdout: ${stdout}`);
  });
};

module.exports = {
  call,
};
