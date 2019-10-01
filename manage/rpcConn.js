const web3 = require('web3');
const config = require('../config');

// RPC Connection
module.exports =  new web3(new web3.providers.HttpProvider(config.rpcHost));
