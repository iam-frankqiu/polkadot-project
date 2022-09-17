// @ts-nocheck
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

const reducer = (state: blockListType, action: actionType): blockListType => {
  switch (action.type) {
    case UPDATE_DATA:
      // sometimes the same block will trigger multiple times. filter the same block.
      if (state.some((item) => item.number === action.data.number)) {
        return state;
      }
      // if the length of list has more than or equals 10. fetch the top 9 blocks plus the newest block.
      return state.length >= 10
        ? [action.data, ...state.slice(0, 9)]
        : [action.data, ...state];
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
        await api.isReady;
        await api.rpc.chain.subscribeNewHeads((header) => {
          const { number, hash } = header;
          const numberStr = number.toString();
          const hashStr = hash.toString();
          dispatch({
            type: UPDATE_DATA,
            data: { number: numberStr, hash: hashStr },
          });
        });
      }
    };
    init();
  }, [api]);

  return (
    <div>
      <h1 className="h1">Recent Blocks</h1>
      <TableContainer className="center">
        <Table variant="simple"  width={'1000px'}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Hash</Th>
            </Tr>
          </Thead>
          <Tbody>

            {
              state.length === 0 && (
                <Tr >
                <Td className="empty" colSpan={2}>No Data Available</Td>
              </Tr>
              )
            }

            {state.map((item) => (
              <Tr key={item.hash}>
                <Td>Block {item.number}</Td>
                <Td>{item.hash}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RecentBlocks;
