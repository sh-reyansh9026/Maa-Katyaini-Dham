import React from 'react'
import { Helmet } from 'react-helmet-async'

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-text space-y-6">
          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">1. Acceptance of Terms</h2>
            <p className="text-muted">By booking rooms or event halls at Maa Katyaini Dham, you agree to be bound by these Terms & Conditions. Please read them carefully before making a booking.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">2. Booking and Reservation</h2>
            <h3 className="font-semibold text-text mt-4">2.1 Booking Process</h3>
            <p className="text-muted">All bookings are subject to availability and confirmation. A booking is considered confirmed only after the advance payment has been received and verified by the management.</p>
            
            <h3 className="font-semibold text-text mt-4">2.2 Advance Payment</h3>
            <p className="text-muted">An advance payment of 25% of the total amount is required to confirm a booking. The advance payment must be made within 30 minutes of booking creation, otherwise the booking will be automatically cancelled.</p>
            
            <h3 className="font-semibold text-text mt-4">2.3 Payment Methods</h3>
            <p className="text-muted">Advance payments are accepted via UPI as guided by the management. The final balance must be paid at the time of check-in or event commencement.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">3. Cancellation and Refund Policy</h2>
            <h3 className="font-semibold text-text mt-4">3.1 Cancellation by Guest</h3>
            <p className="text-muted">Cancellations must be made at least 24 hours before check-in for a full refund of the advance payment. Cancellations made less than 24 hours before check-in will result in forfeiture of the advance payment.</p>
            
            <h3 className="font-semibold text-text mt-4">3.2 Cancellation by Management</h3>
            <p className="text-muted">Maa Katyaini Dham reserves the right to cancel bookings in case of unforeseen circumstances. In such cases, a full refund will be provided.</p>
            
            <h3 className="font-semibold text-text mt-4">3.3 No-Shows</h3>
            <p className="text-muted">Failure to check-in without prior cancellation will result in forfeiture of the entire booking amount.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">4. Check-in and Check-out</h2>
            <h3 className="font-semibold text-text mt-4">4.1 Check-in Time</h3>
            <p className="text-muted">Standard check-in time is 12:00 PM. Early check-in is subject to availability and may incur additional charges.</p>
            
            <h3 className="font-semibold text-text mt-4">4.2 Check-out Time</h3>
            <p className="text-muted">Standard check-out time is 11:00 AM. Late check-out may be available subject to availability and additional charges.</p>
            
            <h3 className="font-semibold text-text mt-4">4.3 ID Proof Requirement</h3>
            <p className="text-muted">Valid government ID proof (Aadhaar card, PAN card, Passport, or Voter ID) is mandatory at the time of check-in for all guests. Foreign nationals must provide valid passport and visa.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">5. House Rules and Conduct</h2>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Guests are expected to maintain decorum and respect other guests and staff.</li>
              <li>Loud music or disturbances are not permitted after 10:00 PM.</li>
              <li>Smoking is not permitted in the rooms or indoor areas.</li>
              <li>Consumption of alcohol is permitted only in designated areas and must be moderate.</li>
              <li>Damage to property will be charged to the guest responsible.</li>
              <li>Management reserves the right to evict any guest for misconduct without refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">6. Event Hall Rules</h2>
            <ul className="list-disc pl-6 text-muted space-y-2">
              <li>Outside food and drinks are not permitted in the event halls.</li>
              <li>Decoration must be removed immediately after the event concludes.</li>
              <li>Guests must vacate the premises by the agreed time.</li>
              <li>Any damage to the hall or property will be charged to the booking party.</li>
              <li>Management is not responsible for any personal belongings left unattended.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">7. Liability</h2>
            <p className="text-muted">Maa Katyaini Dham shall not be liable for any loss, damage, or injury to guests or their property, except where caused by the negligence of the management. Guests are responsible for their personal belongings at all times.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">8. Force Majeure</h2>
            <p className="text-muted">Maa Katyaini Dham shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, government restrictions, or other unforeseen circumstances.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">9. Amendments</h2>
            <p className="text-muted">Maa Katyaini Dham reserves the right to amend these terms at any time. Guests will be notified of any material changes. Continued use of the services after such amendments constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">10. Governing Law</h2>
            <p className="text-muted">These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-text">11. Contact Information</h2>
            <p className="text-muted">For any queries or concerns regarding these terms, please contact us at:</p>
            <p className="text-text">Email: info@maakatyainidham.com</p>
            <p className="text-text">Phone: +91 XXXXXXXXXX</p>
            <p className="text-text">Address: Naimisharanya, Uttar Pradesh, India</p>
          </section>
        </div>
      </div>
    </>
  )
}

export default Terms
