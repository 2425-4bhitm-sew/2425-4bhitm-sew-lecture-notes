import { ToDo } from "./todo"

const BASE_URL = "https://jsonplaceholder.typicode.com"

export async function loadAllToDos() {
    const response = await fetch(`${BASE_URL}/todos`)
    const todos = await response.json() as ToDo[]
    return todos
}