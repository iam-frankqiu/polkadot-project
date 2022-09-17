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

type balanceType = {
  data: { free: string };
};

type balanceListType = balanceType[];

const INIT_ACCOUNT = "init_account";

const UPDATE_ACCOUNT = "update_account";

const UPDATE_BALANCE = "update_balance";

const UPDATE_ADDRESS = 'update_address';

type accountListType = { name: string; address: string; balance: string }[];

type actionType = {
  type: typeof INIT_ACCOUNT | typeof UPDATE_ACCOUNT | typeof UPDATE_BALANCE;
  data: accountListType;
};

type addressType = {
  name: string,
  address: string,
}

type accountType = addressType & {balance: string}

// const reducer = (
//   state: accountListType,
//   action: actionType
// ): accountListType => {
//   switch (action.type) {
//     // case INIT_ACCOUNT:
//     //   return action.data;
//     case UPDATE_ADDRESS: 
//       return {addressList: action.data, accountList: state.accountList}
//     case UPDATE_ACCOUNT:
//       return {addressList: state.addressList, accountList: action.data}
//       // return action.data;
//     case UPDATE_BALANCE:
//       return [];
//     default:
//       throw new Error(`Unknown type: ${action.type}`);
//   }
// };

// const initialState = {
//   addressList: [],
//   accountList: []
// }

const Accounts = () => {
  const [addressList, setAddressList] = useState<addressType>([]);
  const [accountList, setAccountList] = useState<accountType>([]);
  const { api } = useSubstrate();
  // const {addressList} = state
  // useEffect(() => {
  //   async function init() {
  //     if (api) {
  //       await web3Enable(APP_NAME);
  //       let allAccounts = await web3Accounts();
  //       // @ts-ignore
  //       allAccounts = allAccounts.map(({ address, meta }) => ({
  //         address,
  //         name: meta.name,
  //       }));
  //       console.log(allAccounts);
  //       // await cryptoWaitReady();
  //       // keyring.loadAll({ ss58Format: 42, type: "sr25519" });
  //       console.log(keyring.getAccounts());
  //       // console.log(keyring);
  //       // @ts-ignore
  //       await api.isReady;
  //       // @ts-ignore
  //       await api.query.system.account.multi(
  //         allAccounts.map((item) => item.address),
  //         (balances: balanceListType) => {
  //           console.log(balances, "balances");
  //           const balancesArr = balances.map(({ data: { free } }) =>
  //             free.toString()
  //           );
  //           allAccounts = allAccounts.map((item, index) => ({
  //             ...item,
  //             balance: balancesArr[index],
  //           }));
  //           // @ts-ignore
  //           dispatch({ type: INIT_ACCOUNT, data: allAccounts });
  //           // const [{ data: balance1 }, { data: balance2 }] = balances;

  //           // console.log(`The balances are ${balance1.free} and ${balance2.free}`);
  //         }
  //       );

  //       const unsubscribe = await web3AccountsSubscribe(( injectedAccounts ) => {
  //         injectedAccounts.map(( account ) => {
  //             console.log(account);
  //         })
  //      });

  //     }
  //   }
  //   init();
  // }, [api]);

  useEffect(() => {
    const init = async () => {
      await web3Enable(APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = getAccount(allAccounts);
      setAddressList(allAccounts)
      // dispatch({ type: UPDATE_ADDRESS, data: allAccounts });
      const unsubscribe = await web3AccountsSubscribe((accounts) => {
        // const accounts = getAccount(accounts);
        setAddressList(getAccount(accounts))
        // dispatch({ type: UPDATE_ADDRESS, data: accountList });
      });
    };
    init();
  }, []);

  // const accountList = useAsyncMemo(async () => {
  //   if (api) {
  //     // @ts-ignore
  //     await api.isReady;
  //     // @ts-ignore
  //     await api.query.system.account.multi(
  //       state.map((item) => item.address),
  //       (balances: balanceListType) => {
  //         console.log(balances, "balances");
  //         const balancesArr = balances.map(({ data: { free } }) =>
  //           free.toString()
  //         );
  //         return state.map((item, index) => ({
  //           ...item,
  //           balance: balancesArr[index],
  //         }));
  //       }
  //     );
  //   } else {
  //     return []
  //   }
  // }, [...state.map((item) => item.address), api]);

  useEffect(() => {
    const init = async () => {
      if (api) {
        // @ts-ignore
        await api.isReady;
        // @ts-ignore
        await api.query.system.account.multi(
          addressList.map(item => item.address),
          (balances: balanceListType) => {
            const balancesArr = balances.map(({ data: { free } }) =>
              free.toString()
            );
            setAccountList(addressList.map((item, index) => ({
              ...item,
              balance: balancesArr[index],
            })))
            // dispatch({type: UPDATE_ACCOUNT, data: addressList.map((item, index) => ({
            //   ...item,
            //   balance: balancesArr[index],
            // }))})
          }
        );
      }
    }
    init();
  }, [addressList, api])
 
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
            { accountList.length === 0 && (<Tr>
                  <Td colSpan={3}>No Data Available</Td>
                </Tr>)}

            {accountList.length > 0 && accountList.map((item) => (
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
