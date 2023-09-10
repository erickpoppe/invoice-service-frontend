'use client'

import ProductItem from '@/components/ProductItem';
import { data } from '@/utils/data';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {addToCart, removeFromCart} from "@/redux/slices/cartSlice";

export default function Home() {
    const { products } = data;
    const dispatch = useDispatch()
    const router = useRouter()
    const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart)

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }))
    }
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">



            <div className="flex-1 p-4">
                <Link href="/shipping">Registrar datos</Link>

                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Center part with scrollable content */}
                <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductItem key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>


            <div className="w-7/12 p-4 bg-gray-200">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Resumen de Venta de Artículos</h2>
                    <div>
                        <h1 className="mb-4 text-xl"></h1>

                        {loading ? (
                            <div>Loading...</div>
                        ) : cartItems.length === 0 ? (
                            <div>
                                No hay artículos de venta.
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-4 md:gap-5">
                                <div className="overflow-x-auto md:col-span-3">
                                    <table className="min-w-full">
                                        <thead className="border-b">
                                        <tr>
                                            <th className="p-5 text-left">Producto</th>
                                            <th className="p-5 text-right">Cantidad</th>
                                            <th className="p-5 text-right">Precio</th>
                                            <th className="p-5">Acción</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={item.id} className="border-b">
                                                <td>
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="flex items-center"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td className="p-5 text-right">
                                                    <select
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            addToCartHandler(item, Number(e.target.value))
                                                        }
                                                    >
                                                        {[...Array(item.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="p-5 text-right">${item.price}</td>
                                                <td className="p-5 text-center">
                                                    <button
                                                        className="default-button"
                                                        onClick={() => removeFromCartHandler(item.id)}
                                                    >
                                                        Borrar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="card p-5">
                                        <ul>
                                            <li>
                                                <div className="pb-3 text-xl">
                                                    Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) : $
                                                    {itemsPrice}
                                                </div>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => router.push('/placeorder')}
                                                    className="primary-button w-full"
                                                >
                                                    Proceder a facturar
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
