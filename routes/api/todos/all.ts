import { FreshContext } from "$fresh/server.ts";
import { Todo } from "../../../components/DateInput.tsx";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const kv = await Deno.openKv();
    const iter = kv.list<Todo>({ prefix: ["todos"] });
    const todos = [];
    for await (const res of iter) todos.push(res.value);

    return new Response(JSON.stringify(todos), {
        headers: {
            "Content-Type": "application/json",
        }
    });
};
