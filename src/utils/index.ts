// @ts-nocheck
export const getAccount = (accounts) => accounts.map(({address, meta}) => ({address, name: meta.name}))