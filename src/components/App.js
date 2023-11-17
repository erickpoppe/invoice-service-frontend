'use client'

import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import { useEffect } from 'react'
import { hideLoading } from '@/redux/slices/cartSlice'
import { usePathname } from 'next/navigation'

export default function App({ children }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hideLoading())
  }, [dispatch])
  const { cartItems, loading } = useSelector((state) => state.cart)
  const pathname = usePathname()

  return (
    <div>
      <div>
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
