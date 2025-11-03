import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    clerkId: v.string(), // ID de Clerk para la relación
  }).index("by_clerk_id", ["clerkId"]),
});
