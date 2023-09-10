'use client'

import CheckoutWizard from '@/components/CheckoutWizard'
import { savePaymentMethod } from '@/redux/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function ShippingAddressPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { shippingAddress } = useSelector((state) => state.cart)

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
    const [creditCardNumber, setCreditCardNumber] = useState('');

    useEffect(() => {
        if (!shippingAddress.address) {
            return router.push('/shipping')
        }
    }, [router, shippingAddress])

    const handlePaymentMethodChange = (event) => {
        const newValue = event.target.value;
        setSelectedPaymentMethod(newValue);
    };

    const handleCreditCardChange = (event) => {
        const newValue = event.target.value;
        // Obfuscate the central eight digits with zeroes
        const obfuscatedCardNumber = newValue.replace(/^(\d{4})\d{8}(\d{4})$/, '$100000000$2');
        setCreditCardNumber(obfuscatedCardNumber);
    };

    const submitHandler = () => {
        // Store the selected payment method in Redux
        dispatch(savePaymentMethod(selectedPaymentMethod));
        router.push('/');
    };

    return (
        <div>
            <CheckoutWizard activeStep={2} />
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
            <button onClick={submitHandler}>Submit</button>
        </div>
    );
}
