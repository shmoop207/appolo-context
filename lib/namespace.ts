import {Context} from "./context";

export class Namespace {

    private _contexts: Map<string | Symbol, Context> = new Map();

    public create(name: string | Symbol, ContextFn?: typeof Context): Context {
        let context = ContextFn ? new ContextFn() : new Context();

        this._contexts.set(name, context);

        return context;
    }

    public get<T extends Context>(name: string | Symbol): T {
        return this._contexts.get(name) as T;
    }
}