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
    const [invoiceBranchNumber, setInvoiceBranchNumber] = useState(1);
    const [invoicePosNumber, setInvoicePosNumber] = useState(1);

    const translateBranchNumber = (value) => {
        const branchNumberMap = {
            '0': 1,
            '1': 2,
            '2': 3,
            '3': 4
        };
      
       return branchNumberMap[value] || 1;
      
    };
    
    const translatePosNumber = (value) => {
        const posNumberMap = {
            '4': 1,
            '5': 2,
        };
      
       return posNumberMap[value] || 1;
      
    };

    const handleAnularFactura = (event) => {
        const translatedBranchNumber = translateBranchNumber(invoiceBranchNumber);
 
        const translatedPosNumber = translatePosNumber(invoicePosNumber);
       
        const myUrl = `https://prod-core-invoice-service-4z5dz4d2yq-uc.a.run.app/invoices/emit/number/?invoice_number=${invoicePrintNumber}&codigo_motivo=${isRoll}&customer_id=1&branch_id=${translatedBranchNumber}&pos_id=${translatedPosNumber}`;
        axios.delete(myUrl, { headers: { 'Accept': 'application/json' } })
            .then ((response) => {
                if(response.status == 200) { 
                    toast.success('Factura anulada exitosamente.');
                } else {
                    console.log(response);  
                }
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    toast.error(`Error anulando la factura: ${error.response.data.detail}`);
                } else {
                    toast.error(`Error: ${error}`);
                }
            });
    };


    return (
        <div className="card  p-5">
            <ToastContainer />
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
                        />
                    </div>
                    <div className="flex items-center">
                        <div>Sucursal : </div>
                        <input
                            type="number"
                            value={invoiceBranchNumber}
                            onChange={(e) => setInvoiceBranchNumber(e.target.value)}
                            className="border rounded p-1 ml-2"
                        />
                    </div>
                    <div className="flex items-center">
                       <div>Punto de venta: </div>
                        <input
                            type="number"
                            value={invoicePosNumber}
                            onChange={(e) => setInvoicePosNumber(e.target.value)}
                            className="border rounded p-1 ml-2"
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

