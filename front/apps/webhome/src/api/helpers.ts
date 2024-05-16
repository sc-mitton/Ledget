import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
    error: unknown,
): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
    error: unknown,
): error is { error: { message: string } } {
    return (
        typeof error === 'object' &&
        error != null &&
        'error' in error &&
        typeof (error as any).error === 'object' &&
        'message' in (error as any).error &&
        typeof (error as any).error.message === 'string'
    )
}

export function isErrorWithCode(
    error: unknown,
): error is { error: { code: string } } {
    return (
        typeof error === 'object' &&
        error != null &&
        'error' in error &&
        typeof (error as any).error === 'object' &&
        'code' in (error as any).error &&
        typeof (error as any).error.code === 'string'
    )
}

export function hasErrorCode(
    code: string,
    error?: FetchBaseQueryError | SerializedError,
): boolean {
    return (
        error &&
        'status' in error &&
        isErrorWithCode(error.data) &&
        error.data.error.code === code
    ) || false
}
