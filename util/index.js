const { Transaction } = require('anduschain-js');

module.exports = function (web3) {
    return {
        /**
         * @return {number}
         */
        GetNonce : async function (address) {
            try{
                const res = await web3.eth.getTransactionCount(address);
                return parseInt(res);
            }catch (e) {
                console.error(e);
                return 0;
            }
        },
        SendTransactionWithPrivateKey : async function(txData, privateKey) {
            try{
                // privatekey.substr(2, privatekey.length-1) -> remove 0x..
                const pkey = Buffer.from(privateKey.substr(2, privateKey.length-1), 'hex',);
                const tx = new Transaction(txData, 'testnet');
                tx.sign(pkey);
                return {
                    Json : JSON.stringify(tx.toJSON(true)),
                    Rlp : tx.serialize().toString('hex'),
                    Hash : tx.hash().toString('hex'),
                    Fee :  tx.getUpfrontCost().toString(),
                    Receipt : await web3.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'))
                }
            }catch (e) {
               throw e
            }
        },
        ContractEncodeABI : async function(abi, contractAddr, method, params) {
            try {
                const contract = new web3.eth.Contract(abi, contractAddr);
                if (params) {
                    return contract.methods[method](params).encodeABI();
                }else {
                    return contract.methods[method]().encodeABI();
                }

            }catch (e) {
                throw e
            }
        },
        CallContract :  async function(abi, contractAddr, method, params) {
            try {
                const contract = new web3.eth.Contract(abi, contractAddr);
                if (params) {
                    return await contract.methods[method](params).call();
                }else{
                    return await contract.methods[method]().call();
                }
            }catch (e) {
                throw e
            }
        }
    }
};
