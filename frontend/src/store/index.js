import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './data.slice'
import apiReducer from './api.reducer'

export const store = configureStore({
    reducer: {
        [apiReducer.reducerPath]: apiReducer.reducer,
        dataReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiReducer.middleware),
})