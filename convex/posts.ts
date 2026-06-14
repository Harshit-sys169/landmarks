import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProfile } from "./lib/auth";

export const createPost = mutation({
  args: {
  imageStorageId: v.optional(v.id("_storage")),
  parkName: v.string(),
  caption: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
},
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);

    return await ctx.db.insert("posts", {
      authorId: profile._id,
      imageStorageId: args.imageStorageId,
      parkName: args.parkName,
      caption: args.caption,
      latitude: args.latitude,
      longitude: args.longitude,
    });
  },
});

export const getFeedPosts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db.query("posts").order("desc").paginate(args.paginationOpts);
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const profile = await requireProfile(ctx);
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", profile._id),
      )
      .unique();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    }

    await ctx.db.insert("likes", {
      postId: args.postId,
      userId: profile._id,
    });
    return { liked: true };
  },
});
