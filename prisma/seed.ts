import bcrypt from 'bcryptjs'
import {
  BatteryType,
  ProductCategory,
  UserRole,
  UserStatus,
} from '../src/generated/prisma'
import { prisma } from '../src/lib/db'

async function main() {
  console.log('🌱 Starting database seeding...')

  // ============================================================================
  // MASTER USER SETUP (Epic 8)
  // ============================================================================

  console.log('👤 Creating master user...')

  const masterUserEmail = process.env.MASTER_EMAIL
  const masterUserPassword = process.env.MASTER_PASSWORD

  if (!masterUserEmail || !masterUserPassword) {
    console.error('Missing master credentials, seed failed.')
    return
  }

  const hashedPassword = await bcrypt.hash(masterUserPassword, 12)

  const masterUser = await prisma.user.upsert({
    where: { email: masterUserEmail },
    update: {},
    create: {
      email: masterUserEmail,
      firstName: 'Master',
      lastName: 'Admin',
      role: UserRole.MASTER,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  })

  console.log(`✅ Master user created: ${masterUser.email}`)

  // ============================================================================
  // SYSTEM SETTINGS (Configuration)
  // ============================================================================

  console.log('⚙️ Setting up system configuration...')

  const systemSettings = [
    {
      key: 'APP_NAME',
      value: 'VoltEdge',
      description: 'Application name',
      isPublic: true,
    },
    {
      key: 'APP_VERSION',
      value: '1.0.0',
      description: 'Current application version',
      isPublic: true,
    },
    {
      key: 'DEFAULT_CURRENCY',
      value: 'INR',
      description: 'Default currency for the application',
      isPublic: true,
    },
    {
      key: 'DEFAULT_COUNTRY',
      value: 'India',
      description: 'Default country for dealers',
      isPublic: true,
    },
    {
      key: 'SESSION_TIMEOUT_HOURS',
      value: '24',
      type: 'number',
      description: 'Default session timeout in hours',
      isPublic: false,
    },
    {
      key: 'MAX_FILE_UPLOAD_SIZE_MB',
      value: '10',
      type: 'number',
      description: 'Maximum file upload size in megabytes',
      isPublic: false,
    },
    {
      key: 'QUOTATION_VALIDITY_DAYS',
      value: '30',
      type: 'number',
      description: 'Default quotation validity in days',
      isPublic: true,
    },
  ]

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }

  console.log(`✅ Created ${systemSettings.length} system settings`)

  // ============================================================================
  // GST RATES SETUP (Epic 1)
  // ============================================================================

  console.log('💰 Setting up GST rates...')

  const gstRates = [
    {
      category: 'BATTERY',
      rate: 28.0,
      description: 'Battery and UPS systems',
      hsnCode: '8507',
    },
    {
      category: 'INVERTER',
      rate: 18.0,
      description: 'Power inverters and converters',
      hsnCode: '8504',
    },
    {
      category: 'SOLAR_PANEL',
      rate: 5.0,
      description: 'Solar panels and renewable energy equipment',
      hsnCode: '8541',
    },
    {
      category: 'ACCESSORIES',
      rate: 18.0,
      description: 'Electrical accessories and components',
      hsnCode: '8536',
    },
    {
      category: 'OTHER',
      rate: 18.0,
      description: 'Other electrical products',
      hsnCode: '8543',
    },
    {
      category: 'INSTALLATION',
      rate: 18.0,
      description: 'Installation and service charges',
      hsnCode: '9954',
    },
  ]

  for (const gstRate of gstRates) {
    // Check if GST rate already exists for this category
    const existingRate = await prisma.gstRate.findFirst({
      where: {
        category: gstRate.category,
        isActive: true,
      },
    })

    if (!existingRate) {
      await prisma.gstRate.create({
        data: gstRate,
      })
    }
  }

  console.log(`✅ Created ${gstRates.length} GST rate categories`)

  // ============================================================================
  // DEMO DEALER SETUP (For testing)
  // ============================================================================

  console.log('🏪 Creating demo dealer...')

  const demoPassword = await bcrypt.hash('Demo2025!', 12)

  const demoDealer = await prisma.user.upsert({
    where: { email: 'demo@voltedge.com' },
    update: {},
    create: {
      email: 'demo@voltedge.com',
      firstName: 'Demo',
      lastName: 'Dealer',
      role: UserRole.DEALER,
      status: UserStatus.ACTIVE,
      passwordHash: demoPassword,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      invitedBy: masterUser.id,
    },
  })

  // Create dealer profile
  await prisma.dealerProfile.upsert({
    where: { userId: demoDealer.id },
    update: {},
    create: {
      userId: demoDealer.id,
      businessName: 'VoltEdge Demo Store',
      businessType: 'Electrical Equipment Dealer',
      gstNumber: '29ABCDE1234F1Z5',
      phone: '+91-8446131207',
      whatsapp: '+91-8446131207',
      address: '123 Electronics Market, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001',
      defaultGstRate: 18.0,
      defaultCurrency: 'INR',
      defaultDiscountRate: 5.0,
      quotationPrefix: 'VED',
      quotationFooter: 'Thank you for choosing VoltEdge Demo Store!',
      termsAndConditions:
        'Standard terms and conditions apply. Warranty as per manufacturer guidelines.',
      landingPageSlug: 'voltedge-demo',
      landingPageEnabled: true,
      landingPageTitle: 'VoltEdge Demo Store - Power Solutions',
      landingPageDescription:
        'Your trusted partner for batteries, inverters, and solar solutions in Bangalore.',
    },
  })

  console.log(`✅ Demo dealer created: ${demoDealer.email}`)

  // ============================================================================
  // SAMPLE PRODUCTS (Epic 6.2)
  // ============================================================================

  console.log('🔋 Creating sample products...')

  const sampleProducts = [
    // Batteries
    {
      name: 'Exide 150Ah Tubular Battery',
      description:
        'High-performance tubular battery for home and commercial use',
      sku: 'EXI-TUB-150',
      category: ProductCategory.BATTERY,
      brand: 'Exide',
      model: 'IT 500',
      basePrice: 12500.0,
      gstRate: 18.0,
      batteryType: BatteryType.LEAD_ACID,
      capacity: 150.0,
      voltage: 12.0,
      warrantyMonths: 36,
      efficiency: 85.0,
      stockQuantity: 25,
      minimumStock: 5,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Luminous 200Ah SMF Battery',
      description: 'Maintenance-free sealed battery with long life',
      sku: 'LUM-SMF-200',
      category: ProductCategory.BATTERY,
      brand: 'Luminous',
      model: 'LPT 1220H',
      basePrice: 18500.0,
      gstRate: 18.0,
      batteryType: BatteryType.SMF,
      capacity: 200.0,
      voltage: 12.0,
      warrantyMonths: 48,
      efficiency: 90.0,
      stockQuantity: 15,
      minimumStock: 3,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Tesla 100Ah Lithium Battery',
      description: 'Advanced lithium-ion battery with fast charging',
      sku: 'TSL-LIT-100',
      category: ProductCategory.BATTERY,
      brand: 'Tesla Power',
      model: 'TLI-100',
      basePrice: 45000.0,
      gstRate: 18.0,
      batteryType: BatteryType.LITHIUM,
      capacity: 100.0,
      voltage: 12.0,
      warrantyMonths: 60,
      efficiency: 95.0,
      stockQuantity: 8,
      minimumStock: 2,
      isActive: true,
      isFeatured: true,
    },
    // Inverters
    {
      name: 'Microtek 1000VA Inverter',
      description: 'Pure sine wave inverter for home appliances',
      sku: 'MIC-INV-1000',
      category: ProductCategory.INVERTER,
      brand: 'Microtek',
      model: 'UPS EB 1000VA',
      basePrice: 8500.0,
      gstRate: 18.0,
      powerRating: 1000.0,
      inputVoltage: '160V-280V',
      outputVoltage: '220V-240V',
      stockQuantity: 20,
      minimumStock: 5,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Luminous 1500VA Solar Inverter',
      description: 'Hybrid solar inverter with MPPT charge controller',
      sku: 'LUM-SOL-1500',
      category: ProductCategory.INVERTER,
      brand: 'Luminous',
      model: 'Solar NXG 1500',
      basePrice: 15500.0,
      gstRate: 18.0,
      powerRating: 1500.0,
      inputVoltage: '160V-280V',
      outputVoltage: '220V-240V',
      stockQuantity: 12,
      minimumStock: 3,
      isActive: true,
      isFeatured: true,
    },
    // Solar Panels
    {
      name: 'Tata 330W Mono Solar Panel',
      description: 'High-efficiency monocrystalline solar panel',
      sku: 'TAT-SOL-330',
      category: ProductCategory.SOLAR_PANEL,
      brand: 'Tata Solar',
      model: 'TP330M-24',
      basePrice: 7500.0,
      gstRate: 5.0,
      powerRating: 330.0,
      stockQuantity: 30,
      minimumStock: 10,
      isActive: true,
      isFeatured: true,
    },
    // Accessories
    {
      name: 'Battery Terminal Kit',
      description: 'Complete battery terminal and connector kit',
      sku: 'ACC-TERM-KIT',
      category: ProductCategory.ACCESSORIES,
      brand: 'Generic',
      model: 'BTK-001',
      basePrice: 350.0,
      gstRate: 18.0,
      stockQuantity: 50,
      minimumStock: 10,
      isActive: true,
      isFeatured: false,
    },
  ]

  for (const product of sampleProducts) {
    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        dealerId: demoDealer.id,
        sku: product.sku,
      },
    })

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          ...product,
          dealerId: demoDealer.id,
        },
      })
    }
  }

  console.log(`✅ Created ${sampleProducts.length} sample products`)

  // ============================================================================
  // SAMPLE SPECIAL OFFER (Epic 7.3)
  // ============================================================================

  console.log('🎁 Creating sample special offers...')

  const specialOffer = await prisma.specialOffer.create({
    data: {
      dealerId: demoDealer.id,
      title: 'New Year Special - 10% Off on All Batteries',
      description:
        'Get 10% discount on all battery purchases. Valid until end of January.',
      offerType: 'PERCENTAGE_DISCOUNT',
      discountValue: 10.0,
      minimumQuantity: 1,
      minimumOrderValue: 5000.0,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxUsageCount: 100,
    },
  })

  console.log(`✅ Created special offer: ${specialOffer.title}`)

  // ============================================================================
  // SAMPLE BACKUP CALCULATION (Epic 2.2)
  // ============================================================================

  console.log('⚡ Creating sample backup calculations...')

  const backupCalculations = [
    {
      dealerId: demoDealer.id,
      batteryType: BatteryType.LEAD_ACID,
      batteryCapacity: 150.0,
      batteryVoltage: 12.0,
      loadWattage: 500.0,
      efficiency: 85.0,
      calculatedBackupHours: 3.06,
      calculatedBackupMinutes: 184,
      calculationName: 'Home Basic Load Backup',
      notes: 'Calculation for basic home appliances (lights, fans, TV)',
      customerName: 'Sample Customer',
    },
    {
      dealerId: demoDealer.id,
      batteryType: BatteryType.LITHIUM,
      batteryCapacity: 100.0,
      batteryVoltage: 12.0,
      loadWattage: 300.0,
      efficiency: 95.0,
      calculatedBackupHours: 3.8,
      calculatedBackupMinutes: 228,
      calculationName: 'Office Essential Load',
      notes: 'Calculation for office essentials (computers, lights, router)',
      customerName: 'Demo Office',
    },
  ]

  for (const calculation of backupCalculations) {
    await prisma.backupCalculation.create({
      data: calculation,
    })
  }

  console.log(`✅ Created ${backupCalculations.length} backup calculations`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📝 Login credentials:')
  console.log(`👤 Master User: ${masterUserEmail} / ${masterUserPassword}`)
  console.log(`🏪 Demo Dealer: demo@voltedge.com / Demo2025!`)
  console.log('\n🔗 Demo landing page slug: voltedge-demo')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
