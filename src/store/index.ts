import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE
} from 'redux-persist'
import repoReducer from './repoSlice/repoSlice'
import { baseApiSlice } from '../api'

const rootReducer = combineReducers({
	repoReducer,
	[baseApiSlice.reducerPath]: baseApiSlice.reducer
})

const persistConfig = {
	key: 'incodeToDo',
	storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const setupStore = () =>
	configureStore({
		reducer: persistedReducer,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
				}
			}).concat(baseApiSlice.middleware)
	})

export const store = setupStore()
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
