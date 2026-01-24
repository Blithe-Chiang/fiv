/**
 * Zod schemas for runtime validation
 * These schemas validate data at runtime and complement TypeScript compile-time checks
 */

import { z } from 'zod';

/**
 * Large Category Schema
 */
export const LargeCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
});

/**
 * Small Category Schema
 */
export const SmallCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  createdAt: z.string().datetime(),
});

/**
 * Category Association Schema
 */
export const CategoryAssociationSchema = z.object({
  smallCategoryId: z.string().uuid(),
  largeCategoryId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

/**
 * Asset Schema
 */
export const AssetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  amount: z.number().positive().finite(),
  smallCategoryId: z.string().uuid(),
  largeCategoryId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Settings Schema
 */
export const SettingsSchema = z.object({
  currencySymbol: z.string().min(1).max(5),
});

/**
 * Portfolio Data Schema (complete localStorage structure)
 */
export const PortfolioDataSchema = z.object({
  largeCategories: z.array(LargeCategorySchema),
  smallCategories: z.array(SmallCategorySchema),
  categoryAssociations: z.array(CategoryAssociationSchema),
  assets: z.array(AssetSchema),
  settings: SettingsSchema,
});

/**
 * Export File Schema
 */
export const ExportFileSchema = z.object({
  version: z.literal('1.0'),
  exportDate: z.string().datetime(),
  portfolio: PortfolioDataSchema,
});

/**
 * Create Large Category Input Schema
 */
export const CreateLargeCategoryInputSchema = z.object({
  name: z.string().min(1).max(50).trim(),
});

/**
 * Create Small Category Input Schema
 */
export const CreateSmallCategoryInputSchema = z.object({
  name: z.string().min(1).max(50).trim(),
});

/**
 * Create Asset Input Schema
 */
export const CreateAssetInputSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  amount: z.number().positive().finite(),
  smallCategoryId: z.string().uuid(),
  largeCategoryId: z.string().uuid(),
});

/**
 * Update Asset Input Schema
 */
export const UpdateAssetInputSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  amount: z.number().positive().finite().optional(),
  smallCategoryId: z.string().uuid().optional(),
  largeCategoryId: z.string().uuid().optional(),
});

/**
 * Update Settings Input Schema
 */
export const UpdateSettingsInputSchema = z.object({
  currencySymbol: z.string().min(1).max(5).optional(),
});
