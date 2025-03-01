import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mockSupabaseClient, mockSingle } from '@/lib/supabase/test.utils';
import { uploadImages } from '../AddCorgi/uploadImages';
import { sendDog } from '../AddCorgi/sendDog';

vi.mock('@/lib/supabase/client', () => ({
  default: mockSupabaseClient,
}));

describe('uploadImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should upload images successfully', async () => {
    const mockFiles = [
      new File(['test'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test'], 'test2.jpg', { type: 'image/jpeg' }),
    ];

    mockSupabaseClient.storage.from().upload.mockResolvedValue({ data: 'url', error: null });

    const result = await uploadImages(mockFiles);

    expect(result.errors).toHaveLength(0);
    expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith(import.meta.env.VITE_CORGIS_BUCKET_NAME);
    expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledTimes(2);
  });

  test('should handle upload errors', async () => {
    const mockFiles = [
      new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
    ];

    mockSupabaseClient.storage.from().upload.mockResolvedValue({
      data: null,
      error: { message: 'Помилка завантаження' }
    });

    const result = await uploadImages(mockFiles);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      message: 'Помилка завантаження',
      filename: 'test.jpg',
    });
  });
});

describe('sendDog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should send dog data successfully', async () => {
    const mockDog = {
      name: 'Пундик',
      ownerName: 'Марія',
      images: ['url1', 'url2'],
    };

    mockSingle.mockResolvedValue({
      data: { id: 1, ...mockDog },
      error: null
    });

    const result = await sendDog(mockDog);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('dogs');
    expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith({
      name: mockDog.name,
      owner_name: mockDog.ownerName,
      images: mockDog.images,
      include: true,
    });
  });

  test('should handle send dog data errors', async () => {
    const mockDog = {
      name: 'Пундик',
      ownerName: 'Марія',
      images: ['url1'],
    };

    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Помилка відправки' }
    });

    const result = await sendDog(mockDog);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Помилка відправки');
  });
});
