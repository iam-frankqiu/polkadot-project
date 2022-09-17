import React, { useEffect, useReducer } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useSubstrate } from "../contexts/substrateContext";

const UPDATE_DATA = "update_data";

type headerType = {
  hash: string;
  number: string;
};

type block = {
  number: string;
  hash: string;
};

type blockListType = block[];

type actionType = {
  type: typeof UPDATE_DATA
  data: block;
};

const reducer = (state: blockListType, action: actionType): blockListType => {
  switch (action.type) {
    case UPDATE_DATA:
      if (state.some(item => item.number === action.data.number)) {
        return state;
      }
      return state.length >= 10 ? [action.data, ...state.slice(0, 9)]: [action.data, ...state]
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const RecentBlocks = () => {
  const [state, dispatch] = useReducer(reducer, []);
  const { api } = useSubstrate();

  useEffect(() => {
    const init = async () => {
      if (api) {
        // @ts-ignore
        await api.isReady;
        // @ts-ignore
        const unsubHeads = await api.rpc.chain.subscribeNewHeads(
          (header: headerType) => {
            const { number, hash } = header;
            const numberStr = number.toString()
            const hashStr = hash.toString()
            dispatch({ type: UPDATE_DATA, data: { number: numberStr, hash: hashStr } });
          }
        );
      }
    };
    init();
  }, [api]);
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Hash</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.map((item) => (
            <Tr key={item.hash}>
              <Td>{item.number}</Td>
              <Td>{item.hash}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RecentBlocks;
