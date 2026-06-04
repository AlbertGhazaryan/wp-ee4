import type { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();

    const {
      productId,
      customerId,
      shop
    } = body;

    if (!productId || !customerId || !shop) {
      return Response.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.favoriteProduct.findFirst({
      where: {
        productId,
        customerId,
        shop
      }
    });

    if (existing) {
      return Response.json({
        success: true,
        alreadyExists: true
      });
    }

    await prisma.favoriteProduct.create({
      data: {
        productId,
        customerId,
        shop
      }
    });

    return Response.json({
      success: true
    });

  } catch (error) {
    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}