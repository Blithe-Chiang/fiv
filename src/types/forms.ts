/**
 * Form input types for creating and updating entities
 */

/**
 * Form data for creating a new large category
 */
export interface CreateLargeCategoryInput {
  name: string;
}

/**
 * Form data for creating a new small category
 */
export interface CreateSmallCategoryInput {
  name: string;
}

/**
 * Form data for creating a category association
 */
export interface CreateAssociationInput {
  smallCategoryId: string;
  largeCategoryId: string;
}

/**
 * Form data for creating a new asset
 */
export interface CreateAssetInput {
  name: string;
  amount: number;
  smallCategoryId: string;
  largeCategoryId: string;
}

/**
 * Form data for updating an existing asset
 */
export interface UpdateAssetInput {
  name?: string;
  amount?: number;
  smallCategoryId?: string;
  largeCategoryId?: string;
}

/**
 * Form data for updating category names
 */
export interface UpdateCategoryInput {
  name?: string;
}

/**
 * Form data for updating settings
 */
export interface UpdateSettingsInput {
  currencySymbol?: string;
}
