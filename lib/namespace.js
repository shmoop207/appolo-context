"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
class Namespace {
    constructor() {
        this._contexts = new Map();
    }
    create(name, ContextFn) {
        let context = ContextFn ? new ContextFn() : new context_1.Context();
        this._contexts.set(name, context);
        return context;
    }
    get(name) {
        return this._contexts.get(name);
    }
}
exports.Namespace = Namespace;
//# sourceMappingURL=namespace.js.map