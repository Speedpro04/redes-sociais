export interface Store {
  id: string
  slug: string
  name: string
  logo_url?: string
  phone: string
  city?: string
  plan: string
  active: boolean
  created_at: string
}

export interface Vehicle {
  id: string
  store_id: string
  slug: string
  title: string
  type: 'carro' | 'moto'
  brand: string
  year: number
  km: number
  price: number
  description?: string
  status: 'available' | 'sold' | 'paused'
  created_at: string
  media?: VehicleMedia[]
  store?: Store
}

export interface VehicleMedia {
  id: string
  vehicle_id: string
  url: string
  type: 'image' | 'video'
  order: number
}

export interface SocialMediaAccount {
  id: string
  store_id: string
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  account_id: string
  account_name?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface SocialMediaPost {
  id: string
  store_id: string
  vehicle_id: string
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  account_id: string
  post_id?: string
  title: string
  description: string
  video_url?: string
  thumbnail_url?: string
  status: 'pending' | 'scheduled' | 'processing' | 'posted' | 'failed'
  scheduled_at?: string
  posted_at?: string
  error_message?: string
  metrics?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SocialMediaSchedule {
  id: string
  store_id: string
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube'
  time_period: 'morning' | 'afternoon' | 'evening'
  post_time: string
  timezone: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface VideoTemplate {
  id: string
  name: string
  description?: string
  duration: number
  style: 'dynamic' | 'elegant' | 'minimal' | 'bold'
  transition: 'fade' | 'slide' | 'zoom' | 'none'
  music_url?: string
  text_overlay?: Record<string, any>
  active: boolean
  created_at: string
  updated_at: string
}

export interface VideoGeneration {
  id: string
  store_id: string
  vehicle_id: string
  template_id?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  duration?: number
  file_size?: number
  error_message?: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_stores: number
  total_vehicles: number
  total_posts: number
  pending_posts: number
  scheduled_posts: number
  posted_posts: number
  total_generations: number
  completed_generations: number
  active_accounts: number
}
