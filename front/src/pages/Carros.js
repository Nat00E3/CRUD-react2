import GlobalStyle from "../styles/global.js";
import styled from "styled-components";
import FormCarro from "../components/FormCarro";
import GridCarro from "../components/GridCarro.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import api from "../service/api.js";

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2``;

function Carros() {
  const [carros, setCarros] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getCarros = async () => {
    try {
      const res = await api.get(`/carros`);
      setCarros(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getCarros();
  }, []); // Corrigido para [] para garantir que seja executado apenas uma vez ao montar o componente

  return (
    <>
      <Container>
        <Title>VEÍCULOS</Title>
        <FormCarro
          onEdit={onEdit}
          setOnEdit={setOnEdit}
          getCarros={getCarros}
        />
        <Link to="/">Ver Usuários</Link>
        <GridCarro
          setOnEdit={setOnEdit}
          carros={carros}
          setCarros={setCarros}
        />
      </Container>
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </>
  );
}

export default Carros;
