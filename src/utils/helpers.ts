import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

interface ErrorFromObject {
  [key: string | number]: string | ErrorFromObject | ErrorFromObject[]
}
interface EntityError {
  status: 422
  data: {
    error: ErrorFromObject
  }
}
// thu hep 1 error co kieu khong xac dinh ve FetchBaseQueryError
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

// thu hep 1 error co kieu khong xac dinh ve 1 obj voi thuoc tinh message: string (SerializedError)
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error
}

// thu hep 1 error co kieu khong xac dinh ve loi lien quan den POST PUT ko dung fiel (EntityError)
export function isEntityError(error: unknown): error is EntityError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}

export class CustomError extends Error {
  constructor(message: string) {
    super()
  }
}
