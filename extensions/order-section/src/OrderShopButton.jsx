import {
  reactExtension,
  Button,
  BlockStack,  
  useApi, 
  Modal,
  TextBlock,
} from '@shopify/ui-extensions-react/customer-account';
import { useState } from 'react';

export default reactExtension(
  'customer-account.order-status.block.render',
  () => <Extension />,
);

function Extension() {
   const [count, setCount] = useState(0);
   const {ui} = useApi();

  const modalId = 'my-example-modal';
  return (
    <>
    <BlockStack spacing="base">
      <Button
        to="https://backstage-dev.myshopify.com/collections/all"
      >
        Shop Now
      </Button>
    </BlockStack>
    <Button
      overlay={
        <Modal id={modalId} title="Example Modal" padding>
          <TextBlock>
            This is the content inside your popup. You can add any components here.
          </TextBlock>
          <Button onPress={() => ui.overlay.close(modalId)}>
            Close
          </Button>
        </Modal>
      }
    >
      Open Modal
    </Button>
    </>
  );
}