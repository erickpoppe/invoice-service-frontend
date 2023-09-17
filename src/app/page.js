'use client'

import ProductItem from '@/components/ProductItem';
import { data } from '@/utils/data';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import {addToCart, removeFromCart} from "@/redux/slices/cartSlice";
import axios from 'axios';


export default function Home() {
    const { products } = data;
    const dispatch = useDispatch()
    const router = useRouter()
    const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart)

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    };

    const handleLogin = () => {
        axios
            .post('https://dev-core-invoice-service-q642kqwota-uc.a.run.app/auth/login', { username, password }, { headers: { 'Content-Type': 'application/json' } })
            .then((response) => {
                if (response.data.status == "OK") {
                    const role = response.data.role;
                    if (role === "ADMIN") {
                        alert(`Login exitoso como ADMIN`);
                        router.push('/placeorder');
                    } else if (role === "OPERATOR") {
                        alert(`Login exitoso como OPERATOR`);
                        router.push('/placeorderop');
                    } else {
                        alert(`Login falló debido a un rol desconocido`);
                    };
                } else {
                    // Handle authentication error here (e.g., show an error message).
                    alert(`Login falló`);
                }
            })
            .catch((error) => {
                console.error('Error en el login:', error);
            });
    };



    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }))
    }
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">



            <div className="flex-1 p-4">
                <h2>
                <Link href="/placeorder">Facturación</Link>
                </h2>


                <div>
                    <form>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="primary-button" type="button" onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                </div>

            </div>




        </div>
    );
}
