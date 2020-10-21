interface entry {
    val: any;
    corStates: symbol[];
}

const main = () => {
    const store = new Map();
    const methodKey = "methods";
    const globalKey = "globals";
    store.set(methodKey, {});
    store.set(globalKey, {});
    return {
        __add(symbol: Symbol, foreignState: any): object {
            store.set(symbol, foreignState);
            return this;
        },
        __remove(symbol: Symbol): object {
            store.delete(symbol);
            return this;
        },
        __get(symbol: Symbol): object {
            if (!store.has(symbol)) return this;
            return store.get(symbol).state;
        },
        createGlobalState(obj: any): object {
            for (const [key, val] of Object.entries(obj)) {
                if (typeof val === "function") {
                    this.getGlobal()[key] = val;
                    continue;
                }
                const entry = { val, corStates: [] };
                this.getGlobal()[key] = entry;
            }
            return this;
        },
        addSymbolToKey(key: string, symbol: Symbol): object {
            const glob = this.getGlobal();
            if (!glob.hasOwnProperty(key)) {
                throw new Error(`The global state object doesn't have a "${key}" key.`)
            }
            glob[key].corStates.push(symbol);
            return this;
        },
        setGlobal(key: string, val: any): object {
            let entry = this.getGlobal()[key];
            if (!entry) {
                entry = { val, corStates: [] };
                this.getGlobal()[key] = entry.val;
            }
            entry.val = val;
            entry.corStates.forEach((symbol: symbol) => {
                const ctx = store.get(symbol).ctx;
                ctx.setState(key, entry.val);
            });
            return this;
        },
        getGlobal(key: string | null = null): any {
            if (!key) return store.get(globalKey);
            return store.get(globalKey)[key].val;
        },
        getGlobalValues() {
            const obj: any = {};
            let [key, entry] : [null | string, any] = [null, null];
            for ([key, entry] of Object.entries(this.getGlobal())) {
                if (entry.hasOwnProperty("val")) {
                    obj[key] = entry.val;
                    continue;
                }
                obj[key] = entry;
            }
            return obj;
        },
        getGlobalState(): object {
            return {
                ...this.getGlobalValues(),
                setGlobal: this.setGlobal,
            };
        },
    };
};

export default main();
