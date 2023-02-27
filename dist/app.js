"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const utils_1 = require("./helpers/utils");
const body_parser_1 = __importDefault(require("body-parser"));
const inscribe_1 = require("./service/inscribe");
const app = (0, express_1.default)();
const jsonParser = body_parser_1.default.json();
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/inscribe', jsonParser, inscribe_1.inscribe);
app.post('/create-descriptors', jsonParser, async function (req, res) {
    const { tr, wallet } = req.body;
    try {
        const createWallet = await (0, utils_1.callAsync)('bitcoin-cli', 'createwallet', [
            `wallet_name=${wallet}`,
            'blank=true',
            'disable_private_keys=true',
            'descriptors=true',
        ], ['named']).catch((e) => {
            throw e;
        });
    }
    catch (e) {
        if (e.message.includes('error') && !e.message.includes('exist')) {
            return res.status(500).send(e);
        }
    }
    await (0, utils_1.call)('bitcoin-cli', 'getdescriptorinfo', [`"tr(${tr}/0/*)"`], [], async (result1) => {
        await (0, utils_1.call)('bitcoin-cli', 'getdescriptorinfo', [`"tr(${tr}/1/*)"`], [], async (result2) => {
            const template = [
                {
                    desc: '',
                    timestamp: 'now',
                    active: true,
                    internal: true,
                    range: [0, 999],
                    next: 0,
                },
                {
                    desc: '',
                    timestamp: 'now',
                    active: true,
                    internal: false,
                    range: [0, 999],
                    next: 0,
                },
            ];
            template[0].desc = JSON.parse(result1.result).descriptor;
            template[1].desc = JSON.parse(result2.result).descriptor;
            await (0, utils_1.call)('bitcoin-cli', 'importdescriptors', [`'${JSON.stringify(template).replace(/'/g, `'\\''`)}'`], [{ rpcwallet: wallet }], async (result3) => {
                res.status(result3.success ? 200 : 500).send(template);
            });
        });
        // res.status(result.status).send(result);
    });
});
app.get('/:command/:action', async function (req, res) {
    console.log(req.params, req.query.params);
    await (0, utils_1.call)(req.params.command, req.params.action, req.query.params, req.query.flags, async (result) => {
        res.status(result.status).send(result);
    });
});
const server = app.listen(8081, '0.0.0.0', function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});
//# sourceMappingURL=app.js.map