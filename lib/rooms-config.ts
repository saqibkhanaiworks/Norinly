export const ROOM_SCENARIOS: Record<string, string[]> = {
  'daily-life': [
    "Describe your perfect Sunday morning to each other.",
    "What did you eat today? Describe it as if the other person has never heard of your food.",
    "What's one habit you're trying to build this year?",
    "Talk about your hometown — what's one thing tourists always miss?",
    "Describe your dream home."
  ],
  'travel': [
    "You just landed in a new country. Describe arriving at the airport and your first impressions.",
    "Recommend your favourite local restaurant to a tourist. Describe the food, atmosphere, and how to get there.",
    "You're lost in a city. Talk your way to the nearest landmark using only English.",
    "Compare two countries you've visited or want to visit.",
    "What's the worst travel experience you've had or can imagine?"
  ],
  'debate': [
    "Should AI replace human teachers? Argue both sides.",
    "Is social media doing more harm than good globally?",
    "Will remote work become the global default in 10 years?",
    "Should English be the mandatory language of the internet?",
    "Is it ethical to use AI to learn languages?"
  ],
  'job-interview': [
    "Take turns: one is the interviewer, one is the candidate for a marketing manager role.",
    "Practice answering: Tell me about yourself. Give feedback to each other.",
    "Negotiate a salary. One wants £60k, the other offers £50k.",
    "You're presenting a business idea. Other person is a tough investor.",
    "Practice: Why should we hire you over other candidates?"
  ],
  'free-chat': [
    "Ask each other 5 questions you'd ask a stranger at a party.",
    "Describe your current mood using only metaphors.",
    "What's something you learned recently that surprised you?",
    "Talk about a book, show, or movie you both might know.",
    "Debate: coffee vs tea. Which is objectively better and why?"
  ]
};

export const ROOM_SLUGS = Object.keys(ROOM_SCENARIOS);

export const MOCK_ROOMS = [
  { id: '1', slug: 'daily-life', name: 'Daily Life & Routines', topic: 'Talk about your day, hobbies, food, and simple routines.', level: 'Beginner' as const, max_users: 6, active_count: 0, daily_room_name: 'norinly-daily-life' },
  { id: '2', slug: 'travel', name: 'Travel Adventures', topic: 'Share travel stories, dream destinations, and local culture.', level: 'Intermediate' as const, max_users: 6, active_count: 0, daily_room_name: 'norinly-travel' },
  { id: '3', slug: 'debate', name: 'AI & Society Debates', topic: 'Discuss technology, the future, and global issues.', level: 'Advanced' as const, max_users: 6, active_count: 0, daily_room_name: 'norinly-debate' },
  { id: '4', slug: 'job-interview', name: 'Job Interview Practice', topic: 'Practice interviews, CVs, workplace English, and professional conversations.', level: 'Intermediate' as const, max_users: 6, active_count: 0, daily_room_name: 'norinly-job-interview' },
  { id: '5', slug: 'free-chat', name: 'Free Chat', topic: 'Talk about anything. No topic, no pressure, just conversation.', level: 'All Levels' as const, max_users: 6, active_count: 0, daily_room_name: 'norinly-free-chat' }
];
