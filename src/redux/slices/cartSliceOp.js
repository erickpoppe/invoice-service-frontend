import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'



const initialState = Cookies.get('cartOp')
    ? { ...JSON.parse(Cookies.get('cartOp')), loading: true }
    : {
        loading: true,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: '',
        eventId: null,
        codigoRecepcionEventoSignificativo: null,
        clientId: null,
        userId: null,

    }

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2) // 12.3456 to 12.35
}

const cartSliceOp = createSlice({
    name: 'cartOp',
    initialState,
    reducers: {
        addToCartOp: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.id === item.id)
            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.id === existItem.id ? item : x
                )
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            )
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100)
            state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice))
            state.totalPrice = addDecimals(
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            )
            Cookies.set('cartOp', JSON.stringify(state))
        },
        removeFromCartOp: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.id !== action.payload)
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            )
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100)
            state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice))
            state.totalPrice = addDecimals(
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice)
            )
            Cookies.set('cartOp', JSON.stringify(state))
        },
        saveShippingAddressOp: (state, action) => {
            state.shippingAddress = action.payload
            Cookies.set('cartOp', JSON.stringify(state))
        },
        savePaymentMethodOp: (state, action) => {
            state.paymentMethod = action.payload
            Cookies.set('cartOp', JSON.stringify(state))
        },

        saveClientIdOp: (state, action) => {
            state.clientId = action.payload
            Cookies.set('cartOp', JSON.stringify(state))
        },

        saveUserIdOp: (state, action) => {
            state.userId = action.payload
            Cookies.set('cartOp', JSON.stringify(state))
        },

        hideLoadingOp: (state) => {
            state.loading = false
        },
        clearCartOp: (state) => {
            state.cartItems = [];
            state.itemsPrice = '0.00';
            state.shippingPrice = '0.00';
            state.taxPrice = '0.00';
            state.totalPrice = '0.00';
            Cookies.remove('cartOp');
        },

    },
});
export const {
    addToCartOp,
    clearCartOp,
    removeFromCartOp,
    saveShippingAddressOp,
    savePaymentMethodOp,
    hideLoadingOp,
    saveClientIdOp,
    saveUserIdOp,
} = cartSliceOp.actions

export default cartSliceOp.reducer
