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

export const deleteSession = authenticatedMutation({
	args: { sessionId: v.id("workSessions") },
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.sessionId);
		if (!session || session.user !== ctx.user._id) {
			throw new Error("[Convex] Session not found or unauthorized");
		}
		await ctx.db.delete(args.sessionId);
	},
});

export const deleteMultipleSessions = authenticatedMutation({
	args: { sessionIds: v.array(v.id("workSessions")) },
	handler: async (ctx, args) => {
		for (const sessionId of args.sessionIds) {
			const session = await ctx.db.get(sessionId);
			if (!session || session.user !== ctx.user._id) {
				throw new Error("[Convex] Session not found or unauthorized");
			}
			await ctx.db.delete(sessionId);
		}
	},
});
