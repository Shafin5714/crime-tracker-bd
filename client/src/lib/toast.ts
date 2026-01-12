import { toast } from "sonner";

/**
 * Toast utility functions for consistent notification display
 */

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast.info(message);
};

export const showWarning = (message: string) => {
  toast.warning(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (id?: string | number) => {
  toast.dismiss(id);
};

/**
 * Show a promise toast that automatically updates based on the promise state
 * @example
 * showPromise(
 *   submitCrimeReport(data),
 *   {
 *     loading: "Submitting report...",
 *     success: "Report submitted successfully!",
 *     error: "Failed to submit report",
 *   }
 * );
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
) => {
  return toast.promise(promise, messages);
};

/**
 * Parse API error and show appropriate toast
 */
export const showApiError = (error: unknown) => {
  if (error instanceof Error) {
    showError(error.message);
  } else if (typeof error === "object" && error !== null && "message" in error) {
    showError((error as { message: string }).message);
  } else {
    showError("An unexpected error occurred");
  }
};

export { toast };
