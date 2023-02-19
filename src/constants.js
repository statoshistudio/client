const AppResponse = {
  INVALID_INPUT: (message) => ({
    success: false,
    code: 400,
    message: message ?? 'Invalid Input',
  }),
  SERVER_ERROR: (message) => ({
    success: false,
    status: 500,
    message: message ?? 'Internal server error',
  }),
  SUCCESS: (message) => ({
    success: true,
    status: 200,
    message: message ?? 'Success',
  }),
};

const ValidCommands = ['bitcoin-cli', 'ord'];

const ValidActions = {
  'bitcoin-cli': ['sendrawtransaction', 'importdescriptor'],
  ord: ['wallet'],
};

module.exports = {
  ValidCommands,
  AppResponse,
  ValidActions,
};
