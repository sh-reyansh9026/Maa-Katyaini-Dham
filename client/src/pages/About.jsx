import React from 'react'
import { Helmet } from 'react-helmet-async'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">About Maa Katyaini Dham</h1>
        <p className="text-muted mb-8">A sacred retreat in the holy land of Naimisharanya</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <Card.Body>
              <h2 className="font-display text-2xl font-semibold text-text mb-4">Our Story</h2>
              <p className="text-muted mb-4">
                Maa Katyaini Dham is situated in the sacred land of Naimisharanya, one of the most spiritually significant places in India. Our establishment is dedicated to providing comfortable accommodation and event spaces for pilgrims and visitors who come to experience the divine atmosphere of this holy land.
              </p>
              <p className="text-muted">
                Founded with the vision of offering a peaceful and spiritually enriching experience, we have been serving guests from across the country who come to Naimisharanya for spiritual retreats, religious ceremonies, and peaceful getaways.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h2 className="font-display text-2xl font-semibold text-text mb-4">Our Mission</h2>
              <p className="text-muted mb-4">
                Our mission is to provide a home away from home for all our guests, combining modern comforts with the spiritual essence of Naimisharanya. We strive to ensure that every guest's stay is comfortable, safe, and spiritually uplifting.
              </p>
              <p className="text-muted">
                We are committed to maintaining the highest standards of hospitality while preserving the sanctity and traditions of this sacred land.
              </p>
            </Card.Body>
          </Card>
        </div>

        <Card className="mb-12">
          <Card.Body>
            <h2 className="font-display text-2xl font-semibold text-text mb-4">About Naimisharanya</h2>
            <p className="text-muted mb-4">
              Naimisharanya is believed to be the place where the Vedas were written and where sages performed penance for thousands of years. It is mentioned in various Puranas and is considered one of the most important pilgrimage sites in Hinduism.
            </p>
            <p className="text-muted">
              The Chakra Tirth temple, dedicated to Lord Vishnu, is the main attraction here. The serene environment and spiritual significance make it an ideal place for those seeking peace, wisdom, and divine blessings.
            </p>
          </Card.Body>
        </Card>

        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-text mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <Card.Body className="text-center">
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 00.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Sacred Location</h3>
                <p className="text-sm text-muted">In the holy land of Naimisharanya</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Comfortable Stay</h3>
                <p className="text-sm text-muted">Modern amenities with peaceful environment</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.95 1.81 1.654.167.22.33.44.426.65.63.143-.412.31-.248.49-.654.26-.536.26-.1.107.1.654-.23.585-.406.96-.713 1.173-.654.35.049.68.17.95.354.29.185.45.417.474.654.024.237.049.49.065.754.016.266.043.54.065.754.022.28.053.56.065.754.016.28-.053.56-.065.754-.022.26-.043-.54-.065-.754-.016-.28-.053-.56-.065-.754zm-3.976 4.87a5.277 5.277 0 01-2.044-.424 5.277 5.277 0 01-2.044.424 5.277 5.277 0 01-2.044-.424 5.277 5.277 0 012.044.424 5.277 5.277 0 012.044-.424 5.277 5.277 0 012.044.424 5.277 5.277 0 01-2.044-.424 5.277 5.277 0 01-2.044.424zm-3.53 3.458a5.277 5.277 0 01-2.044-.424 5.277 5.277 0 01-2.044.424 5.277 5.277 0 012.044.424 5.277 5.277 0 012.044-.424 5.277 5.277 0 012.044.424 5.277 5.277 0 01-2.044-.424 5.277 5.277 0 01-2.044.424 5.277 5.277 0 012.044.424 5.277 5.277 0 012.044-.424 5.277 5.277 0 01-2.044-.424z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-text mb-2">Spiritual Experience</h3>
                <p className="text-sm text-muted">Perfect for religious ceremonies</p>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button variant="primary" size="lg">Get in Touch</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default About
