import creator from "../creator";

export default function(name) {
    var create = typeof name === "function" ? name : creator(name);
    // this -> enterSelection
    return this.select(function() {
        // this -> EnterNode
        return this.appendChild(create.apply(this, arguments));
    });
}
