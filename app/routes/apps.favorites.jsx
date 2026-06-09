import { authenticate } from "../shopify.server";
import  prisma  from "../db.server";

// Handle POST requests (saving favorites)
export async function action({ request }) {
  try {
    // 1. Authenticate the request and get the session
    //const { admin, session } = await authenticate.public.appProxy(request);
    
    // 2. Get the request body data
    const { productId, customerId, shop } = await request.json();
    
    // 3. Validate required fields
    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: "Product ID is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    // 4. Use the authenticated session's shop if not provided
    const shopName = shop;// || session.shop;
    const userId = customerId; // || session.userId;
    
    // 5. Check if favorite already exists
    const existingFavorite = await prisma.favoriteProduct.findFirst({
      where: {
        productId: productId,
        userId: userId,
        shopName: shopName
      }
    });
    
    if (existingFavorite) {
      // If already exists, optionally delete it (toggle functionality)
      await prisma.productFavorite.delete({
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
    
    // 6. Save new favorite to database
    const favorite = await prisma.favoriteProduct.create({
      data: {
        productId: productId,
        userId: userId,
        shopName: shopName
      }
    });
    
    // 7. Return success response
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
    
    console.error(`File: ${error.filename}`);
    console.error(`Line: ${error.lineno}`);
    console.error(`Column: ${error.colno}`);
    console.error("Error saving favorite:", error);
    
    // Handle duplicate key errors gracefully
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
    
    // Generic error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to save favorite" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// Handle GET requests (fetching favorites list)
export async function loader({ request }) {

    //return new Response("proxy route is alive", { status: 200 });
  try {
    //const { session } = await authenticate.public.appProxy(request);
    const { productId, customerId, shop } = await request.json();


    const favorites = await prisma.favoriteProduct.findMany({
      where: {
        userId: customerId,
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
        error: "Failed to fetch favorites", 
        msg: error 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(
      JSON.stringify({ 
        success: false, 
        error: "No data" 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
}