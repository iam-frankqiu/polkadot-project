import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { SubstrateContextProvider } from "./contexts/substrateContext";
import Home from "./pages/Home";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <SubstrateContextProvider>
        <Home />
      </SubstrateContextProvider>
    </ChakraProvider>
  );
};
