import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    expect(result).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('should override conflicting Tailwind classes', () => {
    const result = cn('p-4', 'p-8');
    expect(result).toBe('p-8');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle arrays', () => {
    const result = cn(['class-1', 'class-2']);
    expect(result).toBe('class-1 class-2');
  });
});
