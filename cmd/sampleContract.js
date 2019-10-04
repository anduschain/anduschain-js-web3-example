const web3 = require('../manage/rpcConn');
const config = require('../config');
const { abi, evm } = require('../build/SimpleStorage.json');
const { decryptedAccount } = require('../manage/keyUtil');
const util = require('../util');
const {GetNonce, SendTransactionWithPrivateKey, ContractEncodeABI, CallContract} = util(web3);
const { address, privateKey, signTransaction, sign } = decryptedAccount(config.keyPath, config.keyPass);

/**
 *sampel contract tx receipt
 *@return {
 *   blockHash: '0xf5dddbeb5a35d8987529e57aaefe67650d4b3334d3f389ba24cc9bf01246e14c',
 *       blockNumber: 20834,
 *   contractAddress: '0x3AFa510E218C2c184CFc9281817648bE6a082871',
 *   cumulativeGasUsed: 127651,
 *   from: '0xfef6f81c2c9e1fa327cad572d352b913bc074a0d',
 *   gasUsed: 127651,
 *   logs: [],
 *   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
 *   status: true,
 *    to: null,
 *   transactionHash: '0x0ca5e6305cd2b1a49c32f7f4d8280c6bf0e5db85d738e018b22367652e2c1b20',
 *   transactionIndex: 1
}
 */

async function deployContract(address, privatekey, contract) {
    try {
        const nonce = await GetNonce(address);
        const { Receipt } = await SendTransactionWithPrivateKey({
            nonce: nonce,
            gasLimit : 2100000,
            data: contract,
        }, privatekey);
        console.log(Receipt);
    }catch (e) {
        console.error(e)
    }
}

async function GetContractData(contractAddr, abi) {
    try {
        const result = await CallContract(abi, contractAddr, 'get');
        console.log(result);
    }catch (e) {
        console.error(e)
    }
}

async function SendContractdData(address, privatekey, contractAddr, abi) {
    try{
        const nonce = await GetNonce(address);
        const { Receipt } = await SendTransactionWithPrivateKey({
            nonce: nonce,
            gasLimit : 2100000,
            to : contractAddr,
            data:  await ContractEncodeABI(abi, contractAddr, 'set', 99),
        }, privatekey);
        console.log(Receipt);
    }catch (e) {
        console.error(e)
    }
}

// Contract object
// const contractData = `0x${evm.bytecode.object}`;
// deployContract(address, privateKey, contractData); // deploy contract
// SendContractdData(address, privateKey, '0x3AFa510E218C2c184CFc9281817648bE6a082871', abi);
//GetContractData('0x3AFa510E218C2c184CFc9281817648bE6a082871', abi);
