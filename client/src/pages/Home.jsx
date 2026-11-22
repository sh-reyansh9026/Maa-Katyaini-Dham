import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Maa Katyaini Dham - Hotel & Event Hall in Naimisharanya</title>
        <meta name="description" content="Experience spiritual tranquility at Maa Katyaini Dham in Naimisharanya. Book comfortable rooms and event halls for your stay and celebrations." />
        <meta name="keywords" content="hotel Naimisharanya, event hall Uttar Pradesh, spiritual retreat, wedding venue, accommodation, Maa Katyaini Dham" />
        <meta property="og:title" content="Maa Katyaini Dham - Hotel & Event Hall in Naimisharanya" />
        <meta property="og:description" content="Experience spiritual tranquility at Maa Katyaini Dham in Naimisharanya. Book comfortable rooms and event halls for your stay and celebrations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maakatyainidham.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Maa Katyaini Dham - Hotel & Event Hall in Naimisharanya" />
        <meta name="twitter:description" content="Experience spiritual tranquility at Maa Katyaini Dham in Naimisharanya. Book comfortable rooms and event halls for your stay and celebrations." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Maa Katyaini Dham",
              "description": "Hotel and event hall in Naimisharanya, Uttar Pradesh offering comfortable accommodation and event spaces for spiritual retreats and celebrations.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Naimisharanya",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
              },
              "telephone": "+91 XXXXXXXXXX",
              "email": "info@maakatyainidham.com",
              "url": "https://maakatyainidham.com",
              "priceRange": "₹₹",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  { "@type": "DayOfWeek", "name": "Monday" },
                  { "@type": "DayOfWeek", "name": "Tuesday" },
                  { "@type": "DayOfWeek", "name": "Wednesday" },
                  { "@type": "DayOfWeek", "name": "Thursday" },
                  { "@type": "DayOfWeek", "name": "Friday" },
                  { "@type": "DayOfWeek", "name": "Saturday" },
                  { "@type": "DayOfWeek", "name": "Sunday" }
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-4">
              Acoustically Balanced Mandaps for<br />
              <span className="text-primary">7-Day Shrimad Bhagwat Kathas</span>
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8">
              Experience spiritual tranquility at Maa Katyaini Dham in Naimisharanya. Book comfortable rooms and event halls for your stay and celebrations.
            </p>
            
            {/* Search/Filter Component */}
            <Card className="max-w-4xl mx-auto">
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text mb-1 block">Event Type</label>
                    <select className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Bhagwat Katha</option>
                      <option>Wedding</option>
                      <option>Corporate Event</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text mb-1 block">Check-in Date</label>
                    <Input type="date" placeholder="Select date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text mb-1 block">Guests</label>
                    <Input type="number" placeholder="Number of guests" />
                  </div>
                  <div className="flex items-end">
                    <Button variant="primary" className="w-full">
                      Search Venues
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Venue Cards Section */}
      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-text mb-8 text-center">Our Sacred Venues</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Venue Card 1 */}
            <Card hover>
              <div className="aspect-video bg-surface-alt rounded-t-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/xvjfndeg/image/upload/v1789935934/maharishi-vyas-mandap.jpg"
                  alt="Maharishi Vyas Sabha Mandap"
                  className="w-full h-full object-cover"
                />
              </div>
              <Card.Body>
                <h3 className="font-display text-2xl font-semibold text-text mb-2">Maharishi Vyas Sabha Mandap</h3>
                <p className="text-muted mb-4">
                  Acoustically balanced hall perfect for 7-day Shrimad Bhagwat Kathas. Spacious, serene, and spiritually uplifting environment.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Capacity: 500 guests</span>
                  </div>
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>Acoustically Balanced</span>
                  </div>
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>7-Day Katha Ready</span>
                  </div>
                </div>
                <Link to="/halls">
                  <Button variant="primary" className="w-full">View Details</Button>
                </Link>
              </Card.Body>
            </Card>

            {/* Venue Card 2 */}
            <Card hover>
              <div className="aspect-video bg-surface-alt rounded-t-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/xvjfndeg/image/upload/v1789935926/katyaini-mangal-bhawan.jpg"
                  alt="Katyaini Mangal Bhawan & Yagya Shala"
                  className="w-full h-full object-cover"
                />
              </div>
              <Card.Body>
                <h3 className="font-display text-2xl font-semibold text-text mb-2">Katyaini Mangal Bhawan & Yagya Shala</h3>
                <p className="text-muted mb-4">
                  Traditional bhawan with dedicated yagya shala for sacred ceremonies. Perfect for spiritual gatherings and religious events.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span>Capacity: 300 guests</span>
                  </div>
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879 1 5 1c-1.399 0-1.003-.503-2.88-2.12zM15 7a2 2 0 012 2 2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 012-2h10z" clipRule="evenodd" />
                    </svg>
                    <span>Yagya Shala Available</span>
                  </div>
                  <div className="flex items-center text-sm text-text">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 00.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.69-.645L3.31 9.397zm7.38 0L14 10.12v4.102a8.969 8.969 0 00-1.69-.645l-1.62-1.08zM14 10.12v4.102a8.969 8.969 0 00-1.69-.645l-1.62-1.08z" />
                    </svg>
                    <span>Traditional Architecture</span>
                  </div>
                </div>
                <Link to="/halls">
                  <Button variant="primary" className="w-full">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-text mb-2 text-center">Complete Logistical Support</h2>
          <p className="text-muted text-center mb-12">For Katha Organizers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <Card.Body>
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 00.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.69-.645L3.31 9.397zm7.38 0L14 10.12v4.102a8.969 8.969 0 00-1.69-.645l-1.62-1.08zM14 10.12v4.102a8.969 8.969 0 00-1.69-.645l-1.62-1.08z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Accommodation</h3>
                <p className="text-sm text-muted">Comfortable rooms for 7-day stay</p>
              </Card.Body>
            </Card>

            <Card className="text-center">
              <Card.Body>
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 001-1l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Prasad Distribution</h3>
                <p className="text-sm text-muted">Daily prasad for all devotees</p>
              </Card.Body>
            </Card>

            <Card className="text-center">
              <Card.Body>
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Yagya Shala</h3>
                <p className="text-sm text-muted">Sacred space for rituals</p>
              </Card.Body>
            </Card>

            <Card className="text-center">
              <Card.Body>
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Audio System</h3>
                <p className="text-sm text-muted">Professional sound setup</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-text mb-2 text-center">Four Steps to Your Katha</h2>
          <p className="text-muted text-center mb-12">In Naimisharanya</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-fg rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-text mb-2">Select Venue</h3>
              <p className="text-sm text-muted">Choose from our sacred mandaps</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-fg rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-text mb-2">Book Dates</h3>
              <p className="text-sm text-muted">Select your preferred dates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-fg rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-text mb-2">Confirm Booking</h3>
              <p className="text-sm text-muted">Pay advance via WhatsApp</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-fg rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold text-text mb-2">Arrive & Begin</h3>
              <p className="text-sm text-muted">Start your spiritual journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-fg mb-4">Plan Your Sacred Katha</h2>
          <p className="text-primary-fg mb-8 opacity-90">With our Resident Coordinator</p>
          
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM6 7a1 1 0 011-1h1a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1V7zM11 9a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9zM16 4a1 1 0 011-1h1a1 1 0 011 1v11a1 1 0 01-1 1h-1a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-text">+91 XXXXXXXXXX</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-text">info@maakatyainidham.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-primary mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-text">Naimisharanya, Uttar Pradesh</span>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-6">Contact Now</Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
