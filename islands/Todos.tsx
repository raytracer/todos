import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import AddTodo from "../components/AddTodo.tsx";
import { Todo } from "../components/DateInput.tsx";

export default function Todos() {
    const todos = useSignal<Array<Todo>>([]);

    const loadTodos = async () => {
        const res = await fetch("/api/todos/all");
        const data = await res.json();
        todos.value = data;
    }

    useEffect(() => {
        loadTodos();
    }, []);

    return (
        <div class="flex gap-8 py-6">
            <AddTodo loadTodos={loadTodos} todos={todos} />
            <ul>
                {todos.value.map((todo, index) => {
                    return (
                        <li key={index}>
                            {todo.start?.toLocaleString()}: {todo.text}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
