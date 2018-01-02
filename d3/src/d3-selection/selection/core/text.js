function textRemove(value) {
    return function() {
        this.textContent = "";
    };
}

function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}

function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}

export default function(value) {
    var fnText;
    if (arguments.length) {
        if (value == null) {
            fnText = textRemove;
        } else if (typeof value === "function") {
            fnText = textFunction;
        } else {
            fnText = textConstant;
        }
        return this.each(fnText(value));
    } else {
        return this.node().textContent;
    }
}
