const web3 = require('../manage/rpcConn');
const config = require('../config');
const { abi, evm } = require('../build/SimpleStorage.json');
const { Transaction } = require('anduschain-js');
const { decryptedAccount } = require('../manage/keyUtil');
const { Buffer } = require('buffer');
const { address, privateKey, signTransaction, sign } = decryptedAccount(config.keyPath, config.keyPass);

// Contract object
const contractData = `0x${evm.bytecode.object}`;

async function getNonce(address) {
    try{
        const res = await web3.eth.getTransactionCount(address);
        return Number(res);
    }catch (e) {
        console.error(e);
        return 0;
    }
}

// Transaction receipt :  {
//     blockHash: '0xc0a67b94a4c2a966b265bf5bef3e3aead46b0075a4f0c450a2b3284fa4163381',
//         blockNumber: 14469,
//         contractAddress: '0xeBad8038108E92ce43113768aBfE421D8b32D13A',
//         cumulativeGasUsed: 64592999,
//         from: '0xfef6f81c2c9e1fa327cad572d352b913bc074a0d',
//         gasUsed: 127651,
//         logs: [],
//         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//         status: true,
//         to: null,
//         transactionHash: '0x5d1a167f0fab10a3e4a84553f68acc7225f3d10f876038e1afc84bbcf6a2d11d',
//         transactionIndex: 2858
// }

async function sendTransactionWithPrivateKey(address, privatekey, data) {
    try{
        // privatekey.substr(2, privatekey.length-1) -> remove 0x..
        const privateKey = Buffer.from(
            privatekey.substr(2, privatekey.length-1),
            'hex',
        );
        const txData = {
            nonce: await getNonce(address),
            gasLimit : 2100000,
            data: data,
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

async function sendTransactionWithPrivateKey2(address, privatekey, data, to) {
    try{
        // privatekey.substr(2, privatekey.length-1) -> remove 0x..
        const privateKey = Buffer.from(
            privatekey.substr(2, privatekey.length-1),
            'hex',
        );
        const txData = {
            nonce: await getNonce(address),
            gasLimit : 2100000,
            to : to,
            data: data,
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

async function CallContract(privatekey, abi, address, to) {
    try {
        const ct = new web3.eth.Contract(abi, address);
        // ct.methods.set(1234).send({from : '0xb91e203d42d0297922682718d8482e62992c0a65', gasLimit: 2100000, gasPrice: 23809523805524});
        const encode = ct.methods.set(7654).encodeABI();
        await sendTransactionWithPrivateKey2('0xfef6f81c2c9e1fa327cad572d352b913bc074a0d', privatekey, encode, address);
    }catch (e) {
        console.error(e)
    }
}

async function CallContract2(abi, address) {
    try {
        const ct = new web3.eth.Contract(abi, address);
        const receipt = await ct.methods.get().call();
        console.log(receipt)
    }catch (e) {
        console.error(e)
    }
}

// sendTransactionWithPrivateKey(address, privateKey, contractData);
// CallContract(privateKey, abi, '0xeBad8038108E92ce43113768aBfE421D8b32D13A');
CallContract2(abi, '0xeBad8038108E92ce43113768aBfE421D8b32D13A');
