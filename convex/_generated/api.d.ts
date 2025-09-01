/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as company from "../company.js";
import type * as labels from "../labels.js";
import type * as lib_withUser from "../lib/withUser.js";
import type * as projects from "../projects.js";
import type * as todos from "../todos.js";
import type * as users from "../users.js";
import type * as workSessions from "../workSessions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  company: typeof company;
  labels: typeof labels;
  "lib/withUser": typeof lib_withUser;
  projects: typeof projects;
  todos: typeof todos;
  users: typeof users;
  workSessions: typeof workSessions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
