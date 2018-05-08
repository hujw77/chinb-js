
"use strict";

var Web3 = require('web3');
var {
    ins_artifacts,
    reg_artifacts,
    crd_artifacts,
    kyc_artifacts,
    config
} = require('../data');

var {sendTx, utils} = require('../utils')

var Institute = function(private_key, rpc_provider = 'http://localhost:8545') {
    if (!private_key && _.isString(private_key)) {
        throw new Error('private_key string required!');
    }
    this.web3 = new Web3(rpc_provider);
    if (private_key.indexOf('0x', 0) === 0) {
        this.account = this.web3.eth.accounts.privateKeyToAccount(private_key);
    } else {
        this.account = this.web3.eth.accounts.privateKeyToAccount('0x' + private_key);
    };
    this.web3.eth.accounts.wallet.add(this.account);
    this.reg = new this.web3.eth.Contract(reg_artifacts.abi, config.reg);
    this.ins = new this.web3.eth.Contract(reg_artifacts.abi, config.ins);
    this.crd = new this.web3.eth.Contract(crd_artifacts.abi, config.crd);
    this.kyc = new this.web3.eth.Contract(kyc_artifacts.abi, config.kyc);
    this.reg.options.from = this.account.address;
    this.reg.options.gas = config.gas;
    this.reg.options.gasLimit = config.gasLimit;
    this.ins.options.from = this.account.address;
    this.ins.options.gas = config.gas;
    this.ins.options.gasLimit = config.gasLimit;
    this.crd.options.from = this.account.address;
    this.crd.options.gas = config.gas;
    this.crd.options.gasLimit = config.gasLimit;
    this.kyc.options.from = this.account.address;
    this.kyc.options.gas = config.gas;
    this.kyc.options.gasLimit = config.gasLimit;
    this.ins = this.ins.getInfo(this.account.address).call();
};

Institute.prototype.getTokens = function getTokens() {
    let balnace = this.crd.getBalance(this.account.address);
    return utils.bal2num(balnace, config.decimals);
}

Institute.prototype.transfer = function transfer(to, amount) {
    sendTx(this.web3, this.crd, 'transfer(address,uint256)', [to, utils.num2bal(amount, config.decimals)], callback);
}

Institute.prototype.register = function register(user_addr, user_id, callback) {
    let id_hash = this.web3.utils.sha3(user_id);
    sendTx(this.web3, this.reg, 'insert(address,uint256,uint256)', [user_addr, id_hash, ins.no], callback);
};

Institute.prototype.del = function del(address, callback) {
    sendTx(this.web3, this.reg, 'delete(address)', [address], callback)
};

Institute.prototype.update = function update(address_old, address_new, callback) {
    sendTx(this.web3, this.reg, 'update(address,address)', [address_old, address_new], callback)
}

Institute.prototype.recover = function recover(address_old, address_new, callback) {
    sendTx(this.web3, this.reg, 'recover(address,address)', [address_old, address_new], callback)
}

Institute.prototype.verify = function verify(data, sign, callback) {
    sendTx(this.web3, this.ins, 'verify(bytes32,bytes32)', [data, sign], callback);
}

module.exports = Institute;