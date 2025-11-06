import { httpAction } from "./_generated/server.js";
import { internal } from "./_generated/api.js";
import { Webhook } from "svix";
import { internalMutation } from "./_generated/server.js";
import { v } from "convex/values";

// HTTP action to handle Clerk webhooks
export const webhook = httpAction(async (ctx, request) => {
  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const body = await request.text();

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const userData = evt.data;

    // Extract user information
    const clerkId = userData.id;
    const email = userData.email_addresses?.[0]?.email_address || "";
    const firstName = userData.first_name || "";
    const lastName = userData.last_name || "";
    const name =
      firstName && lastName
        ? `${firstName} ${lastName}`
        : firstName || lastName || undefined;

    // Extract role from public metadata (set during sign-up or admin creation)
    const role = userData.public_metadata?.role || "student";

    console.log("Processing user:", { clerkId, email, firstName, lastName, role });

    try {
      // Call internal mutation to sync user
      await ctx.runMutation(internal.clerk.syncUser, {
        clerkId,
        email,
        firstName,
        lastName,
        name,
        role,
      });
      console.log("User synced successfully");
    } catch (error) {
      console.error("Error syncing user:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  return new Response("Webhook processed", { status: 200 });
});

// Internal mutation to sync user data
export const syncUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("teacher"), v.literal("student")),
  },
  handler: async (ctx, args) => {
    console.log("Syncing user:", args);

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      console.log("User exists, updating:", existingUser._id);
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        name: args.name,
        role: args.role,
      });
    } else {
      console.log("Creating new user");
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        name: args.name,
        role: args.role,
      });
      console.log("User created with ID:", userId);
    }
  },
});
