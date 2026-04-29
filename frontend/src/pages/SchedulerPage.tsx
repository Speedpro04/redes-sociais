import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function SchedulerPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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
    const fetchStatus = async () => {
      try {
        const response = await api.get('/api/v1/scheduler/status')
        setStatus(response.data)
      } catch (error) {
        console.error('Erro ao buscar status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStart = async () => {
    try {
      await api.post('/api/v1/scheduler/start')
      const response = await api.get('/api/v1/scheduler/status')
      setStatus(response.data)
    } catch (error) {
      console.error('Erro ao iniciar scheduler:', error)
    }
  }

  const handleStop = async () => {
    try {
      await api.post('/api/v1/scheduler/stop')
      const response = await api.get('/api/v1/scheduler/status')
      setStatus(response.data)
    } catch (error) {
      console.error('Erro ao parar scheduler:', error)
    }
  }

  const handleRestart = async () => {
    try {
      await api.post('/api/v1/scheduler/restart')
      const response = await api.get('/api/v1/scheduler/status')
      setStatus(response.data)
    } catch (error) {
      console.error('Erro ao reiniciar scheduler:', error)
    }
  }

  const handleAutoConfigure = async (storeId: string) => {
    try {
      await api.post(`/api/v1/scheduler/auto-configure/${storeId}`)
      alert('Schedules configurados com sucesso!')
    } catch (error) {
      console.error('Erro ao configurar schedules:', error)
      alert('Erro ao configurar schedules')
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
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Vídeos
                </a>
                <a
                  href="/scheduler"
                  className="border-orange-500 text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
          <h2 className="text-2xl font-bold text-white mb-6">Agendador Automático</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Status do Scheduler</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status?.running ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {status?.running ? 'Rodando' : 'Parado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Jobs Ativos:</span>
                  <span className="text-white">{status?.jobs_count || 0}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                {!status?.running ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Iniciar
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Parar
                  </button>
                )}
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="bg-gray-800 overflow-hidden shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Jobs Agendados</h3>
              {status?.jobs && status.jobs.length > 0 ? (
                <div className="space-y-3">
                  {status.jobs.map((job: any, index: number) => (
                    <div key={index} className="bg-gray-700 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">{job.id}</span>
                        <span className="text-gray-400 text-xs">
                          {job.next_run_time
                            ? new Date(job.next_run_time).toLocaleString('pt-BR')
                            : 'N/A'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{job.trigger}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Nenhum job agendado</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Configurar Schedules Automáticos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <div key={store.id} className="bg-gray-800 overflow-hidden shadow rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{store.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      store.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {store.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{store.city || 'Cidade não informada'}</p>
                  <button
                    onClick={() => handleAutoConfigure(store.id)}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700"
                  >
                    Configurar Schedules
                  </button>
                </div>
              ))}
            </div>

            {stores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Nenhuma loja encontrada</p>
              </div>
            )}
          </div>

          <div className="mt-8 bg-gray-800 overflow-hidden shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Como Funciona</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm mr-3">1</span>
                <p>Configure as contas de redes sociais para cada loja</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm mr-3">2</span>
                <p>Configure os horários de postagem (manhã, tarde, noite)</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm mr-3">3</span>
                <p>O scheduler seleciona automaticamente veículos disponíveis</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm mr-3">4</span>
                <p>Gera vídeos e agenda posts nas redes sociais configuradas</p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm mr-3">5</span>
                <p>Posts são publicados automaticamente nos horários configurados</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
