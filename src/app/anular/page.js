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
import { saveAs } from 'file-saver';

export default function ShippingAddressPage() {

    const [isRoll, setIsRoll] = useState(1);
    const [invoicePrintNumber, setInvoicePrintNumber] = useState('');
    const [invoiceBranchNumber, setInvoiceBranchNumber] = useState('');
    const [invoicePosNumber, setInvoicePosNumber] = useState('');

    const handleAnularFactura = (event) => {
        const myUrl = `https://prod-core-invoice-service-4z5dz4d2yq-uc.a.run.app/invoices/emit/number/?invoice_number=${invoicePrintNumber}&codigo_motivo=${isRoll}&customer_id=1&branch_id=${invoiceBranchNumber}&pos_id=&{invoicePosNumber}`;
        axios.delete(myUrl, { responseType: 'blob' })
            .then ((response) => {
                console.log(response);
            })
            .catch((error) => {
                alert(`Error anulando la factura: ${error}`);
            });
    };


    return (
        <div className="card  p-5">
            <div className="mb-3">
                <h2 className="mb-2 text-lg"><b>Anular Factura</b></h2>
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
                    <div className="flex items-center">
                        <div>Sucursal : </div>
                        <input
                            type="number"
                            value={invoiceBranchNumber}
                            onChange={(e) => setInvoiceBranchNumber(e.target.value)}
                            className="border rounded p-1 ml-2"
                            placeholder="Sucursal..."
                        />
                    </div>
                    <div className="flex items-center">
                       <div>Punto de venta: </div>
                        <input
                            type="number"
                            value={invoicePosNumber}
                            onChange={(e) => setInvoicePosNumber(e.target.value)}
                            className="border rounded p-1 ml-2"
                        osplaceholder="Punto de venta..."
                        />
                    </div>
                    <div>
                        <label htmlFor="country">Motivos de anulación </label>
                        <select id="is_roll" className="form-select" onChange={(e) => setIsRoll(e.target.value)}>
                            <option value="1">FACTURA MAL EMITIDA</option>
                            <option value="2">NOTA DE CREDITO-DEBITO MAL EMITIDA</option>
                            <option value="3">DATOS DE EMISION INCORRECTOS</option>
                            <option value="4">FACTURA O NOTA DE CREDITO-DEBITO DEVUELTA</option>
                        </select>
                    </div>
                </ol>
                <ul>
                    <div className="mb-2 flex justify-between">
                        <button onClick={handleAnularFactura} className="primary-button">
                            Anular Factura
                        </button>
                    </div>
                </ul>
            </div>
        </div>
    )
}

