import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const getCarros = (_, res) => {
  const q =
    "SELECT carros.*, usuarios.nome AS nome_usuario FROM carros LEFT JOIN usuarios ON carros.usuario_id = usuarios.id";

  db.query(q, (err, data) => {
    console.log(res, data);
    if (err) return res.json(err);
    console.log(res, data);
    return res.status(200).json(data);
  });
};

export const addCarro = (req, res) => {
  console.log("qualquer coisa");
  const { marca, modelo, cor, usuario_id } = req.body;
  console.log(req.body);

  if (!marca || !modelo || !cor || !usuario_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const id = uuidv4(); // Gera um UUID único

  const insertCarQuery =
    "INSERT INTO carros(`id`, `marca`, `modelo`, `cor`, `usuario_id`) VALUES (?, ?, ?, ?, ?)";

  const values = [id, marca, modelo, cor, usuario_id];

  db.query(insertCarQuery, values, (err) => {
    if (err) {
      console.error("Erro ao adicionar veículo:", err);
      return res.status(500).json({ error: "Erro ao acessar banco de dados" });
    }

    return res.status(200).json("Veículo cadastrado com sucesso.");
  });
};

export const updateCarro = (req, res) => {
  const { marca, modelo, cor, usuario_id } = req.body;

  if (!marca || !modelo || !cor || !usuario_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const q =
    "UPDATE carros SET `marca` = ?, `modelo` = ?, `cor` = ?, `usuario_id` = ? WHERE `id` = ?";

  const values = [marca, modelo, cor, usuario_id, req.params.id];

  db.query(q, values, (err, result) => {
    if (err) return res.json(err);

    if (result.changedRows > 0) {
      return res.status(200).json("Veículo atualizado com sucesso.");
    } else {
      // Não houve modificações, então você pode retornar uma mensagem indicando isso
      return res.status(200).json("Nenhuma modificação realizada.");
    }
  });
};

export const deleteCarro = (req, res) => {
  const carroId = req.params.id;

  if (!carroId) {
    return res.status(400).json({ error: "O ID do veículo é obrigatório" });
  }

  const deleteCarQuery = "DELETE FROM carros WHERE id = ?";

  db.query(deleteCarQuery, [carroId], (err, result) => {
    if (err) {
      console.error("Erro ao excluir veículo:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    return res.status(200).json("Veículo deletado com sucesso.");
  });
};
