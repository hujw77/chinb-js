"use strict";

var num2bal = function num2bal(value, decimals) {
    return Math.floor(value * Math.pow(10, decimals));
}

var bal2num = function bal2num(bal, decimals) {
    return bal && bal.div ?
        bal.div(Math.pow(10, decimals)) :
        bal / Math.pow(10, decimals);
}


module.exports = {
    num2bal,
    bal2num
}