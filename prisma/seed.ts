import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories } from "../src/data/categories";
import { products, productReviews } from "../src/data/products";
import { coupons } from "../src/lib/coupons";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Selavie Femme...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();

  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
      },
    });
  }

  for (const product of products) {
    const category = categories.find((c) => c.slug === product.categorySlug);
    if (!category) continue;

    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description: product.description,
        ingredients: product.ingredients,
        howToUse: product.howToUse,
        price: product.price,
        compareAt: product.compareAt,
        brand: product.brand,
        gender: product.gender,
        images: product.images,
        stock: product.stock,
        soldCount: product.soldCount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        categoryId: category.id,
        createdAt: new Date(product.createdAt),
      },
    });

    const reviews = productReviews[product.id] || [];
    for (const review of reviews) {
      await prisma.review.create({
        data: {
          id: review.id,
          productId: product.id,
          author: review.author,
          rating: review.rating,
          comment: review.comment,
          createdAt: new Date(review.createdAt),
        },
      });
    }
  }

  for (const coupon of coupons) {
    await prisma.coupon.create({
      data: {
        code: coupon.code,
        discountPct: coupon.discountPct,
        discountFlat: coupon.discountFlat,
        active: true,
      },
    });
  }

  const passwordHash = await bcrypt.hash("selavie123", 10);
  await prisma.user.upsert({
    where: { email: "demo@selavie.com.br" },
    update: {},
    create: {
      name: "Cliente Selavie",
      email: "demo@selavie.com.br",
      phone: "11999999999",
      passwordHash,
    },
  });

  console.log("✅ Seed concluído");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
