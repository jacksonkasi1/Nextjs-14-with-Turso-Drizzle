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
  title: text("title", { length: 200 }).notNull(),
  content: text("content", { length: 500 }).notNull(),
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

export const postRelation = relations(posts, ({ one, many }) => {
  return {
    user: one(users, {
      fields: [posts.authorId],
      references: [users.id],
    }),
    postCategories: many(categories),
  };
});

export const categories = sqliteTable("categories", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const categoryRelation = relations(categories, ({ many }) => {
  return {
    posts: many(postCategories),
  };
});

export const postCategories = sqliteTable("post_categories", {
  id: integer("id").notNull().primaryKey({ autoIncrement: true }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
}
);

export const postCategoryRelation = relations(
  postCategories,
  ({ one, many }) => {
    return {
      post: one(posts, {
        fields: [postCategories.postId],
        references: [posts.id],
      }),
      category: one(categories, {
        fields: [postCategories.categoryId],
        references: [categories.id],
      }),
    };
  },
);

export type Users = InferModel<typeof users>;
export type Profile = InferModel<typeof profile>;
export type Posts = InferModel<typeof posts>;
export type Categories = InferModel<typeof categories>;
export type PostCategories = InferModel<typeof postCategories>;