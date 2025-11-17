import { type MatrixData, TaskStatus, TaskPriority } from '../types';

export const educationAcademicExcellenceTemplate: MatrixData = {
  goal: {
    id: 'goal-education-excellence',
    title: 'Achieve Academic Excellence and Graduate with Honors',
    description:
      'Excel academically while developing comprehensive learning skills, time management, and intellectual curiosity following the Harada Method approach to educational success.',
    createdDate: new Date(),
  },
  focusAreas: [
    {
      id: 'area-study-skills',
      title: 'Study Skills',
      description: 'Master effective learning and study techniques',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-time-management',
      title: 'Time Management',
      description: 'Develop efficient scheduling and productivity habits',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-critical-thinking',
      title: 'Critical Thinking',
      description: 'Build analytical and problem-solving abilities',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-research-skills',
      title: 'Research Skills',
      description: 'Master research methodology and academic writing',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-communication-skills',
      title: 'Communication Skills',
      description: 'Develop writing, speaking, and presentation abilities',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-health-wellness',
      title: 'Health & Wellness',
      description: 'Maintain physical and mental health for academic success',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-career-preparation',
      title: 'Career Preparation',
      description: 'Build professional skills and explore career paths',
      goalId: 'goal-education-excellence',
    },
    {
      id: 'area-personal-development',
      title: 'Personal Development',
      description: 'Foster character growth and life skills',
      goalId: 'goal-education-excellence',
    },
  ],
  tasks: [
    // Study Skills (8 tasks)
    {
      id: 'task-study-1',
      title: 'Master active reading techniques',
      description:
        'Learn to read textbooks and articles actively with annotations and summaries',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-study-2',
      title: 'Develop effective note-taking',
      description:
        'Master various note-taking methods (Cornell, mind mapping, etc.)',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-study-3',
      title: 'Learn memory techniques',
      description:
        'Master mnemonic devices and memory palace techniques for better retention',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-study-4',
      title: 'Practice spaced repetition',
      description:
        'Use spaced repetition systems for long-term knowledge retention',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-study-5',
      title: 'Master test-taking strategies',
      description:
        'Learn techniques for different types of exams and assessments',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-study-6',
      title: 'Develop group study habits',
      description: 'Learn to study effectively in groups and teaching others',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-study-7',
      title: 'Create study environment',
      description:
        'Optimize physical and digital study spaces for maximum productivity',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-study-8',
      title: 'Track learning progress',
      description:
        'Monitor study effectiveness and adjust techniques based on results',
      areaId: 'area-study-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Time Management (8 tasks)
    {
      id: 'task-time-1',
      title: 'Create semester schedule',
      description:
        'Develop comprehensive calendar with classes, study time, and deadlines',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-time-2',
      title: 'Master weekly planning',
      description:
        'Create detailed weekly schedules balancing academics and personal life',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-time-3',
      title: 'Set daily goals and priorities',
      description:
        'Use Eisenhower matrix and daily planning for task prioritization',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-time-4',
      title: 'Avoid procrastination',
      description:
        'Learn techniques to overcome procrastination and maintain momentum',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-time-5',
      title: 'Balance multiple courses',
      description:
        'Manage workload across different subjects and assignment types',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-time-6',
      title: 'Handle unexpected events',
      description:
        'Develop contingency planning for illnesses, emergencies, and setbacks',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-time-7',
      title: 'Review and adjust schedule',
      description:
        'Regularly evaluate schedule effectiveness and make improvements',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-time-8',
      title: 'Plan for breaks and vacations',
      description:
        'Schedule academic breaks and maintain productivity during holidays',
      areaId: 'area-time-management',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Critical Thinking (8 tasks)
    {
      id: 'task-critical-1',
      title: 'Question assumptions',
      description:
        'Learn to identify and challenge underlying assumptions in arguments',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-critical-2',
      title: 'Analyze arguments',
      description:
        'Master identifying premises, conclusions, and logical fallacies',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-critical-3',
      title: 'Evaluate evidence',
      description:
        'Assess quality and relevance of evidence in academic and real-world contexts',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-critical-4',
      title: 'Solve complex problems',
      description:
        'Apply systematic problem-solving frameworks to academic challenges',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-critical-5',
      title: 'Think creatively',
      description:
        'Develop innovative solutions and think beyond conventional approaches',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-critical-6',
      title: 'Make informed decisions',
      description:
        'Use evidence-based decision making for academic and personal choices',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-critical-7',
      title: 'Debate and discuss ideas',
      description:
        'Participate in intellectual discussions and defend positions logically',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-critical-8',
      title: 'Reflect on thinking process',
      description:
        'Develop metacognition and awareness of own thinking patterns',
      areaId: 'area-critical-thinking',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Research Skills (8 tasks)
    {
      id: 'task-research-1',
      title: 'Master library research',
      description:
        'Learn to use academic libraries, databases, and research tools effectively',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-research-2',
      title: 'Evaluate source credibility',
      description:
        'Assess reliability, bias, and quality of information sources',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-research-3',
      title: 'Conduct literature reviews',
      description: 'Synthesize existing research and identify knowledge gaps',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-research-4',
      title: 'Write research papers',
      description:
        'Master academic writing structure, citation, and formatting styles',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-research-5',
      title: 'Design research projects',
      description: 'Learn to plan and execute original research studies',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-research-6',
      title: 'Use statistical analysis',
      description:
        'Apply basic statistical methods for data analysis and interpretation',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-research-7',
      title: 'Present research findings',
      description:
        'Communicate research results effectively through presentations and posters',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-research-8',
      title: 'Publish and share work',
      description:
        'Submit work to conferences, journals, and academic competitions',
      areaId: 'area-research-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Communication Skills (8 tasks)
    {
      id: 'task-comm-1',
      title: 'Master academic writing',
      description: 'Write clear, well-structured essays and research papers',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-comm-2',
      title: 'Develop presentation skills',
      description:
        'Create and deliver effective academic presentations and speeches',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-comm-3',
      title: 'Improve grammar and style',
      description:
        'Master English grammar, punctuation, and academic writing style',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-comm-4',
      title: 'Learn citation styles',
      description:
        'Master APA, MLA, Chicago, and other academic citation formats',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-comm-5',
      title: 'Participate in discussions',
      description:
        'Contribute effectively to classroom discussions and seminars',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-comm-6',
      title: 'Write compelling applications',
      description:
        'Craft effective scholarship, internship, and graduate school applications',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-comm-7',
      title: 'Network professionally',
      description:
        'Communicate effectively with professors, professionals, and peers',
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-comm-8',
      title: 'Give peer feedback',
      description:
        "Provide constructive feedback on others' work and receive feedback gracefully",
      areaId: 'area-communication-skills',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Health & Wellness (8 tasks)
    {
      id: 'task-health-1',
      title: 'Maintain sleep schedule',
      description:
        'Establish consistent sleep routine for optimal academic performance',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    },
    {
      id: 'task-health-2',
      title: 'Exercise regularly',
      description:
        'Develop sustainable exercise routine for physical and mental health',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-health-3',
      title: 'Eat nutritious meals',
      description:
        'Plan balanced diet that supports brain function and energy levels',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-health-4',
      title: 'Manage stress effectively',
      description:
        'Learn stress management techniques and mindfulness practices',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-health-5',
      title: 'Stay hydrated and energized',
      description:
        'Maintain proper hydration and manage energy levels throughout the day',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-health-6',
      title: 'Prevent illness',
      description:
        'Build immune system strength and practice good hygiene habits',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-health-7',
      title: 'Schedule health check-ups',
      description: 'Maintain regular medical and dental appointments',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-health-8',
      title: 'Balance screen time',
      description: 'Manage digital device usage for better sleep and focus',
      areaId: 'area-health-wellness',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Career Preparation (8 tasks)
    {
      id: 'task-career-1',
      title: 'Explore career interests',
      description:
        'Research different career paths and identify personal interests and strengths',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-career-2',
      title: 'Build resume and portfolio',
      description:
        'Create comprehensive resume and portfolio showcasing academic achievements',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-career-3',
      title: 'Gain work experience',
      description:
        'Secure internships, part-time jobs, and volunteer opportunities',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-career-4',
      title: 'Develop professional skills',
      description:
        'Learn software tools, professional etiquette, and workplace skills',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-career-5',
      title: 'Network with professionals',
      description: 'Connect with alumni, professionals, and industry leaders',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-career-6',
      title: 'Prepare for interviews',
      description:
        'Practice interview skills and learn professional communication',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-career-7',
      title: 'Research graduate programs',
      description:
        'Explore and prepare applications for advanced degree programs',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-career-8',
      title: 'Set career goals',
      description:
        'Define short-term and long-term career objectives and milestones',
      areaId: 'area-career-preparation',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },

    // Personal Development (8 tasks)
    {
      id: 'task-personal-1',
      title: 'Develop self-awareness',
      description:
        'Understand personal strengths, weaknesses, and learning style',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-personal-2',
      title: 'Build resilience',
      description:
        'Develop ability to bounce back from setbacks and maintain motivation',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-personal-3',
      title: 'Practice self-reflection',
      description:
        'Regularly reflect on experiences, decisions, and personal growth',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-personal-4',
      title: 'Cultivate positive relationships',
      description:
        'Build meaningful friendships and maintain family connections',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    },
    {
      id: 'task-personal-5',
      title: 'Explore personal interests',
      description: 'Pursue hobbies and interests outside of academics',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-personal-6',
      title: 'Practice gratitude',
      description: 'Maintain gratitude journal and appreciate life experiences',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-personal-7',
      title: 'Serve the community',
      description:
        'Volunteer and contribute to community service and social causes',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
    {
      id: 'task-personal-8',
      title: 'Plan for the future',
      description:
        'Set personal goals and create vision for life beyond academics',
      areaId: 'area-personal-development',
      status: TaskStatus.PENDING,
      priority: TaskPriority.LOW,
    },
  ],
};
