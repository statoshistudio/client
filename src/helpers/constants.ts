export const AppResponse = {
  INVALID_INPUT: (message?: string) => ({
    success: false,
    status: 400,
    message: message ?? 'Invalid Input. Command not allowed by gateway',
  }),
  SERVER_ERROR: (message?: string) => ({
    success: false,
    status: 500,
    message: message ?? 'Internal server error',
  }),
  SUCCESS: (message?: string) => ({
    success: true,
    status: 200,
    message: message ?? 'Success',
  }),
};

export const ValidCommands: string[] = ['bitcoin-cli', 'ord'];

export const ValidActions: Record<string, any> = {
  'bitcoin-cli': [
    'sendrawtransaction',
    'importdescriptors',
    'getdescriptorinfo',
    'createwallet',
    'getrawtransaction',
    'listunspent',
    'sendrawtransaction'
  ],
  ord: ['wallet', 'inscribe', 'send'],
};

export const Flags: Record<string, any> = {
  'bitcoin-cli': {
    conf: process.env.BITCOIN_CONFIG_PATH ?? '',
  },
  ord: {
    'bitcoin-data-dir': process.env.BITCOIN_DATA_DIR,
    config: process.env.ORD_CONFIG,
    'data-dir': process.env.ORD_DATA_DIR,
  },
};
