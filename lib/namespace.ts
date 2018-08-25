import {Context} from "./context";

const defaultSymbol = Symbol("default");

export class Namespace {

    private _contexts: Map<string | Symbol, Context> = new Map();

    public get context(): Context {

        let context = this._contexts.get(defaultSymbol);

        if (!context) {
            context = this.create(defaultSymbol);
        }

        return context;
    }

    public create(name: string | Symbol, ContextFn?: typeof Context): Context {

        if (this._contexts.has(name)) {
            throw new Error(`namespace ${name.toString()} already exists`)
        }

        let context = ContextFn ? new ContextFn() : new Context();


        this._contexts.set(name, context);

        return context;
    }

    public get<T extends Context>(name: string | Symbol): T {
        return this._contexts.get(name) as T;
    }

    public delete(name: string | Symbol) {
        let context = this.get(name);

        if (context) {
            context.destroy();
        }

        this._contexts.delete(name);
    }
}