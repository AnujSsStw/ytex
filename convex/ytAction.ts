"use node";
import jwt from "jsonwebtoken";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const getYtData = internalAction({
  args: { apiKey: v.string(), data: v.array(v.string()) },
  handler: async (ctx, args) => {
    const decoded = jwt.verify(args.apiKey, "sheeeeee");

    const p = [];
    for (const yt_video_id of args.data) {
      const res = fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${yt_video_id}&part=id, snippet, contentDetails, statistics&key=AIzaSyDgFURw5aK4UW3h32sXda83h1WLkJasUMQ`
      );
      p.push(res);
    }

    const res = await Promise.allSettled(p);

    console.log("res", res.length);

    for (const d of res) {
      if (d.status === "rejected") {
        console.log("rejected");
        continue;
      }
      const { items } = await d.value.json();
      const res = await ctx.runMutation(internal.yt.insertYt, {
        id: items[0].id,
        title: items[0].snippet.title,
        duration: items[0].contentDetails.duration,
        published_at: items[0].snippet.publishedAt,
        views: items[0].statistics.viewCount,
        categoryId: items[0].snippet.categoryId,
        seen: false,
        channelTitle: items[0].snippet.channelTitle,
        thumbnailLink: items[0].snippet.thumbnails.default.url,
      });

      await ctx.runMutation(internal.yt.setCategory, {
        categoryId: items[0].snippet.categoryId,
        // @ts-ignore
        userId: decoded.userId as string,
        value: res,
      });
    }
  },
});
