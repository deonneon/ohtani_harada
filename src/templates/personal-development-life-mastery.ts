import { type MatrixData, TaskStatus, TaskPriority } from '../types';

export const personalDevelopmentLifeMasteryTemplate: MatrixData = {
  goal: {
    id: 'goal-personal-mastery',
    title: 'Achieve Life Mastery and Personal Fulfillment',
    description:
      'Develop comprehensive personal growth across physical, mental, emotional, and spiritual dimensions to live a balanced, meaningful, and fulfilling life following the Harada Method approach.',
    createdDate: new Date(),
  },
  focusAreas: [
    {
      id: 'area-physical-health',
      title: 'Physical Health',
      description: 'Build strength, vitality, and physical well-being',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-mental-clarity',
      title: 'Mental Clarity',
      description: 'Develop focus, learning, and intellectual growth',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-emotional-intelligence',
      title: 'Emotional Intelligence',
      description: 'Master emotions, relationships, and self-awareness',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-financial-freedom',
      title: 'Financial Freedom',
      description: 'Build wealth, financial literacy, and independence',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-relationships',
      title: 'Relationships',
      description: 'Cultivate meaningful connections and social skills',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-spiritual-growth',
      title: 'Spiritual Growth',
      description: 'Find purpose, meaning, and inner peace',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-life-purpose',
      title: 'Life Purpose',
      description: 'Discover passion, mission, and life direction',
      goalId: 'goal-personal-mastery',
    },
    {
      id: 'area-legacy-building',
      title: 'Legacy Building',
      description: 'Create lasting impact and contribution to the world',
      goalId: 'goal-personal-mastery',
    },
  ],
  tasks: [
    // Physical Health (8 tasks)
    {
      id: 'task-physical-1',
      title: 'Establish fitness foundation',
      description:
        'Build consistent exercise routine combining cardio, strength, and flexibility training',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-physical-2',
      title: 'Optimize nutrition habits',
      description:
        'Develop healthy eating patterns and understand nutritional science',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-physical-3',
      title: 'Master sleep quality',
      description:
        'Establish optimal sleep schedule and create sleep-friendly environment',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-physical-4',
      title: 'Build recovery practices',
      description:
        'Learn massage, stretching, and recovery techniques for optimal performance',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-physical-5',
      title: 'Prevent chronic diseases',
      description:
        'Understand and implement preventive health measures and regular check-ups',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-physical-6',
      title: 'Develop body awareness',
      description:
        'Learn to listen to body signals and maintain physical intuition',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-physical-7',
      title: 'Age gracefully',
      description:
        'Implement anti-aging practices and maintain vitality throughout life',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-physical-8',
      title: 'Track health metrics',
      description:
        'Monitor key health indicators and adjust lifestyle based on data',
      areaId: 'area-physical-health',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Mental Clarity (8 tasks)
    {
      id: 'task-mental-1',
      title: 'Cultivate mindfulness practice',
      description:
        'Establish daily meditation and mindfulness routine for mental clarity',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-mental-2',
      title: 'Develop deep focus',
      description: 'Master concentration techniques and eliminate distractions',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-mental-3',
      title: 'Build learning capacity',
      description:
        'Develop efficient learning techniques and knowledge acquisition skills',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-mental-4',
      title: 'Enhance memory function',
      description: 'Practice memory techniques and maintain cognitive health',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-mental-5',
      title: 'Master critical thinking',
      description: 'Develop analytical skills and logical reasoning abilities',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-mental-6',
      title: 'Practice creative thinking',
      description:
        'Cultivate imagination and innovative problem-solving approaches',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-mental-7',
      title: 'Maintain mental flexibility',
      description:
        'Develop adaptability and openness to new ideas and perspectives',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-mental-8',
      title: 'Journal and reflect',
      description:
        'Maintain daily reflection practice for mental clarity and insight',
      areaId: 'area-mental-clarity',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Emotional Intelligence (8 tasks)
    {
      id: 'task-emotional-1',
      title: 'Develop self-awareness',
      description:
        'Understand personal emotions, triggers, and behavioral patterns',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-emotional-2',
      title: 'Master emotional regulation',
      description:
        'Learn to manage emotions effectively and respond rather than react',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-emotional-3',
      title: 'Build empathy skills',
      description: "Develop ability to understand and share others' feelings",
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-emotional-4',
      title: 'Improve social awareness',
      description: 'Read social cues and understand group dynamics effectively',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-emotional-5',
      title: 'Cultivate positive relationships',
      description:
        'Build and maintain healthy, supportive personal and professional relationships',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-emotional-6',
      title: 'Practice forgiveness',
      description:
        'Learn to forgive others and yourself for personal growth and freedom',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-emotional-7',
      title: 'Develop resilience',
      description:
        'Build ability to bounce back from adversity and maintain optimism',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-emotional-8',
      title: 'Express gratitude daily',
      description:
        'Practice daily gratitude to cultivate positive emotional state',
      areaId: 'area-emotional-intelligence',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Financial Freedom (8 tasks)
    {
      id: 'task-financial-1',
      title: 'Build financial literacy',
      description:
        'Master budgeting, saving, investing, and basic financial principles',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-financial-2',
      title: 'Eliminate debt strategically',
      description:
        'Create and execute plan to pay off high-interest debt efficiently',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-financial-3',
      title: 'Build emergency fund',
      description:
        'Save 3-6 months of expenses for financial security and peace of mind',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-financial-4',
      title: 'Invest wisely',
      description:
        'Learn investment principles and build diversified investment portfolio',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-financial-5',
      title: 'Create multiple income streams',
      description:
        'Develop passive and active income sources beyond primary employment',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-financial-6',
      title: 'Plan for retirement',
      description:
        'Set up retirement accounts and develop long-term financial strategy',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-financial-7',
      title: 'Protect assets',
      description:
        'Understand insurance and legal protections for financial security',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-financial-8',
      title: 'Teach financial wisdom',
      description:
        'Share financial knowledge with family and community members',
      areaId: 'area-financial-freedom',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Relationships (8 tasks)
    {
      id: 'task-relationship-1',
      title: 'Strengthen family bonds',
      description:
        'Build deeper connections with immediate and extended family members',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-relationship-2',
      title: 'Cultivate close friendships',
      description:
        'Develop and maintain meaningful friendships throughout life',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-relationship-3',
      title: 'Master communication skills',
      description:
        'Learn effective verbal and non-verbal communication techniques',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-relationship-4',
      title: 'Build professional network',
      description:
        'Create valuable professional connections and mentorship relationships',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-relationship-5',
      title: 'Practice active listening',
      description:
        "Develop skill of truly listening and understanding others' perspectives",
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-relationship-6',
      title: 'Resolve conflicts constructively',
      description:
        'Learn healthy conflict resolution and relationship repair techniques',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-relationship-7',
      title: 'Give generously',
      description:
        'Practice generosity and service in relationships and community',
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-relationship-8',
      title: "Celebrate others' successes",
      description:
        "Practice genuine happiness for others' achievements and good fortune",
      areaId: 'area-relationships',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Spiritual Growth (8 tasks)
    {
      id: 'task-spiritual-1',
      title: 'Discover personal values',
      description:
        'Identify and clarify core values that guide life decisions and actions',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-spiritual-2',
      title: 'Explore spiritual practices',
      description:
        'Experiment with meditation, prayer, contemplation, or other spiritual disciplines',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-spiritual-3',
      title: 'Find inner peace',
      description:
        'Develop practices for inner calm and presence in daily life',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-spiritual-4',
      title: 'Connect with nature',
      description:
        'Spend time in nature and develop appreciation for the natural world',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-spiritual-5',
      title: 'Practice compassion',
      description:
        'Cultivate compassion for self and others through loving-kindness practices',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-spiritual-6',
      title: 'Explore philosophical traditions',
      description:
        'Study wisdom traditions and philosophical perspectives on life',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-spiritual-7',
      title: 'Live with intention',
      description:
        'Make conscious choices aligned with personal values and purpose',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-spiritual-8',
      title: 'Practice acceptance',
      description:
        'Develop acceptance of life circumstances while working toward positive change',
      areaId: 'area-spiritual-growth',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Life Purpose (8 tasks)
    {
      id: 'task-purpose-1',
      title: 'Identify personal passions',
      description:
        'Discover activities and causes that ignite enthusiasm and energy',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-purpose-2',
      title: 'Clarify life vision',
      description:
        'Create clear vision for ideal life and long-term aspirations',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-purpose-3',
      title: 'Define core mission',
      description: 'Articulate personal mission statement and life purpose',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-purpose-4',
      title: 'Set meaningful goals',
      description:
        'Create goals that align with personal values and life purpose',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-purpose-5',
      title: 'Find flow activities',
      description:
        'Identify and incorporate activities that create state of complete immersion',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-purpose-6',
      title: 'Contribute to causes',
      description:
        'Support causes larger than self and make positive societal impact',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-purpose-7',
      title: 'Mentor and guide others',
      description: 'Share wisdom and experience to help others find their path',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-purpose-8',
      title: 'Live authentically',
      description:
        'Express true self and live in alignment with personal values',
      areaId: 'area-life-purpose',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Legacy Building (8 tasks)
    {
      id: 'task-legacy-1',
      title: 'Document life lessons',
      description:
        'Write down important lessons learned to share with future generations',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-legacy-2',
      title: 'Create lasting memories',
      description:
        'Build traditions and experiences that family will cherish and remember',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-3',
      title: 'Share wisdom generously',
      description:
        'Teach and mentor others, sharing accumulated knowledge and experience',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-4',
      title: 'Build enduring relationships',
      description:
        'Cultivate deep, lasting relationships that transcend time and circumstances',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-5',
      title: 'Create positive change',
      description:
        'Initiate projects or movements that create lasting positive impact',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-6',
      title: 'Preserve family history',
      description:
        'Document and preserve family stories, traditions, and heritage',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-7',
      title: 'Leave ethical will',
      description:
        'Create document sharing values, beliefs, and hopes for loved ones',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-legacy-8',
      title: 'Live with integrity',
      description:
        'Demonstrate through actions the values and principles to pass forward',
      areaId: 'area-legacy-building',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
  ],
};
