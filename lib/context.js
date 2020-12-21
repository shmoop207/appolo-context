"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const async_hooks_1 = require("async_hooks");
class Context {
    constructor() {
        this._context = new Map();
        this._isEnabled = false;
        this._isInitialize = false;
    }
    initialize() {
        if (this._isInitialize) {
            return;
        }
        this._hook = async_hooks_1.createHook({ init: this._init.bind(this), destroy: this._destroy.bind(this) });
        this.enable();
        this._isInitialize = true;
    }
    _init(asyncId, type, triggerAsyncId, resource) {
        if (this._context.has(triggerAsyncId)) {
            this._context.set(asyncId, this._context.get(triggerAsyncId));
        }
    }
    _destroy(asyncId) {
        this._context.delete(asyncId);
    }
    scope(fn) {
        const id = async_hooks_1.executionAsyncId();
        this._context.set(id, new Map());
        return fn();
    }
    get(key) {
        return this._getContext().get(key);
    }
    _getContext() {
        if (!this._hook || !this._isEnabled) {
            throw new Error("async hooks in not initialized or not enabled");
        }
        const id = async_hooks_1.executionAsyncId();
        let context = this._context.get(id);
        if (!context) {
            context = new Map();
            this._context.set(id, context);
        }
        return context;
    }
    set(key, vale) {
        this._getContext().set(key, vale);
    }
    enable() {
        this._isEnabled = true;
        this._hook.enable();
    }
    disable() {
        this._isEnabled = false;
        this._hook.disable();
    }
    destroy() {
        this.disable();
        this._context.clear();
        this._context = null;
        this._hook = null;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map