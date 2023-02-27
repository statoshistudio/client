"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.call = exports.callAsync = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const node_fetch_1 = __importDefault(require("node-fetch"));
const non_secure_1 = require("nanoid/non-secure");
const constants_1 = require("./constants");
const callAsync = async function (command, action, args = [], flags = []) {
    return new Promise((resolve, reject) => {
        try {
            (0, exports.call)(command, action, args, flags, (result) => {
                if (!result.success)
                    reject(result);
                else
                    resolve(result);
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.callAsync = callAsync;
const call = function (command, action, args = [], flags = [], cb) {
    if (!constants_1.ValidCommands.includes(command)) {
        return cb(constants_1.AppResponse.INVALID_INPUT());
    }
    if (!constants_1.ValidActions[command].includes(action)) {
        return cb(constants_1.AppResponse.INVALID_INPUT());
    }
    args = Array.isArray(args) ? args : JSON.parse(args !== null && args !== void 0 ? args : '[]');
    // console.log('ARGS', args);
    const params = args.join(' ');
    // console.log('flags', typeof flags);
    flags = Array.isArray(flags) ? flags : JSON.parse(flags !== null && flags !== void 0 ? flags : '[]');
    let flagString = '';
    const flagPrefix = command === 'ord' ? '--' : '-';
    flags.forEach((v) => {
        var _a;
        const key = typeof v === 'object' ? Object.keys(v)[0] : v;
        flagString +=
            typeof v === 'string'
                ? `${flagPrefix}${key} `
                : `${flagPrefix}${key}=${(_a = constants_1.Flags[command][key]) !== null && _a !== void 0 ? _a : Object.values(v)[0]} `;
    });
    Object.keys(constants_1.Flags[command]).forEach((k) => {
        flagString += `${flagPrefix}${k}=${constants_1.Flags[command][k]} `;
    });
    const fullCommand = `${command} ${flagString} ${action} ${params}`;
    console.log('COMMAND:::::', fullCommand);
    (0, child_process_1.exec)(`${fullCommand}`, async (error, stdout, stderr) => {
        if (error) {
            await cb(constants_1.AppResponse.SERVER_ERROR(error.message));
            console.error(error);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            await cb(constants_1.AppResponse.SERVER_ERROR(error.message));
            return;
        }
        await cb({ success: true, result: stdout });
        console.log(`stdout: ${stdout}`);
    });
};
exports.call = call;
const download = async function (url, fileName, callback) {
    try {
        const response = await (0, node_fetch_1.default)(url);
        // const blob = await response.blob();
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fileName = fileName !== null && fileName !== void 0 ? fileName : `/tmp/${(0, non_secure_1.nanoid)()}-${Date.now()}+${url.substring(url.length - 5, url.length)}`;
        await fs_1.promises.writeFile(fileName, buffer);
        return fileName;
    }
    catch (e) {
        throw e;
    }
};
exports.download = download;
//# sourceMappingURL=utils.js.map