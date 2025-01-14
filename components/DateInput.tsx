import * as chrono from "npm:chrono-node@2.7.7";
import { Signal } from "@preact/signals";

export type Todo = {
  id: string;
  start?: Date;
  end?: Date;
  text: string;
};

type DateProps = {
  todo: Signal<Todo | null>;
  text: Signal<string>;
};

export default function DateInput(props: DateProps) {
  return (
    <div class="flex gap-8 py-6">
      <input
        class={"p-2 rounded-md border-gray-200 border outline-none"}
        value={props.text}
        onInput={(e) => {
          const text = (e.target as any).value as string;
          props.text.value = text;
          const results = chrono.de.parse(text);
          const result = results.length > 0 ? results[0] : undefined;

          if (result) {
            props.todo.value = {
              id: crypto.randomUUID(),
              start: result.start.date(),
              end: result.end?.date(),
              text: text.replace(result.text, ""),
            };
          } else {
            props.todo.value = {
              id: crypto.randomUUID(),
              text: text,
            };
          }
        }}
      >
      </input>
    </div>
  );
}
