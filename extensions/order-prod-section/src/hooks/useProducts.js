import { useQuery } from '@shopify/ui-extensions-react/customer-account';

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
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

export function useProducts(first = 5) {
  const { data, isLoading, error, refetch } = useQuery(PRODUCTS_QUERY, {
    variables: { first },
  });

  return { data, isLoading, error, refetch };
}