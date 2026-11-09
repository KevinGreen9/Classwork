import { useSelector } from "react-redux"
import type { RootState } from "../../App/store.ts"

export const useAppSelector = useSelector.withTypes<RootState>()