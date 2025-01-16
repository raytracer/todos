import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import AddTodo from "../components/AddTodo.tsx";
import { Todo } from "../components/DateInput.tsx";
import TrashCan from "../components/TrashCan.tsx";
import { startOfWeek, addWeeks, startOfDay, addDays } from "npm:date-fns@4.1.0";

const formatDate = (date: Date | undefined): string => {
    if (date) {
        return date.toLocaleString('de-DE', {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).replace(',', '').replace(/:\d{2}$/, ''); // Optional trimming if seconds aren't needed
    } else {
        return "Nicht zugewiesen";
    }
};

export default function Todos() {
    const todos = useSignal<Array<Todo>>([]);

    const loadTodos = async () => {
        const res = await fetch("/api/todos/all");
        const data = await res.json();
        const transformed = data.map((todo: any) => {
            return {...todo, start: todo.start === undefined ? undefined : new Date(todo.start), end: todo.end === undefined ? undefined : new Date(todo.end)};
        });
        todos.value = transformed;
    }

    useEffect(() => {
        loadTodos();
    }, []);

    const sortTodos = (todos: Array<Todo>) => {
        return todos.sort((a, b) => {
            if (a.start && b.start) {
                const comparison =  a.start.getTime() - b.start.getTime();
                if (comparison === 0) {
                    return a.text.localeCompare(b.text);
                } else {
                    return comparison;
                }
            } else if (a.start) {
                return 1;
            } else if (b.start) {
                return -1;
            } else {
                return a.text.localeCompare(b.text);
            }
        });
    }

    const groupTodos = (todos: Array<Todo>) => {
        let rest = todos;
        const inbox = rest.filter(todo => todo.start === undefined);
        rest = rest.filter(todo => !inbox.includes(todo));
        const today = rest.filter(todo => todo.start !== undefined && startOfDay(todo.start).getTime() === startOfDay(new Date()).getTime());
        rest = rest.filter(todo => !today.includes(todo));
        const tomorrow = rest.filter(todo => todo.start !== undefined && startOfDay(todo.start).getTime() === startOfDay(addDays(new Date(), 1)).getTime());
        rest = rest.filter(todo => !tomorrow.includes(todo));
        const thisWeek = rest.filter(todo => todo.start !== undefined && startOfWeek(todo.start, { weekStartsOn: 1 }).getTime() === startOfWeek(new Date(), { weekStartsOn: 1 }).getTime());
        rest = rest.filter(todo => !thisWeek.includes(todo));
        const nextWeek = rest.filter(todo => todo.start !== undefined && startOfWeek(todo.start, { weekStartsOn: 1 }).getTime() === startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }).getTime());
        rest = rest.filter(todo => !nextWeek.includes(todo));
        const later = rest.filter(todo => todo.start !== undefined && startOfDay(todo.start).getTime() > startOfDay(addWeeks(new Date(), 1)).getTime());

        const groups: Array<{label: string, todos: Array<Todo>}> = [
            { label: "Inbox", todos: inbox },
            { label: "Today", todos: today },
            { label: "Tomorrow", todos: tomorrow },
            { label: "This Week", todos: thisWeek },
            { label: "Next Week", todos: nextWeek },
            { label: "Later", todos: later }
        ];

        return groups;
    }

    return (
        <div>
            <AddTodo loadTodos={loadTodos} todos={todos} />
                {groupTodos(sortTodos(todos.value)).map(({label, todos}) => {
                    return <div class="pb-4" key={label}>
                        <h2 class="text-xl font-bold pb-2">{label}</h2>
                        <ul>
                            {todos.map((todo, index) => {
                                const callback = async () => {
                                    await fetch("/api/todos/delete", {
                                        method: "POST",
                                        body: JSON.stringify(todo.id)
                                    });
                                    loadTodos();
                                };


                                return (
                                    <li class="grid grid-cols-[1fr_auto_1fr]" key={index}>
                                        <pre class="font-bold"><TrashCan callback={callback} /> {formatDate(todo.start)}</pre><span class="font-bold text-center px-3">:</span><span>{todo.text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>;
                })}
        </div>
    );
}
