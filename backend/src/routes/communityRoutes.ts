import express from "express";
import { createCommunity, getAllCommunities, joinCommunity, getUserCommunities, getCommunityByName } from "../controllers/communityController"
import { authenticate } from "../middleware/authMiddleware"
import db from "../models/db";

const router = express.Router()

router.get("/", getAllCommunities)

router.post("/create", authenticate, createCommunity)

router.post("/join", authenticate, joinCommunity)

router.get("/mine", authenticate, getUserCommunities)

router.get("/name/:name", getCommunityByName);


export default router;