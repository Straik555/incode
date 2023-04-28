import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'

export const useAppDispatch = () => useDispatch<AppDispatch>()

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useRepo = () => useAppSelector(state => state.repoReducer)
