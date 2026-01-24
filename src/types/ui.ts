/**
 * UI state types for React components and async operations
 */

/**
 * Loading state for async operations
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async operation state
 */
export interface AsyncState<T> {
  status: LoadingState;
  data?: T;
  error?: string;
}

/**
 * Form state for category/asset forms
 */
export interface FormState<T> {
  /** Current form values */
  values: T;
  /** Field-level errors */
  errors: Partial<Record<keyof T, string>>;
  /** Whether form has been submitted */
  submitted: boolean;
  /** Whether form is currently submitting */
  submitting: boolean;
}

/**
 * View mode for visualizations
 */
export type VisualizationMode = 'table' | 'chart';

/**
 * Chart type for visualizations
 */
export type ChartType = 'pie' | 'bar';
