-- CreateTable
CREATE TABLE "public"."pricing_activities" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "productId" TEXT,
    "customerId" TEXT,
    "businessMode" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "costPrice" DECIMAL(65,30),
    "quantity" INTEGER NOT NULL,
    "gstRate" DECIMAL(65,30) NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "discountApplied" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "marginPercent" DECIMAL(65,30),
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."pricing_activities" ADD CONSTRAINT "pricing_activities_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pricing_activities" ADD CONSTRAINT "pricing_activities_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pricing_activities" ADD CONSTRAINT "pricing_activities_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
