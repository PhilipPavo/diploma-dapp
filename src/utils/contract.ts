import web3 from './web3';

import * as contract from 'truffle-contract';
const PassportStorageContract = require("../contract/PassportStorage.json");

const passportContract = contract(PassportStorageContract);
passportContract.setProvider(web3.currentProvider);
export default passportContract;