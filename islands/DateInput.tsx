import * as chrono from "npm:chrono-node@2.7.7";
import { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

export type Todo = {
  start?: Date;
  end?: Date;
  text: string;
};

type DateProps = {
  todo: Signal<Todo | null>;
};

export default function DateInput(props: DateProps) {
  return (
    <div class="flex gap-8 py-6">
      <input
        class={"p-2 rounded-md border-gray-200 border outline-none"}
        onInput={(e) => {
          const text = (e.target as any).value as string;
          const results = chrono.de.parse(text);
          const result = results.length > 0 ? results[0] : undefined;

          if (result) {
            console.log("i was here");
            props.todo.value = {
              start: result.start.date(),
              end: result.end?.date(),
              text: text.replace(result.text, ""),
            };
          } else {
            props.todo.value = null;
          }
        }}
      >
      </input>
      <Button>Add</Button>
    </div>
  );
}
