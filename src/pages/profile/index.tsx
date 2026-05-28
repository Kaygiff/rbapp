import { useState } from 'react'
import { useAuthStore } from '../../store'
import AuthScreen from './AuthScreen'
import MainProfile from './MainProfile'
import EditProfileScreen from './EditProfileScreen'
import OrdersScreen from './OrdersScreen'
import OrderDetailScreen from './OrderDetailScreen'
import AddressesScreen from './AddressesScreen'
import type { Screen } from './types'

export default function ProfilePage() {
  const { token, client } = useAuthStore()
  if (!token || !client) return <AuthScreen />
  return <ProfileRouter />
}

function ProfileRouter() {
  const [screen, setScreen] = useState<Screen>('main')
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  if (screen === 'orders') return (
    <OrdersScreen
      onBack={() => setScreen('main')}
      onSelect={id => { setSelectedOrderId(id); setScreen('order-detail') }}
    />
  )
  if (screen === 'order-detail' && selectedOrderId) return (
    <OrderDetailScreen orderId={selectedOrderId} onBack={() => setScreen('orders')} />
  )
  if (screen === 'addresses') return <AddressesScreen onBack={() => setScreen('main')} />
  if (screen === 'edit-profile') return <EditProfileScreen onBack={() => setScreen('main')} />
  return <MainProfile onNavigate={setScreen} />
}
