import { Signal, useSignal } from "@preact/signals";
import { Button } from "./Button.tsx";
import DateInput, { Todo } from "./DateInput.tsx";
import { T } from "../translations.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { isFirstDayOfMonth } from "npm:date-fns@4.1.0/isFirstDayOfMonth";

type AddTodoProps = {
    todos: Signal<Array<Todo>>;
    loadTodos: () => Promise<void>;
};

const loadSpeech = () => {
    if (IS_BROWSER) {
        const rawSpeech = localStorage.getItem("speech");
        return rawSpeech ? JSON.parse(rawSpeech) : false;
    }

    return false;
};

export default function AddTodo(props: AddTodoProps) {
    const currentTodo = useSignal<Todo | null>(null);
    const text = useSignal<string>("");
    const loading = useSignal<boolean>(false);
    const speech = useSignal<boolean>(loadSpeech());

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

    const toggleMic = () => {
        if (IS_BROWSER) {
            localStorage.setItem("speech", JSON.stringify(!speech.value));
            speech.value = !speech.value;
        }
    };

    return (
        <div>
            <form class="flex gap-8 py-6 items-center" onSubmit={addTodo}>
                <DateInput speech={speech} text={text} todo={currentTodo} />
                <Button onClick={toggleMic}>MIC</Button>
                <Button disabled={loading}>{loading.value ? T("LOADING") : T("ADD")}</Button>
            </form>
        </div>
    );
}
