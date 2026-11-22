import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-fg font-serif text-xl font-bold">म</span>
              </div>
              <span className="font-serif text-xl font-semibold text-text">Maa Katyaini Dham</span>
            </div>
            <p className="text-sm text-muted mb-4">
              Spiritual tranquility in the sacred land of Naimisharanya.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/rooms" className="text-sm text-muted hover:text-primary transition-colors">Rooms</Link></li>
              <li><Link to="/halls" className="text-sm text-muted hover:text-primary transition-colors">Mandaps</Link></li>
              <li><Link to="/gallery" className="text-sm text-muted hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="text-sm text-muted hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-text mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-muted hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-sm text-muted hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM6 7a1 1 0 011-1h1a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1V7zM11 9a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1V9zM16 4a1 1 0 011-1h1a1 1 0 011 1v11a1 1 0 01-1 1h-1a1 1 0 01-1-1V4z" />
                </svg>
                +91 XXXXXXXXXX
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@maakatyainidham.com
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Naimisharanya, UP
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Maa Katyaini Dham. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
