'use client'

import CheckoutWizard from '@/components/CheckoutWizard'
import { saveShippingAddress } from '@/redux/slices/cartSlice'
import { saveClientId } from '@/redux/slices/cartSlice'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {error} from "next/dist/build/output/log";

export default function ShippingAddressPage() {

    const [isRoll, setIsRoll] = useState(null);
    const [invoicePrintNumber, setInvoicePrintNumber] = useState('');

    const handleImprimirFactura = (event) => {
        const myUrl = `https://prod-core-invoice-service-4z5dz4d2yq-uc.a.run.app/invoices/pdf?invoice_number=${invoicePrintNumber}&customer_id=1&is_roll=1`;
        axios.get(myUrl, { responseType: 'blob' })
            .then ((response) => {
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const filename = `invoice_${invoicePrintNumber}.pdf`;
                saveAs(pdfBlob, filename);
            })
            .catch((error) => {
                alert(`Error imprimiendo la factura: ${error}`);
            });
    };


    return (
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
                        <button onClick={handleImprimirFactura} className="primary-button">
                            Imprimir Factura
                        </button>
                    </div>
                </ul>
            </div>
        </div>
    )
}

