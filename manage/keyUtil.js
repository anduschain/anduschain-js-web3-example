const web3 = require('../manage/rpcConn');
const fs = require('fs');
const moment = require('moment');

const decryptedAccount = (keyPath, keyPass) => {
    try{
        const keyJson = JSON.parse(fs.readFileSync(keyPath));
        return web3.eth.accounts.decrypt(keyJson, keyPass);
    }catch (e) {
        console.error(e)
    }
    return null
};

const createAccount = (keyPass) => {
    let address, path = "";
    if (!keyPass) throw new Error('key pass is empty');
    try {
        const createAccount =  web3.eth.accounts.create();
        const entryptKey = web3.eth.accounts.encrypt(createAccount.privateKey, keyPass);
        path = `${__dirname}/../tmp/UTC--${moment().utc(false).format().toString()}--${entryptKey.address}.json`;
        address = entryptKey.address;
        fs.writeFileSync(path, JSON.stringify(entryptKey));
    }catch (e) {
        console.error(e)
    }finally {
        console.log("Create Account : ", address, "KeyPath :", path)
    }
};


module.exports = {
    decryptedAccount, createAccount
};
