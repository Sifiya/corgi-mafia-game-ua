import { vi } from 'vitest';

export const mockUpload = vi.fn();
export const mockSingle = vi.fn();
export const mockInsert = vi.fn();

export const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: mockInsert.mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: mockSingle,
  })),
  storage: {
    from: vi.fn(() => ({
      upload: mockUpload,
    })),
  },
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));
