-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MASTER', 'DEALER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_INVITATION', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('CREATE_QUOTATION', 'EDIT_QUOTATION', 'DELETE_QUOTATION', 'SHARE_QUOTATION', 'VIEW_ALL_QUOTATIONS', 'MANAGE_PRODUCTS', 'VIEW_PRODUCTS', 'MANAGE_CUSTOMERS', 'VIEW_CUSTOMERS', 'VIEW_REPORTS', 'EXPORT_DATA', 'MANAGE_SETTINGS', 'MANAGE_TEMPLATES', 'MANAGE_USERS', 'VIEW_ACTIVITY_LOGS', 'SYSTEM_SETTINGS');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE_QUOTATION', 'UPDATE_QUOTATION', 'DELETE_QUOTATION', 'SHARE_QUOTATION', 'CONVERT_QUOTATION', 'UPDATE_PROFILE', 'MANAGE_PRODUCTS', 'GST_CALCULATION', 'BATTERY_CALCULATION', 'EXPORT_DATA', 'ADMIN_ACTION');

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('BATTERY', 'INVERTER', 'SOLAR_PANEL', 'ACCESSORIES', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BatteryType" AS ENUM ('LEAD_ACID', 'SMF', 'LITHIUM', 'GEL', 'AGM');

-- CreateEnum
CREATE TYPE "public"."OfferType" AS ENUM ('PERCENTAGE_DISCOUNT', 'FIXED_AMOUNT_DISCOUNT', 'BUY_X_GET_Y', 'COMBO_DEAL', 'BULK_DISCOUNT');

-- CreateEnum
CREATE TYPE "public"."CustomerStatus" AS ENUM ('LEAD', 'PROSPECT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."LeadSource" AS ENUM ('LANDING_PAGE', 'DIRECT_CONTACT', 'REFERRAL', 'SOCIAL_MEDIA', 'WHATSAPP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "public"."QuotationActivityType" AS ENUM ('CREATED', 'UPDATED', 'SENT', 'VIEWED', 'DOWNLOADED', 'SHARED', 'CONVERTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'DEALER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'PENDING_INVITATION',
    "passwordHash" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "invitedBy" TEXT,
    "invitationToken" TEXT,
    "invitationExpiresAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "public"."Permission" NOT NULL,
    "grantedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "public"."ActivityType" NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dealer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" TEXT,
    "registrationNumber" TEXT,
    "gstNumber" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "defaultGstRate" DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'INR',
    "defaultDiscountRate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "quotationPrefix" TEXT NOT NULL DEFAULT 'QT',
    "quotationFooter" TEXT,
    "termsAndConditions" TEXT,
    "landingPageSlug" TEXT,
    "landingPageEnabled" BOOLEAN NOT NULL DEFAULT false,
    "landingPageTitle" TEXT,
    "landingPageDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dealer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT,
    "category" "public"."ProductCategory" NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "gstRate" DECIMAL(5,2) NOT NULL,
    "batteryType" "public"."BatteryType",
    "capacity" DECIMAL(8,2),
    "voltage" DECIMAL(5,2),
    "warrantyMonths" INTEGER,
    "efficiency" DECIMAL(5,2),
    "powerRating" DECIMAL(8,2),
    "inputVoltage" TEXT,
    "outputVoltage" TEXT,
    "specifications" JSONB,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."special_offers" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "offerType" "public"."OfferType" NOT NULL,
    "discountValue" DECIMAL(10,2),
    "minimumQuantity" INTEGER DEFAULT 1,
    "maximumQuantity" INTEGER,
    "minimumOrderValue" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "maxUsageCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "special_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."offer_products" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "offer_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."combo_items" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "combo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "companyName" TEXT,
    "gstNumber" TEXT,
    "status" "public"."CustomerStatus" NOT NULL DEFAULT 'LEAD',
    "leadSource" "public"."LeadSource" NOT NULL DEFAULT 'DIRECT_CONTACT',
    "leadValue" DECIMAL(12,2),
    "notes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastContactAt" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."landing_page_inquiries" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "interestedIn" TEXT,
    "landingPageSlug" TEXT,
    "referrerUrl" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "isContacted" BOOLEAN NOT NULL DEFAULT false,
    "contactedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_page_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotations" (
    "id" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "title" TEXT,
    "notes" TEXT,
    "termsConditions" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "totalGst" DECIMAL(12,2) NOT NULL,
    "totalDiscount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "status" "public"."QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "shareableSlug" TEXT,
    "shareableLink" TEXT,
    "linkExpiresAt" TIMESTAMP(3),
    "isConverted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "conversionValue" DECIMAL(12,2),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotation_items" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "productId" TEXT,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL DEFAULT 1,
    "discount" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "gstRate" DECIMAL(5,2) NOT NULL,
    "lineSubtotal" DECIMAL(12,2) NOT NULL,
    "lineGst" DECIMAL(12,2) NOT NULL,
    "lineTotal" DECIMAL(12,2) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotation_activities" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "activity" "public"."QuotationActivityType" NOT NULL,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gst_rates" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "description" TEXT,
    "hsnCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gst_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."battery_warranties" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "productId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "batteryBrand" TEXT NOT NULL,
    "batteryModel" TEXT NOT NULL,
    "batteryType" "public"."BatteryType" NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyMonths" INTEGER NOT NULL,
    "warrantyExpiryDate" TIMESTAMP(3) NOT NULL,
    "installationDate" TIMESTAMP(3),
    "installedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battery_warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."warranty_claims" (
    "id" TEXT NOT NULL,
    "warrantyId" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "claimDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "photos" TEXT[],
    "documents" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."backup_calculations" (
    "id" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "batteryType" "public"."BatteryType" NOT NULL,
    "batteryCapacity" DECIMAL(8,2) NOT NULL,
    "batteryVoltage" DECIMAL(5,2) NOT NULL,
    "loadWattage" DECIMAL(8,2) NOT NULL,
    "efficiency" DECIMAL(5,2) NOT NULL,
    "calculatedBackupHours" DECIMAL(6,2) NOT NULL,
    "calculatedBackupMinutes" INTEGER NOT NULL,
    "calculationName" TEXT,
    "notes" TEXT,
    "customerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backup_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_invitationToken_key" ON "public"."users"("invitationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordResetToken_key" ON "public"."users"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permission_key" ON "public"."user_permissions"("userId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "public"."user_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "dealer_profiles_userId_key" ON "public"."dealer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "dealer_profiles_landingPageSlug_key" ON "public"."dealer_profiles"("landingPageSlug");

-- CreateIndex
CREATE INDEX "products_dealerId_category_idx" ON "public"."products"("dealerId", "category");

-- CreateIndex
CREATE INDEX "products_dealerId_isActive_idx" ON "public"."products"("dealerId", "isActive");

-- CreateIndex
CREATE INDEX "special_offers_dealerId_isActive_idx" ON "public"."special_offers"("dealerId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "offer_products_offerId_productId_key" ON "public"."offer_products"("offerId", "productId");

-- CreateIndex
CREATE INDEX "customers_dealerId_status_idx" ON "public"."customers"("dealerId", "status");

-- CreateIndex
CREATE INDEX "customers_dealerId_email_idx" ON "public"."customers"("dealerId", "email");

-- CreateIndex
CREATE INDEX "landing_page_inquiries_dealerId_isContacted_idx" ON "public"."landing_page_inquiries"("dealerId", "isContacted");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quotationNumber_key" ON "public"."quotations"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_shareableSlug_key" ON "public"."quotations"("shareableSlug");

-- CreateIndex
CREATE INDEX "quotations_dealerId_status_idx" ON "public"."quotations"("dealerId", "status");

-- CreateIndex
CREATE INDEX "quotations_shareableSlug_idx" ON "public"."quotations"("shareableSlug");

-- CreateIndex
CREATE INDEX "gst_rates_category_isActive_idx" ON "public"."gst_rates"("category", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "battery_warranties_serialNumber_key" ON "public"."battery_warranties"("serialNumber");

-- CreateIndex
CREATE INDEX "battery_warranties_dealerId_warrantyExpiryDate_idx" ON "public"."battery_warranties"("dealerId", "warrantyExpiryDate");

-- CreateIndex
CREATE INDEX "battery_warranties_serialNumber_idx" ON "public"."battery_warranties"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "warranty_claims_claimNumber_key" ON "public"."warranty_claims"("claimNumber");

-- CreateIndex
CREATE INDEX "backup_calculations_dealerId_createdAt_idx" ON "public"."backup_calculations"("dealerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_permissions" ADD CONSTRAINT "user_permissions_grantedBy_fkey" FOREIGN KEY ("grantedBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."dealer_profiles" ADD CONSTRAINT "dealer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."special_offers" ADD CONSTRAINT "special_offers_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offer_products" ADD CONSTRAINT "offer_products_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."special_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offer_products" ADD CONSTRAINT "offer_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."combo_items" ADD CONSTRAINT "combo_items_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."special_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."combo_items" ADD CONSTRAINT "combo_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."landing_page_inquiries" ADD CONSTRAINT "landing_page_inquiries_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."landing_page_inquiries" ADD CONSTRAINT "landing_page_inquiries_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotations" ADD CONSTRAINT "quotations_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotations" ADD CONSTRAINT "quotations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotation_items" ADD CONSTRAINT "quotation_items_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "public"."quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotation_items" ADD CONSTRAINT "quotation_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotation_activities" ADD CONSTRAINT "quotation_activities_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "public"."quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battery_warranties" ADD CONSTRAINT "battery_warranties_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."battery_warranties" ADD CONSTRAINT "battery_warranties_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."warranty_claims" ADD CONSTRAINT "warranty_claims_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "public"."battery_warranties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."backup_calculations" ADD CONSTRAINT "backup_calculations_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
