const main = () => {
    const store = new Map();
    const methodKey = "methods";
    const globalKey = "globals";
    store.set(methodKey, {});
    store.set(globalKey, {});
    return {
        __add(symbol, foreignState) {
            store.set(symbol, foreignState);
            return this;
        },
        __remove(symbol) {
            store.delete(symbol);
            return this;
        },
        __get(symbol) {
            if (!store.has(symbol))
                return this;
            return store.get(symbol).state;
        },
        createGlobalState(obj) {
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
        addSymbolToKey(key, symbol) {
            const glob = this.getGlobal();
            if (!glob.hasOwnProperty(key)) {
                throw new Error(`The global state object doesn't have a "${key}" key.`);
            }
            glob[key].corStates.push(symbol);
            return this;
        },
        setGlobal(key, val) {
            let entry = this.getGlobal()[key];
            if (!entry) {
                entry = { val, corStates: [] };
                this.getGlobal()[key] = entry.val;
            }
            entry.val = val;
            entry.corStates.forEach((symbol) => {
                const ctx = store.get(symbol).ctx;
                ctx.setState(key, entry.val);
            });
            return this;
        },
        getGlobal(key = null) {
            if (!key)
                return store.get(globalKey);
            return store.get(globalKey)[key].val;
        },
        getGlobalValues() {
            const obj = {};
            let [key, entry] = [null, null];
            for ([key, entry] of Object.entries(this.getGlobal())) {
                if (entry.hasOwnProperty("val")) {
                    obj[key] = entry.val;
                    continue;
                }
                obj[key] = entry;
            }
            return obj;
        },
        getGlobalState() {
            return {
                ...this.getGlobalValues(),
                setGlobal: this.setGlobal,
            };
        },
    };
};
export default main();
