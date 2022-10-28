import { HandlerContext } from "$fresh/server.ts";

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  return new Response(
    Array.from({ length: 100 }, (_, i) => i + 1).map((i) =>
      (i % 3 ? "" : "Fizz") +
      (i % 5 ? "" : "Buzz") +
      (i % 3 && i % 5 ? i : "")
    ).join("\n"),
  );
};
