import React from 'react'
import { Helmet } from 'react-helmet-async'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">Contact Us</h1>
        <p className="text-muted mb-8">Get in touch with our resident coordinator</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-text">Send us a message</h2>
            </Card.Header>
            <Card.Body>
              <form className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                />
                <div>
                  <label className="text-sm font-medium text-text mb-1">Message</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                    placeholder="Your message"
                  />
                </div>
                <Button type="submit" variant="primary">
                  Send Message
                </Button>
              </form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="font-semibold text-text">Contact Information</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM6 7a1 1 0 011-1h1a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1V7zM11 9a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9zM16 4a1 1 0 011-1h1a1 1 0 011 1v11a1 1 0 01-1 1h-1a1 1 0 01-1-1V4z" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">Address</p>
                    <p className="text-sm text-muted">Maa Katyaini Dham, Naimisharanya, Uttar Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM6 7a1 1 0 011-1h1a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1V7zM11 9a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9zM16 4a1 1 0 011-1h1a1 1 0 011 1v11a1 1 0 01-1 1h-1a1 1 0 01-1-1V4z" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">Phone</p>
                    <p className="text-sm text-muted">+91 XXXXXXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">Email</p>
                    <p className="text-sm text-muted">info@maakatyainidham.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0 4 4 0 00-2 2 1 1 0 102 0 6 6 0 012-2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">Business Hours</p>
                    <p className="text-sm text-muted">24/7 for bookings and inquiries</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Contact
