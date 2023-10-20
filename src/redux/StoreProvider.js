'use client'
import { store } from './store'
import { storeOp } from './storeOp';
import { Provider } from 'react-redux'

export function StoreProvider({ children, storeType }) {
  const selectedStore = storeType === 'storeOp' ? storeOp : store;
  return <Provider store={selectedStore}>{children}</Provider>
}
