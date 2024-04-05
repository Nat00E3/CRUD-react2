import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
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

const GridCarro = ({ carros, setCarros, setOnEditCarro }) => {
  const handleEditCarro = (item) => {
    setOnEditCarro(item);
  };

  const handleDeleteCarro = async (id) => {
    await axios
      .delete("http://localhost:8800/carros/" + id)
      .then(({ data }) => {
        const newArray = carros.filter((carro) => carro.id !== id);

        setCarros(newArray);

        // Verifica se o veículo foi excluído com sucesso no banco de dados
        if (data.includes("Veículo excluído")) {
          toast.success(data);
        } else {
          toast.error(data);
        }
      })
      .catch(({ data }) => toast.error(data));

    setOnEditCarro(null);
  };

  return (
    <>
      <GlobalStyle />

      <Table>
        <Thead>
          <Tr>
            <Th>Marca</Th>
            <Th>Modelo</Th>
            <Th>Cor</Th>
            <Th>Nome do Usuário</Th>
          </Tr>
        </Thead>
        <Tbody>
          {carros.map((item, i) => (
            <Tr key={i}>
              <Td width="20%">{item.marca}</Td>
              <Td width="20%">{item.modelo}</Td>
              <Td width="20%">{item.cor}</Td>
              <Td width="20%">{item.nome_usuario}</Td>

              <Td $alignCenter="true" width="5%">
                <FaEdit onClick={() => handleEditCarro(item)} />
              </Td>
              <Td $alignCenter="true" width="5%">
                <FaTrash onClick={() => handleDeleteCarro(item.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default GridCarro;
