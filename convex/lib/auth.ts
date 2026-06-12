import { Doc } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export async function getProfileByTokenIdentifier(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
) {
  return await ctx.db
    .query("profiles")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier),
    )
    .unique();
}

export async function requireProfile(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"profiles">> {
  const identity = await requireIdentity(ctx);
  const profile = await getProfileByTokenIdentifier(
    ctx,
    identity.tokenIdentifier,
  );
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
}
