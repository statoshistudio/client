const AppResponse = {
  INVALID_INPUT: (message) => ({
    success: false,
    status: 400,
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
  'bitcoin-cli': [
    'sendrawtransaction',
    'importdescriptors',
    'getdescriptorinfo',
  ],
  ord: ['wallet'],
};

const Flags = {
  'bitcoin-cli': {
    conf: process.env.BITCOIN_CONFIG_PATH ?? '',
  },
  ord: {
    'bitcoin-data-dir': process.env.BITCOIN_DATA_DIR,
    config: process.env.ORD_CONFIG,
  },
};

module.exports = {
  ValidCommands,
  AppResponse,
  ValidActions,
  Flags,
};
