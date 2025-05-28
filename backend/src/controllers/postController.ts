import { Request, Response } from "express";
import db from "../models/db";

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  community_id: number;
  created_at: string;
  preview_image?: string;
}

export const getAllPosts = (req: Request, res: Response): void => {
  const posts = db.prepare(`
    SELECT posts.*, users.username, communities.name as community_name,
      (SELECT COUNT(*) FROM post_votes WHERE post_id = posts.id AND vote = 1) as upvotes, 
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN communities ON posts.community_id = communities.id
    ORDER BY posts.created_at DESC
  `).all();

  res.json(posts);
};

export const getPostById = (req: Request, res: Response): void => {
  const { id } = req.params;

  const post = db.prepare(`
    SELECT posts.*, users.username, communities.name as community_name,
      (SELECT COUNT(*) FROM post_votes WHERE post_id = posts.id AND vote = 1) as upvotes,
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN communities ON posts.community_id = communities.id
    WHERE posts.id = ?
  `).get(id);

  if (!post) {
    res.status(404).json({ message: "Inlägget hittades inte" });
    return;
  }

  res.json(post);
};
// Hämta inlägg för specifika communities ⬇️
export const getPostsByCommunity = (req: Request, res: Response): void => {
  const { name } = req.params;

  const posts = db.prepare(`
    SELECT posts.*, users.username, communities.name as community_name,
      (SELECT COUNT(*) FROM post_votes WHERE post_id = posts.id AND vote = 1) as upvotes,
      (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments
    FROM posts
    JOIN users ON posts.user_id = users.id
    JOIN communities ON posts.community_id = communities.id
    WHERE communities.name = ?
    ORDER BY posts.created_at DESC
  `).all(name);

  res.json(posts);
};
// För att skapa nya inlägg ⬇️
export const createPost = (req: Request, res: Response): void => {
  const { title, content, link, communityId } = req.body;
  const userId = (req as any).userId;

  if (!title || !communityId) {
    res.status(400).json({ message: "Titel och community krävs" });
    return;
  }

  const preview_image = link?.startsWith("http") ? link : null;

  const stmt = db.prepare(`
    INSERT INTO posts (title, content, community_id, user_id, preview_image)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(title, content, communityId, userId, preview_image); // SKapa nytt inlägg
  const newPost = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid); // Hämtar det nya inlägget direkt efter skapandet

  res.status(201).json(newPost);

  console.log("Post mottaget:", {
    title,
    content,
    link,
    communityId,
    userId,
  });
};

export const deletePost = (req: Request, res: Response): void => {
  const { id } = req.params;
  const userId = (req as any).userId;

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as Post; // Hämtar inlägget för att kontrollera ownershipet

  if (!post) {
    res.status(404).json({ message: "Inlägget finns inte" });
    return;
  }

  if (post.user_id !== userId) {
    res.status(403).json({ message: "Du är inte ägare av detta inlägg" });
    return;
  }

  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  res.json({ message: "Inlägg raderat" });
};

export const upvotePost = (req: Request, res: Response): void => {
  const postId = parseInt(req.params.id);
  const userId = (req as any).userId;

  db.prepare(`INSERT OR REPLACE INTO post_votes (user_id, post_id, vote) VALUES (?, ?, 1)`).run(userId, postId); // Använder INSERT OR REPLACE för att uppdatera ifall användaren redan har likat inlägget
  res.status(200).json({ message: "Liked!" });
};

export const downvotePost = (req: Request, res: Response): void => {
  const postId = parseInt(req.params.id);
  const userId = (req as any).userId;

  db.prepare(`INSERT OR REPLACE INTO post_votes (user_id, post_id, vote) VALUES (?, ?, -1)`).run(userId, postId); // Samma som innan fast om man dislikat
  res.status(200).json({ message: "Disliked!" });
};
// postController.ts
export const getForYouPosts = (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const posts = db.prepare(`
        SELECT posts.*, users.username, communities.name as community_name,
          (SELECT COUNT(*) FROM post_votes WHERE post_id = posts.id AND vote = 1) as upvotes,
          (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as comments
        FROM posts
        JOIN users ON posts.user_id = users.id
        JOIN communities ON posts.community_id = communities.id
        WHERE posts.community_id IN (
          SELECT community_id FROM user_communities WHERE user_id = ?
        )
        ORDER BY posts.created_at DESC
      `).all(userId);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kunde inte hämta FYP" });
  }
};
