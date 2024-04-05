import React from "react";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../service/api";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  a, Td {
    cursor: pointer; /* Define o cursor para uma mão em todos os links */
  }
`;

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  max-width: 1120px;
  margin: 20px auto;
`;

const Thead = styled.thead``;

const Tbody = styled.tbody``;

const Tr = styled.tr``;

const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};
`;
const Grid = ({ users, setUsers, setOnEdit }) => {
  const handleEdit = (item) => {
    // Formatando a data de nascimento antes de passá-la para o componente de edição
    const formattedItem = {
      ...item,
      data_nasc: formatDate(item.data_nasc),
    };
    setOnEdit(formattedItem);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`); // Adicionando a barra e o ID do usuário
      const { data } = response;
      const newArray = users.filter((user) => user.id !== id);
      setUsers(newArray);
      toast.success(data);
    } catch (error) {
      toast.error(error.response.data);
    }

    setOnEdit(null);
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatarDate = (datetime) => {
    const date = new Date(datetime);
    const year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <GlobalStyle />
      <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>CPF</Th>
            <Th>Data de Nascimento</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((item, i) => (
            <Tr key={i}>
              <Td width="30%">{item.nome}</Td>
              <Td width="30%">{item.CPF}</Td>
              <Td width="20%">{formatarDate(item.data_nasc)}</Td>
              <Td $alignCenter="true" width="5%">
                <FaEdit onClick={() => handleEdit(item)} />
              </Td>
              <Td $alignCenterr="true" width="5%">
                <FaTrash onClick={() => handleDelete(item.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default Grid;
