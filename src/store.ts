import { blogApi } from './pages/blog/blog.services'
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/components/blog.slice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rktQueryErrorLogger } from 'middleware'

export const store = configureStore({
  reducer: {
    blog: blogReducer,
    [blogApi.reducerPath]: blogApi.reducer
  },
  // middleware to enable for caching, invalidation, polling of rtk-query
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(blogApi.middleware, rktQueryErrorLogger)
  }
})
// force to use if we have refetchOnFocus or refetchOnReconnect
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
