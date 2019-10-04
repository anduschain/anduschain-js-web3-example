// send Transaction example
const web3 = require('../manage/rpcConn');
const config = require('../config');
const { decryptedAccount } = require('../manage/keyUtil');
const util = require('../util');
const {GetNonce, SendTransactionWithPrivateKey} = util(web3);

// get local keystore
const { address, privateKey, signTransaction, sign } = decryptedAccount(config.keyPath, config.keyPass);
// {
//     address: '0xfef6f81c2c9e1fa327cad572d352b913bc074a0d',
//     privateKey: '0xabd1374002952e5f3b60fd16293d06521e1557d9dfb9996561568423a26a9cc9',
//     signTransaction: [Function: signTransaction],
//     sign: [Function: sign],
//     encrypt: [Function: encrypt]
// }

// get balance
async function getBalance(account) {
    try {
        const res = await web3.eth.getBalance(account);
        console.log(`Account : ${account} >> Balance : ${res}`);
    }catch (e) {
        console.error(e);
    }
}

// get Block
async function getBlock(number) {
    try {
        const res = await web3.eth.getBlock(number);
        console.log(res);
    }catch (e) {
        console.error(e);
    }
}

async function getTransaction(txHash) {
    try {
        const res = await web3.eth.getTransaction(txHash);
        console.log(res);
    }catch (e) {
        console.error(e);
    }
}

async function getNonce(address) {
    try{
       const res = await web3.eth.getTransactionCount(address);
       return Number(res);
    }catch (e) {
        console.error(e);
        return 0;
    }
}

async function sendTransactionWithPrivateKey(address, privatekey) {
    try{
        const nonce = await GetNonce(address);
        const { Receipt } = await SendTransactionWithPrivateKey({
            nonce: nonce,
            to: '0xfef6f81c2c9e1fa327cad572d352b913bc074a0d',
            value: '0x1',
            data: '0x',
        }, privatekey);
        console.log(Receipt);
    }catch (e) {
        console.error(e)
    }
}

// getBalance(address);
// getBlock(1000);
// getTransaction('0x2388788826de461ca3a52ceb4437762bf9f8d73cf9cafd92abb6dd2283b97981');
sendTransactionWithPrivateKey(address, privateKey);
