'use client'

import AddToCart from '@/components/AddToCart'
import { data } from '@/utils/data'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductDetailPage({ params: { id } }) {
  const product = data.products.find((x) => x.id === id)
  const [productInfo, setProductInfo] = useState({
    codigoProductoSin: product?.codigoProductoSin || 99100,
    descripcion: "",
    unidadMedida: 58,
    especialidad: product?.especialidad || "Especialidad",
    especialidadDetalle: product?.especialidadDetalle || "string",
    nroQuirofanoSalaOperaciones: 1,
    especialidadMedico: product?.especialidadMedico || "string",
    nombreApellidoMedico: "Medicmel",
    nitDocumentoMedico: 392010028,
    nroMatriculaMedico: "string",
    nroFacturaMedico: 1,
  })

  const saveDataToLocalStorage = () => {
    // Save the productInfo to local storage
    localStorage.setItem('productInfo', JSON.stringify(productInfo));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductInfo({
      ...productInfo,
      [name]: value,
    })
  }

  if (!product) {
    return <div>Producto no encontrado</div>
  }
  return (
    <div>
      <div className="py-2">
        <Link href="/placeorder">Volver a elegir productos</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <div>
            <label htmlFor="codigoProductoSin"><b>Código Producto Sin:</b></label>
            <input
                type="number"
                id="codigoProductoSin"
                name="codigoProductoSin"
                value={productInfo.codigoProductoSin}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="especialidad"><b>Especialidad:</b></label>
            <input
                type="text"
                id="especialidad"
                name="especialidad"
                value={productInfo.especialidad}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="especialidadDetalle"><b>Especialidad detalle:</b></label>
            <input
                type="text"
                id="especialidadDetalle"
                name="especialidadDetalle"
                value={productInfo.especialidadDetalle}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="nroQuirofanoSalaOperaciones"><b>Numero de quirofano o sala de operaciones:</b></label>
            <input
                type="text"
                id="nroQuirofanoSalaOperaciones"
                name="nroQuirofanoSalaOperaciones"
                value={productInfo.nroQuirofanoSalaOperaciones}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="especialidadMedico"><b>Especialidad del médico:</b></label>
            <input
                type="text"
                id="especialidadMedico"
                name="especialidadMedico"
                value={productInfo.especialidadMedico}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="nombreApellidoMedico"><b>Nombre y Apellido del médico:</b></label>
            <input
                type="text"
                id="nombreApellidoMedico"
                name="nombreApellidoMedico"
                value={productInfo.nombreApellidoMedico}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="nitDocumentoMedico"><b>NIT o Documento médico:</b></label>
            <input
                type="text"
                id="nitDocumentoMedico"
                name="nitDocumentoMedico"
                value={productInfo.nitDocumentoMedico}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="nroMatriculaMedico"><b>Número de matrícula del médico:</b></label>
            <input
                type="text"
                id="nroMatriculaMedico"
                name="nroMatriculaMedico"
                value={productInfo.nroMatriculaMedico}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="nroFacturaMedico"><b>Número de factura del médico:</b></label>
            <input
                type="text"
                id="nroFacturaMedico"
                name="nroFacturaMedido"
                value={productInfo.nroFacturaMedico}
                onChange={handleInputChange}
                className="w-full border rounded-md py-2 px-3"
            />
          </div>

        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>

            <li>

            </li>

            <li>
              <hr className="my-3" />
              Descripción:
              <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Datos</div>
            </div>

            <div>
              {/* Input fields and other components */}
              <button className="primary-button" onClick={saveDataToLocalStorage}>Guardar datos</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
