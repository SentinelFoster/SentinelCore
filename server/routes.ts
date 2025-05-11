import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import { insertPostSchema, insertCommentSchema, insertLikeSchema, insertFollowSchema, insertMessageSchema } from "@shared/schema";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Create a memory storage for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const post = await storage.getPostById(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
  });

  app.get("/api/users/:userId/posts", async (req, res) => {
    try {
      const posts = await storage.getPostsByUserId(parseInt(req.params.userId));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  // Comments routes
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByPostId(parseInt(req.params.postId));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Likes routes
  app.get("/api/posts/:postId/likes", async (req, res) => {
    try {
      const likes = await storage.getLikesByPostId(parseInt(req.params.postId));
      res.json(likes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching likes" });
    }
  });

  app.post("/api/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const likeData = insertLikeSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const like = await storage.createLike(likeData);
      res.status(201).json(like);
    } catch (error) {
      res.status(400).json({ message: "Invalid like data" });
    }
  });

  app.delete("/api/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      await storage.deleteLike(req.user!.id, req.body.postId);
      res.status(200).json({ message: "Like removed" });
    } catch (error) {
      res.status(500).json({ message: "Error removing like" });
    }
  });

  // Follow routes
  app.get("/api/users/:userId/followers", async (req, res) => {
    try {
      const followers = await storage.getFollowersByUserId(parseInt(req.params.userId));
      res.json(followers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching followers" });
    }
  });

  app.get("/api/users/:userId/following", async (req, res) => {
    try {
      const following = await storage.getFollowingByUserId(parseInt(req.params.userId));
      res.json(following);
    } catch (error) {
      res.status(500).json({ message: "Error fetching following" });
    }
  });

  app.post("/api/follows", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const followData = insertFollowSchema.parse({
        followerId: req.user!.id,
        followingId: req.body.followingId
      });
      
      const follow = await storage.createFollow(followData);
      res.status(201).json(follow);
    } catch (error) {
      res.status(400).json({ message: "Invalid follow data" });
    }
  });

  app.delete("/api/follows", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      await storage.deleteFollow(req.user!.id, req.body.followingId);
      res.status(200).json({ message: "Unfollowed" });
    } catch (error) {
      res.status(500).json({ message: "Error unfollowing user" });
    }
  });

  // Message routes
  app.get("/api/messages/:otherUserId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const messages = await storage.getMessagesBetweenUsers(
        req.user!.id,
        parseInt(req.params.otherUserId)
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const messageData = insertMessageSchema.parse({
        senderId: req.user!.id,
        receiverId: req.body.receiverId,
        content: req.body.content
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
