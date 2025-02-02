// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_todos_add from "./routes/api/todos/add.ts";
import * as $api_todos_all from "./routes/api/todos/all.ts";
import * as $api_todos_delete from "./routes/api/todos/delete.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $Todos from "./islands/Todos.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/todos/add.ts": $api_todos_add,
    "./routes/api/todos/all.ts": $api_todos_all,
    "./routes/api/todos/delete.ts": $api_todos_delete,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
  },
  islands: {
    "./islands/Todos.tsx": $Todos,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
