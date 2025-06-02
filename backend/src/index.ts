import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import db from './models/db';
import authRoutes from './routes/authRoutes';
import postRoutes from "./routes/postRoutes";
import communityRoutes from "./routes/communityRoutes"
import commentRoutes from "./routes/commentRoutes";
import path from "path";
dotenv.config();
// Users
db.exec("PRAGMA foreign_keys = ON;");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  profile_description TEXT,
  profile_picture TEXT,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

//Tabell för communities
db.exec(`
  CREATE TABLE IF NOT EXISTS communities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP);
  `);
// kopplingstabell mellan användare och communities
db.exec(`
  CREATE TABLE IF NOT EXISTS user_communities(
  user_id INTEGER,
  community_id INTEGER,
  joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, community_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (community_id) REFERENCES communities(id)
  );
  `)
// Skapa posts-tabell
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  community_id INTEGER,
  user_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (community_id) REFERENCES communities(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
  );
    `)
// tabell för comments
db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        post_id INTEGER,
        user_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);
// upvotes/downvotes på inlägg
db.exec(`
      CREATE TABLE IF NOT EXISTS post_votes (
        user_id INTEGER,
        post_id INTEGER,
        vote INTEGER, -- 1 = upvote, -1 = downvote
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      );
    `);

db.exec(`
  CREATE TABLE IF NOT EXISTS friends (
  user_id INTEGER,
  friend_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
);
  `)

const postCols = db.prepare("PRAGMA table_info(posts);").all();
const hasPreviewImage = postCols.some((col: any) => col.name === "preview_image");
if (!hasPreviewImage) {
  db.exec(`ALTER TABLE posts ADD COLUMN preview_image TEXT;`);
}
const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/posts", postRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/comments", commentRoutes)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});

