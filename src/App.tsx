import { Route, Routes } from "react-router";
import "./App.css";
import { Configuration, Modal, Toolbar } from "./components";
import { Facturar, Facturas, LandingPage } from "./pages";
import { useState } from "react";

function App() {
  const [configurationModal, setConfigurationModal] = useState(false);
  return (
    <>
      <Toolbar
        onConfigurationClick={() => {
          setConfigurationModal(true);
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/facturar" element={<Facturar />} />
        <Route path="/facturas" element={<Facturas />} />
      </Routes>
      <Modal open={configurationModal} onClose={() => setConfigurationModal(false)}>
        <Configuration />
      </Modal>
    </>
  );
}

export default App;
