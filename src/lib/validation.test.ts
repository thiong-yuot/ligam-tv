import { describe, it, expect } from 'vitest';
import {
  chatMessageSchema,
  streamSchema,
  productSchema,
  validateOrThrow,
  validateInput,
} from './validation';

describe('Validation Schemas', () => {
  describe('chatMessageSchema', () => {
    it('should validate a valid message', () => {
      const validMessage = { message: 'Hello, world!' };
      const result = chatMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should reject an empty message', () => {
      const invalidMessage = { message: '' };
      const result = chatMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should reject a message that is too long', () => {
      const invalidMessage = { message: 'a'.repeat(501) };
      const result = chatMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace', () => {
      const message = { message: '  Hello  ' };
      const result = chatMessageSchema.parse(message);
      expect(result.message).toBe('Hello');
    });
  });

  describe('streamSchema', () => {
    it('should validate a valid stream', () => {
      const validStream = {
        title: 'My Stream',
        description: 'A great stream',
        category_id: '550e8400-e29b-41d4-a716-446655440000',
      };
      const result = streamSchema.safeParse(validStream);
      expect(result.success).toBe(true);
    });

    it('should reject a stream without a title', () => {
      const invalidStream = { description: 'No title' };
      const result = streamSchema.safeParse(invalidStream);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields as null', () => {
      const stream = {
        title: 'Stream',
        description: null,
        category_id: null,
      };
      const result = streamSchema.safeParse(stream);
      expect(result.success).toBe(true);
    });
  });

  describe('productSchema', () => {
    it('should validate a valid product', () => {
      const validProduct = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        category: 'Electronics',
      };
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject negative prices', () => {
      const invalidProduct = {
        name: 'Product',
        price: -10,
        category: 'Test',
      };
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('should reject prices that are too high', () => {
      const invalidProduct = {
        name: 'Product',
        price: 100000,
        category: 'Test',
      };
      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('validateOrThrow', () => {
    it('should return data for valid input', () => {
      const data = { message: 'Valid message' };
      const result = validateOrThrow(chatMessageSchema, data);
      expect(result).toEqual({ message: 'Valid message' });
    });

    it('should throw an error for invalid input', () => {
      const data = { message: '' };
      expect(() => validateOrThrow(chatMessageSchema, data)).toThrow();
    });
  });

  describe('validateInput', () => {
    it('should return success object for valid input', () => {
      const data = { message: 'Valid message' };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ message: 'Valid message' });
      }
    });

    it('should return error object for invalid input', () => {
      const data = { message: '' };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeTruthy();
      }
    });
  });
});
