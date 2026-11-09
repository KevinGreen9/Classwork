import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../App/store.ts"

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
