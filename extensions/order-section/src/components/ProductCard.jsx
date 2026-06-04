import { View, BlockStack, Text, Button } from '@shopify/ui-extensions-react/customer-account';

export function ProductCard({ product }) {
  return (
    <View
      padding="base"
      border="base"
      cornerRadius="base"
      backgroundColor="surface"
    >
      <BlockStack spacing="tight">
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.title}
            style={{ width: '100%', maxWidth: '200px', borderRadius: '8px' }}
          />
        )}
        <Text emphasis="bold">{product.title}</Text>
        <Text size="small" appearance="subdued">
          {product.description?.substring(0, 100)}...
        </Text>
        <Text emphasis="bold">
          {product.priceRange.minVariantPrice.amount}{' '}
          {product.priceRange.minVariantPrice.currencyCode}
        </Text>
        <Button onPress={() => window.location.href = `/products/${product.handle}`}>
          View Product
        </Button>
      </BlockStack>
    </View>
  );
}