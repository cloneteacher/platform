import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal query to get files by topic
 */
export const getFilesByTopic = internalQuery({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("topicFiles")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
  },
});


