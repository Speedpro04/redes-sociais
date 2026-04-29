import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { Store } from '../types'

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/api/v1/stores')
        setStores(response.data)
      } catch (error) {
        console.error('Erro ao buscar lojas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-white text-xl font-bold">Redes Sociais</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/stores"
                  className="border-orange-500 text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Lojas
                </a>
                <a
                  href="/vehicles"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Veículos
                </a>
                <a
                  href="/social-media"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Redes Sociais
                </a>
                <a
                  href="/videos"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Vídeos
                </a>
                <a
                  href="/scheduler"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-white mb-6">Lojas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {store.logo_url && (
                      <img
                        src={store.logo_url}
                        alt={store.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">{store.name}</h3>
                      <p className="text-sm text-gray-400">{store.city || 'Cidade não informada'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {store.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {store.slug}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      store.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {store.active ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-sm text-gray-400">{store.plan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhuma loja encontrada</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
