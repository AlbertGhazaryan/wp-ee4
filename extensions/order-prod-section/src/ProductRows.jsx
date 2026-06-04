import { reactExtension, BlockStack } from '@shopify/ui-extensions-react/customer-account';
import { ProductSection } from './components/ProductSection.jsx';

export default reactExtension(
  'customer-account.order-status.block.render',
  () => <App />
);

function App() {
  return (
    <BlockStack spacing="base">
      {/* Other content above your product section */}
      <ProductSection />
      {/* Other content below your product section */}
    </BlockStack>
  );
}