// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  web3Accounts,
  web3Enable,
  web3AccountsSubscribe,
} from "@polkadot/extension-dapp";
import { getAccount } from "../utils";
import { useSubstrate } from "../contexts/substrateContext";
import { APP_NAME } from "../config";

const Accounts = () => {
  const [addressList, setAddressList] = useState<addressType>([]);
  const [accountList, setAccountList] = useState<accountType>([]);
  const { api } = useSubstrate();

  useEffect(() => {
    const init = async () => {
      await web3Enable(APP_NAME);
      const allAccounts = await web3Accounts();
      setAddressList(getAccount(allAccounts));
      await web3AccountsSubscribe((accounts) => {
        setAddressList(getAccount(accounts));
      });
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (api) {
        console.log('accounts')
        await api.isReady;
        await api.query.system.account.multi(
          addressList.map((item) => item.address),
          balances => {
            console.log('balance')
            const balancesArr = balances.map(({ data: { free } }) =>
              free.toString()
            );
            setAccountList(
              addressList.map((item, index) => ({
                ...item,
                balance: balancesArr[index],
              }))
            );
          }
        );
      }
    };
    init();
  }, [addressList, api]);

  return (
    <div>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accountList.length === 0 && (
              <Tr>
                <Td colSpan={3}>No Data Available</Td>
              </Tr>
            )}

            {accountList.length > 0 &&
              accountList.map((item) => (
                <Tr key={item.address}>
                  <Td>{item.name}</Td>
                  <Td>{item.address}</Td>
                  <Td>{item.balance}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Accounts;
