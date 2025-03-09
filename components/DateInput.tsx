// deno-lint-ignore-file no-explicit-any
import { effect, Signal, useSignal } from "@preact/signals";
import { T } from "../translations.ts";
import { custom } from "../parser.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export type Todo = {
  id: string;
  start?: Date;
  end?: Date;
  text: string;
};

type DateProps = {
  todo: Signal<Todo | null>;
  text: Signal<string>;
  speech: Signal<boolean>;
};

let recognition: any;

export default function DateInput(props: DateProps) {
  const recognitionStarted = useSignal<boolean>(false);
  effect(() => {
    if (IS_BROWSER) {
      if (props.speech.value) {
        if (recognition && !recognitionStarted.value) {
          console.log(recognitionStarted)
          recognition.start();
          recognitionStarted.value = true;
        } else if (!recognition) {
          recognition = new (window as any).webkitSpeechRecognition();
          recognition.lang = "de-DE";
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = function (event: any) {
            const text = event.results[0][0].transcript;
            processText(text);
          };
          recognition.start();
          recognitionStarted.value = true;
        }
      } else {
        if (recognition) {
          recognition.stop();
          recognitionStarted.value = false;
        }
      }
    }
  });

  const processText = (text: string) => {
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
  };

  return (
    <div class="w-full">
      <input
        autofocus
        type="search"
        placeholder={T("PLACEHOLDER")}
        class={"p-2 rounded-md border-gray-200 border outline-none w-full"}
        value={props.text}
        onInput={(e) => {
          console.log("input");
          const text = (e.target as HTMLInputElement).value as string;
          processText(text);
        }}
      >
      </input>
    </div>
  );
}
