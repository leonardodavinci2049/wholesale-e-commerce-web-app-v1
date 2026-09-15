import { z } from "zod";

export const ProductWholesaleFindAllSchema = z.object({
  pe_user_id: z.string().max(200).optional(),
  pe_user_name: z.string().max(200).optional(),
  pe_user_role: z.string().max(200).optional(),
  pe_person_id: z.number().optional(),
  pe_customer_id: z.number().optional(),
  pe_search: z.string().max(300).optional(),
  pe_taxonomy_id: z.number().int().optional(),
  pe_brand_id: z.number().int().optional(),
  pe_stock_flag: z.number().int().optional(),
  pe_qt_records: z.number().int().positive().optional(),
  pe_page_id: z.number().int().min(0).optional(),
  pe_column_id: z.number().int().optional(),
  pe_order_id: z.number().int().optional(),
});

export const ProductWholesaleFindByIdSchema = z.object({
  pe_user_id: z.string().max(200).optional(),
  pe_user_name: z.string().max(200).optional(),
  pe_user_role: z.string().max(200).optional(),
  pe_person_id: z.number().optional(),
  pe_customer_id: z.number().optional(),
  pe_product_id: z.number().int().optional(),
  pe_product_slug: z.string().max(300).optional(),
});

export const ProductWholesaleSectionsSchema = z.object({
  pe_user_id: z.string().max(200).optional(),
  pe_user_name: z.string().max(200).optional(),
  pe_user_role: z.string().max(200).optional(),
  pe_person_id: z.number().optional(),
  pe_customer_id: z.number().optional(),
  pe_taxonomy_id: z.number().int().optional(),
  pe_brand_id: z.number().int().optional(),
  pe_type_id: z.number().int().optional(),
  pe_promotion_flag: z.number().int().optional(),
  pe_highlight_flag: z.number().int().optional(),
  pe_launch_flag: z.number().int().optional(),
  pe_limit: z.number().int().positive().max(100).optional(),
});

export type ProductWholesaleFindAllInput = z.infer<
  typeof ProductWholesaleFindAllSchema
>;
export type ProductWholesaleFindByIdInput = z.infer<
  typeof ProductWholesaleFindByIdSchema
>;
export type ProductWholesaleSectionsInput = z.infer<
  typeof ProductWholesaleSectionsSchema
>;
