import { useQuery } from '@tanstack/react-query';
import { productService, ProductFilters } from '@/services/product.service';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    // Ensure data is cached, but refetches correctly if filters change
  });
}
