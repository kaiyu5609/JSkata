export default function() {
    this._groups.forEach(function(group, i) {
        group.forEach(function(node, j) {
            if (node) return node;
        });
    });
    return null;
}
