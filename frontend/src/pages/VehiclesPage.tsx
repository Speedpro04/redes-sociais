import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { Vehicle } from '../types'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [stores, setStores] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/api/v1/stores')
        setStores(response.data)
      } catch (error) {
        console.error('Erro ao buscar lojas:', error)
      }
    }

    fetchStores()
  }, [])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const params = selectedStore ? { store_id: selectedStore } : {}
        const response = await api.get('/api/v1/vehicles', { params })
        setVehicles(response.data)
      } catch (error) {
        console.error('Erro ao buscar veículos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [selectedStore])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-20 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-white text-xl font-bold flex items-baseline gap-2"><span className="font-architect text-white text-2xl">AUTO RACER</span><span className="text-orange-300">Redes Sociais</span></h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/stores"
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Lojas
                </a>
                <a
                  href="/vehicles"
                  className="border-orange-500 text-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Veículos
                </a>
                <a
                  href="/social-media"
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Redes Sociais
                </a>
                <a
                  href="/videos"
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Vídeos
                </a>
                <a
                  href="/scheduler"
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Agendador
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  navigate('/')
                }}
                className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-600 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Veículos</h2>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todas as lojas</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl">
                {vehicle.media && vehicle.media.length > 0 && (
                  <div className="relative h-48 bg-gray-700">
                    <img
                      src={vehicle.media[0].url}
                      alt={vehicle.title}
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponível' :
                       vehicle.status === 'sold' ? 'Vendido' : 'Pausado'}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white mb-2">{vehicle.title}</h3>
                  <div className="space-y-1 text-sm text-slate-400">
                    <p>{vehicle.brand} - {vehicle.year}</p>
                    <p>{vehicle.km.toLocaleString()} km</p>
                    <p className="text-xl font-bold text-orange-500">{formatPrice(vehicle.price)}</p>
                  </div>
                  {vehicle.store && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-slate-400">{vehicle.store.name}</p>
                      <p className="text-sm text-slate-400">{vehicle.store.city}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {vehicles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhum veículo encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



