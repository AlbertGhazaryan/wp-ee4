import { View, BlockStack, Text, Button, ProductThumbnail } from '@shopify/ui-extensions-react/customer-account';

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
          <ProductThumbnail
            source={product.featuredImage.url}
            accessibilityLabel={product.title}
            size="base"
          />
        )}
        <Text emphasis="bold">{product.title}</Text>
        <Text size="small" appearance="subdued">
          {product.description?.substring(0, 100)}...
        </Text>
        <Text emphasis="bold">
          {product.priceRange?.minVariantPrice?.amount}{' '}
          {product.priceRange?.minVariantPrice?.currencyCode}
        </Text>
        <Button onPress={() => window.location.href = `/products/${product.handle}`}>
          View Product
        </Button>
      </BlockStack>
    </View>
  );
}