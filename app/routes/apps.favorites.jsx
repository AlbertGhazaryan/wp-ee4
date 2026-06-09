import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request }) {
  try {
    // Parse the request body
    const body = await request.json();
    const { productId, customerId, shop } = body;
    
    console.log("POST received:", { productId, customerId, shop });
    
    // Validate required fields
    if (!productId || !customerId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Product ID and Customer ID are required" 
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    const shopName = shop;
    const userId = customerId;
    
    // Check if favorite already exists
    const existingFavorite = await prisma.favoriteProduct.findFirst({
      where: {
        productId: String(productId),
        userId: String(userId),
        shopName: shopName
      }
    });
    
    if (existingFavorite) {
      // Toggle: remove if exists
      await prisma.favoriteProduct.delete({
        where: { id: existingFavorite.id }
      });
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Product removed from favorites",
          action: "removed"
        }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // Create new favorite
    const favorite = await prisma.favoriteProduct.create({
      data: {
        productId: String(productId),
        userId: String(userId),
        shopName: shopName
      }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Product added to favorites",
        action: "added",
        favorite: favorite
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error in action:", error);
    
    // Check for Prisma duplicate error
    if (error.code === 'P2002') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Product already in favorites" 
        }),
        { 
          status: 409,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to save favorite" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// GET handler for fetching favorites
export async function loader({ request }) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    const shop = url.searchParams.get('shop');
    
    if (!customerId || !shop) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Customer ID and Shop are required" 
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    const favorites = await prisma.favoriteProduct.findMany({
      where: {
        userId: String(customerId),
        shopName: shop
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        count: favorites.length,
        favorites: favorites
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to fetch favorites" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}