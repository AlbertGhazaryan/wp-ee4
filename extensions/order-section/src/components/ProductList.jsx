import { BlockStack, View, Text } from '@shopify/ui-extensions-react/customer-account';
import { ProductCard } from './ProductCard';

export function ProductList({ products, isLoading }) {
  if (isLoading) {
    return (
      <View padding="base">
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View padding="base">
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <BlockStack spacing="base">
      {products.map(({ node: product }) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </BlockStack>
  );
}