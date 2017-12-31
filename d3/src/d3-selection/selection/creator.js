import namespace from "./namespace";
import { xhtml } from "./namespaces";

function creatorFixed(fullname) {
    return function() {
        this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}

function creatorInherit(name) {
    return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;

        if (uri === xhtml && document.documentElement.namespaceURI === xhtml) {
            return document.createElement(name);
        }
        return document.createElementNS(uri, name);
    };
}

export default function(name) {
    var fullname = namespace(name);
    return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
