module.exports.convertToCodeName = function (n) {
    return n.replace(/\s/g, "").replace(/[/()& ]/gi, "");
}

module.exports.normalizeString = function (n) {
    if(n!=null){
        return n.replace(/\"/g, "'").replace(/\\/g, "\\\\").replace(/\r\n/g, "\\n").replace(/\n/g,"\\n");
    }
    else{
        return n;
    }
}

module.exports.parseValueList = function (n) {
    return n.replace(/^\s*\[\s*/g,"").replace(/\s*\]\s*$/g,"").replace(/\s*,\s*/g,",").split(",");
}