import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import ExpiryMap from "npm:expiry-map@2.0.0";
import { Todo } from "./components/DateInput.tsx";
import { Bot } from "https://deno.land/x/grammy@v1.34.0/mod.ts";

const oldTodos = new ExpiryMap<string, Todo>(1000 * 240);

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
const CHAT_ID = Deno.env.get("CHAT_ID");

const isBuildMode = Deno.args.includes("build");

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
}


export default defineConfig({
  plugins: [tailwind()],
});
