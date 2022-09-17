// @ts-nocheck
import React, { useContext, createContext, useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { DOLPHIN_NETWORK } from "../config";

const SubstrateContext = createContext(null);

const SubstrateContextProvider = ({
  children,
}: SubstrateContextProps): React.ReactElement => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const init = async () => {
      const wsProvider = new WsProvider(DOLPHIN_NETWORK);
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);
    };
    init();
  }, []);

  const value = {
    api,
  };

  return (
    <SubstrateContext.Provider value={value}>
      {children}
    </SubstrateContext.Provider>
  );
};
const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
