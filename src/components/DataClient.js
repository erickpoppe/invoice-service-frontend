import React from 'react'

export default function DataClient({ foundClient, setFoundClient }) {
  return (
      <div className="found-client">
        <p><b>{foundClient.nombre_razon_social}</b></p>
        <p><b>{foundClient.numero_documento}</b></p>
        <p><b>{foundClient.correo_electronico}</b></p>
      </div>
  )
}