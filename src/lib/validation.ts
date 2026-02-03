import { z } from "zod";

// Chat message validation
export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be 500 characters or less"),
});

// Stream validation
export const streamSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),
  category_id: z.string().uuid().optional().nullable(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

// Message validation
export const messageSchema = z.object({
  recipient_id: z.string().uuid("Invalid recipient"),
  freelancer_id: z.string().uuid().optional().nullable(),
  subject: z
    .string()
    .trim()
    .max(200, "Subject must be 200 characters or less")
    .optional()
    .nullable(),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less"),
});

// Product validation
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must be 200 characters or less"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or less")
    .optional()
    .nullable(),
  price: z.number().min(0, "Price must be positive").max(99999, "Price too high"),
  sale_price: z.number().min(0).max(99999).optional().nullable(),
  category: z.string().min(1, "Category is required").max(50),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  stock_quantity: z.number().int().min(0).max(999999).optional(),
});

// Helper function to validate and throw on error
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(firstError?.message || "Validation failed");
  }
  return result.data;
}

// Helper function to validate and return result
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.errors[0];
  return { success: false, error: firstError?.message || "Validation failed" };
}
