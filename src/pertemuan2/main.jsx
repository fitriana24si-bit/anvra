import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BiodataDiri from "./BiodataDiri";
import Container from "./Container";
import "./custom.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Container>
      <BiodataDiri />
    </Container>
  </StrictMode>
);