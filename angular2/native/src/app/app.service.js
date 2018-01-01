var { Injectable } = require("@angular/core");

module.exports = Injectable()
.Class({
    constructor: function() {},
    say: function(word) {
        return word;
    },
    getData: function() {
        return [{
            value: 'additional parameter',
            color: 'yellow'
        }, {
            value: 'additional parameter',
            color: 'blue'
        }];
    }
});
