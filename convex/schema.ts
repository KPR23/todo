import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index('by_token', ['tokenIdentifier']),
  todos: defineTable({
    user: v.id('users'),
    projectId: v.id('projects'),
    labelId: v.id('labels'),
    taskName: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    dueTime: v.optional(v.number()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    isCompleted: v.boolean(),
    embedding: v.optional(v.array(v.float64())),
  }).vectorIndex('by_embedding', {
    vectorField: 'embedding',
    dimensions: 1536,
    filterFields: ['user'],
  }),
  subTodos: defineTable({
    user: v.id('users'),
    projectId: v.id('projects'),
    labelId: v.id('labels'),
    parentId: v.id('todos'),
    taskName: v.string(),
    description: v.optional(v.string()),
    dueDate: v.number(),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    isCompleted: v.boolean(),
    embedding: v.optional(v.array(v.float64())),
  }).vectorIndex('by_embedding', {
    vectorField: 'embedding',
    dimensions: 1536,
    filterFields: ['user'],
  }),
  labels: defineTable({
    user: v.union(v.id('users'), v.null()),
    name: v.string(),
    type: v.union(v.literal('user'), v.literal('system')),
  }),
  projects: defineTable({
    user: v.union(v.id('users'), v.null()),
    name: v.string(),
    type: v.union(v.literal('user'), v.literal('system')),
  }),
});
