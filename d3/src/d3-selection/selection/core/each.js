export default function(callback) {
    this._groups.forEach(function(group, i) {
        group.forEach(function(node, j) {
            if (node) callback.call(node, node.__data__, j, group);
        });
    });
    return this;
}
