import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="p-2 border-gray-500 border rounded bg-white hover:bg-gray-200 transition-colors h-full"
    />
  );
}
