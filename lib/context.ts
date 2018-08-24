import {AsyncHook, createHook, executionAsyncId} from 'async_hooks';


export class Context {

    private _hook: AsyncHook;

    private _context: Map<number, Map<any, any>> = new Map();

    private _isEnabled = false;
    private _isInitialize = false;

    public initialize() {

        if (this._isInitialize) {
            return;
        }

        this._hook = createHook({init: this._init.bind(this), destroy: this._destroy.bind(this)});
        this.enable();

        this._isInitialize = true;

    }

    private _init(asyncId: number, type: string, triggerAsyncId: number, resource: Object) {

        if (this._context.has(triggerAsyncId)) {
            this._context.set(asyncId, this._context.get(triggerAsyncId));
        }
    }

    private _destroy(asyncId: number) {
        this._context.delete(asyncId);
    }

    public scope(fn: Function): any {
        const id = executionAsyncId();
        this._context.set(id, new Map());

        return fn();
    }

    public get<T>(key: any): T {

        return this._getContext().get(key);
    }

    private _getContext(): Map<any, any> {

        if (!this._hook || !this._isEnabled) {
            throw new Error("async hooks in not initialized or not enabled")
        }

        const id = executionAsyncId();
        let context = this._context.get(id);

        if (!context) {
            context = new Map();
            this._context.set(id, context);
        }

        return context
    }

    public set<T>(key: any, vale: T) {
        this._getContext().set(key, vale);
    }


    public enable() {
        this._isEnabled = true;
        this._hook.enable();
    }

    public disable() {
        this._isEnabled = false;
        this._hook.disable();
    }

    public destroy() {
        this.disable();
        this._context.clear();
        this._context = null;
        this._hook = null;
    }
}
