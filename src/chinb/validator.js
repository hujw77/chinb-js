"use strict";

var Web3 = require('web3');
var {
    ins_artifacts,
    crd_artifacts,
    config
} = require('../data');
var {sendTx, utils} = require('../utils')

var Validator = function(private_key, rpc_provider = 'http://localhost:8545') {
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
    this.ins = new this.web3.eth.Contract(reg_artifacts.abi, config.ins);
    this.crd = new this.web3.eth.Contract(crd_artifacts.abi, config.crd);
    this.kyc = new this.web3.eth.Contract(kyc_artifacts.abi, config.kyc);
    this.ins.options.from = this.account.address;
    this.ins.options.gas = config.gas;
    this.ins.options.gasLimit = config.gasLimit;
    this.crd.options.from = this.account.address;
    this.crd.options.gas = config.gas;
    this.crd.options.gasLimit = config.gasLimit;
};

Validator.prototype.getTokens = function getTokens() {
    let balnace = this.crd.getBalance(this.account.address);
    return utils.bal2num(balnace, config.decimals);
};

Validator.prototype.transfer = function transfer(to, amount) {
    sendTx(this.web3, this.crd, 'transfer(address,uint256)', [to, utils.num2bal(amount, config.decimals)], callback);
};

Validator.prototype.register = function register(adddress, no) {
    sendTx(this.web3, this.ins, 'register(address,uint256)', [address, no], callback);
};

Validator.prototype.recover = function recover(address_old, address_new){
    sendTx(this.web3, this.ins, 'recover(address,address)', [address, address], callback);
};

Validator.prototype.listen = function listen() {
    var _this = this;
    this.ins.events.recover({}, (err, res) => {
        let val = res.returnValues
        Validator.recover(_this.recover(val.address_old, val.address_new));
    });
};

module.exports = Validator;
