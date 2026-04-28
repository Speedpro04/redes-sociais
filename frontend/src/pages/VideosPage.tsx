import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { VideoTemplate, VideoGeneration } from '../types'

export default function VideosPage() {
  const [templates, setTemplates] = useState<VideoTemplate[]>([])
  const [generations, setGenerations] = useState<VideoGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [stores, setStores] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'templates' | 'generations'>('templates')
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
    const fetchData = async () => {
      try {
        const params = selectedStore ? { store_id: selectedStore } : {}

        const [templatesRes, generationsRes] = await Promise.all([
          api.get('/api/v1/videos/templates'),
          api.get('/api/v1/videos/generations', { params })
        ])

        setTemplates(templatesRes.data)
        setGenerations(generationsRes.data)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStore])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'dynamic': return 'bg-blue-100 text-blue-800'
      case 'elegant': return 'bg-purple-100 text-purple-800'
      case 'minimal': return 'bg-gray-100 text-gray-800'
      case 'bold': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                  className="border-orange-500 text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Vídeos</h2>
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

          <div className="mb-6">
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`${
                    activeTab === 'templates'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Templates ({templates.length})
                </button>
                <button
                  onClick={() => setActiveTab('generations')}
                  className={`${
                    activeTab === 'generations'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Gerações ({generations.length})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.description}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyleColor(template.style)}`}>
                        {template.style}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Duração:</span>
                        <span className="text-white">{template.duration}s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Transição:</span>
                        <span className="text-white capitalize">{template.transition}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {template.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">Nenhum template encontrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'generations' && (
            <div className="space-y-4">
              {generations.map((generation) => (
                <div key={generation.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">Veículo ID: {generation.vehicle_id}</h3>
                        <p className="text-sm text-gray-400">Loja ID: {generation.store_id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(generation.status)}`}>
                        {generation.status}
                      </span>
                    </div>
                    {generation.video_url && (
                      <div className="mb-4">
                        <video
                          src={generation.video_url}
                          controls
                          className="w-full max-w-md rounded-lg"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Duração:</span>
                        <span className="text-white ml-2">{generation.duration}s</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Tamanho:</span>
                        <span className="text-white ml-2">{generation.file_size ? `${(generation.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Criado em:</span>
                        <span className="text-white ml-2">{new Date(generation.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Atualizado em:</span>
                        <span className="text-white ml-2">{new Date(generation.updated_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    {generation.error_message && (
                      <div className="mt-4 p-3 bg-red-900/50 rounded-md">
                        <p className="text-sm text-red-300">{generation.error_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {generations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Nenhuma geração de vídeo encontrada</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
