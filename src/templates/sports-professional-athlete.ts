import { MatrixData, TaskStatus, TaskPriority } from '../types';

export const sportsProfessionalAthleteTemplate: MatrixData = {
  goal: {
    id: 'goal-sports-pro-athlete',
    title: 'Become a Professional Athlete',
    description: 'Achieve excellence in professional sports through systematic development of physical, mental, and strategic skills, following the Harada Method approach to comprehensive athlete development.',
    createdDate: new Date()
  },
  focusAreas: [
    {
      id: 'area-physical-development',
      title: 'Physical Development',
      description: 'Build strength, speed, endurance, and athletic conditioning',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-mental-preparation',
      title: 'Mental Preparation',
      description: 'Develop focus, resilience, and psychological strength',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-skill-acquisition',
      title: 'Skill Acquisition',
      description: 'Master fundamental and advanced sport-specific techniques',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-strategic-planning',
      title: 'Strategic Planning',
      description: 'Develop game strategy and competitive intelligence',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-performance-execution',
      title: 'Performance Execution',
      description: 'Deliver consistent high-level performance under pressure',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-recovery-maintenance',
      title: 'Recovery & Maintenance',
      description: 'Optimize recovery, prevent injury, and maintain peak condition',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-relationship-building',
      title: 'Relationship Building',
      description: 'Build professional network and mentorship connections',
      goalId: 'goal-sports-pro-athlete'
    },
    {
      id: 'area-personal-growth',
      title: 'Personal Growth',
      description: 'Develop character, leadership, and life skills',
      goalId: 'goal-sports-pro-athlete'
    }
  ],
  tasks: [
    // Physical Development (8 tasks)
    {
      id: 'task-physical-1',
      title: 'Establish baseline fitness assessment',
      description: 'Complete comprehensive physical assessment including strength, speed, endurance, and flexibility testing',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-physical-2',
      title: 'Develop strength training program',
      description: 'Create and implement a progressive strength training regimen focusing on compound movements',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-physical-3',
      title: 'Improve cardiovascular endurance',
      description: 'Build aerobic capacity through sport-specific cardio training and conditioning drills',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-physical-4',
      title: 'Enhance speed and agility',
      description: 'Develop explosive speed and change-of-direction ability through specialized drills',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-physical-5',
      title: 'Master sport-specific movements',
      description: 'Perfect fundamental movements and positions specific to your chosen sport',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-physical-6',
      title: 'Develop functional flexibility',
      description: 'Improve mobility and flexibility with dynamic stretching and mobility exercises',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-physical-7',
      title: 'Implement nutrition strategy',
      description: 'Develop optimal fueling plan for training, recovery, and performance demands',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-physical-8',
      title: 'Track and analyze progress',
      description: 'Regularly monitor physical metrics and adjust training based on data and results',
      areaId: 'area-physical-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Mental Preparation (8 tasks)
    {
      id: 'task-mental-1',
      title: 'Build mental toughness foundation',
      description: 'Develop resilience and mental fortitude through visualization and positive self-talk',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-mental-2',
      title: 'Master pre-performance routines',
      description: 'Establish consistent pre-game and pre-practice mental preparation rituals',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-mental-3',
      title: 'Develop focus and concentration',
      description: 'Train attention control and ability to maintain focus during high-pressure situations',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-mental-4',
      title: 'Learn stress management techniques',
      description: 'Master breathing exercises, relaxation techniques, and stress coping strategies',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-mental-5',
      title: 'Set performance goals and visualization',
      description: 'Create detailed mental imagery and process goals for competitions and training',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-mental-6',
      title: 'Build confidence through preparation',
      description: 'Develop self-assurance through thorough preparation and skill mastery',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-mental-7',
      title: 'Learn from setbacks and failures',
      description: 'Develop growth mindset by analyzing mistakes and using them for improvement',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-mental-8',
      title: 'Maintain work-life balance',
      description: 'Balance athletic demands with personal life and prevent burnout',
      areaId: 'area-mental-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Skill Acquisition (8 tasks)
    {
      id: 'task-skill-1',
      title: 'Master fundamental techniques',
      description: 'Perfect basic skills and techniques required for your sport',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-skill-2',
      title: 'Develop advanced skills',
      description: 'Learn and practice advanced techniques and specialized moves',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-skill-3',
      title: 'Improve decision making',
      description: 'Enhance in-game decision making through scenario training and analysis',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-skill-4',
      title: 'Perfect footwork and positioning',
      description: 'Master optimal positioning and movement patterns for your sport',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-skill-5',
      title: 'Develop sport IQ',
      description: 'Study game situations, rules, and strategies to improve understanding',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-skill-6',
      title: 'Learn from elite performers',
      description: 'Study and analyze techniques of top athletes in your sport',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-skill-7',
      title: 'Practice under pressure',
      description: 'Simulate high-pressure situations during training to build performance consistency',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-skill-8',
      title: 'Film and review performance',
      description: 'Record training sessions and analyze technique for continuous improvement',
      areaId: 'area-skill-acquisition',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Strategic Planning (8 tasks)
    {
      id: 'task-strategy-1',
      title: 'Study sport strategy and tactics',
      description: 'Learn advanced strategies, formations, and tactical approaches for your sport',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-strategy-2',
      title: 'Analyze opponents and competition',
      description: 'Research and prepare for different opponents and competitive situations',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-3',
      title: 'Develop game management skills',
      description: 'Learn how to manage games, timeouts, and strategic substitutions',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-4',
      title: 'Create training game plans',
      description: 'Design structured practice sessions with specific learning objectives',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-5',
      title: 'Learn statistical analysis',
      description: 'Use performance data and statistics to inform training and strategy decisions',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-strategy-6',
      title: 'Develop adaptability skills',
      description: 'Learn to adjust strategies based on changing game situations and conditions',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-strategy-7',
      title: 'Build competitive intelligence',
      description: 'Gather and analyze information about competitors, trends, and industry developments',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-strategy-8',
      title: 'Plan career progression',
      description: 'Create long-term career roadmap with milestones and development goals',
      areaId: 'area-strategic-planning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Performance Execution (8 tasks)
    {
      id: 'task-performance-1',
      title: 'Establish performance standards',
      description: 'Define clear performance expectations and quality standards for training and competition',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-performance-2',
      title: 'Develop consistent routines',
      description: 'Create reliable pre-competition and performance execution routines',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-performance-3',
      title: 'Master pressure situations',
      description: 'Learn to perform consistently in high-stakes, pressure-filled environments',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-performance-4',
      title: 'Improve execution speed and accuracy',
      description: 'Enhance ability to perform skills quickly and precisely under time constraints',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-performance-5',
      title: 'Build performance consistency',
      description: 'Develop ability to deliver high-level performance repeatedly across multiple events',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-performance-6',
      title: 'Learn recovery techniques',
      description: 'Master between-point/play recovery and energy management during competition',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-performance-7',
      title: 'Track performance metrics',
      description: 'Monitor and analyze performance data to identify strengths and areas for improvement',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-performance-8',
      title: 'Celebrate achievements',
      description: 'Recognize and celebrate performance milestones and personal bests',
      areaId: 'area-performance-execution',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Recovery & Maintenance (8 tasks)
    {
      id: 'task-recovery-1',
      title: 'Develop recovery protocols',
      description: 'Create comprehensive post-training and post-competition recovery routines',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-recovery-2',
      title: 'Learn injury prevention',
      description: 'Master techniques to prevent common injuries through proper form and conditioning',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-recovery-3',
      title: 'Implement sleep optimization',
      description: 'Establish optimal sleep schedule and create sleep environment for recovery',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-recovery-4',
      title: 'Master massage and therapy',
      description: 'Learn self-massage techniques, foam rolling, and when to seek professional therapy',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-recovery-5',
      title: 'Monitor training load',
      description: 'Track training volume and intensity to prevent overtraining and optimize recovery',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-recovery-6',
      title: 'Maintain equipment and gear',
      description: 'Regularly maintain and replace athletic equipment for optimal performance',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-recovery-7',
      title: 'Schedule periodic check-ups',
      description: 'Regular medical and performance check-ups to monitor overall health and fitness',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-recovery-8',
      title: 'Plan off-season development',
      description: 'Create structured plan for maintaining fitness and skill development during off-season',
      areaId: 'area-recovery-maintenance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Relationship Building (8 tasks)
    {
      id: 'task-relationship-1',
      title: 'Find a mentor or coach',
      description: 'Identify and connect with experienced mentors who can guide athletic development',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-relationship-2',
      title: 'Build team relationships',
      description: 'Develop strong relationships with teammates, coaches, and support staff',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-relationship-3',
      title: 'Network with industry professionals',
      description: 'Connect with scouts, agents, and other professionals in the sports industry',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-relationship-4',
      title: 'Join sports communities',
      description: 'Participate in local sports clubs, online communities, and training groups',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-relationship-5',
      title: 'Learn communication skills',
      description: 'Develop effective communication with coaches, teammates, and media',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-relationship-6',
      title: 'Build fan and supporter network',
      description: 'Develop relationships with fans, sponsors, and community supporters',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-relationship-7',
      title: 'Seek performance psychology support',
      description: 'Work with sports psychologists and mental performance coaches',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-relationship-8',
      title: 'Maintain work-life balance',
      description: 'Build relationships outside of sports for personal support and perspective',
      areaId: 'area-relationship-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Personal Growth (8 tasks)
    {
      id: 'task-growth-1',
      title: 'Develop leadership qualities',
      description: 'Cultivate leadership skills and ability to influence and inspire others',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-growth-2',
      title: 'Build discipline and work ethic',
      description: 'Develop consistent habits and strong work ethic essential for athletic success',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-growth-3',
      title: 'Learn time management',
      description: 'Master scheduling, prioritization, and balancing multiple commitments',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-growth-4',
      title: 'Pursue education and learning',
      description: 'Continue academic or professional education alongside athletic development',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-growth-5',
      title: 'Develop financial literacy',
      description: 'Learn money management, budgeting, and financial planning for athletes',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-growth-6',
      title: 'Practice gratitude and humility',
      description: 'Cultivate appreciation for opportunities and maintain humble perspective',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-growth-7',
      title: 'Set life goals beyond sports',
      description: 'Define personal and professional aspirations for life after competitive sports',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-growth-8',
      title: 'Give back to community',
      description: 'Volunteer and contribute to community through sports-related charitable activities',
      areaId: 'area-personal-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    }
  ]
};
