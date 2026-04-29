import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { DashboardStats } from '../types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storesResponse = await api.get('/api/v1/stores')
        const postsResponse = await api.get('/api/v1/social-media/stats')
        const videosResponse = await api.get('/api/v1/videos/stats')

        setStats({
          total_stores: storesResponse.data.length,
          total_vehicles: 0,
          total_posts: postsResponse.data.total_posts,
          pending_posts: postsResponse.data.pending_posts,
          scheduled_posts: postsResponse.data.scheduled_posts,
          posted_posts: postsResponse.data.posted_posts,
          total_generations: videosResponse.data.total_generations,
          completed_generations: videosResponse.data.completed_generations,
          active_accounts: postsResponse.data.active_accounts,
        })
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
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
                  className="border-orange-500 text-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
                onClick={handleLogout}
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
          <div className="mb-8 rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/20 via-slate-900 to-slate-900 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Painel Inteligente</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Dashboard de Performance</h2>
            <p className="mt-2 text-slate-300">Visão rápida de operação, geração e publicação em redes sociais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-500/20 to-slate-900 border border-orange-400/30 overflow-hidden shadow-xl rounded-xl">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">Total de Lojas</dt>
                      <dd className="text-3xl font-semibold text-white">{stats?.total_stores || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-slate-900 border border-blue-400/30 overflow-hidden shadow-xl rounded-xl">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">Total de Posts</dt>
                      <dd className="text-3xl font-semibold text-white">{stats?.total_posts || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-slate-900 border border-green-400/30 overflow-hidden shadow-xl rounded-xl">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">Posts Publicados</dt>
                      <dd className="text-3xl font-semibold text-white">{stats?.posted_posts || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-slate-900 border border-purple-400/30 overflow-hidden shadow-xl rounded-xl">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-400 truncate">Vídeos Gerados</dt>
                      <dd className="text-3xl font-semibold text-white">{stats?.completed_generations || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Status dos Posts</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pendentes</span>
                  <span className="text-white font-semibold">{stats?.pending_posts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Agendados</span>
                  <span className="text-white font-semibold">{stats?.scheduled_posts || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Publicados</span>
                  <span className="text-white font-semibold">{stats?.posted_posts || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/60 overflow-hidden shadow-xl rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Contas Ativas</h3>
              <div className="flex items-center justify-center">
                <div className="text-5xl font-bold text-orange-500">{stats?.active_accounts || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}



