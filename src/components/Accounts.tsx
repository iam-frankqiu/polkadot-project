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
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getAccount } from "../utils";
import { useSubstrate } from "../contexts/substrateContext";
import { APP_NAME, SS58_FORMAT, KEYRING_TYPE } from "../config";

const Accounts = () => {
  // store address and name
  const [addressList, setAddressList] = useState<addressType>([]);
  // store address, name , and balance
  const [accountList, setAccountList] = useState<accountType>([]);
  const { api } = useSubstrate();

  useEffect(() => {
    const fetchAddressList = async () => {
      await web3Enable(APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: meta.name },
      }));
      setAddressList(getAccount(allAccounts));
      await cryptoWaitReady();
      // it will throw an Error: Unable to initialise options more than once
      try {
        keyring.loadAll({ ss58Format: SS58_FORMAT, type: KEYRING_TYPE }, allAccounts);
      } catch (error) {
      }
      // subscribe the change of the wallets
      await web3AccountsSubscribe((accounts) => {
        setAddressList(getAccount(accounts));
      });
    };
    fetchAddressList();
  }, []);

  useEffect(() => {
    const fetchBalanceList = async () => {
      if (api) {
        await api.isReady;
        // query the balance of multiple addresses
        await api.query.system.account.multi(
          addressList.map((item) => item.address),
          (balances) => {
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
    fetchBalanceList();
  }, [addressList, api]);

  return (
    <div>
      <h1 className="h1">My Accounts</h1>
      <TableContainer className="center">
        <Table variant="simple" width="1000px" className="border-width">
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
                <Td className="empty" colSpan={3}>
                  No Data Available
                </Td>
              </Tr>
            )}

            {accountList.length > 0 &&
              accountList.map((item) => (
                <Tr key={item.address}>
                  <Td>{item.name}</Td>
                  <Td>{item.address}</Td>
                  <Td>{item.balance} DOL</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Accounts;
