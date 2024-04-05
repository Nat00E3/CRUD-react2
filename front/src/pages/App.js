import GlobalStyle from "../styles/global.js";
import styled from "styled-components";
import Form from "../components/Form.js";
import Grid from "../components/Grid.js";
import FormCarro from "../components/FormCarro.js";
import GridCarro from "../components/GridCarro.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom
import { createGlobalStyle } from "styled-components";
import api from "../service/api.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const TabStyles = createGlobalStyle`
  .react-tabs__tab-list {
    border-bottom: 1px solid #aaa;
    margin: 0 0 10px;
    padding: 0;
  }

  .react-tabs__tab {
    display: inline-block;
    border: 1px solid transparent;
    border-bottom: none;
    bottom: 0px;
    position: relative;
    list-style: none;
    padding: 6px 12px;
    cursor: pointer;
    gap: 10px;
  }

  .react-tabs__tab--selected {
    background: #fff;
    border-color: #aaa;
    color: black;
    border-radius: 5px 5px 0 0;
  }

  .react-tabs__tab-panel {
    display: none;
  }

  .react-tabs__tab-panel--selected {
    display: block;
  }
`;

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

function App() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getUsers = async () => {
    try {
      const res = await api.get(`/usuarios/`);
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const [carros, setCarros] = useState([]);
  const [onEditCarro, setOnEditCarro] = useState(null);

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
  }, []);

  return (
    <>
      <Container>
        <Title>ADICIONAR NOVO USUÁRIO</Title>
        <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
        <Title>ADICIONAR NOVO VEÍCULO</Title>
        <FormCarro
          onEdit={onEditCarro}
          setOnEdit={setOnEditCarro}
          getCarros={getCarros}
        />
        <TabStyles />
        <Tabs>
          <TabList>
            <Tab>USUÁRIOS</Tab>
            <Tab>VEÍCULOS</Tab>
          </TabList>

          <TabPanel>
            <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
          </TabPanel>
          <TabPanel>
            <GridCarro
              setOnEditCarro={setOnEditCarro}
              carros={carros}
              setCarros={setCarros}
            />
          </TabPanel>
        </Tabs>
      </Container>
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </>
  );
}

export default App;
