import express from "express";
import {
  addCarro,
  deleteCarro,
  getCarros,
  updateCarro,
} from "../controllers/carro.js";

const router = express.Router();

router.get("/carros", getCarros);
router.post("/carros", addCarro);
router.put("/carros/:id", updateCarro);
router.delete("/carros/:id", deleteCarro);

export default router;
