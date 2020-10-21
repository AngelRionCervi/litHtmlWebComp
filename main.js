import { createComp, store } from "./dist/EZC.js";

store.createGlobalState({
    cars: {
        bmw: "m5",
        fiat: "500",
        renault: "espace",
    },
    addCar(car) {
        console.log("this.cars result : ", this.cars, this);
        store.setGlobal("cars", { ...this.cars, ...car });
    },
});

const addMoreCars = (cars) => {
    store.setGlobal("cars", { ...store.getGlobal("cars"), ...cars });
};

store.setGlobal("addMoreCars", addMoreCars);
const gState = store.getGlobalState();

createComp("test-test", ({ createState, html, query, onAttached, onRemove, useGlobal, _this }) => {
    const { state, setState } = createState({ cars: useGlobal("cars") });

    onAttached(() => {
        //setState("car", "mini");
        console.log("heyeeeeeeeeeeeeeezrzerz");
        console.log(query("#some_id"));
    });

    onRemove(() => {
        console.log("rip");
    });

    const click = () => {
        console.log("click");
        gState.addMoreCars({ tesla: "model 3" });
    };

    setTimeout(() => {
        console.log(_this)
        _this.remove();
    }, 10)

    return () => html`
        <div id="some_id">some div</div>
        <p @click=${click}>Hello ${Object.keys(state.cars).map((brand) => html`<p>${brand}</p>`)}</p>
        <test-2 .props=${{ sayIt: () => console.log("lol") }}></test-2>
    `;
});

createComp("test-2", ({ html, props }) => {
    props.sayIt();

    return () => html`lol`;
});
