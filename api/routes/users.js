import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
  getUserById,
} from "../controllers/user.js";

const router = express.Router();

router.get("/usuarios", getUsers);
router.get("/usuarios/:id", getUserById);
router.post("/usuarios", addUser);
router.put("/usuarios/:id", updateUser);
router.delete("/usuarios/:id", deleteUser);

export default router;
