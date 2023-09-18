'use client'
import CheckoutWizard from '@/components/CheckoutWizard'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux';
import {addToCart, removeFromCart, savePaymentMethod, clearCart} from '../../redux/slices/cartSlice.js';

import React, { useState } from 'react';
import axios from 'axios';
import ProductItem from "@/components/ProductItem";
import {data} from "@/utils/data";
import { saveAs } from 'file-saver';




export default function PlaceOrderScreen() {
    const { products } = data;


    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const addToCartHandler = async (product, qty) => {
        dispatch(addToCart({ ...product, qty }))
    }
    // State for the search query
    const [searchQuery, setSearchQuery] = useState('');

    const [setEditModalOpen] = useState(false);

    const handleEditarClick = () => {



        // Open the modal when "Editar" is clicked
        setEditModalOpen(true);
    };

    const [editWindow, setEditWindow] = useState(null);

    const openEditWindow = () => {
        // Specify the URL and other options for the pop-up window
        const url = '/shipping'; // Replace with the correct URL
        const windowFeatures = 'width=600,height=600,scrollbars=yes,resizable=yes';
        const newWindow = window.open(url, '_blank', windowFeatures);
        setEditWindow(newWindow);
    };

    const closeEditWindow = () => {
        if (editWindow) {
            editWindow.close();
            setEditWindow(null);
        }
    };

    const handleCloseModal = () => {
        // Close the modal when the close button is clicked
        setEditModalOpen(false);
    };

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const {
        cartItems,
        paymentMethod,
        loading,
    } = useSelector((state) => state.cart)

    const [codigoRecepcion, setCodigoRecepcion] = useState(null);

    const handlePaymentMethodChange = (event) => {
        const newValue = event.target.value;
        setSelectedPaymentMethod(newValue);
    };

    const submitHandler = () => {
        // Store the selected payment method in Redux
        dispatch(savePaymentMethod(selectedPaymentMethod));
        router.push('/placeorder');
    };

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
    const [creditCardNumber, setCreditCardNumber] = useState('');

    const actividadEconomica = "862010";
    const codigoProductoSin = 99100;
    const codigoProducto = "";
    const descripcion = "";
    const unidadMedida = 58;
    const precioUnitario = null; // Set the fixed value of 65.0
    const montoDescuento = null;
    const especialidad = "";
    const especialidadDetalle = "";
    const nroQuirofanoSalaOperaciones = null;
    const especialidadMedico = "";
    const nombreApellidoMedico = "Medicmel";
    const nitDocumentoMedico = 392010028;
    const nroMatriculaMedico = "";
    const nroFacturaMedico = null;

    // Calculate the values based on cartItems
    const cantidad = cartItems.reduce((total, item) => total + item.qty, 0);
    const subTotal = null;
    const monto_total_moneda = null;
    const monto_total = null;
    const monto_total_sujeto_iva = null;

    // Define the params object
    const params = {
        codigo_metodo_pago: null,
        monto_total: null,
        monto_total_sujeto_iva: null,
        codigo_moneda: 1,
        tipo_cambio: 1,
        monto_total_moneda: null,
        monto_gift_card: null,
        descuento_adicional: null,
        leyenda: "",
        usuario: "",
    };
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discounts, setDiscounts] = useState({});




    const handleItemDiscountChange = (itemId, discountValue) => {
        setDiscounts((prevDiscounts) => ({
            ...prevDiscounts,
            [itemId]: parseFloat(discountValue),
        }));
    };

    const handleRetrieveData = () => {
        const formattedStartDate = new Date(startDate).toISOString();


        const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/reports/?start_date=${encodeURIComponent(formattedStartDate)}&customer_id=2`;

        axios
            .get(apiUrl, {
                headers: {
                    'Accept': 'text/csv',
                },
                responseType: 'blob',
            })
            .then((response) => {
                // Handle the response data here
                console.log(response.data);
                const blob = new Blob([response.data], { type: 'text/csv' });
                saveAs(blob, 'data.csv');
            })
            .catch((error) => {
                console.error('Error buscado los datos:', error);
            });
    };



    const calculateUpdatedSubtotal = () => {
        let updatedSubtotal = 0;
        cartItems.forEach((item) => {
            const discount = discounts[item.id] || 0;
            updatedSubtotal += item.qty * item.price - discount;
        });
        return updatedSubtotal.toFixed(2);
    };

    const [additionalDiscount, setAdditionalDiscount] = useState(0);

    const [successMessage, setSuccessMessage] = useState('');

    const [isOffline, setIsOffline] = useState(false);

    const [apiUrl, setApiUrl] = useState('');

    const toggleIsOffline = () => {
        setIsOffline((prevIsOffline) => !prevIsOffline);
        console.log(apiUrl);
    };



    const handleAdditionalDiscountChange = (value) => {
        setAdditionalDiscount(parseFloat(value));
    };

    const [codigoMotivo, setCodigoMotivo] = useState('1');
    const [invoiceId, setInvoiceId] = useState('');

    const router = useRouter()



    useEffect(() => {
        const newApiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/hospital_clinic?&branch_id=1&pos_id=1&user_id=${user_id}&customer_id=2&client_id=${client_id}&is_offline=${isOffline ? 1 : 0}`;
        setApiUrl(newApiUrl);
    }, [isOffline]);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dispatch = useDispatch();

    const [eventId, setEventId] = useState(null);

    const user_id = useSelector((state) => state.cart.userId);
    const client_id = useSelector((state) => state.cart.userId);

    const handleServicioWebNoDisponible = () => {


        const payload = {
            pos_code: 0,
            event_code: 2,
            description: "SERVICIO WEB DE IMPUESTOS NO DISPONIBLE"
        };

        axios
            .post(
                `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/operations/events/start?customer_id=2&branch_id=1&pos_id=1`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    // Successfully sent the request
                    alert(`Status: ${response.data.status}`);

                    if (response.data.status === "STARTED" && response.data.id) {
                        // Dispatch the eventId to the Redux store
                        setEventId(response.data.id);
                        console.log(eventId);
                    }

                } else {
                    // Handle the error
                    alert('Failed to send request. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error sending request:', error);
                alert('An error occurred while sending the request. Please try again later.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleAnularFactura = () => {
        if (invoiceId) {
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit?invoice_id=${invoiceId}&codigo_motivo=${codigoMotivo}&customer_id=2&branch_id=1&pos_id=1`;

            axios
                .delete(apiUrl)
                .then((response) => {
                    if (response.status === 200) {
                        // Successfully called the URL
                        alert('Factura anulada exitosamente.');
                    } else {
                        // Handle the error
                        alert('Fallo al intentar anular la factura. Por favor intente de nuevo.');
                    }
                })
                .catch((error) => {
                    console.error('Error canceling the invoice:', error);
                    alert('An error occurred while canceling the invoice. Please try again later.');
                });
        } else {
            alert('Please enter an invoice ID.');
        }
    };

    const handleGoOnline = () => {
        if (eventId) {
            // Construct the URL with event_id
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/operations/events/end?event_id=${eventId}&customer_id=2&branch_id=1&pos_id=1`;

            axios
                .patch(apiUrl)
                .then((response) => {
                    if (response.status === 200) {
                        // Successfully received the response
                        const codigoRecepcionEventoSignificativo = response.data.codigoRecepcionEventoSignificativo;
                        setCodigoRecepcion(codigoRecepcionEventoSignificativo);
                        alert(`Received codigoRecepcion: ${codigoRecepcionEventoSignificativo}`);
                    } else {
                        // Handle the error
                        alert('Failed to end the event. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error ending the event:', error);
                    alert('An error occurred while ending the event. Please try again later.');
                });
        } else {
            alert('Event ID is not available.');
        }
    };

    const handleEmitirFacturasGuardadas = () => {
        if (eventId) {
            // Construct the URL with event_id
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/offline?customer_id=2&doc_sector=17&event_id=${eventId}&branch_id=1&pos_id=1`;

            axios
                .post(apiUrl)
                .then((response) => {
                    if (response.status === 200) {
                        // Successfully received the response
                        // Handle the response data here if needed
                        const transaccion = response.data.siat_response.transaccion;
                        const invoices = response.data.batch.invoices.invoices;

                        // Display an alert with the extracted values
                        alert(`Transaccion: ${transaccion}\nFacturas enviadas: ${invoices}`);
                    } else {
                        // Handle the error
                        alert('Failed to call the URL. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error calling the URL:', error);
                    alert('An error occurred while calling the URL. Please try again later.');
                });
        } else {
            alert('Event ID is not available.');
        }
    };


    const handleEnviarFactura = () => {
        setIsSubmitting(true);

        setSuccessMessage('');

        const details = cartItems.map((item) => ({
            actividadEconomica: "862010",
            codigoProductoSin: 99100,
            codigoProducto: item.id,
            descripcion: item.description,
            cantidad: item.qty,
            unidadMedida: 58,
            precioUnitario: item.price,
            montoDescuento: discounts[item.id] || 0,
            subTotal: (item.qty * item.price - (discounts[item.id] || 0)).toFixed(2),
            especialidad: item.especialidad,
            especialidadDetalle: item.especialidadDetalle,
            nroQuirofanoSalaOperaciones: item.nroQuirofanoSalaOperaciones,
            especialidadMedico: item.especialidadMedico,
            nombreApellidoMedico: item.nombreApellidoMedico,
            nitDocumentoMedico: item.nitDocumentoMedico,
            nroMatriculaMedico: item.nroMatriculaMedico,
            nroFacturaMedico: item.nroFacturaMedico,
        }));

        const handleEditarClick = () => {
            // Specify the URL you want to open in the emergent window
            const url = '/shipping'; // Change this URL to the desired one

            // Open the emergent window
            window.open(url, '_blank');
        };


        const params = {
            codigo_metodo_pago: paymentMethod,
            monto_total: calculateUpdatedSubtotal()-additionalDiscount,
            monto_total_sujeto_iva: calculateUpdatedSubtotal()-additionalDiscount,
            codigo_moneda: 1,
            tipo_cambio: 1,
            monto_total_moneda: calculateUpdatedSubtotal()-additionalDiscount,
            monto_gift_card: null,
            descuento_adicional: additionalDiscount,
            usuario: "string",
        };

        const nombre_paciente = "Primer Paciente";

        const jsonObject = {
            details,
            nombre_paciente,
            params,
        };


        axios
            .post(
                apiUrl,
                jsonObject,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    // Successfully sent the invoice
                    alert(response.data.status);
                    alert(`El número de factura es: ${response.data.invoice_number}`);
                    alert(response.data.id);
                } else {
                    // Handle the error
                    alert('Failed to send invoice. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error sending invoice:', error);
                alert('An error occurred while sending the invoice. Please try again later.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div>
            <CheckoutWizard activeStep={2} />
            <h1 className="mb-4 text-xl font-bold">
                <b>Sistema de facturación electrónica</b>
            </h1>
            {loading ? (
                <div>Loading</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:grid-cols-4">
                    {/* Left Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="p-4">
                            {/* Search input */}
                            <input
                                type="text"
                                placeholder="Busque productos..."
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
                    </div>

                    {/* Middle Column */}
                    <div className="md:col-span-2 col-span-4">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold">Resumen de Venta de Artículos</h2>
                            <div>
                                <button className="primary-button" onClick={handleClearCart}>Borrar ventas</button>
                            </div>
                            <div>
                                <h1 className="mb-4 text-xl"></h1>

                                {loading ? (
                                    <div>Loading...</div>
                                ) : cartItems.length === 0 ? (
                                    <div>
                                        No hay artículos de venta.
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 md:gap-5">
                                        <div className="overflow-x-auto md:col-span-3">
                                            <table className="min-w-full">
                                                <thead className="border-b">
                                                <tr>
                                                    <th className="p-5 text-left">Producto</th>
                                                    <th className="p-5 text-right">Cantidad</th>
                                                    <th className="p-5 text-right">Precio</th>
                                                    <th className="p-5">Acción</th>
                                                    <th className="p-5">Descuento</th>
                                                    <th className="p-5">Subtotal</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {cartItems.map((item) => (
                                                    <tr key={item.id} className="border-b">
                                                        <td>
                                                            <a
                                                                href={`/product/${item.id}`}
                                                                className="flex items-center"
                                                                onClick={(e) => {
                                                                    e.preventDefault(); // Prevent the default link behavior
                                                                    const url = e.currentTarget.getAttribute('href'); // Get the href attribute
                                                                    window.open(url, '_blank', 'width=600,height=870'); // Open the URL in a new tab/window
                                                                }}
                                                            > {item.name}
                                                            </a>
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
                                                        <td className="p-5 text-right">Bs. {item.price}</td>
                                                        <td className="p-5 text-center">
                                                            <button
                                                                className="default-button"
                                                                onClick={() => removeFromCartHandler(item.id)}
                                                            >
                                                                Borrar
                                                            </button>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            <input
                                                                type="number"
                                                                value={discounts[item.id] || ''}
                                                                onChange={(e) => handleItemDiscountChange(item.id, e.target.value)}
                                                                className="w-16 border rounded p-1 text-right"
                                                            />
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            Bs. {(item.qty * item.price - (discounts[item.id] || 0)).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg"><b>Datos del cliente</b></h2>
                            <div> {/* Add the 'text-right' class here */}
                                <button onClick={openEditWindow} className="primary-button">Editar</button>
                                <div className="text-right">
                                    El ID del cliente es {client_id}
                                </div>
                            </div>
                        </div>
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg"><b>Método de Pago</b></h2>
                            <div>{paymentMethod}</div>
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="paymentMethod" className="form-label">Tipo de método de pago</label>
                                    <select
                                        id="paymentMethod"
                                        className="form-select"
                                        value={selectedPaymentMethod}
                                        onChange={handlePaymentMethodChange}
                                    >
                                        <option value="1">Efectivo</option>
                                        <option value="2">Tarjeta</option>
                                        <option value="7">Transferencia bancaria</option>
                                        <option value="10">Tarjeta y Efectivo</option>
                                    </select>
                                </div>
                                {selectedPaymentMethod === "2" && (
                                    <div className="mb-3">
                                        <label htmlFor="creditCardNumber" className="form-label">Número de tarjeta de crédito </label>
                                        <input
                                            type="text"
                                            id="creditCardNumber"
                                            className="form-control"
                                            value={creditCardNumber}
                                            onChange={handleCreditCardChange}
                                        />
                                    </div>
                                )}
                                <button onClick={submitHandler} className="primary-button" >Registrar</button>
                            </div>
                        </div>
                    </div>


                    {/* Right Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg"><b>Resumen de Facturación</b></h2>
                            <ul>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>SubTotal</div>
                                        <div>Bs. {calculateUpdatedSubtotal()}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Descuento Adicional</div>
                                        <div>
                                            <input
                                                type="number"
                                                value={additionalDiscount}
                                                onChange={(e) => handleAdditionalDiscountChange(e.target.value)}
                                                className="w-16 border rounded p-1 text-right"
                                            />
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>SubTotal con Descuento</div>
                                        <div>Bs. {(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Monto Total</div>
                                        <div>Bs. {(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
                                    </div>
                                </li>
                                <li>
                                    <button
                                        onClick={handleEnviarFactura}
                                        className="primary-button w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Enviando Factura...' : 'Enviar Factura'}
                                    </button>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <label className="inline-flex items-center">
                                            <span className="mr-2">Modo offline</span>
                                            <input
                                                type="checkbox"
                                                checked={isOffline}
                                                onChange={toggleIsOffline}
                                                className="form-checkbox h-5 w-5 text-indigo-600"
                                            />
                                        </label>

                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <button
                                            onClick={handleServicioWebNoDisponible}
                                            className="primary-button w-full"
                                        >
                                            Servicio web no disponible
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <button onClick={handleGoOnline} className="primary-button w-full">
                                            Volver a modo online
                                        </button>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <button onClick={handleEmitirFacturasGuardadas} className="primary-button w-full">
                                            Emitir facturas guardadas
                                        </button>
                                    </div>
                                </li>

                            </ul>
                        </div>


                    </div>
                </div>
            )}
        </div>
    )
}
