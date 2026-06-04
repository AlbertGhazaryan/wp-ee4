import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
// Handles GET
export async function loader({ request }) {
  return new Response(
    JSON.stringify({ ok: true, message: "proxy works" }),
    { status: 200, headers: corsHeaders }
  );
}

// Handles POST ← make sure this exists
export async function action({ request }) {
 // const { session } = await authenticate.public.appProxy(request);
  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: corsHeaders }
  ); 
  const body = await request.json();

  const favorite = await prisma.favoriteProduct.create({
    data: {
      shop: session?.shop,
      productId: body.productId,
    }
  });

  return new Response(
    JSON.stringify({ ok: true, favorite }),
    { status: 200, headers: corsHeaders }
  );
}