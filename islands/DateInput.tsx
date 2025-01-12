import * as chrono from "npm:chrono-node@2.7.7";
import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

export default function DateInput() {
  const d = useSignal<Date | undefined>(undefined);

  return (
    <div class="flex gap-8 py-6">
        <input class={"p-2 rounded-md border-gray-200 border outline-none"} onChange={(e) => {d.value = (chrono.de.parseDate((e.target as any).value))}}></input>
        <Button>Add</Button>
        {d}
    </div>
  );
}
