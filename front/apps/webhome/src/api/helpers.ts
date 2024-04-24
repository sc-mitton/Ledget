import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

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
