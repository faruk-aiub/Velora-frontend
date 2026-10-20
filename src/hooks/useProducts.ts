import { useQuery } from '@tanstack/react-query';
import { productService, ProductFilters } from '@/services/product.service';
import type { PaginatedResponse } from '@/types/auth.types';
import type { Product } from '@/types/product.types';

export function useProducts(
  filters: ProductFilters,
  initialData?: PaginatedResponse<Product> | null
) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000, // Cache results for 1 minute for instant filter toggles
    gcTime: 5 * 60 * 1000,
  });
}
