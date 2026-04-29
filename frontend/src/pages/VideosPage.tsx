import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { VideoTemplate, VideoGeneration } from '../types'

type SmartTemplate = {
  id: string
  name: string
  style: string
  objective: string
  duration: string
  hook: string
  cta: string
}

export default function VideosPage() {
  const [templates, setTemplates] = useState<VideoTemplate[]>([])
  const [generations, setGenerations] = useState<VideoGeneration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState<string>('')
  const [stores, setStores] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'templates' | 'generations' | 'smart'>('templates')
  const [selectedSmartTemplate, setSelectedSmartTemplate] = useState<string>('agressivo')
  const [vehicleName, setVehicleName] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehiclePrice, setVehiclePrice] = useState('')
  const [vehicleHighlight, setVehicleHighlight] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [smartDescription, setSmartDescription] = useState('')
  const [smartStatus, setSmartStatus] = useState('')
  const [smartPlatform, setSmartPlatform] = useState('instagram')
  const navigate = useNavigate()

  const smartTemplates: SmartTemplate[] = [
    {
      id: 'agressivo',
      name: 'Fechamento Agressivo',
      style: 'Conversão direta',
      objective: 'Gerar contato rápido no WhatsApp',
      duration: '20s',
      hook: 'Oferta quente + benefício imediato',
      cta: 'Me chama agora e garanta prioridade',
    },
    {
      id: 'spin',
      name: 'SPIN Premium',
      style: 'Consultivo persuasivo',
      objective: 'Convencer com lógica e dor do cliente',
      duration: '25s',
      hook: 'Situação + Problema + Implicação',
      cta: 'Fala comigo e veja a melhor condição',
    },
    {
      id: 'status',
      name: 'Status & Lifestyle',
      style: 'Desejo e posicionamento',
      objective: 'Atrair cliente que compra por imagem e experiência',
      duration: '18s',
      hook: 'Visual forte + presença',
      cta: 'Chama no WhatsApp para vídeo completo',
    },
    {
      id: 'familia',
      name: 'Família Segura',
      style: 'Segurança e confiança',
      objective: 'Reduzir objeções de risco e manutenção',
      duration: '22s',
      hook: 'Proteção, conforto e tranquilidade',
      cta: 'Me chama e agende sua visita',
    },
  ]

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

  const completedCount = generations.filter((g) => g.status === 'completed').length
  const processingCount = generations.filter((g) => g.status === 'processing').length
  const failedCount = generations.filter((g) => g.status === 'failed').length
  const currentSmartTemplate = smartTemplates.find((t) => t.id === selectedSmartTemplate) || smartTemplates[0]

  const handleGenerateSmartDescription = async () => {
    if (!selectedStore) {
      setSmartStatus('Selecione uma loja antes de gerar a descrição.')
      return
    }
    if (!vehicleName.trim()) {
      setSmartStatus('Informe o nome do veículo para gerar a descrição.')
      return
    }

    try {
      setSmartStatus('Gerando descrição inteligente...')
      const response = await api.post('/api/v1/social-media/smart-description', {
        store_id: selectedStore,
        vehicle_id: 'manual-input',
        platform: smartPlatform,
        vehicle_name: vehicleName,
        vehicle_year: vehicleYear || null,
        vehicle_price: vehiclePrice || null,
        vehicle_highlight: vehicleHighlight || null,
        target_audience: targetAudience || null,
        template_style: currentSmartTemplate.id,
        save_draft: true,
      })

      setSmartDescription(response.data.description || '')
      setSmartStatus(response.data.message || 'Descrição gerada.')
    } catch (error) {
      console.error('Erro ao gerar descrição inteligente:', error)
      setSmartStatus('Não foi possível gerar a descrição agora.')
    }
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
                  className="border-transparent text-slate-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Redes Sociais
                </a>
                <a
                  href="/videos"
                  className="border-orange-500 text-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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
          <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Central de Vídeos</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Gerencie templates e acompanhe o status das gerações em um só lugar.
                </p>
              </div>
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-slate-400">Templates</p>
                <p className="text-xl font-bold text-white">{templates.length}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-slate-400">Concluídos</p>
                <p className="text-xl font-bold text-green-400">{completedCount}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-slate-400">Processando</p>
                <p className="text-xl font-bold text-purple-400">{processingCount}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-slate-400">Falhas</p>
                <p className="text-xl font-bold text-red-400">{failedCount}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-800 p-2 rounded-lg inline-flex gap-2">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`${
                    activeTab === 'templates'
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-300 hover:bg-gray-700'
                  } whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors`}
                >
                  Templates ({templates.length})
                </button>
                <button
                  onClick={() => setActiveTab('generations')}
                  className={`${
                    activeTab === 'generations'
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-300 hover:bg-gray-700'
                  } whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors`}
                >
                  Gerações ({generations.length})
                </button>
                <button
                  onClick={() => setActiveTab('smart')}
                  className={`${
                    activeTab === 'smart'
                      ? 'bg-orange-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  } whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-colors`}
                >
                  Descrição Inteligente
                </button>
            </div>
          </div>

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-gray-800 border border-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">{template.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{template.description || 'Sem descrição'}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyleColor(template.style)}`}>
                        {template.style}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Duração:</span>
                        <span className="text-white">{template.duration}s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Transição:</span>
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
                  <p className="text-slate-400">Nenhum template encontrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'generations' && (
            <div className="space-y-4">
              {generations.map((generation) => (
                <div key={generation.id} className="bg-gray-800 border border-gray-700 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">Geração de Vídeo</h3>
                        <p className="text-sm text-slate-400">Veículo: {generation.vehicle_id}</p>
                        <p className="text-sm text-slate-400">Loja: {generation.store_id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(generation.status)}`}>
                        {generation.status}
                      </span>
                    </div>
                    {generation.video_url && (
                      <div className="mb-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
                        <video
                          src={generation.video_url}
                          controls
                          className="w-full max-w-2xl rounded-lg"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Duração:</span>
                        <span className="text-white ml-2">{generation.duration}s</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Tamanho:</span>
                        <span className="text-white ml-2">{generation.file_size ? `${(generation.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Criado em:</span>
                        <span className="text-white ml-2">{new Date(generation.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Atualizado em:</span>
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
                  <p className="text-slate-400">Nenhuma geração de vídeo encontrada</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'smart' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 bg-slate-900/70 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Modelos de Template</h3>
                <div className="space-y-3">
                  {smartTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedSmartTemplate(template.id)}
                      className={`w-full text-left rounded-lg border p-3 transition-colors ${
                        selectedSmartTemplate === template.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{template.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{template.style}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-lg bg-slate-950 border border-slate-700">
                  <p className="text-xs text-slate-400">Objetivo</p>
                  <p className="text-sm text-white">{currentSmartTemplate.objective}</p>
                  <p className="text-xs text-slate-400 mt-3">Gancho</p>
                  <p className="text-sm text-white">{currentSmartTemplate.hook}</p>
                  <p className="text-xs text-slate-400 mt-3">CTA sugerida</p>
                  <p className="text-sm text-orange-300">{currentSmartTemplate.cta}</p>
                </div>
              </div>

              <div className="xl:col-span-2 bg-slate-900/70 border border-slate-700/60 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Tela de Descrição Inteligente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    placeholder="Nome do veículo (ex: Corolla XEi)"
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                  <input
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="Ano (ex: 2022)"
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                  <input
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(e.target.value)}
                    placeholder="Preço (ex: R$ 129.900)"
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                  <input
                    value={vehicleHighlight}
                    onChange={(e) => setVehicleHighlight(e.target.value)}
                    placeholder="Destaque principal (ex: baixa km e revisão em dia)"
                    className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                  <input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Público alvo (ex: família, motorista de app...)"
                    className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                  <select
                    value={smartPlatform}
                    onChange={(e) => setSmartPlatform(e.target.value)}
                    className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">Legendas automáticas</p>
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-300">
                      Sempre Ativas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Todo template inteligente sai com legendas por padrão para melhorar retenção e acessibilidade.
                  </p>
                </div>

                <button
                  onClick={handleGenerateSmartDescription}
                  className="mt-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Gerar descrição inteligente
                </button>
                {smartStatus && (
                  <p className="mt-3 text-sm text-orange-300">{smartStatus}</p>
                )}

                <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Prévia da narração</p>
                  <p className="text-sm text-slate-100 whitespace-pre-wrap">
                    {smartDescription || 'Preencha os dados e clique em "Gerar descrição inteligente".'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}



