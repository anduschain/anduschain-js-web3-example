const { createAccount } = require('../manage/keyUtil');
const config = require('../config');
// create account and save key json file to keypath ( located > /tmp/..)
createAccount(config.keyPass);
