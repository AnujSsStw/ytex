import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  yt: defineTable({
    id: v.string(),
    title: v.string(),
    duration: v.string(),
    published_at: v.string(),
    views: v.string(),
    data: v.optional(v.any()),
    categoryId: v.string(),
    seen: v.boolean(),

    thumbnailLink: v.string(),
    channelTitle: v.string(),
  }).index("by_catedgoryId", ["categoryId"]),
  user: defineTable({
    clerkId: v.string(),
    email: v.string(),
    prefrence: v.optional(v.any()),
    categoryMap: v.optional(v.any()),
    apiKey: v.string(),
    name: v.string(),
  }).index("by_clerkId", ["clerkId"]),
});
