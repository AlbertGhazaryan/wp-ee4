import { useState, useEffect } from 'react';
import {
  BlockStack,
  Text,
  View,
  Button,
} from '@shopify/ui-extensions-react/customer-account';
//import { useProducts } from '../hooks/useProducts.js';

import { ProductList } from './ProductList.jsx';

export function ProductSection() {
  const [first, setFirst] = useState(5);
  //const { data, isLoading, error, refetch } = useProducts(first);
  //const products = data?.products?.edges || [];

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = `
          query {
            products(first: 5) {
              edges {
                node {
                  id
                  title
                  description
                  featuredImage {
                    url
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(
          'https://backstage-dev.myshopify.com/api/2025-07/graphql.json',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          }
        );

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setProducts(result.data?.products?.edges || []);
      } catch (err) {
        console.error('GraphQL error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (error) {
    return (
      <View padding="base" border="critical" cornerRadius="base">
        <Text appearance="critical">Unable to load products. Please try again.v2 </Text>
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