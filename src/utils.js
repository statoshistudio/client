const { exec } = require('child_process');

const { ValidCommands, AppError, AppResponse } = require('./constants');

const call = async function (command, action, args = [], cb) {
  if (!ValidCommands.includes(command)) {
    return AppError.INVALID_INPUT();
  }
  args = JSON.parse(args);
  let params = args.length ? args.pop().join(' ') : '';

  exec(`${command} ${action} ${params}`, async (error, stdout, stderr) => {
    if (error) {
      console.log(error.messag);
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
