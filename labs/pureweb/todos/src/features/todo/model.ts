import {ToDo} from "./todo";

export interface Model {

    todos: ToDo[]
}

const handler2: ProxyHandler<Model> = {
    get(model, prop, receiver) {
        console.log("getter ", model, prop)
        return model.todos;
    },
};

const state: Model = {todos: []}

export const model = new Proxy(state, handler2);


