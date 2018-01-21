var zrUtil = require("./core/util");
// var Group = require("./container/Group");


function timesort(array, compare, lo, hi) {

}

/**
 * Storage内容仓库模块
 */
class Storage {
    constructor() {
        this._roots = [];
        this._displayList = [];
        this._displayListLen = 0;
    }

    addRoot(el) {
        if (el.__storage === this) {
            return;
        }

        // if (el instanceof Group) {
        //     el.addChildrenToStorage(this);
        // }

        this.addToStorage(el);

        this._roots.push(el);
    }

    addToStorage(el) {
        el.__storage = this;
        el.dirty(false);
        return this;
    }

    getDisplayList(update, includeIgnore) {
        includeIgnore = includeIgnore || false;

        if (update) {
            this.updateDisplayList(includeIgnore);
        }

        return this._displayList;
    }

    updateDisplayList(includeIgnore) {
        this._displayListLen = 0;
        var roots = this._roots;
        var displayList = this._displayList;
        var self = this;

        roots.forEach(function(root) {
            self._updateAndAddDisplayable(root, null, includeIgnore);
        });

        displayList.length = this._displayListLen;


        timesort(displayList, function() {})
    }
    _updateAndAddDisplayable(el, clipPaths, includeIgnore) {
        if (el.ignore && !includeIgnore) {
            return;
        }

        el.beforeUpdate();

        if (el.__dirty) {
            el.update();
        }

        el.afterUpdate();

        el.__clipPaths = clipPaths;

        this._displayList[this._displayListLen++] = el;
    }
}


module.exports = Storage;
