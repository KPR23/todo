import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./lib/withUser";

export const getSessions = authenticatedQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("workSessions")
			.filter((q) => q.eq(q.field("user"), ctx.user._id))
			.collect();
	},
});

export const createSession = authenticatedMutation({
	args: {
		company: v.id("company"),
		startTime: v.number(),
		endTime: v.number(),
	},
	handler(ctx, args) {
		return ctx.db.insert("workSessions", {
			user: ctx.user._id,
			companyId: args.company,
			startTime: args.startTime,
			endTime: args.endTime,
		});
	},
});
