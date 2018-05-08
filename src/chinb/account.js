"use strict";

var Web3 = require('web3');
var {crd_artifacts,kyc_artifacts,config} = require('../data');
var {sendTx, utils} = require('../utils')

var Account = function(rpc_provider = 'http://localhost:8545') {
    this.web3 = new Web3(rpc_provider);
    this.crd = new this.web3.eth.Contract(crd_artifacts.abi, config.crd);   
    this.kyc = new this.web3.eth.Contract(kyc_artifacts.abi, config.kyc);   
    this.crd.options.gas = config.gas;
    this.crd.options.gasPrice = config.gasPrice;
    this.kyc.options.gas = config.gas;
    this.kyc.options.gasPrice = config.gasPrice;
};

Account.prototype.create = function create(id, password) {
    let account = this.web3.eth.accounts.create();
    this.web3.eth.accounts.wallet.add(account);
    if(!this.web3.eth.accounts.wallet.save(password, id)) {
        throw new Error('save key failed!');
    }
    return account;
};

Account.prototype.recreate = function recreate(id, password) {
    let wallet = this.web3.eth.account.load(password, id);
    if (!wallet || wallet.length == 0) {
        return Account.create(id, password);
    } else {
        let address_old = wallet[0].address;
        this.web3.eth.accounts.wallet.remove(address_old);
        let account_new = Account.create(id, password);
        account_new.address_old = address_old;
        return account_new;
    }
};

Account.prototype.getPublicKey = function getPublicKey(id) {
    return this.kyc.getPublicKey(id).call();
};

Account.prototype.getInfo = function getInfo(publicKey) {
    return this.kyc.getInfo(publicKey).call();
};

Account.prototype.getTokens = function getTokens(id) {
    let keys = Account.getPublicKey(id);
    let balances = new Map();
    for (let key in keys ) {
        let balnace = this.crd.getBalance(key);
        balances.set(key, utils.bal2num(balance, config.decimals));
    }
    return balances;
};

Account.prototype.transfer = function transfer(id, password, to, amount, callback) {
    let wallet = this.web3.eth.account.wallet.load(password, id);
    if (!wallet || wallet.length == 0) {
        throw new Error('load key fails');
    }
    this.crd.options.from = wallet[0].address;
    sendTx(this.web3, this.crd, 'transfer(address,uint256)', [to, utils.num2bal(amount, config.decimals)], callback);
};

Account.prototype.authorize = function authorize(id, password, data) {
    let wallet = this.web3.eth.account.load(password, id);
    if (!wallet) {
        throw new Error('load key fails');
    }
    let account = wallet[0];
    return account.sign(data);
};

module.exports = Account;
