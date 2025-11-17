import { MatrixData, TaskStatus, TaskPriority } from '../types';

export const careerProfessionalDevelopmentTemplate: MatrixData = {
  goal: {
    id: 'goal-career-professional',
    title: 'Advance to Senior Leadership Position',
    description: 'Build a successful career in technology leadership through systematic skill development, networking, and strategic career planning following the Harada Method approach.',
    createdDate: new Date()
  },
  focusAreas: [
    {
      id: 'area-technical-expertise',
      title: 'Technical Expertise',
      description: 'Master technical skills and stay current with industry trends',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-leadership-skills',
      title: 'Leadership Skills',
      description: 'Develop management and leadership capabilities',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-business-acumen',
      title: 'Business Acumen',
      description: 'Understand business operations and strategic thinking',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-career-strategy',
      title: 'Career Strategy',
      description: 'Plan and execute long-term career advancement',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-communication',
      title: 'Communication',
      description: 'Master verbal, written, and presentation skills',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-networking',
      title: 'Networking',
      description: 'Build professional relationships and industry connections',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-work-life-balance',
      title: 'Work-Life Balance',
      description: 'Maintain health, relationships, and personal fulfillment',
      goalId: 'goal-career-professional'
    },
    {
      id: 'area-continuous-learning',
      title: 'Continuous Learning',
      description: 'Commit to lifelong learning and personal development',
      goalId: 'goal-career-professional'
    }
  ],
  tasks: [
    // Technical Expertise (8 tasks)
    {
      id: 'task-tech-1',
      title: 'Master core technical skills',
      description: 'Deepen expertise in primary technical domain and related technologies',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-tech-2',
      title: 'Stay current with industry trends',
      description: 'Follow technology trends, attend conferences, and read industry publications',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-tech-3',
      title: 'Learn emerging technologies',
      description: 'Study new technologies and tools relevant to career field',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-tech-4',
      title: 'Contribute to open source',
      description: 'Participate in open source projects to build portfolio and network',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-tech-5',
      title: 'Obtain relevant certifications',
      description: 'Earn industry-recognized certifications to validate expertise',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-tech-6',
      title: 'Build technical portfolio',
      description: 'Create showcase of projects and technical achievements',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-tech-7',
      title: 'Mentor junior developers',
      description: 'Share knowledge and help develop the next generation of professionals',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-tech-8',
      title: 'Research and innovation',
      description: 'Explore cutting-edge solutions and innovative approaches to problems',
      areaId: 'area-technical-expertise',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Leadership Skills (8 tasks)
    {
      id: 'task-leadership-1',
      title: 'Develop management fundamentals',
      description: 'Learn core management principles and team leadership basics',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-leadership-2',
      title: 'Build team management skills',
      description: 'Learn to effectively manage, motivate, and develop team members',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-leadership-3',
      title: 'Master conflict resolution',
      description: 'Develop skills to handle team conflicts and difficult conversations',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-leadership-4',
      title: 'Learn project management',
      description: 'Master methodologies for planning, executing, and delivering projects',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-leadership-5',
      title: 'Develop coaching abilities',
      description: 'Learn to coach and develop team members\' skills and careers',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-leadership-6',
      title: 'Build strategic thinking',
      description: 'Develop ability to think strategically and make long-term decisions',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-leadership-7',
      title: 'Foster innovation culture',
      description: 'Create environment that encourages creativity and innovative thinking',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-leadership-8',
      title: 'Lead organizational change',
      description: 'Learn to manage and lead through periods of organizational change',
      areaId: 'area-leadership-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Business Acumen (8 tasks)
    {
      id: 'task-business-1',
      title: 'Understand business fundamentals',
      description: 'Learn basic business concepts, financial statements, and metrics',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-business-2',
      title: 'Learn industry knowledge',
      description: 'Gain deep understanding of industry dynamics and market forces',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-business-3',
      title: 'Master product management',
      description: 'Learn to develop, launch, and manage successful products',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-business-4',
      title: 'Develop sales and marketing knowledge',
      description: 'Understand customer acquisition, sales processes, and marketing strategies',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-business-5',
      title: 'Learn financial management',
      description: 'Master budgeting, forecasting, and financial decision making',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-business-6',
      title: 'Understand regulatory compliance',
      description: 'Learn industry regulations and compliance requirements',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-business-7',
      title: 'Build customer empathy',
      description: 'Develop deep understanding of customer needs and pain points',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-business-8',
      title: 'Master negotiation skills',
      description: 'Learn effective negotiation and deal-making techniques',
      areaId: 'area-business-acumen',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Career Strategy (8 tasks)
    {
      id: 'task-strategy-1',
      title: 'Define career vision',
      description: 'Create clear vision for career progression and long-term goals',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-strategy-2',
      title: 'Identify skill gaps',
      description: 'Assess current skills and identify areas needing development',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-strategy-3',
      title: 'Create career roadmap',
      description: 'Develop detailed plan with milestones and timelines for advancement',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-strategy-4',
      title: 'Build personal brand',
      description: 'Develop professional reputation and online presence',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-5',
      title: 'Seek high-visibility projects',
      description: 'Take on challenging projects that demonstrate leadership potential',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-6',
      title: 'Prepare for performance reviews',
      description: 'Document achievements and prepare compelling cases for advancement',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-strategy-7',
      title: 'Explore career options',
      description: 'Research alternative career paths and opportunities',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-strategy-8',
      title: 'Plan for career transitions',
      description: 'Prepare for potential career changes or pivots',
      areaId: 'area-career-strategy',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Communication (8 tasks)
    {
      id: 'task-comm-1',
      title: 'Improve presentation skills',
      description: 'Master public speaking and presentation delivery techniques',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-comm-2',
      title: 'Develop writing skills',
      description: 'Enhance ability to write clear, concise, and compelling content',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-comm-3',
      title: 'Master active listening',
      description: 'Develop skills to truly listen and understand others\' perspectives',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-comm-4',
      title: 'Learn executive communication',
      description: 'Develop communication style appropriate for leadership roles',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-comm-5',
      title: 'Build storytelling abilities',
      description: 'Learn to craft compelling narratives and tell stories effectively',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-comm-6',
      title: 'Improve email communication',
      description: 'Master professional email writing and digital communication',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-comm-7',
      title: 'Develop cross-cultural communication',
      description: 'Learn to communicate effectively across cultural and language barriers',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-comm-8',
      title: 'Practice feedback delivery',
      description: 'Master giving and receiving constructive feedback effectively',
      areaId: 'area-communication',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Networking (8 tasks)
    {
      id: 'task-network-1',
      title: 'Build professional network',
      description: 'Establish connections with key industry professionals and leaders',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-network-2',
      title: 'Attend industry conferences',
      description: 'Participate in conferences, meetups, and professional gatherings',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-network-3',
      title: 'Join professional organizations',
      description: 'Become active member of industry associations and groups',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-network-4',
      title: 'Find mentors and sponsors',
      description: 'Identify and develop relationships with career mentors and sponsors',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-network-5',
      title: 'Contribute to professional communities',
      description: 'Share knowledge through blogs, forums, and community involvement',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-network-6',
      title: 'Maintain contact database',
      description: 'Organize and maintain professional contacts and relationships',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-network-7',
      title: 'Develop LinkedIn presence',
      description: 'Build comprehensive and professional LinkedIn profile and network',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-network-8',
      title: 'Give back through mentoring',
      description: 'Mentor junior professionals and give back to the community',
      areaId: 'area-networking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Work-Life Balance (8 tasks)
    {
      id: 'task-balance-1',
      title: 'Set boundaries and priorities',
      description: 'Establish clear work-life boundaries and prioritize personal time',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH
    },
    {
      id: 'task-balance-2',
      title: 'Maintain physical health',
      description: 'Develop exercise routine and healthy lifestyle habits',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-balance-3',
      title: 'Nurture personal relationships',
      description: 'Maintain strong relationships with family and friends',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-balance-4',
      title: 'Develop hobbies and interests',
      description: 'Cultivate personal interests and activities outside of work',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-balance-5',
      title: 'Practice mindfulness',
      description: 'Incorporate meditation and mindfulness practices for stress management',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-balance-6',
      title: 'Plan vacations and breaks',
      description: 'Schedule regular time off and maintain work-life balance',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-balance-7',
      title: 'Build support network',
      description: 'Develop network of friends and professionals for personal support',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-balance-8',
      title: 'Celebrate personal milestones',
      description: 'Recognize and celebrate personal achievements and life events',
      areaId: 'area-work-life-balance',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },

    // Continuous Learning (8 tasks)
    {
      id: 'task-learning-1',
      title: 'Read industry books',
      description: 'Maintain regular reading habit focused on professional development',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-learning-2',
      title: 'Take online courses',
      description: 'Complete relevant online courses and certifications regularly',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-learning-3',
      title: 'Attend workshops and seminars',
      description: 'Participate in professional development workshops and training',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-learning-4',
      title: 'Learn new programming languages',
      description: 'Expand technical skills by learning additional programming languages',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM
    },
    {
      id: 'task-learning-5',
      title: 'Study leadership and management',
      description: 'Read books and take courses on leadership and organizational behavior',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-learning-6',
      title: 'Explore adjacent fields',
      description: 'Learn about related disciplines and interdisciplinary knowledge',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-learning-7',
      title: 'Teach and share knowledge',
      description: 'Share learnings through blogging, speaking, or teaching others',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    },
    {
      id: 'task-learning-8',
      title: 'Reflect and journal',
      description: 'Maintain learning journal to reflect on experiences and insights',
      areaId: 'area-continuous-learning',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW
    }
  ]
};
