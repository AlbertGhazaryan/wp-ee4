import {
  reactExtension,
  useApi,
  TextField,
  Button,
  BlockStack,
  View,
  Text,
  useCartLines,
} from '@shopify/ui-extensions-react/customer-account';
import { useState, useEffect } from 'react';

export default reactExtension('customer-account.order-status.block.render', () => <App />);

function App() {
  const { resource } = useApi();
  const cartLines = useCartLines(); // Gets all line items in the order
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Extract product variant IDs from order line items
  const getProductVariantIds = () => {
     if (!resource?.lineItems?.edges) return [];
    return resource.lineItems.edges.map(edge => edge.node?.merchandise?.id).filter(Boolean);
  };

  // 1. Fetch existing note and product IDs when page loads
  useEffect(() => {
    async function fetchOrderData() {
      try {
        const query = `
          query GetOrderData($orderId: ID!) {
            order(id: $orderId) {
              metafield(namespace: "custom", key: "order_note") {
                value
              }
              metafield(namespace: "custom", key: "product_ids") {
                value
              }
            }
          }
        `;

        const response = await fetch(
          'shopify://customer-account/api/2025-07/graphql.json',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              variables: { orderId: resource?.id },
            }),
          }
        );

        const result = await response.json();
        setMessage(result.data?.order?.metafield?.value || '');
        // Optionally load previously saved product IDs if needed
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, [resource?.id]);
  console.log('resource?.idresource?.id', resource?.id); 
  // 2. Save both note and product IDs
  const saveOrderData = async () => {
    setIsSaving(true);
    setSaveStatus('');

    const productVariantIds = getProductVariantIds();
    
    // Convert array to JSON string for storage
    const productIdsJson = JSON.stringify(productVariantIds);

    try {
      const mutation = `
        mutation saveOrderData($orderId: ID!, $note: String!, $productIds: String!) {
          metafieldsSet(metafields: [
            {
              ownerId: $orderId
              namespace: "custom"
              key: "order_note"
              type: "multi_line_text_field"
              value: $note
            },
            {
              ownerId: $orderId
              namespace: "custom"
              key: "orderproductsids"
              type: "multi_line_text_field"
              value: $productIds
            }
          ]) {
            metafields { key value }
            userErrors { field message }
          }
        }
      `;

      const response = await fetch(
        'shopify://customer-account/api/2025-07/graphql.json',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: mutation,
            variables: { 
              orderId: resource?.id, 
              note: message,
              productIds: productIdsJson
            },
          }),
        }
      );

      const result = await response.json();
      
      if (result.errors || result.data?.metafieldsSet?.userErrors?.length) {
        throw new Error('Could not save data');
      }

      setSaveStatus(`Saved! Found ${productVariantIds.length} product(s) in this order`);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <View padding="base"><Text>Loading...</Text></View>;

  // Display product count for transparency
  const productCount = getProductVariantIds().length;

  return (
    <View padding="base" border="base" cornerRadius="base">
      <BlockStack spacing="base">
        <Text size="base" emphasis="bold">
          Add a Note to Your Purchase
        </Text>
        <Text size="small" appearance="subdued">
          This order contains {productCount} product(s). We'll save your message along with product information.
        </Text>
        <TextField
          label="Your Message"
          value={message}
          onChange={setMessage}
          multiline={3}
        />
        <Button
          kind="primary"
          onPress={saveOrderData}
          disabled={isSaving}
          loading={isSaving}
        >
          Save Note
        </Button>
        {saveStatus && <Text appearance="success">{saveStatus}</Text>}
      </BlockStack>
    </View>
  );
}