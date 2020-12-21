"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.Context = exports.namespace = void 0;
const context_1 = require("./lib/context");
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return context_1.Context; } });
const namespace_1 = require("./lib/namespace");
let namespace = new namespace_1.Namespace();
exports.namespace = namespace;
let context = namespace.context;
exports.context = context;
//# sourceMappingURL=index.js.map