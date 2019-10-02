// send Transaction example
const web3 = require('../manage/rpcConn');
const config = require('../config');
const { Transaction } = require('anduschain-js');
const { decryptedAccount } = require('../manage/keyUtil');
const { Buffer } = require('buffer');

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
        // privatekey.substr(2, privatekey.length-1) -> remove 0x..
        const privateKey = Buffer.from(
            privatekey.substr(2, privatekey.length-1),
            'hex',
        );
        const txData = {
            nonce: await getNonce(address),
            to: '0xfef6f81c2c9e1fa327cad572d352b913bc074a0d',
            value: '0x1',
            data: '0x',
        };
        const tx = new Transaction(txData, 'testnet');
        tx.sign(privateKey);
        console.log("Transasion JSON: " + JSON.stringify(tx.toJSON(true)));
        console.log("Transasion rplEncode: " + tx.serialize().toString('hex'));
        console.log('Transaction Hash: ' + tx.hash().toString('hex'));
        console.log("Sender", tx.getSenderAddress().toString('hex')); // fef6f81c2c9e1fa327cad572d352b913bc074a0d
        console.log('Senders ChainId: ' + tx.getChainId());
        console.log("Fee ", tx.getUpfrontCost().toString());

        //send transaction
        const receipt = await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
        console.log("Transaction receipt : ", receipt)

    }catch (e) {
        console.error(e)
    }
}

// getBalance(address);
// getBlock(1000);
// getTransaction('0x2388788826de461ca3a52ceb4437762bf9f8d73cf9cafd92abb6dd2283b97981');
sendTransactionWithPrivateKey(address, privateKey);
