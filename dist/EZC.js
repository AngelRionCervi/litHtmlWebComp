import { html, render } from "../node_modules/lit-html/lit-html.js";
import * as _H from "./helpers.js";
import store from "./Store.js";
export { store };
export function createComp(name, defineComp) {
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            this.storeSymbol = Symbol();
            this.attachedResolve = null;
            this.attachedReject = null;
            this.attached = false;
            this.cycleBeforeRender = () => void 0;
            this.cycleAfterRender = () => void 0;
            this.cycleBeforeFirstRender = () => void 0;
            this.cycleAfterAttached = () => void 0;
            this.cycleAfterRemoved = () => void 0;
            const beforeFirstRender = (cb) => (this.cycleBeforeFirstRender = cb);
            const beforeRender = (cb) => (this.cycleBeforeRender = cb);
            const onRender = (cb) => (this.cycleAfterRender = cb);
            const onAttached = (cb) => (this.cycleAfterAttached = cb);
            const onRemove = (cb) => (this.cycleAfterRemoved = cb);
            const shadowRoot = this.attachShadow({ mode: "open" });
            const attachedError = new Error("shadowRoot isn't yet attached to the dom, listen to onAttached lifecycle event");
            this.setState = () => void 0;
            const createState = (initState = {}) => {
                store.__add(this.storeSymbol, { ctx: this, state: initState });
                this.setState = (key, val, cb) => {
                    _H.setPath(store.__get(this.storeSymbol), key, val);
                    if (this.attached) {
                        this.cycleBeforeRender();
                        render(this.htmlTemplate(), shadowRoot);
                        this.cycleAfterRender();
                        return cb ? cb() : void 0;
                    }
                    throw attachedError;
                };
                return { state: store.__get(this.storeSymbol), setState: this.setState };
            };
            const useGlobal = (key) => {
                store.addSymbolToKey(key, this.storeSymbol);
                return store.getGlobal()[key].val;
            };
            const query = (key) => {
                if (this.attached) {
                    return shadowRoot.querySelector(key);
                }
                throw attachedError;
            };
            const queryAll = (key) => {
                if (this.attached) {
                    return shadowRoot.querySelectorAll(key);
                }
                throw attachedError;
            };
            this.htmlTemplate = defineComp({
                createState,
                onAttached,
                beforeFirstRender,
                onRender,
                beforeRender,
                onRemove,
                useGlobal,
                html,
                query,
                queryAll,
                props: this.props,
                _this: this,
            });
            this.cycleBeforeFirstRender();
            this.cycleBeforeRender();
            render(this.htmlTemplate(), shadowRoot);
            this.cycleAfterRender();
        }
        connectedCallback() {
            this.attached = true;
            this.cycleAfterAttached();
        }
        disconnectedCallback() {
            this.cycleAfterRemoved();
        }
    });
}
