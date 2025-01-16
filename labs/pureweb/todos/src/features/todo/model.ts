import {ToDo} from "./todo";

type Subscription = (model:Model) => void

const subscribers: Subscription[] = []

function subscribe(subscriber: Subscription) {
    subscribers.push(subscriber)
}

interface Model {
    todos: ToDo[]
    myName: string
}

const handler: ProxyHandler<Model> = {
    get(model, prop, receiver) {
        console.log("getter ", model, prop)
        return Reflect.get(model, prop, receiver); // liefert den prop-value vom Original zum Proxy
    },
    set(model: Model, p: string | symbol, newValue: any, receiver: any) {
        const success = Reflect.set(model, p, newValue, receiver)
        console.log("setter ", model, p, receiver)
        return success
    }
};

const state: Model = {
    myName: "Chris Aberger",
    todos: []
}

// Erstellen einer Proxy-Variable
const model = new Proxy(state, handler);

export {model, Model, subscribe}

