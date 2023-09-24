import { httpRouter } from "convex/server";
import { doSomething } from "./myHttpActions";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/test",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com
          "Access-Control-Allow-Origin": "https://youtube.com",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Content-Type": "application/json",
        }),
      });
    } else {
      return new Response();
    }
  }),
});

// Define additional routes
http.route({
  path: "/test",
  method: "POST",
  handler: doSomething,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
