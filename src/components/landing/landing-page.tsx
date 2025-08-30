import { FooterSection } from '@/components/landing/footer-section'
import { HeroSection } from '@/components/landing/hero-section'
import { LocationSection } from '@/components/landing/location-section'
import { OffersSection } from '@/components/landing/offers-section'
import { ProductsSection } from '@/components/landing/products-section'
import { QuoteRequestSection } from '@/components/landing/quote-request-section'
import { ScrollToTop } from '@/components/landing/scroll-to-top'

export function LandingPage() {
  return (
    <>
      <main className='min-h-screen'>
        <HeroSection />
        <ProductsSection />
        <OffersSection />
        <QuoteRequestSection />
        <LocationSection />
        <FooterSection />
      </main>
      <ScrollToTop />
    </>
  )
}
