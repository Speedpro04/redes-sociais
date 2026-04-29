import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { SocialMediaAccount, SocialMediaPost, SocialMediaSchedule } from '../types'

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([])
  const [posts, setPosts] = useState<SocialMediaPost[]>([])
  const [schedules, setSchedules] = useState<SocialMediaSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [stores, setStores] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'accounts' | 'posts' | 'schedules'>('accounts')
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

        const [accountsRes, postsRes, schedulesRes] = await Promise.all([
          api.get('/api/v1/social-media/accounts', { params }),
          api.get('/api/v1/social-media/posts', { params }),
          api.get('/api/v1/social-media/schedules', { params })
        ])

        setAccounts(accountsRes.data)
        setPosts(postsRes.data)
        setSchedules(schedulesRes.data)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedStore])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      case 'tiktok': return '🎵'
      case 'youtube': return '▶️'
      default: return '📱'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'posted': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
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
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Veículos
                </a>
                <a
                  href="/social-media"
                  className="border-orange-500 text-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
            <h2 className="text-2xl font-bold text-white">Redes Sociais</h2>
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
                  onClick={() => setActiveTab('accounts')}
                  className={`${
                    activeTab === 'accounts'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Contas ({accounts.length})
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`${
                    activeTab === 'posts'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Posts ({posts.length})
                </button>
                <button
                  onClick={() => setActiveTab('schedules')}
                  className={`${
                    activeTab === 'schedules'
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Agendamentos ({schedules.length})
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'accounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">{getPlatformIcon(account.platform)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-white">{account.account_name || account.account_id}</h3>
                        <p className="text-sm text-slate-400 capitalize">{account.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {account.active ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className="text-sm text-slate-400">
                        {new Date(account.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {accounts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">Nenhuma conta conectada</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getPlatformIcon(post.platform)}</span>
                        <div>
                          <h3 className="text-lg font-medium text-white">{post.title}</h3>
                          <p className="text-sm text-slate-400 capitalize">{post.platform}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-4">{post.description}</p>
                    {post.video_url && (
                      <div className="mb-4">
                        <video
                          src={post.video_url}
                          controls
                          className="w-full max-w-md rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Veículo ID: {post.vehicle_id}</span>
                      <span>
                        {post.scheduled_at
                          ? `Agendado: ${new Date(post.scheduled_at).toLocaleString('pt-BR')}`
                          : post.posted_at
                          ? `Postado: ${new Date(post.posted_at).toLocaleString('pt-BR')}`
                          : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">Nenhum post encontrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-4">{getPlatformIcon(schedule.platform)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-white capitalize">{schedule.platform}</h3>
                        <p className="text-sm text-slate-400 capitalize">{schedule.time_period}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Horário:</span>
                        <span className="text-white">{schedule.post_time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Timezone:</span>
                        <span className="text-white">{schedule.timezone}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        schedule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {schedule.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">Nenhum agendamento configurado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



