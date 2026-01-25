/**
 * Error helpers for user-friendly messaging.
 */

import { StorageError, StorageErrorCode } from '@/types/errors';

export function getUserFriendlyError(error: unknown, fallbackMessage: string): string {
  if (error instanceof StorageError) {
    if (error.code === StorageErrorCode.QUOTA_EXCEEDED) {
      return 'Storage is full. Export your data for backup, then clear unused items to continue.';
    }
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
