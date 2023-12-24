import { InferModel, relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const profile = sqliteTable("profile", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  bio: text("bio", { length: 500 }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const userRelation = relations(users, ({ one, many }) => {
  return {
    profile: one(profile, {
      fields: [users.id],
      references: [profile.userId],
    }),
    posts: many(posts),
  };
});

export const posts = sqliteTable("posts", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const postRelation = relations(posts, ({ one }) => {
  return {
    user: one(users, {
      fields: [posts.authorId],
      references: [users.id],
    }),
  };
});

export type Users = InferModel<typeof users>;
export type Profile = InferModel<typeof profile>;
export type Posts = InferModel<typeof posts>;
