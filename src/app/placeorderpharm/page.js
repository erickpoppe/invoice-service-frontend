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
import {datos} from "@/utils/datos";
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';






export default function PlaceOrderScreen() {
    const [foundClient, setFoundClient] = useState('');


    const { products } = datos;

    const [isOnline, setIsOnline] = useState(true);

    const ledClass = isOnline ? 'Online' : 'Offline';

    useEffect(() => {
        const checkOnlineStatus = () => {
            setIsOnline(window.navigator.onLine);
        };

        checkOnlineStatus();

        const intervalId = setInterval(checkOnlineStatus, 10000);

        return () => {
            clearInterval(intervalId); // Cleanup the interval
        };
    }, []);






    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleLogout = () => {
        dispatch(clearCart());
        router.push('/');

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

    const handleImprimirFactura = (event) => {
        const myUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/pdf?invoice_number=${invoicePrintNumber}&customer_id=1`;
        axios.get(myUrl, { responseType: 'blob' })
            .then ((response) => {
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const filename = `invoice_${invoicePrintNumber}.pdf`;
                saveAs(pdfBlob, filename);
            })
            .catch((error) => {
                console.error('Error descargando el PDF :', error);
            });
    };

    const submitHandler = () => {
        // Store the selected payment method in Redux
        dispatch(savePaymentMethod(selectedPaymentMethod));
        router.push('/placeorder');
    };

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
    const [creditCardNumber, setCreditCardNumber] = useState(null);
    const [nombre_paciente, setNombre_paciente] = useState('');


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discounts, setDiscounts] = useState({});

    const [clientData, setClientData] = useState(null);

    const [creditCard, setCreditCard] = useState(null);



    const handleItemDiscountChange = (itemId, discountValue) => {
        setDiscounts((prevDiscounts) => ({
            ...prevDiscounts,
            [itemId]: parseFloat(discountValue),
        }));
    };

    const handleRetrieveData = () => {
        const formattedStartDate = new Date(startDate).toISOString();


        const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/reports/?start_date=${encodeURIComponent(formattedStartDate)}&customer_id=1`;

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
            const discountPercentage = discounts[item.id] || 0;
            const discountedAmount = (item.qty * item.price * (1 - discountPercentage / 100));
            updatedSubtotal += discountedAmount;
        });
        return updatedSubtotal.toFixed(2);
    };

    const [additionalDiscount, setAdditionalDiscount] = useState(0);

    const [successMessage, setSuccessMessage] = useState('');

    const [isOffline, setIsOffline] = useState(false);

    const [apiUrl, setApiUrl] = useState('');

    const [apixUrl, setApixUrl] = useState('')

    const toggleIsOffline = () => {
        setIsOffline((prevIsOffline) => !prevIsOffline);
        console.log(apiUrl);
    };



    const handleAdditionalDiscountChange = (value) => {
        setAdditionalDiscount(parseFloat(value));
    };

    const handleNombrePaciente = (event) => {
        console.log('Nombre del Paciente:', nombre_paciente);
        toast.success('Nombre del paciente registrado.');
    };

    const [codigoMotivo, setCodigoMotivo] = useState('1');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoicePrintNumber, setInvoicePrintNumber] = useState('');

    const router = useRouter()



    const user_id= useSelector((state) => state.cart.userId);
    let client_id = foundClient.id;

    useEffect(() => {
        const newApiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/hospital_clinic?&branch_id=1&pos_id=1&user_id=1&customer_id=1&client_id=${client_id}&is_offline=${isOffline ? 1 : 0}`;
        setApiUrl(newApiUrl);
    }, [client_id]);

    useEffect(() => {
        const nuevoApiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/hospital_clinic?&branch_id=1&pos_id=1&user_id=1&customer_id=1&client_id=${client_id}&is_offline=${isOffline ? 1 : 0}`;
        setApixUrl(nuevoApiUrl);
    }, [client_id, isOffline]);

    const handleEstablecerCliente = () => {
        if (foundClient) {
            client_id = foundClient.id;
            console.log(client_id);
        } else {
            console.log("No hay ese cliente!")
        };
    };

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dispatch = useDispatch();

    const [eventId, setEventId] = useState('1');

    const handleServicioWebNoDisponible = () => {


        const payload = {
            pos_code: 0,
            event_code: 2,
            description: "SERVICIO WEB DE IMPUESTOS NO DISPONIBLE"
        };

        axios
            .post(
                `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/operations/events/start?customer_id=1&branch_id=1&pos_id=1`,
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
        if (invoiceNumber) {
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/number/?invoice_number=${invoiceNumber}&codigo_motivo=${codigoMotivo}&customer_id=1&branch_id=1&pos_id=1`;
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
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/operations/events/end?event_id=${eventId}&customer_id=1&branch_id=1&pos_id=1`;

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

    const handleCreditCardChange = (event) => {
        const newValue = event.target.value;
        setCreditCardNumber(newValue);
        console.log(newValue);
        console.log(creditCardNumber);
    };

    const handleBuscarCliente = async () => {
        try {
            const response = await axios.get('https://dev-core-invoice-service-q642kqwota-uc.a.run.app/clients/', {
                headers: {
                    Accept: 'application/json',
                },
            });

            if (response.status === 200) {
                const clients = response.data;

                // Use the value from the input field as the search field
                const foundClient = clients.find((client) => client.numero_documento === searchField);

                if (foundClient) {
                    console.log('Found Client:', foundClient);
                    setFoundClient(foundClient);
                } else {
                    console.log('Client not found');
                    setFoundClient(null);
                }

            } else {
                console.error('Failed to fetch client data');
            }
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    };




    const handleEmitirFacturasGuardadas = () => {
        if (eventId) {
            const apiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/offline?customer_id=1&doc_sector=17&event_id=${eventId}&branch_id=1&pos_id=1`;

            axios
                .post(apiUrl)
                .then((response) => {
                    if (response.status === 200) {
                        const transaccion = response.data.siat_response.transaccion;
                        const invoices = response.data.batch.invoices.invoices;

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

    const [searchField, setSearchField] = useState('');


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
            montoDescuento: (item.qty * item.price * ((discounts[item.id] || 0) / 100)).toFixed(2),
            subTotal: (item.qty * item.price - (item.qty * item.price * ((discounts[item.id] || 0) / 100))).toFixed(2),
            especialidad: item.especialidad,
            especialidadDetalle: item.especialidadDetalle,
            nroQuirofanoSalaOperaciones: item.nroQuirofanoSalaOperaciones,
            especialidadMedico: item.especialidadMedico,
            nombreApellidoMedico: item.nombreApellidoMedico,
            nitDocumentoMedico: item.nitDocumentoMedico,
            nroMatriculaMedico: item.nroMatriculaMedico,
            nroFacturaMedico: item.nroFacturaMedico,
        }));

        const params = {
            codigo_metodo_pago: paymentMethod,
            monto_total: (calculateUpdatedSubtotal()-(calculateUpdatedSubtotal()*(additionalDiscount/100))).toFixed(2),
            monto_total_sujeto_iva: (calculateUpdatedSubtotal()-(calculateUpdatedSubtotal()*(additionalDiscount/100))).toFixed(2),
            codigo_moneda: 1,
            tipo_cambio: 1,
            monto_total_moneda: (calculateUpdatedSubtotal()-(calculateUpdatedSubtotal()*(additionalDiscount/100))).toFixed(2),
            monto_gift_card: null,
            descuento_adicional: (calculateUpdatedSubtotal()*(additionalDiscount/100)).toFixed(2),
            usuario: "string",
            numero_tarjeta: creditCardNumber,
        };



        const jsonObject = {
            details,
            nombre_paciente: nombre_paciente,
            params,
        };

        const mapiUrl = `https://dev-core-invoice-service-q642kqwota-uc.a.run.app/invoices/emit/hospital_clinic?&branch_id=1&pos_id=1&user_id=1&customer_id=1&client_id=${client_id}&is_offline=${isOffline ? 1 : 0}`;



        axios
            .post(
                mapiUrl,
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
                    setNombre_paciente('');
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
            <h1 className="mb-4 text-xl font-bold">
                <b>Sistema de facturación electrónica</b>
            </h1>
            <div className="flex justify-end"> {/* Use flex and justify-end to align the button to the right */}
                {/* Logout button */}
                <button className="primary-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            {loading ? (
                <div>Loading</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:grid-cols-4">
                    {/* Left Column */}
                    <div className="col-span-1 md:col-span-1">
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
                                        <option value="1" selected>Efectivo</option>
                                        <option value="2">Tarjeta</option>
                                        <option value="7">Transferencia bancaria</option>
                                        <option value="10">Tarjeta y Efectivo</option>
                                    </select>
                                </div>
                                {selectedPaymentMethod === "2" && (
                                    <div className="mb-3">
                                        <label htmlFor="creditCardNumber" className="form-label">Número de tarjeta de crédito </label>
                                        <input
                                            type="tel"
                                            inputmode="numeric"
                                            id="creditCardNumber"
                                            pattern="[0-9\s]{13,19}"
                                            autocomplete="cc-number"
                                            maxlength="19"
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            className="form-control"
                                            value={creditCardNumber}
                                            onChange={handleCreditCardChange}
                                        />
                                    </div>
                                )}
                                <button onClick={submitHandler} className="primary-button" >Registrar</button>
                            </div>

                        </div>
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
                        <div className="card p-5">
                            <h2 className="mb-2 text-lg"><b>Datos del cliente</b></h2>
                            <div className="text-right">
                                <button onClick={openEditWindow} className="primary-button mb-2 mr-3">Editar y guardar</button>
                                <input
                                    type="text"
                                    placeholder="Escriba datos..."
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value)}
                                    className="mb-3"
                                />
                                <button onClick={handleBuscarCliente} className="primary-button">Buscar cliente venta</button>
                            </div>
                            {foundClient !== null ? (
                                <div className="found-client">
                                    <h3>Cliente encontrado: </h3>
                                    <p>ID: {foundClient.id}</p>
                                    <p>Nombre: {foundClient.nombre_razon_social}</p>
                                </div>
                            ) : (
                                <div className="no-client-found">
                                    <p>No se encontró ningún cliente.</p>
                                </div>
                            )}
                            <div>
                                <button onClick={handleEstablecerCliente} className="primary-button">Establecer cliente</button>
                            </div>

                        </div>
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
                                                    <th className="p-5">Descuento %</th>
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
                                                            <input
                                                                type="number"
                                                                value={item.qty}
                                                                onChange={(e) => {
                                                                    const newValue = Math.max(1, Number(e.target.value));
                                                                    addToCartHandler(item, newValue);
                                                                }}
                                                            />
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
                                                                min="0"
                                                                value={discounts[item.id] || ''}
                                                                onChange={(e) => handleItemDiscountChange(item.id, e.target.value)}
                                                                className="w-16 border rounded p-1 text-right"
                                                            />
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            Bs. {(item.qty * item.price * (1 - (discounts[item.id] || 0) / 100)).toFixed(2)}
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


                    </div>


                    {/* Right Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="card  p-5">
                            <h2 className="mb-2 text-lg"><b>Resumen de Facturación</b></h2>
                            <ul>
                                <li>
                                    <div>
                                        <p>Estado del Internet: {ledClass}</p>
                                        {/* Other content */}
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>SubTotal</div>
                                        <div>Bs. {calculateUpdatedSubtotal()}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Porcentaje descuento adicional %</div>
                                        <div>
                                            <input
                                                type="number"
                                                min="0"
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
                                        <div>Bs. {((calculateUpdatedSubtotal() * (1 - additionalDiscount / 100)).toFixed(2))}</div>

                                    </div>
                                </li>
                                <li>
                                    <div className="mb-2 flex justify-between">
                                        <div>Monto Total</div>
                                        <div>Bs. {((calculateUpdatedSubtotal() * (1 - additionalDiscount / 100)).toFixed(2))}</div>

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
                            <ul>
                                <div className="card p-5">
                                    <div>
                                        <h2 className="mb-2 text-lg"><b>Anular factura</b></h2>
                                        <ul>
                                            <li className="mb-4"> {/* Add margin to create separation */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center"> {/* Add flex and items-center to center elements vertically */}
                                                        <input
                                                            type="text"
                                                            value={invoiceNumber}
                                                            onChange={(e) => setInvoiceNumber(e.target.value)}
                                                            className="border rounded p-1 ml-2 w-full"
                                                            placeholder="Número de la factura..."
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="mb-4 flex justify-between items-center"> {/* Add margin and center elements vertically */}
                                                    <select
                                                        value={codigoMotivo}
                                                        onChange={(e) => setCodigoMotivo(e.target.value)}
                                                        className="border rounded p-1 w-full"
                                                    >
                                                        <option value="1">FACTURA MAL EMITIDA</option>
                                                        <option value="2">NOTA DE CREDITO-DEBITO MAL EMITIDA</option>
                                                        <option value="3">DATOS DE EMISION INCORRECTOS</option>
                                                        <option value="4">FACTURA O NOTA DE CREDITO-DEBITO DEVUELTA</option>
                                                    </select>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="flex justify-center"> {/* Center the button */}
                                            <button onClick={handleAnularFactura} className="primary-button w-full">
                                                Anular Factura
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <ol>
                                            <h2 className="mb-2 text-lg"><b>Emitir reportes</b></h2>
                                            <li className="mb-4"> {/* Add margin to create separation */}
                                                <div className="flex justify-between items-center">
                                                    <div className="mb-2">
                                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                                            Fecha de inicio
                                                        </label>
                                                        <input
                                                            type="datetime-local" // Use datetime-local type
                                                            id="startDate"
                                                            name="startDate"
                                                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                        </ol>
                                        <div className="flex justify-center"> {/* Center the button */}
                                            <button onClick={handleRetrieveData} className="primary-button w-full">
                                                Emitir reporte
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </ul>
                        </div>
                        <div className="card  p-5">
                            <div className="mb-3">
                                <h2 className="mb-2 text-lg"><b>Imprimir Factura</b></h2>
                                <ol>

                                    <div className="flex items-center"> {/* Add flex and items-center to center elements vertically */}
                                        <div>Número de factura :</div>
                                        <input
                                            type="number"
                                            value={invoicePrintNumber}
                                            onChange={(e) => setInvoicePrintNumber(e.target.value)}
                                            className="border rounded p-1 ml-2"
                                            placeholder="Número de la factura..."
                                        />
                                    </div>
                                </ol>
                                <ul>
                                    <div className="mb-2 flex justify-between">
                                        <button onClick={handleImprimirFactura} className="primary-button w-full">
                                            Imprimir Factura
                                        </button>
                                    </div>
                                </ul>
                            </div>
                        </div>


                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}
