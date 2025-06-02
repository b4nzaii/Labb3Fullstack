import { Request, Response } from "express";
import db from "../models/db";
import fs from "fs";
import path from "path";

// typdefinition 
interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  community_id: number;
  created_at: string;
  preview_image?: string;
}

// Hämta alla inlägg
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

// Hämta ett specifikt inlägg
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

// Hämta inlägg i community
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

//  Skapa nytt inlägg (med bilduppladdning)
export const createPost = (req: Request, res: Response): void => {
  const userId = (req as any).userId;
  const { title, content } = req.body;
  const communityId = parseInt(req.body.community_id); // ⬅️ mycket viktigt!
  const file = req.file;

  const previewImageUrl = file ? `/uploads/${file.filename}` : null;

  console.log("Skapar inlägg:", {
    title,
    content,
    communityId,
    userId,
    previewImageUrl
  });

  try {
    const stmt = db.prepare(`
      INSERT INTO posts (title, content, community_id, user_id, preview_image)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, content, communityId, userId, previewImageUrl);

    const newPost = db.prepare(`
      SELECT posts.*, users.username, communities.name as community_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      JOIN communities ON posts.community_id = communities.id
      WHERE posts.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Fel vid skapande av post:", err);
    res.status(500).json({ message: "Kunde inte skapa inlägg" });
  }
};


// Radera inlägg
export const deletePost = (req: Request, res: Response): void => {
  const { id } = req.params;
  const userId = (req as any).userId;

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as Post;

  if (!post) {
    res.status(404).json({ message: "Inlägget finns inte" });
    return;
  }

  if (post.user_id !== Number(userId)) {
    res.status(403).json({ message: "Du är inte ägare av detta inlägg" });
    return;
  }

  // Om det är en uppladdad bild, ta bort filen från disk
  if (post.preview_image && post.preview_image.startsWith("/uploads/")) {
    const filename = path.basename(post.preview_image); // bara filnamnet
    const filePath = path.resolve("uploads", filename); // pekar på uploads/

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Kunde inte ta bort bildfilen:", err.message);
        // Fortsätt ändå
      }
    });
  }


  db.prepare("DELETE FROM comments WHERE post_id = ?").run(id); // Raderar kommentar kopplad till inlägget
  db.prepare("DELETE FROM post_votes WHERE post_id = ?").run(id);

  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  res.json({ message: "Inlägg raderat" });
};

// Upvote
export const upvotePost = (req: Request, res: Response): void => {
  const postId = parseInt(req.params.id);
  const userId = (req as any).userId;

  db.prepare(`
    INSERT OR REPLACE INTO post_votes (user_id, post_id, vote)
    VALUES (?, ?, 1)
  `).run(userId, postId);

  res.status(200).json({ message: "Liked!" });
};

// Downvote
export const downvotePost = (req: Request, res: Response): void => {
  const postId = parseInt(req.params.id);
  const userId = (req as any).userId;

  db.prepare(`
    INSERT OR REPLACE INTO post_votes (user_id, post_id, vote)
    VALUES (?, ?, -1)
  `).run(userId, postId);

  res.status(200).json({ message: "Disliked!" });
};

// "För dig"-flödet baserat på dina communities
export const getForYouPosts = (req: Request, res: Response): void => {
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
    console.error("Fel vid FYP:", err);
    res.status(500).json({ message: "Kunde inte hämta FYP" });
  }
};
