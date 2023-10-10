'use client'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { saveUserId } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





export default function Home() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, cartItems, itemsPrice } = useSelector((state) => state.cart);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    const handleLogin = () => {
        axios
            .post(
                'https://dev-core-invoice-service-q642kqwota-uc.a.run.app/auth/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then((response) => {
                if (response.data.status === 'OK') {
                    const role = response.data.role;
                    if (role === 'ADMIN') {
                        toast.success('Login exitoso como ADMIN', {
                            autoClose: 3000,
                            onClose: () => {
                                dispatch(saveUserId(1));
                                router.push('/placeorder');
                            },
                        });
                    } else if (role === 'OPERATOR') {
                        toast.success('Login exitoso como OPERATOR', {
                            autoClose: 3000,
                            onClose: () => {
                                router.push('/placeorderop');
                                dispatch(saveUserId(4));
                            },
                        });
                    } else if (role === 'READONLY') {
                        toast.success('Login exitoso como FARMACIA', {
                            autoclose: 30000,
                            onClose: () => {
                                router.push('/placeorderpharm');
                                dispatch(saveUserId(5))
                            },
                        });
                    } else {
                        toast.error('Login falló por login desconocido', { autoClose: 3000 });
                    }
                } else {
                    toast.error('Login failed', { autoClose: 3000 });
                }
            })
            .catch((error) => {
                console.error('Error in login:', error);
                toast.error('Error in login', { autoClose: 3000 });
            });
    };


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="max-w-md p-4 border rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-semibold mb-4">
                    <Link href="/placeorder">Sistema Electrónico de Facturación</Link>
                </h2>

                <form>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-600">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        type="button"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
