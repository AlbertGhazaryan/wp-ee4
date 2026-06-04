import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const customerId = url.searchParams.get("customerId");
  const shop = url.searchParams.get("shop");

  if (!customerId || !shop) {
    return Response.json([]);
  }

  const favorites = await prisma.favoriteProduct.findMany({
    where: {
      customerId,
      shop
    }
  });

  return Response.json(favorites);
}