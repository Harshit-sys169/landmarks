import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    tokenIdentifier: v.string(),
    username: v.optional(v.string()),
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_username", ["username"]),

  posts: defineTable({
    authorId: v.id("profiles"),
    imageStorageId: v.optional(v.id("_storage")),
    caption: v.optional(v.string()),
    parkName: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("profiles"),
    body: v.string(),
  }).index("by_post", ["postId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("profiles"),
  })
    .index("by_post", ["postId"])
    .index("by_post_and_user", ["postId", "userId"]),
});
