// Template exports for pre-configured Harada Method matrices

import { sportsProfessionalAthleteTemplate } from './sports-professional-athlete';
import { careerProfessionalDevelopmentTemplate } from './career-professional-development';
import { educationAcademicExcellenceTemplate } from './education-academic-excellence';
import { personalDevelopmentLifeMasteryTemplate } from './personal-development-life-mastery';

export { sportsProfessionalAthleteTemplate };
export { careerProfessionalDevelopmentTemplate };
export { educationAcademicExcellenceTemplate };
export { personalDevelopmentLifeMasteryTemplate };

// Template metadata for UI display
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  template: any; // MatrixData
}

export const availableTemplates: TemplateMetadata[] = [
  {
    id: 'sports-professional-athlete',
    name: 'Professional Athlete',
    description:
      "Comprehensive development plan for aspiring professional athletes, inspired by Shohei Ohtani's Harada Method approach.",
    category: 'Sports',
    difficulty: 'advanced',
    estimatedHours: 2000,
    template: sportsProfessionalAthleteTemplate,
  },
  {
    id: 'career-professional-development',
    name: 'Career Advancement',
    description:
      'Strategic career development for technology professionals aiming for senior leadership positions.',
    category: 'Career',
    difficulty: 'intermediate',
    estimatedHours: 1500,
    template: careerProfessionalDevelopmentTemplate,
  },
  {
    id: 'education-academic-excellence',
    name: 'Academic Excellence',
    description:
      'Complete academic success strategy for students pursuing honors and comprehensive skill development.',
    category: 'Education',
    difficulty: 'intermediate',
    estimatedHours: 1200,
    template: educationAcademicExcellenceTemplate,
  },
  {
    id: 'personal-development-life-mastery',
    name: 'Life Mastery',
    description:
      'Holistic personal development across physical, mental, emotional, and spiritual dimensions for life fulfillment.',
    category: 'Personal Growth',
    difficulty: 'advanced',
    estimatedHours: 3000,
    template: personalDevelopmentLifeMasteryTemplate,
  },
];

// Helper function to get template by ID
export function getTemplateById(id: string) {
  const metadata = availableTemplates.find((t) => t.id === id);
  return metadata?.template;
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string) {
  return availableTemplates.filter(
    (t) => t.category.toLowerCase() === category.toLowerCase()
  );
}
