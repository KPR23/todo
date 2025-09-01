import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./lib/withUser";

export const getCompany = authenticatedQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("company")
			.filter((q) => q.eq(q.field("user"), ctx.user._id))
			.collect();
	},
});

export const createCompany = authenticatedMutation({
	args: {
		name: v.string(),
		rate: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("company", {
			user: ctx.user._id,
			name: args.name,
			rate: args.rate,
		});
	},
});
