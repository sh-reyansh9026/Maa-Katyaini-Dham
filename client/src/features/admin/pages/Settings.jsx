import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { adminSettingsApi } from '../api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Skeleton from '../../../components/ui/Skeleton'

const AdminSettings = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: () => adminSettingsApi.get(),
  })

  return (
    <>
      <Helmet>
        <title>Admin Settings - Maa Katyaini Dham</title>
      </Helmet>
      <div className="p-8">
        <h1 className="font-display text-3xl font-bold text-text mb-8">Settings</h1>

        {isLoading ? (
          <Card>
            <Card.Body>
              <Skeleton variant="card" />
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <div className="space-y-6">
                <Input
                  label="WhatsApp Owner Number"
                  value={settings?.data?.whatsappOwnerNumber || ''}
                  placeholder="+91 XXXXXXXXXX"
                />
                <Input
                  label="Advance Payment Percentage"
                  type="number"
                  value={settings?.data?.advancePaymentPercentage || ''}
                  placeholder="25"
                />
                <Input
                  label="Booking Hold Duration (minutes)"
                  type="number"
                  value={settings?.data?.bookingHoldDurationMinutes || ''}
                  placeholder="30"
                />
                <Input
                  label="Check-in Time"
                  value={settings?.data?.checkInTime || ''}
                  placeholder="12:00"
                />
                <Input
                  label="Check-out Time"
                  value={settings?.data?.checkOutTime || ''}
                  placeholder="11:00"
                />
                <Button>Save Settings</Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </>
  )
}

export default AdminSettings
