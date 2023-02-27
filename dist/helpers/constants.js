"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = exports.ValidActions = exports.ValidCommands = exports.AppResponse = void 0;
exports.AppResponse = {
    INVALID_INPUT: (message) => ({
        success: false,
        status: 400,
        message: message !== null && message !== void 0 ? message : 'Invalid Input. Command not allowed by gateway',
    }),
    SERVER_ERROR: (message) => ({
        success: false,
        status: 500,
        message: message !== null && message !== void 0 ? message : 'Internal server error',
    }),
    SUCCESS: (message) => ({
        success: true,
        status: 200,
        message: message !== null && message !== void 0 ? message : 'Success',
    }),
};
exports.ValidCommands = ['bitcoin-cli', 'ord'];
exports.ValidActions = {
    'bitcoin-cli': [
        'sendrawtransaction',
        'importdescriptors',
        'getdescriptorinfo',
        'createwallet',
    ],
    ord: ['wallet', 'inscribe'],
};
exports.Flags = {
    'bitcoin-cli': {
        conf: (_a = process.env.BITCOIN_CONFIG_PATH) !== null && _a !== void 0 ? _a : '',
    },
    ord: {
        'bitcoin-data-dir': process.env.BITCOIN_DATA_DIR,
        config: process.env.ORD_CONFIG,
        'data-dir': process.env.ORD_DATA_DIR,
    },
};
//# sourceMappingURL=constants.js.map