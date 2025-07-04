export interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          template_id: string
          personal_info: PersonalInfo
          summary: string
          experience: Experience[]
          education: Education[]
          skills: string[]
          certifications: Certification[]
          projects: Project[]
          additional_sections: Record<string, any>
          download_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          template_id?: string
          personal_info?: PersonalInfo
          summary?: string
          experience?: Experience[]
          education?: Education[]
          skills?: string[]
          certifications?: Certification[]
          projects?: Project[]
          additional_sections?: Record<string, any>
          download_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_id?: string
          personal_info?: PersonalInfo
          summary?: string
          experience?: Experience[]
          education?: Education[]
          skills?: string[]
          certifications?: Certification[]
          projects?: Project[]
          additional_sections?: Record<string, any>
          download_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      resume_templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          preview_image: string | null
          config: Record<string, any>
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          category: string
          preview_image?: string | null
          config?: Record<string, any>
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          preview_image?: string | null
          config?: Record<string, any>
          is_premium?: boolean
          created_at?: string
        }
      }
    }
  }
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
}

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}