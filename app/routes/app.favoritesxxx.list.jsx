
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  
  const shopName = session.shop;
  const userId = session.userId;

  // Your database query here
  const favorites = await prisma.productFavorite.findMany({
    where: {
      userId: userId,
      shopName: shopName
    }
  });

  // ... rest of your logic

  return { products: validProducts, count: validProducts.length };
}