import { FreshContext } from "$fresh/server.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const kv = await Deno.openKv();
    kv.delete(["todos", await _req.json()])

    return new Response();
};
