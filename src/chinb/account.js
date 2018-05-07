"use strict";

var Web3 = require('web3');
var crd_artifacts = require('../data/CRD.json');
var kyc_artifacts = require('../data/KYC.json');
var config = require('../data/config.json')

var Account = function(rpc_provider = 'http://localhost:8545') {
    this.web3 = new Web3(rpc_provider);
    this.crd = new this.web3.eth.Contract(crd_artifacts.abi, config.crd);   
    this.kyc = new this.web3.eth.Contract(kyc_artifacts.abi, config.kyc);   
}

Account.prototype.create = function create(id, password) {
    let account = this.web3.eth.accounts.create();
    if(!this.web3.eth.accounts.wallet.save(password, id)) {
        throw new Error('save key failed!');
    }
    return account;
};

Account.prototype.getPublicKey = function getPublicKey(id) {
    return this.kyc.getPublicKey(id).call();
};

Account.prototype.getInfo = function getInfo(publicKey) {
    return this.kyc.getInfo(publicKey).call();
};

Account.prototype.getBalance = function getBalance(id) {
    let keys = Account.getPublicKey(id);
    let balances = new Map();
    for (let key in keys ) {
        let balnace = this.crd.getBalance(key);
        balances.set(key, balance);
    }
    return balances;
};

if (typeof localStorage === 'undefined') {
    delete Account.prototype.save;
    delete Account.prototype.load;
}