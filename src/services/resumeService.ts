import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'

type Resume = Database['public']['Tables']['resumes']['Row']
type ResumeInsert = Database['public']['Tables']['resumes']['Insert']
type ResumeUpdate = Database['public']['Tables']['resumes']['Update']
type ResumeTemplate = Database['public']['Tables']['resume_templates']['Row']

export class ResumeService {
  // Resume CRUD operations
  static async createResume(resume: ResumeInsert): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .insert(resume)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getResumes(userId: string): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getResume(id: string): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async updateResume(id: string, updates: ResumeUpdate): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteResume(id: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_download_count', {
      resume_id: id
    })

    if (error) throw error
  }

  // Auto-save functionality
  static async autoSave(id: string, updates: ResumeUpdate): Promise<void> {
    try {
      await this.updateResume(id, updates)
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  // Template operations
  static async getTemplates(): Promise<ResumeTemplate[]> {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getTemplate(id: string): Promise<ResumeTemplate> {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async getTemplatesByCategory(category: string): Promise<ResumeTemplate[]> {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }
}