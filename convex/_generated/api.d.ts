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
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as compatibility from "../compatibility.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as providers from "../providers.js";
import type * as reviews from "../reviews.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";
import type * as stations from "../stations.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  auth: typeof auth;
  bookings: typeof bookings;
  compatibility: typeof compatibility;
  documents: typeof documents;
  http: typeof http;
  providers: typeof providers;
  reviews: typeof reviews;
  router: typeof router;
  sampleData: typeof sampleData;
  stations: typeof stations;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
