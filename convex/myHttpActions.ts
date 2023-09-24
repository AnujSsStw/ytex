import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const doSomething = httpAction(async (ctx, request) => {
  const { data, apiKey } = (await request.json()) as {
    data: string[];
    apiKey: string;
  };

  await ctx.runAction(internal.ytAction.getYtData, {
    apiKey,
    data,
  });

  return new Response("hoe", {
    status: 200,
    // CORS headers
    headers: new Headers({
      // e.g. https://mywebsite.com
      "Access-Control-Allow-Origin": "https://www.youtube.com",
      Vary: "origin",
    }),
  });
});
