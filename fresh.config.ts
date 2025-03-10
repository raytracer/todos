import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import ExpiryMap from "npm:expiry-map@2.0.0";
import { Todo } from "./components/DateInput.tsx";
import { Bot } from "https://deno.land/x/grammy@v1.34.0/mod.ts";
import { startOfDay } from "npm:date-fns@4.1.0/startOfDay";
import { setMinutes } from "npm:date-fns@4.1.0/setMinutes";
import { getMinutes } from "npm:date-fns@4.1.0/getMinutes";
import { getHours } from "npm:date-fns@4.1.0/getHours";
import { setHours } from "npm:date-fns@4.1.0/setHours";
import { addDays } from "npm:date-fns@4.1.0/addDays";
import { custom } from "./parser.ts";

const oldTodos = new ExpiryMap<string, Todo>(1000 * 240);

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
const CHAT_ID = Deno.env.get("CHAT_ID");

const isBuildMode = Deno.args.includes("build");

if (BOT_TOKEN) {
  const bot = new Bot(BOT_TOKEN);
  bot.command("start", (ctx) => ctx.reply("Es kann losgehen"));
  bot.on("message", async (ctx) => {
    const text = ctx.message.text;
    if (text) {
      const results = custom.parse(text);
      const result = results.length > 0 ? results[0] : undefined;

      let todo: Todo | undefined = undefined;

      if (result) {
        todo = {
          id: crypto.randomUUID(),
          start: result.start.date(),
          end: result.end?.date(),
          text: text.replace(result.text, "").trim(),
        };
      } else {
        todo = {
          id: crypto.randomUUID(),
          text: text,
        };
      }

      const kv = await Deno.openKv();
      const key = ["todos", todo.id]
      kv.set(key, todo);
    }
  });
  // bot.start();
}

if (!isBuildMode) {
  Deno.cron("notification cron", { minute: { every: 1 } }, async () => {
    const kv = await Deno.openKv();
    const iter = kv.list<Todo>({ prefix: ["todos"] });
    const now = new Date();
    for await (const res of iter) {
      if (res.value.start) {
        if (Math.abs(now.getTime() - new Date(res.value.start).getTime()) < 90 * 1000 && !oldTodos.has(res.value.id)) {
          oldTodos.set(res.value.id, res.value);
          if (BOT_TOKEN && CHAT_ID) {
            const bot = new Bot(BOT_TOKEN);
            bot.api.sendMessage(CHAT_ID, res.value.text);
          }
        }
      }
    }
  });

  Deno.cron("rollover cron", { hour: { every: 1 } }, async () => {
    const kv = await Deno.openKv();
    const iter = kv.list<Todo>({ prefix: ["todos"] });
    const dayStart = startOfDay(new Date());

    for await (const res of iter) {
      if (res.value.start && res.value.end === undefined) {
        const parsedDate = new Date(res.value.start)
        if (parsedDate < dayStart) {
          const newDate = setHours(setMinutes(dayStart, getMinutes(parsedDate)), getHours(parsedDate));
          const updatedTodo = { ...res.value, start: newDate };
          await kv.set(res.key, updatedTodo);
        }
      } else {
        const newDate = setHours(addDays(dayStart, 1), 10);
        const updatedTodo = { ...res.value, start: newDate };
        await kv.set(res.key, updatedTodo);
      }
    }
  });
}


export default defineConfig({
  plugins: [tailwind()],
});
