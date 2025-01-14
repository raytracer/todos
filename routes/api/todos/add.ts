import { FreshContext } from "$fresh/server.ts";
import { Todo } from "../../../components/DateInput.tsx";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  const body = await _req.json() as Todo;

  const kv = await Deno.openKv();
  const key = ["todos", body.id]
  kv.set(key, body);

  return new Response();
};
