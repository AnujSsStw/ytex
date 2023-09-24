import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { categories, categoryMap } from "./utils";
import { Id } from "./_generated/dataModel";

export const insertYt = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("yt", { ...args });
    return id;
  },
});

// when user generates a new api key, we need to insert it into the db
export const userInsert = mutation({
  args: {
    name: v.string(),
    id: v.string(),
    email: v.string(),
    key: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("user", {
      clerkId: args.id,
      email: args.email,
      apiKey: args.key,
      categoryMap: categoryMap,
      prefrence: ["Random"],
      name: args.name,
    });
  },
});

export const setCategory = internalMutation({
  args: { userId: v.string(), categoryId: v.string(), value: v.id("yt") },
  handler: async (ctx, args) => {
    const usrDoc = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.userId))
      .unique();

    if (!usrDoc) return;
    const v = categories.find((c) => c.id === parseInt(args.categoryId));
    if (!v) return;

    console.log("v", v);

    await ctx.db.patch(usrDoc._id, {
      categoryMap: {
        ...usrDoc.categoryMap,
        Random: [...usrDoc.categoryMap["Random"], args.value],
        [v.name]: [...usrDoc.categoryMap[v.name], args.value],
      },
    });
  },
});

export const userApiKey = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const key = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.id))
      .unique();

    if (!key) {
      return null;
    }
    return key.apiKey;
  },
});

export const userCategories = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.id))
      .unique();

    if (!user) return null;

    const categoriesWithValues = [];

    for (const category in user.categoryMap) {
      if (user.categoryMap[category].length > 0) {
        categoriesWithValues.push(category);
      }
    }

    return {
      currentPrefrence: user.prefrence,
      prefs: categoriesWithValues,
    };
  },
});

export const userPrefrence = mutation({
  args: { id: v.string(), prefrence: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.id))
      .unique();

    if (!user) return null;

    await ctx.db.patch(user._id, { prefrence: args.prefrence });
  },
});

export const forChart = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.id))
      .unique();

    if (!user) return null;

    type DataItem = {
      name: string;
      value: number;
    };
    const arr: DataItem[] = [];

    for (const category in user.categoryMap) {
      if (user.categoryMap[category].length > 0) {
        if (category === "Random") continue;
        arr.push({
          name: category,
          value: user.categoryMap[category].length,
        });
      }
    }

    return arr;
  },
});

export const updateYTandUser = internalMutation({
  args: { id: v.id("yt"), userId: v.id("user") },
  handler: async (ctx, args) => {
    const yt = await ctx.db.get(args.id);
    const user = await ctx.db.get(args.userId);

    if (!yt || !user) return null;
    const category = categories.find((c) => c.id === parseInt(yt.categoryId));

    if (!category) return null;

    await ctx.db.patch(yt._id, { seen: true });
    await ctx.db.patch(user._id, {
      categoryMap: {
        ...user.categoryMap,
        Random: user.categoryMap["Random"].filter(
          (id: string) => id !== yt._id
        ),
        [category.name]: user.categoryMap[category.name].filter(
          (id: string) => id !== yt._id
        ),
      },
    });
  },
});
