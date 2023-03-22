import { AnyAction, isRejectedWithValue, Middleware, isRejected, MiddlewareAPI } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helpers'

function isPayloadErrorMessage(payload: unknown): payload is { data: { error: string }; status: number } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}
export const rktQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  /* isRejectedWithValue la moot function giup kiem tra nhung action co `isRejectedWithValue` = true tu createAsyncThunk
   * RTK Query su dung createAsyncThunk ben trong => co the su dung `isRejectedWithValue` de kiem tra loi
   */

  if (isRejected(action)) {
    if (action.error.name === 'CustomError') {
      // Những lỗi liên quan đến quá trình thực thi
      toast.warn(action.error.message)
    }
  }

  if (isRejectedWithValue(action)) {
    // Khi thuc hien query hoac mutation bi loi se chay vao day
    // Loi tu server thì aciton mới có isRejectedWithValue = true
    // Nhung action lien quan den viec caching ma bi rejected thì isRejectedWithValue = false => se ko di vao day

    if (isPayloadErrorMessage(action.payload)) {
      // loi reject tu server chi co message
      toast.warn(action.payload.data.error)
    }
  }
  return next(action)
}
