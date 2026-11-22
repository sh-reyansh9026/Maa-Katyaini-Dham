import React from 'react'
import { Helmet } from 'react-helmet-async'

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none text-text space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">1. Information Collection</h2>
            <p className="text-muted">At Maa Katyaini Dham, we collect personal information from you when you make a booking, create an account, or interact with our services. This may include:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Government ID proof details (Aadhaar, PAN, Passport, etc.)</li>
              <li>Booking details and preferences</li>
              <li>Payment information (UPI transaction references)</li>
              <li>Communication history with our team</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">2. Use of Information</h2>
            <p className="text-muted">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Process and confirm your bookings</li>
              <li>Communicate with you about your reservations</li>
              <li>Improve our services and customer experience</li>
              <li>Send you promotional offers (with your consent)</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">3. Data Sharing</h2>
            <p className="text-muted">We do not sell, rent, or trade your personal information with third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>With service providers who perform services on our behalf (e.g., payment processors, authentication providers)</li>
              <li>When required by law or to protect our rights and property</li>
              <li>With your consent for specific purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">4. Data Security</h2>
            <p className="text-muted">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">5. Cookies and Tracking</h2>
            <p className="text-muted">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">6. Your Rights</h2>
            <p className="text-muted">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account and personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Review and manage your cookie preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">7. Third-Party Services</h2>
            <p className="text-muted">Our website integrates with third-party services including:</p>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Clerk for authentication and user management</li>
              <li>Cloudinary for image storage and delivery</li>
              <li>WhatsApp for booking communication</li>
            </ul>
            <p className="text-muted">These services have their own privacy policies, and we encourage you to review them.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">8. Children's Privacy</h2>
            <p className="text-muted">Our services are not intended for children under 18. We do not knowingly collect personal information from children without parental consent.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">9. Changes to This Policy</h2>
            <p className="text-muted">We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the effective date.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">10. Contact Us</h2>
            <p className="text-muted">If you have questions about this privacy policy or our data practices, please contact us:</p>
            <p className="text-text">Email: privacy@maakatyainidham.com</p>
            <p className="text-text">Phone: +91 XXXXXXXXXX</p>
            <p className="text-text">Address: Maa Katyaini Dham, Naimisharanya, Uttar Pradesh, India</p>
          </section>
        </div>
      </div>
    </>
  )
}

export default Privacy
