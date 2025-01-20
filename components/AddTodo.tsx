import { Signal, useSignal } from "@preact/signals";
import { Button } from "./Button.tsx";
import DateInput, { Todo } from "./DateInput.tsx";
import { T } from "../translations.ts";

type AddTodoProps = {
    todos: Signal<Array<Todo>>;
    loadTodos: () => Promise<void>;
};

export default function AddTodo(props: AddTodoProps) {
    const currentTodo = useSignal<Todo | null>(null);
    const text = useSignal<string>("");
    const loading = useSignal<boolean>(false);

    const addTodo = async (e: SubmitEvent) => {
        e.preventDefault();

        if (currentTodo.value && currentTodo.value.text) {
            try {
                loading.value = true;
                const newTodo = currentTodo.value;
                currentTodo.value = null;
                text.value = "";
                await fetch("/api/todos/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTodo),
                });
                await props.loadTodos();
            } finally {
                loading.value = false;
            }
        }
    };

    return (
        <div>
            <form class="flex gap-8 py-6 items-center" onSubmit={addTodo}>
                <DateInput text={text} todo={currentTodo} />
                <Button disabled={loading}>{loading.value ? T("LOADING") : T("ADD")}</Button>
            </form>
        </div>
    );
}
