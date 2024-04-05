import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import api from "../service/api";
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

const CancelButton = styled(Button)`
  background-color: #dc3545;
`;

const validaCPF = (cpf) => {
  let soma = 0;
  let resto;

  if (cpf === "00000000000") return false;

  for (let i = 1; i <= 9; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const userRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = userRef.current;

    if (!user.nome.value || !user.CPF.value || !user.data_nasc.value) {
      return toast.warn("Preencha todos os campos!");
    }

    if (!validaCPF(user.CPF.value)) {
      return toast.warn("CPF inválido!");
    }

    if (onEdit) {
      await api
        .put("/usuarios/" + onEdit.id, {
          nome: user.nome.value,
          CPF: user.CPF.value,
          data_nasc: user.data_nasc.value,
        })
        .then(({ data }) => {
          toast.success(data);
          getUsers(); // Atualiza a lista de usuários
          setOnEdit(null); // Limpa o estado de edição
        })
        .catch((error) => toast.error(error.response.data.error));
    } else {
      await api
        .post("/usuarios", {
          nome: user.nome.value,
          CPF: user.CPF.value,
          data_nasc: user.data_nasc.value,
        })
        .then((response) => {
          toast.success(response.data.message);
          getUsers(); // Atualiza a lista de usuários
        })
        .catch((error) => toast.error(error.response.data.error));
    }

    // Limpa os campos do formulário após a submissão
    user.nome.value = "";
    user.CPF.value = "";
    user.data_nasc.value = "";
  };

  const handleCancelEdit = () => {
    setOnEdit(null);
    const form = document.querySelector("form");
    if (form) {
      form.reset();
    }
    toast.dismiss();
  };

  useEffect(() => {
    if (onEdit) {
      const user = userRef.current;

      user.nome.value = onEdit.nome;
      user.CPF.value = onEdit.CPF;
      user.data_nasc.value = onEdit.data_nasc;
    }
  }, [onEdit]);

  return (
    <>
      <GlobalStyle />
      <FormContainer ref={userRef} onSubmit={handleSubmit}>
        <InputArea>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" name="nome" />
        </InputArea>
        <InputArea>
          <Label htmlFor="CPF">CPF</Label>
          <Input id="CPF" name="CPF" type="text" />
        </InputArea>
        <InputArea>
          <Label htmlFor="data_nasc">Data de Nascimento</Label>
          <Input
            id="data_nasc"
            name="data_nasc"
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
          />
        </InputArea>
        <Button type="submit">{onEdit ? "EDITAR" : "SALVAR"}</Button>
        {onEdit && (
          <CancelButton onClick={handleCancelEdit}>CANCELAR</CancelButton>
        )}
      </FormContainer>
    </>
  );
};

export default Form;
