import { useState } from 'react';
import {
  BlockStack,
  Text,
  View,
  Button,
} from '@shopify/ui-extensions-react/customer-account';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from './ProductList';

export function ProductSection() {
  const [first, setFirst] = useState(5);
  const { data, isLoading, error, refetch } = useProducts(first);
  const products = data?.products?.edges || [];

  if (error) {
    return (
      <View padding="base" border="critical" cornerRadius="base">
        <Text appearance="critical">Unable to load products. Please try again.</Text>
      </View>
    );
  }

  return (
    <BlockStack spacing="base">
      <View
        padding="base"
        border="base"
        cornerRadius="base"
        backgroundColor="surface-secondary"
      >
        <Text size="large" emphasis="bold">
          Recommended Products
        </Text>
      </View>

      <ProductList products={products} isLoading={isLoading} />

      {products.length >= first && (
        <View padding="base">
          <Button onPress={() => {
            setFirst(prev => prev + 5);
            refetch({ first: first + 5 });
          }} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </View>
      )}
    </BlockStack>
  );
}