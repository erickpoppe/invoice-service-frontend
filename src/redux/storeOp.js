import { configureStore } from '@reduxjs/toolkit';
import cartSliceOpReducer from './slices/cartSliceOp';

export const storeOp = configureStore({
    reducer: {
        cartOp: cartSliceOpReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default storeOp;