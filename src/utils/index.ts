// @ts-nocheck

// get address and name form an object who have address and meta attributes.
export const getAccount = (accounts) => accounts.map(({address, meta}) => ({address, name: meta.name}))