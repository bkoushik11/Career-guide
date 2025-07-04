import { create } from 'zustand'
import { ResumeService } from '@/services/resumeService'
import type { Database } from '@/lib/supabase-types'

type Resume = Database['public']['Tables']['resumes']['Row']
type ResumeTemplate = Database['public']['Tables']['resume_templates']['Row']

interface ResumeState {
  resumes: Resume[]
  currentResume: Resume | null
  templates: ResumeTemplate[]
  loading: boolean
  autoSaving: boolean
  
  // Resume operations
  setResumes: (resumes: Resume[]) => void
  setCurrentResume: (resume: Resume | null) => void
  updateCurrentResume: (updates: Partial<Resume>) => void
  addResume: (resume: Resume) => void
  updateResume: (id: string, updates: Partial<Resume>) => void
  deleteResume: (id: string) => void
  incrementDownloadCount: (id: string) => void
  
  // Template operations
  setTemplates: (templates: ResumeTemplate[]) => void
  
  // Async operations
  loadResumes: (userId: string) => Promise<void>
  loadTemplates: () => Promise<void>
  saveResume: (resume: Resume) => Promise<Resume>
  autoSave: (id: string, updates: Partial<Resume>) => Promise<void>
  
  // State management
  setLoading: (loading: boolean) => void
  setAutoSaving: (autoSaving: boolean) => void
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  templates: [],
  loading: false,
  autoSaving: false,

  // Resume operations
  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  updateCurrentResume: (updates) => {
    const { currentResume, autoSave } = get()
    if (currentResume) {
      const updatedResume = { ...currentResume, ...updates }
      set({ currentResume: updatedResume })
      
      // Auto-save after 1 second delay
      if (currentResume.id) {
        setTimeout(() => {
          autoSave(currentResume.id!, updates)
        }, 1000)
      }
    }
  },
  addResume: (resume) => {
    const { resumes } = get()
    set({ resumes: [resume, ...resumes] })
  },
  updateResume: (id, updates) => {
    const { resumes } = get()
    set({
      resumes: resumes.map((resume) =>
        resume.id === id ? { ...resume, ...updates } : resume
      ),
    })
  },
  deleteResume: async (id) => {
    try {
      await ResumeService.deleteResume(id)
      const { resumes } = get()
      set({ resumes: resumes.filter((resume) => resume.id !== id) })
    } catch (error) {
      console.error('Failed to delete resume:', error)
      throw error
    }
  },
  incrementDownloadCount: async (id) => {
    try {
      await ResumeService.incrementDownloadCount(id)
      const { resumes } = get()
      set({
        resumes: resumes.map((resume) =>
          resume.id === id 
            ? { ...resume, download_count: (resume.download_count || 0) + 1 }
            : resume
        ),
      })
    } catch (error) {
      console.error('Failed to increment download count:', error)
    }
  },

  // Template operations
  setTemplates: (templates) => set({ templates }),

  // Async operations
  loadResumes: async (userId: string) => {
    set({ loading: true })
    try {
      const resumes = await ResumeService.getResumes(userId)
      set({ resumes })
    } catch (error) {
      console.error('Failed to load resumes:', error)
    } finally {
      set({ loading: false })
    }
  },

  loadTemplates: async () => {
    try {
      const templates = await ResumeService.getTemplates()
      set({ templates })
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  },

  saveResume: async (resume: Resume) => {
    try {
      let savedResume: Resume
      
      if (resume.id && get().resumes.find(r => r.id === resume.id)) {
        // Update existing resume
        savedResume = await ResumeService.updateResume(resume.id, resume)
        get().updateResume(resume.id, savedResume)
      } else {
        // Create new resume
        savedResume = await ResumeService.createResume(resume)
        get().addResume(savedResume)
      }
      
      // Update current resume with saved data
      set({ currentResume: savedResume })
      
      return savedResume
    } catch (error) {
      console.error('Failed to save resume:', error)
      throw error
    }
  },

  autoSave: async (id: string, updates: Partial<Resume>) => {
    const { autoSaving } = get()
    if (autoSaving) return // Prevent multiple auto-saves
    
    set({ autoSaving: true })
    try {
      await ResumeService.autoSave(id, updates)
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      set({ autoSaving: false })
    }
  },

  // State management
  setLoading: (loading) => set({ loading }),
  setAutoSaving: (autoSaving) => set({ autoSaving }),
}))

// Helper function to create a new resume
export const createNewResume = (userId: string, templateId: string = 'modern-professional'): Omit<Resume, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: userId,
  title: 'New Resume',
  template_id: templateId,
  personal_info: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  additional_sections: {},
  download_count: 0,
})