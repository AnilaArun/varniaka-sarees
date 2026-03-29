import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Terms & Conditions | Varniaka Sarees",
  description: "Terms and conditions, return policy, and replacement guidelines for Varniaka Sarees.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-card px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl text-foreground md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-muted-foreground">
            Please read these terms carefully before placing your order
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          
          {/* Return Policy */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              Return Policy
            </h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-medium text-destructive">
                We do not accept returns.
              </p>
              <p className="mt-3 text-muted-foreground">
                Due to the handcrafted nature of our sarees and to maintain hygiene standards, 
                we are unable to accept returns on any purchased items. Please carefully review 
                product details, images, and descriptions before making a purchase.
              </p>
            </div>
          </div>

          {/* Replacement Policy */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              Replacement Policy
            </h2>
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <p className="text-muted-foreground">
                Items can only be replaced if there is visible damage to the product. 
                To be eligible for a replacement, you must meet the following requirements:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Unboxing video required:</span>{" "}
                  You must provide a complete, unedited video recording of the package opening. 
                  The video must clearly show the sealed package before opening and continue 
                  without any cuts until the damage is visible.
                </li>
                <li>
                  <span className="font-medium text-foreground">Report within 24 hours:</span>{" "}
                  Damage must be reported within 24 hours of receiving the package.
                </li>
                <li>
                  <span className="font-medium text-foreground">Original packaging:</span>{" "}
                  The item must be in its original packaging with all tags intact.
                </li>
                <li>
                  <span className="font-medium text-foreground">Unused condition:</span>{" "}
                  The saree must not have been worn, washed, or altered in any way.
                </li>
              </ul>
              <div className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                <strong>Important:</strong> Without a valid unboxing video showing the damage, 
                we will not be able to process any replacement requests.
              </div>
            </div>
          </div>

          {/* How to Request Replacement */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              How to Request a Replacement
            </h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
                <li>
                  Contact us via email or WhatsApp within 24 hours of delivery
                </li>
                <li>
                  Send the complete unboxing video clearly showing the damage
                </li>
                <li>
                  Provide your order number and describe the issue
                </li>
                <li>
                  Our team will review your request within 2-3 business days
                </li>
                <li>
                  If approved, we will arrange for a replacement to be sent
                </li>
              </ol>
            </div>
          </div>

          {/* Order Cancellation */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              Order Cancellation
            </h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-muted-foreground">
                Orders can only be cancelled within 2 hours of placing the order, 
                provided the item has not already been dispatched. Once an order 
                is shipped, it cannot be cancelled.
              </p>
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              Shipping Information
            </h2>
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <p className="text-muted-foreground">
                We offer the following shipping options:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Standard Delivery:</span>{" "}
                  £4.99 (5-7 business days)
                </li>
                <li>
                  <span className="font-medium text-foreground">Express Delivery:</span>{" "}
                  £12.00 (1-3 business days)
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Delivery times are estimates and may vary based on location and external factors.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-foreground">
              Questions?
            </h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-muted-foreground">
                If you have any questions about our terms and conditions, please don&apos;t 
                hesitate to{" "}
                <Link href="/#contact" className="text-accent underline hover:text-accent/80">
                  contact us
                </Link>
                . We&apos;re happy to help!
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
