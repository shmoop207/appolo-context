"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const defaultSymbol = Symbol("default");
class Namespace {
    constructor() {
        this._contexts = new Map();
    }
    get context() {
        let context = this._contexts.get(defaultSymbol);
        if (!context) {
            context = this.create(defaultSymbol);
        }
        return context;
    }
    create(name, contextFn) {
        if (this._contexts.has(name)) {
            throw new Error(`namespace ${name.toString()} already exists`);
        }
        let context;
        if (contextFn) {
            context = contextFn instanceof context_1.Context ? contextFn : new contextFn();
        }
        else {
            context = new context_1.Context();
        }
        this._contexts.set(name, context);
        return context;
    }
    get(name) {
        return this._contexts.get(name);
    }
    delete(name) {
        let context = this.get(name);
        if (context) {
            context.destroy();
        }
        this._contexts.delete(name);
    }
}
exports.Namespace = Namespace;
//# sourceMappingURL=namespace.js.map