import { v } from "convex/values";
import { query, internalQuery, mutation } from "./_generated/server.js";

// Query to get the current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated user's identity from Clerk
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    // Find the user in our users table by clerkId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user;
  },
});

// Mutation to sync current user (called after signup)
export const syncCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;
    const email = identity.email || "";
    const firstName =
      typeof identity.firstName === "string" ? identity.firstName : "";
    const lastName =
      typeof identity.lastName === "string" ? identity.lastName : "";
    const name =
      identity.name ||
      (firstName && lastName ? `${firstName} ${lastName}` : undefined);

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email,
        firstName,
        lastName,
        name,
      });
      return existingUser._id;
    } else {
      // Create new user with default role "student"
      const userId = await ctx.db.insert("users", {
        clerkId,
        email,
        firstName,
        lastName,
        name,
        role: "student",
      });
      return userId;
    }
  },
});

// Internal query to get user by ID (for actions)
export const getUserById = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
