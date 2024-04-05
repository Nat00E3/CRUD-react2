// routes.js

import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
  getUserById,
} from "../controllers/user.js";
import {
  addCarro,
  deleteCarro,
  getCarros,
  updateCarro,
} from "../controllers/carro.js";

const router = express.Router();

// Rotas para usuários
router.get("/usuarios", getUsers);
router.get("/usuarios/:id", getUserById);
router.post("/usuarios", addUser);
router.put("/usuarios/:id", updateUser);
router.delete("/usuarios/:id", deleteUser);

// Rotas para carros
router.get("/carros", getCarros);
router.post("/carros", addCarro);
router.put("/carros/:id", updateCarro);
router.delete("/carros/:id", deleteCarro);

export default router;
