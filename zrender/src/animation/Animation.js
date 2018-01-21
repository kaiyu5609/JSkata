var util = require("../core/util");
// var _event = require("../core/event");
// var Dispatcher = _event.Dispatcher;
var requestAnimationFrame = require("./requestAnimationFrame");
// var Animator = require("./Animator");

class Animation {

    constructor(opts) {
        opts = opts || {};

        this.stage = opts.stage || {};
        this.onframe = opts.onframe || function() {};

        this._clips = [];
        this._running = false;
        this._time;
        this._pausedTime;
        this._pauseStart;
        this._paused = false;
    }

    start() {
        this._time = new Date().getTime();
        this._pausedTime = 0;
        this._startLoop();
    }

    _startLoop() {
        var self = this;
        this._running = true;

        function step() {
            if (self._running) {
                requestAnimationFrame(step);
                !self._paused && self._update();
            }
        }

        requestAnimationFrame(step);
    }

    _update() {
        var time = new Date().getTime() - this._pausedTime;
        var delta = time - this._time;
        var clips = this._clips;
        var len = clips.length;
        var deferredEvents = [];
        var deferredClips = [];

        for (var i = 0; i< len; i++) {
            var clip = clips[i];
            var e = clip.step(time, dalta);

            if (e) {
                deferredEvents.push(e);
                deferredClips.push(clip);
            }
        }

        for (var i = 0; i < len;) {
            if (clips[i]._needsRemove) {
                clips[i] = clips[len -1];
                clips.pop();
                len--;
            } else {
                i++;
            }
        }

        len = deferredEvents.length;

        for (var i = 0; i < len; i++) {
            deferredClips[i].fire(deferredEvents[i]);
        }

        this._time = time;
        this.onframe(delta);
        // this.trigger('frame', delta);

        if (this.stage.update) {
            this.stage.update();
        }
    }
}

module.exports = Animation;
