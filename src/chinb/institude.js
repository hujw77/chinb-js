
"use strict";

var Web3 = require('web3');
var crd_artifacts = require('../data/CRD.json');
var config = require('../data/config.json')

var Account = function(private_key, rpc_provider = 'http://localhost:8545') {
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
    this.crd = new this.web3.eth.Contract(crd_artifacts.abi, config.crd);
    this.crd.options.from = this.account.address;
    



}