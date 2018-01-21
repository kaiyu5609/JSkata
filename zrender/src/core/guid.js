/*
 * zrender: 生成唯一id
 */
var idStart = 0x0907;

function guid() {
    return idStart++;
}

module.exports = guid;
