import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  a, Td {
    cursor: pointer; /* Define o cursor para uma mão em todos os links */
  }
`;

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Select = styled.select`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;
const CancelButton = styled(Button)`
  background-color: #dc3545;
`;

const FormCarro = ({ getCarros, onEdit, setOnEdit }) => {
  const carroRef = useRef();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [carroData, setCarroData] = useState({
    marca: "",
    modelo: "",
    cor: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8800/usuarios")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  }, []);

  useEffect(() => {
    if (onEdit) {
      setSelectedUserId(onEdit.usuario_id);
      setCarroData({
        marca: onEdit.marca,
        modelo: onEdit.modelo,
        cor: onEdit.cor,
      });
    } else {
      setCarroData({ marca: "", modelo: "", cor: "" }); // Limpar os dados do formulário se não estiver editando
    }
  }, [onEdit]);

  const [toastId, setToastId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const carro = carroRef.current;

    if (
      !carro.marca.value ||
      !carro.modelo.value ||
      !carro.cor.value ||
      !selectedUserId
    ) {
      const id = toast.warn("Preencha todos os campos!");
      setToastId(id);
    } else {
      const data = {
        marca: carro.marca.value,
        modelo: carro.modelo.value,
        cor: carro.cor.value,
        usuario_id: selectedUserId,
      };

      try {
        if (onEdit) {
          await axios.put(`http://localhost:8800/carros/${onEdit.id}`, data);
          toast.success("Veículo atualizado com sucesso.");
        } else {
          await axios.post("http://localhost:8800/carros", data);
          toast.success("Veículo cadastrado com sucesso.");
        }
        carro.marca.value = "";
        carro.modelo.value = "";
        carro.cor.value = "";
        setSelectedUserId("");
        setOnEdit(null);
        getCarros();
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    if (onEdit) {
      const carro = carroRef.current;

      carro.marca.value = onEdit.marca;
      carro.modelo.value = onEdit.modelo;
      carro.cor.value = onEdit.cor;
      setSelectedUserId(onEdit.usuario_id);
    }
  }, [onEdit]);

  const handleCancelEditCarro = () => {
    setOnEdit(null);
    setSelectedUserId("");
    const carro = carroRef.current;

    carro.marca.value = "";
    carro.modelo.value = "";
    carro.cor.value = "";
    if (toastId) {
      toast.dismiss(toastId);
      setToastId(null);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8800/usuarios")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
      });
  }, [selectedUserId]);

  return (
    <>
      <GlobalStyle />
      <FormContainer ref={carroRef} onSubmit={handleSubmit}>
        <InputArea>
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" name="marca" defaultValue={carroData.marca} />
        </InputArea>
        <InputArea>
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" name="modelo" defaultValue={carroData.modelo} />
        </InputArea>
        <InputArea>
          <Label htmlFor="cor">Cor</Label>
          <Input id="cor" name="cor" defaultValue={carroData.cor} />
        </InputArea>
        <InputArea>
          <Label htmlFor="usuario">Usuário</Label>
          <Select
            id="usuario"
            name="usuario"
            value={selectedUserId}
            onChange={(e) => {
              const userId = e.target.value;
              setSelectedUserId(userId);
            }}
            onClick={() => {
              axios
                .get("http://localhost:8800/usuarios")
                .then((response) => {
                  setUsers(response.data);
                })
                .catch((error) => {
                  console.error("Erro ao buscar usuários:", error);
                });
            }}
          >
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nome}
              </option>
            ))}
          </Select>
        </InputArea>
        <Button type="submit">{onEdit ? "EDITAR" : "SALVAR"}</Button>
        {onEdit && (
          <CancelButton type="button" onClick={(e) => handleCancelEditCarro(e)}>
            CANCELAR
          </CancelButton>
        )}
      </FormContainer>
    </>
  );
};

export default FormCarro;
