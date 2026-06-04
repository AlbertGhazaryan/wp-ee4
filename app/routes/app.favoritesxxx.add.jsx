import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.json();
  
  const { productId } = formData;
  const shopName = session.shop;
  const userId = session.userId;

  try {
    // Check if favorite already exists
    const existing = await prisma.productFavorite.findUnique({
      where: {
        productId_userId_shopName: {
          productId,
          userId,
          shopName
        }
      }
    });

    if (existing) {
      return json({ 
        success: false, 
        message: 'Product already in favorites' 
      }, { status: 409 });
    }

    // Create new favorite
    const favorite = await prisma.productFavorite.create({
      data: {
        productId,
        userId,
        shopName
      }
    });

    return json({ 
      success: true, 
      favorite,
      message: 'Product added to favorites'
    });

  } catch (error) {
    console.error('Error adding favorite:', error);
    return json({ 
      success: false, 
      message: 'Failed to add favorite' 
    }, { status: 500 });
  }
};