import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getProfileByTokenIdentifier,
  requireIdentity,
} from "./lib/auth";

export const createProfileOnFirstLogin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const existing = await getProfileByTokenIdentifier(
      ctx,
      identity.tokenIdentifier,
    );
    if (existing) {
      return existing._id;
    }

    const displayName =
      identity.name ?? identity.email ?? "User";

    return await ctx.db.insert("profiles", {
      tokenIdentifier: identity.tokenIdentifier,
      displayName,
    });
  },
});

export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await getProfileByTokenIdentifier(ctx, identity.tokenIdentifier);
  },
});
