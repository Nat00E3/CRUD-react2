import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const getUsers = (_, res) => {
  const q = "SELECT * FROM usuarios";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const getUserById = (req, res) => {
  const getUserQuery = "SELECT * FROM usuarios WHERE `id` = ?";
  db.query(getUserQuery, [req.params.id], (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const addUser = (req, res) => {
  // Gerar um UUID único
  const userId = uuidv4();

  // Verificar se o CPF já existe no banco
  const checkCPFQuery = "SELECT * FROM usuarios WHERE `CPF` = ?";
  db.query(checkCPFQuery, [req.body.CPF], (err, data) => {
    if (err) {
      console.error("Erro ao verificar CPF:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    if (data.length > 0) {
      return res.status(400).json({ error: "CPF já existente." });
    } else {
      const q =
        "INSERT INTO usuarios(`id`, `nome`, `CPF`, `data_nasc`) VALUES(?, ?, ?, ?)";
      const values = [userId, req.body.nome, req.body.CPF, req.body.data_nasc];

      db.query(q, values, (err) => {
        if (err) {
          console.error("Erro ao adicionar usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro interno do servidor ao adicionar usuário." });
        }

        return res
          .status(201)
          .json({ message: "Usuário criado com sucesso.", userId });
      });
    }
  });
};

export const updateUser = (req, res) => {
  const { nome, CPF, data_nasc } = req.body;

  if (!nome || !CPF || !data_nasc) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const q =
    "UPDATE usuarios SET `nome` = ?, `CPF` = ?, `data_nasc` = ? WHERE `id` = ?";

  const values = [nome, CPF, data_nasc, req.params.id];

  db.query(q, values, (err, result) => {
    if (err) {
      console.error("Erro ao executar a consulta SQL:", err);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao atualizar o usuário." });
    }

    if (result.changedRows > 0) {
      console.log("Usuário atualizado com sucesso.");
      return res.status(200).json("Usuário atualizado com sucesso.");
    } else {
      // Não houve modificações, então você pode retornar uma mensagem indicando isso
      console.log("Nenhuma modificação realizada.");
      return res.status(200).json("Nenhuma modificação realizada.");
    }
  });
};


export const deleteUser = (req, res) => {
  // Primeiro, deletamos todos os carros associados ao usuário
  const deleteCarsQuery = "DELETE FROM carros WHERE `usuario_id` = ?";
  db.query(deleteCarsQuery, [req.params.id], (err) => {
    if (err) return res.json(err);

    // Depois que todos os carros são deletados, podemos deletar o usuário
    const deleteUserQuery = "DELETE FROM usuarios WHERE `id` = ?";
    db.query(deleteUserQuery, [req.params.id], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Usuário deletado com sucesso.");
    });
  });
};
