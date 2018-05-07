"use strict";

var version = require('../package.json').version;
var Account = require('./chinb/account');
var Institude = require('./chinb/institude');
var Validator = require('./chinb/validator')

module.exports = {
  version,
  Account,
  Institude,
  Validator
};