'use client'

import CheckoutWizard from '@/components/CheckoutWizard'
import { saveShippingAddress } from '@/redux/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

export default function ShippingAddressPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm()
  const router = useRouter()
  const dispatch = useDispatch()
  const { shippingAddress } = useSelector((state) => state.cart)

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const submitHandler = async (data) => {
    try {
      const url = 'https://dev-core-invoice-service-q642kqwota-uc.a.run.app/clients/?customer_id=2&branch_id=1&pos_id=1';
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      // Create a simple object with the required fields
      const payload = {
        nombre_razon_social: data.fullName,
        correo_electronico: data.address,
        complemento: data.city,
        numero_documento: data.postalCode,
        codigo_tipo_documento_identidad: data.country,
      };

      const response = await axios.post(url, payload, { headers });
      alert(`Cliente nuevo creado con ID:' ${response.data.id}`);
      dispatch(saveShippingAddress(payload));
      router.push('/payment');
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };
  return (
      <div>
        <CheckoutWizard activeStep={1} />
        <form
            className="mx-auto max-w-screen-md"
            onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-xl">Datos del Cliente</h1>
          <div className="mb-4">
            <label htmlFor="fullName">Nombre o Razón Social</label>
            <input
                className="w-full"
                id="fullName"
                autoFocus
                {...register('fullName', {
                  required: 'Por favor escriba su nombre',
                })}
            />
            {errors.fullName && (
                <div className="text-red-500">{errors.fullName.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="address">Email</label>
            <input
                className="w-full"
                id="address"
                type="email"
                {...register('address', {
                  required: 'Por favor escriba su correo electrónico',
                  minLength: {
                    value: 3,
                    message: 'Debe contener más de dos caracteres',
                  },
                })}
            />
            {errors.address && (
                <div className="text-red-500">{errors.address.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="city">Complemento</label>
            <input
                className="w-full"
                id="city"
                {...register('city', {
                })}
            />
            {errors.city && (
                <div className="text-red-500 ">{errors.city.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="postalCode">Numero de Documento</label>
            <input
                className="w-full"
                id="postalCode"
                type="number"
                {...register('postalCode', {
                  required: 'Por favor escriba el numero de documento.',
                })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country">Código de tipo de Documento  </label>
            <select id="country" className="form-select" {...register('country')}>
              <option value="1">Cédula de identidad</option>
              <option value="2">Cédula de identidad de extranjero</option>
              <option value="3">Pasaporte</option>
              <option value="4">Otro documento de identidad</option>
              <option value="5">Número de identificación tributaria</option>
            </select>
          </div>
          <div className="mb-4 flex justify-between">
            <button className="primary-button">Registrar</button>
          </div>
        </form>
      </div>
  )
}

