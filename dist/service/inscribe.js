"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inscribe = void 0;
const utils_1 = require("../helpers/utils");
const inscribe = async (req, res) => {
    const { file, wallet } = req.body;
    try {
        const savedFile = await (0, utils_1.download)(file);
        console.log('SAVEDFILE', savedFile);
        const createWallet = await (0, utils_1.callAsync)('ord', 'inscribe', [
            `${savedFile}`,
            `--dry-run`,
            `--no-backup`,
        ], [{ wallet }]).catch((e) => {
            throw e;
        });
        console.log('CREATED_WALLET_RESPONSE', createWallet);
        res.status(200).send(savedFile);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
};
exports.inscribe = inscribe;
//# sourceMappingURL=inscribe.js.map