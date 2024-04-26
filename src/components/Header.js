import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Header() {
  const { loading, cartItems } = useSelector((state) => state.cart)
  const pathname = usePathname()

  return (
    <header>
      <nav className="flex justify-between items-center h-12 px-4 shadow-md bg-gray-800 text-white">
        <Link href="/" className="text-lg font-bold">
          Clinica MEDICMEL S.R.L.
        </Link>
        <div>
          <span className="cart-badge">
            {loading ? '' : cartItems.reduce((a, c) => a + c.qty, 0)}
          </span>

          {!loading && cartItems.length > 0 && pathname !== '/cart' && (
            <div className="caret"></div>
          )}
        </div>
      </nav>
    </header>
  )
}
