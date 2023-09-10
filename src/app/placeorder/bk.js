<div>
    <CheckoutWizard activeStep={3} />
    <h1 className="mb-4 text-xl"><b>Emisión de Factura</b></h1>
    {loading ? (
        <div>Loading</div>
    ) : cartItems.length === 0 ? (
        <div>
            Cart is empty. <Link href="/">Hacer venta</Link>
        </div>
    ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
                <div className="card  p-5">
                    <h2 className="mb-2 text-lg"><b>Datos del cliente</b></h2>
                    <div>
                        {shippingAddress.fullName}, {shippingAddress.address},{' '}
                        {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                        {shippingAddress.country}
                    </div>
                    <div>
                        <Link className="default-button inline-block" href="/shipping">
                            Editar
                        </Link>
                    </div>
                </div>
                <div className="card  p-5">
                    <h2 className="mb-2 text-lg"><b>Método de Pago</b></h2>
                    <div>{paymentMethod}</div>
                    <div>
                        <Link className="default-button inline-block" href="/payment">
                            Editar
                        </Link>
                    </div>
                </div>
                <div className="card overflow-x-auto p-5">
                    <h2 className="mb-2 text-lg"><b>Artículos de venta</b></h2>
                    <table className="min-w-full">
                        <thead className="border-b">
                        <tr>
                            <th className="px-5 text-left">Artículo</th>
                            <th className="    p-5 text-right">Cantidad</th>
                            <th className="  p-5 text-right">Precio</th>
                            <th className= "  p-5 text-right">Descuento</th>
                            <th className="p-5 text-right">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td>
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="flex items-center"
                                    >
                                        {item.name}
                                    </Link>
                                </td>
                                <td className=" p-5 text-right">{item.qty}</td>
                                <td className="p-5 text-right">${item.price}</td>
                                <td className="p-5 text-right">
                                    <input
                                        type="number"
                                        value={discounts[item.id] || ''}
                                        onChange={(e) => handleItemDiscountChange(item.id, e.target.value)}
                                        placeholder="Discount"
                                        className="w-16 border rounded p-1 text-right"
                                    />
                                </td>
                                <td className="p-5 text-right">
                                    ${(item.qty * item.price - (discounts[item.id] || 0)).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div>
                        <Link className="default-button inline-block" href="/cart">
                            Editar
                        </Link>
                    </div>
                </div>
            </div>
            <div>
                <div className="card  p-5">
                    <h2 className="mb-2 text-lg"><b>Resumen de Facturación</b></h2>
                    <ul>
                        <li>
                            <div className="mb-2 flex justify-between">
                                <div>SubTotal</div>
                                <div>${calculateUpdatedSubtotal()}</div>
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
                                        placeholder="Descuento Adicional"
                                        className="w-16 border rounded p-1 text-right"
                                    />
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="mb-2 flex justify-between">
                                <div>SubTotal con Descuento</div>
                                <div>${(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
                            </div>
                        </li>
                        <li>
                            <div className="mb-2 flex justify-between">
                                <div>Monto Total</div>
                                <div>${(calculateUpdatedSubtotal() - additionalDiscount).toFixed(2)}</div>
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
