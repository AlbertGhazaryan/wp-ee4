import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";

// Handles GET
export async function loader({ request }) {
  return new Response(
    JSON.stringify({ ok: true, message: "proxy works" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}



// Handles POST ← make sure this exists
export async function action({ request }) {
  const { session } = await authenticate.public.appProxy(request);

  const body = await request.json();

  const favorite = await prisma.favoriteProduct.create({
    data: {
      shop: session?.shop,
      productId: body.productId,
    }
  });

  return new Response(
    JSON.stringify({ ok: true, favorite }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
