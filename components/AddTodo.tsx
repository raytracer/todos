import { Signal, useSignal } from "@preact/signals";
import { Button } from "./Button.tsx";
import DateInput, { Todo } from "./DateInput.tsx";

type AddTodoProps = {
    todos: Signal<Array<Todo>>;
};

export default function AddTodo(props: AddTodoProps) {
    const currentTodo = useSignal<Todo | null>(null);
    const text = useSignal<string>("");

    const addTodo = () => {
        if (currentTodo.value) {
            props.todos.value = [currentTodo.value, ...props.todos.value];
            currentTodo.value = null;
            text.value = "";
        }
    };

    return (
        <div class="flex gap-8 py-6">
            <DateInput text={text} todo={currentTodo} />
            <Button onClick={addTodo}>Add</Button>
            <br />
            {currentTodo.value?.start?.toLocaleString()}
            {currentTodo.value?.text}
        </div>
    );
}
