import { Signal } from "@preact/signals";
import { T } from "../translations.ts";
import { custom } from "../parser.ts";

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
    <div class="w-full">
      <input
        autofocus
        placeholder={T("PLACEHOLDER")}
        class={"p-2 rounded-md border-gray-200 border outline-none w-full"}
        value={props.text}
        onInput={(e) => {
          const text = (e.target as HTMLInputElement).value as string;
          props.text.value = text;
          const results = custom.parse(text);
          const result = results.length > 0 ? results[0] : undefined;

          if (result) {
            props.todo.value = {
              id: crypto.randomUUID(),
              start: result.start.date(),
              end: result.end?.date(),
              text: text.replace(result.text, "").trim(),
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
