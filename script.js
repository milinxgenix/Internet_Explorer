/**
 * SEMANTICNAV — EXACT UI RECREATION & INTERACTION ENGINE
 * Frontend Logic, Heuristic Intent Engine, Screen Navigation & Dynamic State
 * Strictly matched to Reference Images A & B
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // SEMANTICNAV THEME SWITCH
  // Persists dark/light preference across page reloads.
  // ============================================================

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applySemanticNavTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', safeTheme);

    try {
      localStorage.setItem('semanticnav_theme', safeTheme);
    } catch (error) {
      console.warn('Theme preference could not be saved.', error);
    }

    if (themeToggleBtn) {
      const isDark = safeTheme === 'dark';

      themeToggleBtn.setAttribute(
        'aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme'
      );

      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.setAttribute('aria-pressed', String(isDark));
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        'content',
        safeTheme === 'dark' ? '#061020' : '#F5F1E8'
      );
    }

    const prefThemeBadge = document.getElementById('prefCurrentThemeBadge');
    if (prefThemeBadge) {
      prefThemeBadge.textContent = safeTheme === 'dark' ? 'Dark Celestial' : 'Warm Ivory';
    }
    const themeRadios = document.querySelectorAll('input[name="profileThemeSelect"]');
    themeRadios.forEach(radio => {
      radio.checked = (radio.value === safeTheme);
    });
  }

  // Dark mode is the default for first-time visitors (supports ?theme=light or #theme=light override)
  let savedSemanticNavTheme = 'dark';
  const themeUrlParams = new URLSearchParams(window.location.search);
  const hashRaw = window.location.hash.replace(/^#\/?/, '');
  const themeHashParams = new URLSearchParams(hashRaw);
  const urlTheme = themeUrlParams.get('theme') || themeHashParams.get('theme') || (hashRaw === 'light' || hashRaw === 'dark' ? hashRaw : null);

  if (urlTheme === 'light' || urlTheme === 'dark') {
    savedSemanticNavTheme = urlTheme;
  } else {
    try {
      const storedTheme = localStorage.getItem('semanticnav_theme');

      if (storedTheme === 'dark' || storedTheme === 'light') {
        savedSemanticNavTheme = storedTheme;
      }
    } catch (error) {
      console.warn('Saved theme preference could not be read.', error);
    }
  }

  applySemanticNavTheme(savedSemanticNavTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applySemanticNavTheme(nextTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 1. State Management & Local Storage Keys
  // --------------------------------------------------------------------------
  const STORAGE_KEYS = {
    USER: 'semanticnav_user_session',
    SAVED: 'semanticnav_saved_bookmarks',
    HISTORY: 'semanticnav_search_history',
    REMEMBER_EMAIL: 'semanticnav_remembered_email'
  };

  let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
  if (!currentUser) {
    currentUser = {
      name: 'Milind Kumar',
      email: 'milind.kumar@example.com',
      avatar: 'MK',
      joinedDate: 'Oct 2024',
      proMember: true,
      preferredCategory: 'Web'
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } catch (e) {}
  }

  let savedBookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED) || '[]');
  if (savedBookmarks.length === 0) {
    savedBookmarks = [
      {
        id: 'lap-1',
        title: 'Best Budget Laptops for Students 2024',
        domain: 'techradar.com',
        url: 'https://www.techradar.com/news/best-student-laptops',
        desc: 'Comprehensive list of affordable and reliable laptops for university students with detailed reviews, pros and cons.',
        category: 'Articles',
        favicon: '💻',
        rating: 4.8,
        date: '2026-03'
      },
      {
        id: 'lap-2',
        title: 'The Best College Laptops',
        domain: 'pcmag.com',
        url: 'https://www.pcmag.com/picks/the-best-laptops-for-college-students',
        desc: 'Expert recommendations for budget-friendly laptops with good battery life, performance, and value for students.',
        category: 'Articles',
        favicon: 'PC',
        rating: 4.7,
        date: '2026-02'
      }
    ];
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedBookmarks));
    } catch (e) {}
  }

  let rawHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
  let searchHistory = rawHistory.map(item => {
    if (typeof item === 'string') {
      return {
        id: 'hist-' + Math.random().toString(36).substr(2, 8),
        query: item,
        category: 'Web',
        timestamp: new Date().toISOString(),
        resultCount: 4
      };
    }
    return {
      id: item.id || ('hist-' + Math.random().toString(36).substr(2, 8)),
      query: item.query || '',
      category: item.category || 'Web',
      timestamp: item.timestamp || new Date().toISOString(),
      resultCount: typeof item.resultCount === 'number' ? item.resultCount : 4
    };
  });

  if (searchHistory.length === 0) {
    searchHistory = [
      {
        id: 'hist-1',
        query: 'compare reliable budget laptops for university',
        category: 'Articles',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        resultCount: 4
      },
      {
        id: 'hist-2',
        query: 'learn python programming with interactive tutorials',
        category: 'Tools',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        resultCount: 4
      },
      {
        id: 'hist-3',
        query: 'research papers on transformers and attention mechanisms',
        category: 'Articles',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        resultCount: 4
      },
      {
        id: 'hist-4',
        query: 'edit pdf files online without watermark',
        category: 'Tools',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        resultCount: 3
      }
    ];
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
    } catch (e) {}
  }

  let rememberedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL) || '';

  let currentScreen = 'home';
  const navigationHistory = ['home'];
  let activeCategory = 'Web';
  let activeQuickFilter = null;
  let activeSort = 'relevance';
  let currentIntentQuery = 'compare reliable budget laptops for university';

  // --------------------------------------------------------------------------
  // 2. Curated Sample Database
  // Contains Reference Screen 04 dataset + Curated datasets for all 4 features
  // --------------------------------------------------------------------------
  const DATABASE = [
    // --- Laptops & Product Comparison (Exact Reference Image B Screen 04) ---
    {
      id: 'lap-1',
      title: 'Best Budget Laptops for Students 2024',
      domain: 'techradar.com',
      url: 'https://www.techradar.com/news/best-student-laptops',
      desc: 'Comprehensive list of affordable and reliable laptops for university students with detailed reviews, pros and cons.',
      category: 'Articles',
      thumbType: 'laptop',
      favicon: '💻',
      rating: 4.8,
      date: '2026-03',
      tags: ['laptop', 'laptops', 'budget', 'student', 'university', 'college', 'battery', 'compare', 'product'],
      baseRelevance: 95
    },
    {
      id: 'lap-2',
      title: 'The Best College Laptops',
      domain: 'pcmag.com',
      url: 'https://www.pcmag.com/picks/the-best-laptops-for-college-students',
      desc: 'Expert recommendations for budget-friendly laptops with good battery life, performance, and value for students.',
      category: 'Articles',
      thumbType: 'pc',
      favicon: 'PC',
      rating: 4.7,
      date: '2026-02',
      tags: ['laptop', 'laptops', 'college', 'student', 'university', 'battery', 'compare', 'product'],
      baseRelevance: 92
    },
    {
      id: 'lap-3',
      title: 'Student Laptops on Amazon',
      domain: 'amazon.in',
      url: 'https://www.amazon.com/s?k=student+laptops',
      desc: 'Wide range of budget laptops for students with user reviews and ratings.',
      category: 'Tools',
      thumbType: 'amazon',
      favicon: 'a',
      rating: 4.6,
      date: '2026-04',
      tags: ['laptop', 'laptops', 'budget', 'student', 'university', 'store', 'amazon', 'cheap'],
      baseRelevance: 88
    },
    {
      id: 'lap-4',
      title: 'Wirecutter: The Best Laptops Under $700',
      domain: 'nytimes.com/wirecutter',
      url: 'https://www.nytimes.com/wirecutter/reviews/best-laptops-under-700/',
      desc: 'Independent real-world stress test comparisons prioritizing screen brightness, typing comfort, and 12+ hour battery endurance.',
      category: 'Articles',
      thumbType: 'laptop',
      favicon: 'W',
      rating: 4.9,
      date: '2026-01',
      tags: ['laptop', 'laptops', 'budget', 'student', 'battery', 'reliable', 'compare'],
      baseRelevance: 86
    },
    {
      id: 'lap-5',
      title: 'Reddit /r/SuggestALaptop University Hub',
      domain: 'reddit.com/r/SuggestALaptop',
      url: 'https://www.reddit.com/r/SuggestALaptop/',
      desc: 'Active student community evaluating notebook reliability, thermal cooling, student discounts, and budget options.',
      category: 'Web',
      thumbType: 'reddit',
      favicon: 'R',
      rating: 4.5,
      date: '2026-04',
      tags: ['laptop', 'laptops', 'student', 'budget', 'reddit', 'community', 'compare'],
      baseRelevance: 84
    },

    // --- Feature 1: Discover Functionality (Interactive Discovery & Data Visualization) ---
    {
      id: 'feat-disc-1',
      title: 'Observable HQ — Interactive Data Visualization & Canvas',
      domain: 'observablehq.com',
      url: 'https://observablehq.com/',
      desc: 'Collaborative data workspace to explore, visualize, and discover insights with responsive graphics, D3.js, and live datasets.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '📊',
      rating: 4.9,
      date: '2026-03',
      tags: ['discover', 'discovery', 'visualization', 'data', 'interactive', 'tools', 'graphs', 'charts'],
      baseRelevance: 97
    },
    {
      id: 'feat-disc-2',
      title: 'Our World in Data — Interactive Explorations & Research',
      domain: 'ourworldindata.org',
      url: 'https://ourworldindata.org/',
      desc: 'Empirical research and interactive visual tools that allow deep exploratory analysis of global issues, trends, and demographics.',
      category: 'Articles',
      thumbType: 'generic',
      favicon: '🌍',
      rating: 4.9,
      date: '2026-02',
      tags: ['discover', 'discovery', 'visualization', 'data', 'interactive', 'research', 'explore'],
      baseRelevance: 94
    },

    // --- Feature 2: Adapts to Dynamic Interfaces (Modern UI & Responsive Systems) ---
    {
      id: 'feat-adapt-1',
      title: 'Awwwards — Dynamic Web Design & Interface Inspiration',
      domain: 'awwwards.com',
      url: 'https://www.awwwards.com/',
      desc: 'Curated showcase of cutting-edge responsive web applications, fluid layouts, and creative dynamic UI animations.',
      category: 'Web',
      thumbType: 'generic',
      favicon: '🏆',
      rating: 4.8,
      date: '2026-04',
      tags: ['dynamic', 'interfaces', 'interface', 'responsive', 'design', 'ui', 'ux', 'inspiration'],
      baseRelevance: 96
    },
    {
      id: 'feat-adapt-2',
      title: 'Mobbin — Mobile & Web Interface Design Patterns',
      domain: 'mobbin.com',
      url: 'https://mobbin.com/',
      desc: 'Comprehensive real-world UI design library showcasing how top digital products adapt layouts across diverse devices.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '📱',
      rating: 4.8,
      date: '2026-03',
      tags: ['dynamic', 'interfaces', 'interface', 'responsive', 'design', 'ui', 'patterns'],
      baseRelevance: 92
    },

    // --- Feature 3: Understands Your Intent (Semantic AI & Meaning-Based Navigation) ---
    {
      id: 'feat-intent-1',
      title: 'OpenAI Research: Semantic Intent Understanding in LLMs',
      domain: 'openai.com/research',
      url: 'https://openai.com/research/',
      desc: 'Technical papers demonstrating how dense vector embeddings map human natural language intent to precise concepts.',
      category: 'Articles',
      thumbType: 'generic',
      favicon: '🧠',
      rating: 4.9,
      date: '2026-04',
      tags: ['intent', 'semantic', 'meaning', 'ai', 'navigation', 'language', 'understanding', 'models'],
      baseRelevance: 98
    },
    {
      id: 'feat-intent-2',
      title: 'Hugging Face — Semantic Search and Embeddings Hub',
      domain: 'huggingface.co',
      url: 'https://huggingface.co/models?pipeline_tag=feature-extraction',
      desc: 'State-of-the-art embedding models and datasets for building semantic intent classification and conceptual similarity retrieval.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '🤗',
      rating: 4.9,
      date: '2026-03',
      tags: ['intent', 'semantic', 'meaning', 'ai', 'embeddings', 'nlp', 'search'],
      baseRelevance: 95
    },

    // --- Feature 4: Quick and Easy Access (Developer Shortcuts & Fast Navigation) ---
    {
      id: 'feat-quick-1',
      title: 'DevDocs — Fast, Offline Unified Developer Documentation',
      domain: 'devdocs.io',
      url: 'https://devdocs.io/',
      desc: 'Fast, clean, organized interface combining 100+ API docs with instant keyboard shortcuts and zero-friction navigation.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '⚡',
      rating: 4.9,
      date: '2026-04',
      tags: ['quick', 'easy', 'access', 'shortcuts', 'developer', 'documentation', 'docs', 'steps', 'fast'],
      baseRelevance: 97
    },
    {
      id: 'feat-quick-2',
      title: 'Raycast Store — Developer Shortcuts and Quick Workflows',
      domain: 'raycast.com',
      url: 'https://raycast.com/',
      desc: 'Blazingly fast desktop launcher that replaces repetitive browsing steps with direct keyboard command shortcuts.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '🚀',
      rating: 4.8,
      date: '2026-03',
      tags: ['quick', 'easy', 'access', 'shortcuts', 'developer', 'steps', 'fast', 'launcher'],
      baseRelevance: 93
    },

    // --- Learning & Skills ---
    {
      id: 'learn-1',
      title: 'FreeCodeCamp — Learn Interactive Programming',
      domain: 'freecodecamp.org',
      url: 'https://www.freecodecamp.org/',
      desc: 'Interactive coding curriculum with built-in sandbox exercises covering Python, web development, algorithms, and data science.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: '⌘',
      rating: 4.9,
      date: '2026-03',
      tags: ['learn', 'skill', 'python', 'code', 'coding', 'free', 'tutorial', 'programming', 'student', 'beginner'],
      baseRelevance: 96
    },
    {
      id: 'learn-2',
      title: 'Coursera — Online University Courses',
      domain: 'coursera.org',
      url: 'https://www.coursera.org/',
      desc: 'Specialized certificate programs and guided hands-on projects delivered by accredited university faculties.',
      category: 'Web',
      thumbType: 'generic',
      favicon: 'C',
      rating: 4.8,
      date: '2026-02',
      tags: ['learn', 'skill', 'course', 'university', 'certificate', 'data', 'ai'],
      baseRelevance: 92
    },
    {
      id: 'learn-3',
      title: 'Khan Academy — Free Mastery Learning',
      domain: 'khanacademy.org',
      url: 'https://www.khanacademy.org/',
      desc: 'Structured, self-paced mastery exercises and video walkthroughs in math, science, economics, and computer science.',
      category: 'Videos',
      thumbType: 'generic',
      favicon: 'K',
      rating: 4.9,
      date: '2026-01',
      tags: ['learn', 'skill', 'free', 'math', 'science', 'beginner', 'student'],
      baseRelevance: 90
    },

    // --- Research & Papers ---
    {
      id: 'res-1',
      title: 'Google Scholar — Academic Literature Index',
      domain: 'scholar.google.com',
      url: 'https://scholar.google.com/',
      desc: 'Index of peer-reviewed articles, theses, preprints, technical reports, and citation networks across all disciplines.',
      category: 'Articles',
      thumbType: 'generic',
      favicon: 'G',
      rating: 4.9,
      date: '2026-04',
      tags: ['research', 'papers', 'paper', 'academic', 'study', 'citation', 'scholar', 'science', 'ai'],
      baseRelevance: 98
    },
    {
      id: 'res-2',
      title: 'arXiv.org e-Print Archive',
      domain: 'arxiv.org',
      url: 'https://arxiv.org/',
      desc: 'Open access preprints in computer science, machine learning, physics, mathematics, and quantitative biology.',
      category: 'Articles',
      thumbType: 'generic',
      favicon: 'a',
      rating: 4.8,
      date: '2026-04',
      tags: ['research', 'papers', 'paper', 'preprint', 'arxiv', 'ai', 'computer science'],
      baseRelevance: 95
    },
    {
      id: 'res-3',
      title: 'Papers With Code',
      domain: 'paperswithcode.com',
      url: 'https://paperswithcode.com/',
      desc: 'Machine learning papers connected directly to reproducible open source code implementations and benchmark leaderboards.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: 'P',
      rating: 4.8,
      date: '2026-03',
      tags: ['research', 'papers', 'code', 'ai', 'benchmark', 'machine learning'],
      baseRelevance: 93
    },

    // --- Travel & Exploration ---
    {
      id: 'trav-1',
      title: 'Google Travel — Itinerary & Destination Explorer',
      domain: 'google.com/travel',
      url: 'https://www.google.com/travel/',
      desc: 'Compare flights, hotel rates, and custom day-by-day itineraries tailored to your dates, interests, and budget.',
      category: 'Web',
      thumbType: 'generic',
      favicon: '✈',
      rating: 4.7,
      date: '2026-02',
      tags: ['travel', 'trip', 'plan', 'budget', 'flight', 'hotel', 'itinerary', 'vacation', 'japan'],
      baseRelevance: 95
    },

    // --- Coding & Problem Solving ---
    {
      id: 'code-1',
      title: 'MDN Web Docs — Developer Reference',
      domain: 'developer.mozilla.org',
      url: 'https://developer.mozilla.org/',
      desc: 'In-depth documentation, live code examples, specifications, and browser compatibility tables for HTML, CSS, and JavaScript.',
      category: 'Web',
      thumbType: 'generic',
      favicon: 'M',
      rating: 4.9,
      date: '2026-04',
      tags: ['coding', 'code', 'web', 'javascript', 'html', 'css', 'developer', 'problem', 'solve'],
      baseRelevance: 97
    },
    {
      id: 'code-2',
      title: 'LeetCode — Algorithm & Data Structure Practice',
      domain: 'leetcode.com',
      url: 'https://leetcode.com/',
      desc: 'Extensive problem set with visual test runner, discussions, and time-complexity optimization guides.',
      category: 'Tools',
      thumbType: 'generic',
      favicon: 'LC',
      rating: 4.8,
      date: '2026-03',
      tags: ['coding', 'code', 'algorithm', 'problem', 'solve', 'practice', 'interview', 'dynamic programming'],
      baseRelevance: 94
    },

    // --- PDF Tools & Document Editing ---
    {
      id: "pdf-1",
      title: "iLovePDF: Free Online PDF Editor, Merger & Converter",
      domain: "ilovepdf.com",
      url: "https://www.ilovepdf.com",
      desc: "Comprehensive suite of web tools to edit, merge, split, compress, and convert PDF documents completely in your browser without software installation.",
      category: "Tools",
      thumbType: "generic",
      favicon: "📄",
      rating: 4.9,
      date: "2026-03",
      tags: ["pdf", "edit", "editor", "merge", "convert", "compress", "document", "free", "online", "tools"],
      baseRelevance: 96
    },
    {
      id: "pdf-2",
      title: "PDF24 Tools: 100% Free All-in-One Online PDF Utilities",
      domain: "tools.pdf24.org",
      url: "https://tools.pdf24.org",
      desc: "Free, privacy-focused online PDF tools with no file size limits. Add text, highlights, redact content, sign documents, and reorder pages easily.",
      category: "Tools",
      thumbType: "generic",
      favicon: "24",
      rating: 4.8,
      date: "2026-02",
      tags: ["pdf", "edit", "editor", "tools", "free", "convert", "online", "utilities", "privacy"],
      baseRelevance: 94
    },
    {
      id: "pdf-3",
      title: "Smallpdf: Compress, Convert & Edit PDF Documents Online",
      domain: "smallpdf.com",
      url: "https://smallpdf.com",
      desc: "Streamlined cloud tool for filling forms, signing contracts, and inserting annotations directly into PDF documents across desktop and mobile.",
      category: "Tools",
      thumbType: "generic",
      favicon: "S",
      rating: 4.7,
      date: "2026-01",
      tags: ["pdf", "edit", "sign", "compress", "convert", "tools", "online"],
      baseRelevance: 91
    },
    {
      id: "pdf-4",
      title: "Sejda PDF: Easy, Pleasant & Productive PDF Editor",
      domain: "sejda.com",
      url: "https://www.sejda.com/pdf-editor",
      desc: "Direct in-browser text editing, signature addition, page rotation, and image insertion with automatic 2-hour cloud privacy wipe.",
      category: "Tools",
      thumbType: "generic",
      favicon: "SJ",
      rating: 4.6,
      date: "2026-04",
      tags: ["pdf", "edit", "editor", "text", "free", "tools", "online", "sign"],
      baseRelevance: 89
    },

    // --- Bengaluru Travel & 3-Day Itineraries ---
    {
      id: "blr-1",
      title: "TripSavvy: Complete 3-Day Bengaluru Heritage, Parks & Tech Itinerary",
      domain: "tripsavvy.com",
      url: "https://www.tripsavvy.com/bengaluru-3-day-itinerary",
      desc: "Curated 72-hour guide covering Bangalore Palace, Lalbagh Botanical Gardens, traditional breakfast spots in Malleshwaram, and modern Indiranagar cafes.",
      category: "Articles",
      thumbType: "travel",
      favicon: "✈️",
      rating: 4.9,
      date: "2026-03",
      tags: ["bengaluru", "bangalore", "trip", "travel", "itinerary", "three-day", "3-day", "places", "visit", "tour", "karnataka", "guide"],
      baseRelevance: 96
    },
    {
      id: "blr-2",
      title: "Karnataka Tourism: Best Places to Visit in Bangalore & City Walks",
      domain: "karnatakatourism.org",
      url: "https://karnatakatourism.org/destination/bengaluru/",
      desc: "Official state tourism guide with opening hours, heritage walk maps, Cubbon Park trails, Vidhana Soudha architecture, and museum entry passes.",
      category: "Web",
      thumbType: "travel",
      favicon: "KT",
      rating: 4.8,
      date: "2026-02",
      tags: ["bengaluru", "bangalore", "karnataka", "tourism", "visit", "places", "travel", "trip", "itinerary", "guide"],
      baseRelevance: 93
    },
    {
      id: "blr-3",
      title: "LBB Bengaluru: Curated Cafes, Microbreweries & Cultural Spots",
      domain: "lbb.in/bangalore",
      url: "https://lbb.in/bangalore",
      desc: "Locals recommendation guide for hidden speakeasies, artisanal bakeries, live music venues, book clubs, and boutique art galleries in Bangalore.",
      category: "Articles",
      thumbType: "travel",
      favicon: "LBB",
      rating: 4.7,
      date: "2026-04",
      tags: ["bengaluru", "bangalore", "cafes", "itinerary", "places", "visit", "trip", "travel", "food", "lifestyle"],
      baseRelevance: 90
    },

    // --- Python Beginner Courses with Practical Projects ---
    {
      id: "py-1",
      title: "freeCodeCamp: Python for Beginners - Full Course with Projects",
      domain: "freecodecamp.org",
      url: "https://www.freecodecamp.org/news/learn-python-free-python-courses-for-beginners/",
      desc: "Interactive curriculum teaching core syntax, control flow, file handling, and 5 practical portfolio projects including web scrapers and games.",
      category: "Articles",
      thumbType: "code",
      favicon: "🐍",
      rating: 4.95,
      date: "2026-03",
      tags: ["python", "courses", "beginner", "beginners", "practical", "projects", "learn", "programming", "free", "coding", "tutorial"],
      baseRelevance: 97
    },
    {
      id: "py-2",
      title: "Automate the Boring Stuff with Python - Practical Programming",
      domain: "automatetheboringstuff.com",
      url: "https://automatetheboringstuff.com",
      desc: "Hands-on guide for complete beginners to write programs that automate spreadsheet tasks, send emails, scrape websites, and parse files.",
      category: "Tools",
      thumbType: "code",
      favicon: "ATB",
      rating: 4.9,
      date: "2026-02",
      tags: ["python", "courses", "beginner", "practical", "projects", "automate", "learn", "programming", "basics"],
      baseRelevance: 95
    },
    {
      id: "py-3",
      title: "CS50P: Harvard University Introduction to Programming with Python",
      domain: "edx.org/cs50p",
      url: "https://cs50.harvard.edu/python/",
      desc: "Rigorous introductory course emphasizing clean code architecture, testing with pytest, object-oriented concepts, and final capstone projects.",
      category: "Videos",
      thumbType: "code",
      favicon: "CS",
      rating: 4.92,
      date: "2026-01",
      tags: ["python", "courses", "university", "beginner", "projects", "harvard", "cs50", "programming"],
      baseRelevance: 94
    },
    {
      id: "py-4",
      title: "Coursera: Python for Everybody Specialization (Univ. of Michigan)",
      domain: "coursera.org",
      url: "https://www.coursera.org/specializations/python",
      desc: "Learn basics of Python data structures, networked application program interfaces, and databases with Charles Severance. Capstone project included.",
      category: "Articles",
      thumbType: "code",
      favicon: "C",
      rating: 4.85,
      date: "2026-04",
      tags: ["python", "courses", "beginner", "projects", "learn", "university", "data", "practical"],
      baseRelevance: 92
    },

    // --- Neural Networks & Transformers Research Papers ---
    {
      id: "nn-1",
      title: "Attention Is All You Need (Seminal Transformer Paper) - arXiv",
      domain: "arxiv.org/abs/1706.03762",
      url: "https://arxiv.org/abs/1706.03762",
      desc: "The groundbreaking paper introducing the Transformer architecture based entirely on self-attention mechanisms, dispensing with recurrence and convolutions.",
      category: "Articles",
      thumbType: "research",
      favicon: "📄",
      rating: 4.98,
      date: "2026-03",
      tags: ["research", "papers", "neural", "networks", "transformers", "transformer", "arxiv", "ai", "attention", "academic"],
      baseRelevance: 98
    },
    {
      id: "nn-2",
      title: "Hugging Face: Deep Dive into Modern Transformers & Attention",
      domain: "huggingface.co/learn",
      url: "https://huggingface.co/learn/nlp-course",
      desc: "Interactive technical breakdown of encoder, decoder, and seq2seq transformer models with PyTorch implementations and model hub weights.",
      category: "Tools",
      thumbType: "research",
      favicon: "🤗",
      rating: 4.9,
      date: "2026-02",
      tags: ["transformers", "neural", "networks", "research", "papers", "ai", "huggingface", "deep learning", "code"],
      baseRelevance: 95
    },
    {
      id: "nn-3",
      title: "Papers with Code: State of the Art Neural Networks & Transformers",
      domain: "paperswithcode.com",
      url: "https://paperswithcode.com/methods/category/transformers",
      desc: "Track the evolution of transformer architectures, attention variants, benchmark leaderboard rankings, and reproducible GitHub code repositories.",
      category: "Web",
      thumbType: "research",
      favicon: "PWC",
      rating: 4.88,
      date: "2026-04",
      tags: ["papers", "research", "neural", "networks", "transformers", "benchmarks", "code", "ai"],
      baseRelevance: 94
    },
    {
      id: "nn-4",
      title: "Distill.pub: Visual and Interactive Explanations of Neural Networks",
      domain: "distill.pub",
      url: "https://distill.pub",
      desc: "Peer-reviewed, highly interactive visual publications demonstrating convolutional filters, attention heads, feature visualization, and weight matrices.",
      category: "Articles",
      thumbType: "research",
      favicon: "D",
      rating: 4.95,
      date: "2026-01",
      tags: ["neural", "networks", "research", "papers", "visualization", "interactive", "transformers", "distill"],
      baseRelevance: 93
    },
  ];

  // --------------------------------------------------------------------------
  // 3. Heuristic Intent Detection Engine
  // --------------------------------------------------------------------------
  function detectIntent(rawQuery) {
    if (!rawQuery || !rawQuery.trim()) {
      return {
        category: 'Product comparison',
        intentSummary: 'compare reliable budget laptops for university',
        keywords: ['laptop', 'budget', 'university', 'compare'],
        confidence: 96
      };
    }

    const clean = rawQuery.toLowerCase().trim();
    const tokens = clean.split(/[\s,.-]+/).filter(w => w.length > 2);

    const taxonomies = [
      {
        category: 'Productivity & document tools',
        keywords: ['pdf', 'edit', 'convert', 'merge', 'compress', 'sign', 'document', 'ocr', 'online', 'tools', 'free'],
        label: 'find free tools to edit PDFs online'
      },
      {
        category: 'Product comparison',
        keywords: ['laptop', 'laptops', 'compare', 'product', 'buy', 'price', 'budget', 'cheap', 'affordable', 'specs', 'battery', 'student', 'college', 'university', 'screen'],
        label: 'compare reliable budget laptops for university'
      },
      {
        category: 'Data discovery & visualization',
        keywords: ['visualization', 'visual', 'discover', 'discovery', 'interactive', 'chart', 'charts', 'graph', 'graphs', 'data', 'canvas'],
        label: 'find interactive tools for exploratory data discovery'
      },
      {
        category: 'Dynamic interface design',
        keywords: ['interface', 'interfaces', 'dynamic', 'responsive', 'design', 'ui', 'ux', 'inspiration', 'patterns', 'layout'],
        label: 'explore dynamic web design and interface patterns'
      },
      {
        category: 'Semantic AI & intent mapping',
        keywords: ['intent', 'semantic', 'meaning', 'ai', 'nlp', 'understanding', 'vector', 'embeddings', 'model', 'models'],
        label: 'analyze how AI models understand semantic user intent'
      },
      {
        category: 'Developer shortcuts & quick access',
        keywords: ['shortcut', 'shortcuts', 'quick', 'easy', 'access', 'steps', 'fewer', 'devdocs', 'launcher', 'workflow'],
        label: 'reach developer documentation and shortcuts in fewer steps'
      },
      {
        category: 'Learning & skills',
        keywords: ['learn', 'skill', 'course', 'courses', 'tutorial', 'beginner', 'beginners', 'study', 'teach', 'class', 'interactive', 'python', 'programming', 'basics', 'practical', 'projects'],
        label: 'discover interactive learning resources and courses'
      },
      {
        category: 'Academic & research',
        keywords: ['paper', 'papers', 'research', 'academic', 'journal', 'study', 'citation', 'arxiv', 'scholar', 'thesis', 'preprints', 'neural', 'networks', 'transformer', 'transformers'],
        label: 'find peer-reviewed academic literature and preprints'
      },
      {
        category: 'Travel & itinerary',
        keywords: ['travel', 'trip', 'flight', 'hotel', 'itinerary', 'destination', 'budget', 'visit', 'vacation', 'tour', 'city', 'bengaluru', 'bangalore', 'three-day', '3-day', 'places'],
        label: 'plan a travel itinerary and destination logistics'
      },
      {
        category: 'Software & development',
        keywords: ['code', 'coding', 'problem', 'solve', 'bug', 'algorithm', 'debug', 'developer', 'javascript', 'html', 'css', 'react', 'api', 'leetcode', 'docs', 'programming'],
        label: 'solve software engineering and coding challenges'
      }
    ];

    let bestMatch = taxonomies[0];
    let highestScore = 0;

    taxonomies.forEach(t => {
      let score = 0;
      t.keywords.forEach(kw => {
        if (clean.includes(kw)) score += 2;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = t;
      }
    });

    const confidence = Math.min(99, Math.max(88, 84 + highestScore * 3));

    return {
      category: bestMatch.category,
      intentSummary: clean.length > 5 ? clean : bestMatch.label,
      keywords: tokens.slice(0, 5),
      confidence
    };
  }

  // --------------------------------------------------------------------------
  // 4. Result Ranking & Filtering Engine
  // --------------------------------------------------------------------------
  const STOPWORDS = new Set(['for', 'and', 'the', 'with', 'from', 'in', 'of', 'to', 'your', 'how', 'what', 'you', 'are', 'is', 'on', 'a', 'an']);

  function rankAndFilterResults(query, category = 'Web', filter = null, sort = 'relevance') {
    const intent = detectIntent(query);
    const isDefaultLaptop = (query || '').trim() === 'compare reliable budget laptops for university';
    const qLower = (query || '').toLowerCase();
    const queryTokens = qLower.split(/[\s,.-]+/).filter(w => w.length > 2 && !STOPWORDS.has(w));

    let list = DATABASE.filter(item => {
      if (!category || category === 'All') return true;
      if (category === 'Web') return true;
      return item.category === category;
    });

    list = list.map(item => {
      let score = 0;
      let matchedTags = 0;

      queryTokens.forEach(token => {
        if (item.tags.some(tag => tag === token || (token.length > 4 && tag.includes(token)))) {
          matchedTags += 2;
          score += 8;
        }
        if (item.title.toLowerCase().includes(token)) score += 6;
        if (item.desc.toLowerCase().includes(token)) score += 3;
      });

      if (filter === 'Budget') {
        if (item.tags.includes('budget') || item.tags.includes('cheap') || item.tags.includes('free')) score += 15;
        else score -= 30;
      } else if (filter === 'Student') {
        if (item.tags.includes('student') || item.tags.includes('university') || item.tags.includes('college')) score += 15;
        else score -= 30;
      } else if (filter === 'Battery') {
        if (item.tags.includes('battery')) score += 20;
        else score -= 30;
      } else if (filter === 'HighRated') {
        if (item.rating >= 4.8) score += 15;
      }

      let finalRelevance = 70;
      if (isDefaultLaptop && !filter && item.tags.includes('laptop')) {
        finalRelevance = item.baseRelevance || 85;
        score = item.baseRelevance; // Match Screen 04 priority order
      } else {
        const isMatch = matchedTags > 0 || score > 0;
        finalRelevance = isMatch ? Math.min(98, Math.max(86, 82 + Math.round(score / 3))) : Math.max(70, (item.baseRelevance || 80) - 20);
      }

      return {
        ...item,
        _rawScore: score,
        relevance: finalRelevance,
        matchCount: matchedTags
      };
    });

    if (sort === 'relevance') {
      list.sort((a, b) => {
        if (b._rawScore !== a._rawScore) return b._rawScore - a._rawScore;
        return b.relevance - a.relevance;
      });
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      list.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return { intent, results: list };
  }

  // --------------------------------------------------------------------------
  // 5. DOM References
  // --------------------------------------------------------------------------
  const views = {
    home: document.getElementById('viewHome'),
    login: document.getElementById('viewLogin'),
    signup: document.getElementById('viewSignup'),
    explore: document.getElementById('viewExplore'),
    results: document.getElementById('viewResults'),
    profile: document.getElementById('viewProfile')
  };

  const navItems = {
    home: document.getElementById('navHome'),
    explore: document.getElementById('navExplore'),
    features: document.getElementById('navFeatures'),
    about: document.getElementById('navAbout')
  };

  const dockButtons = document.querySelectorAll('.dock-btn');
  const dockToggle = document.getElementById('dockToggle');
  const screenDock = document.getElementById('screenDock');
  const browserBackBtn = document.getElementById('browserBackBtn');

  const brandHomeBtn = document.getElementById('brandHomeBtn');
  const headerSearchBtn = document.getElementById('headerSearchBtn');
  const headerProfileBtn = document.getElementById('headerProfileBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const primaryNav = document.getElementById('primaryNav');

  // Hero Search Form
  const heroSearchForm = document.getElementById('heroSearchForm');
  const heroSearchInput = document.getElementById('heroSearchInput');

  // Explore Search Form
  const exploreSearchForm = document.getElementById('exploreSearchForm');
  const exploreSearchInput = document.getElementById('exploreSearchInput');
  const exploreCategoryPills = document.querySelectorAll('#exploreCategoryPills .cat-pill');
  const advFilterToggle = document.getElementById('advFilterToggle');
  const advancedFiltersBox = document.getElementById('advancedFiltersBox');

  // Results View Elements
  const intentSummaryText = document.getElementById('intentSummaryText');
  const editIntentBtn = document.getElementById('editIntentBtn');
  const refineSearchForm = document.getElementById('refineSearchForm');
  const refineQueryInput = document.getElementById('refineQueryInput');
  const quickFilterPills = document.querySelectorAll('#quickFilterPills .qfilter-btn');
  const moreFiltersTrigger = document.getElementById('moreFiltersTrigger');
  const moreDropdownMenu = document.getElementById('moreDropdownMenu');
  const moreItems = document.querySelectorAll('.more-item');
  const resultsSortSelect = document.getElementById('resultsSortSelect');
  const resultsCardStack = document.getElementById('resultsCardStack');
  const resultsNewSearchBtn = document.getElementById('resultsNewSearchBtn');

  // Auth Forms
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginRemember = document.getElementById('loginRemember');
  const loginEyeToggle = document.getElementById('loginEyeToggle');
  const loginEmailError = document.getElementById('loginEmailError');
  const loginPassError = document.getElementById('loginPassError');
  const forgotPassBtn = document.getElementById('forgotPassBtn');
  const googleAuthBtn = document.getElementById('googleAuthBtn');
  const switchToSignupBtn = document.getElementById('switchToSignupBtn');

  const signupForm = document.getElementById('signupForm');
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupTerms = document.getElementById('signupTerms');
  const signupEyeToggle = document.getElementById('signupEyeToggle');
  const signupNameError = document.getElementById('signupNameError');
  const signupEmailError = document.getElementById('signupEmailError');
  const signupPassError = document.getElementById('signupPassError');
  const signupTermsError = document.getElementById('signupTermsError');
  const switchToLoginBtn = document.getElementById('switchToLoginBtn');

  // Drawers & Modals
  const profileDrawer = document.getElementById('profileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerAvatar = document.getElementById('drawerAvatar');
  const drawerUserName = document.getElementById('drawerUserName');
  const drawerUserEmail = document.getElementById('drawerUserEmail');
  const drawerSignToggle = document.getElementById('drawerSignToggle');
  const savedCountBadge = document.getElementById('savedCountBadge');
  const savedItemsList = document.getElementById('savedItemsList');

  const forgotModal = document.getElementById('forgotModal');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotForm = document.getElementById('forgotForm');
  const forgotEmail = document.getElementById('forgotEmail');

  const appToast = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');

  // --------------------------------------------------------------------------
  // 6. Toast Notification Helper
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg, duration = 3000) {
    if (!appToast || !toastMessage) return;
    toastMessage.textContent = msg;
    appToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      appToast.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 7. Screen View Switching & Navigation Routing
  // --------------------------------------------------------------------------
  function switchScreen(targetScreen, options = {}) {
    if (!views[targetScreen]) return;

    // Maintain History Stack cleanly without consecutive duplicates
    if (!options.isBackAction) {
      if (navigationHistory[navigationHistory.length - 1] !== targetScreen) {
        navigationHistory.push(targetScreen);
      }
    }
    currentScreen = targetScreen;

    // 1. Toggle Screen View Panels
    Object.keys(views).forEach(key => {
      if (key === targetScreen) {
        views[key].classList.add('active-view');
      } else {
        views[key].classList.remove('active-view');
      }
    });

    // 2. Update Header Navigation Active Pill State
    Object.values(navItems).forEach(item => item && item.classList.remove('active'));
    if (options.activeNavSection === 'features' && navItems.features) {
      navItems.features.classList.add('active');
    } else if (options.activeNavSection === 'about' && navItems.about) {
      navItems.about.classList.add('active');
    } else if (targetScreen === 'home' && navItems.home) {
      navItems.home.classList.add('active');
    } else if ((targetScreen === 'explore' || targetScreen === 'results') && navItems.explore) {
      navItems.explore.classList.add('active');
    }

    // 3. Update Quick Switcher Dock Buttons
    dockButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === targetScreen);
    });

    // 4. Close mobile menu if open
    if (primaryNav) primaryNav.classList.remove('mobile-open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');

    // 5. Scroll position
    if (!options.preventScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 6. View-specific lifecycle hooks
    if (targetScreen === 'results') {
      renderResultsView(options.query || currentIntentQuery);
    } else if (targetScreen === 'profile') {
      updateProfileUI();
    } else if (targetScreen === 'login') {
      if (rememberedEmail && loginEmail) {
        loginEmail.value = rememberedEmail;
        if (loginRemember) loginRemember.checked = true;
      }
      setTimeout(() => loginEmail && loginEmail.focus(), 150);
    } else if (targetScreen === 'signup') {
      setTimeout(() => signupName && signupName.focus(), 150);
    } else if (targetScreen === 'explore') {
      setTimeout(() => exploreSearchInput && exploreSearchInput.focus(), 150);
    }
  }

  // Browser Back Button Handler
  if (browserBackBtn) {
    browserBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Pop current screen
        const previousScreen = navigationHistory[navigationHistory.length - 1];
        switchScreen(previousScreen, { isBackAction: true });
      } else {
        switchScreen('home', { isBackAction: true });
      }
    });
  }

  // Quick Switcher Dock Listeners
  dockButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchScreen(btn.dataset.screen);
    });
  });

  if (dockToggle && screenDock) {
    dockToggle.addEventListener('click', () => {
      screenDock.classList.toggle('dock-minimized');
      dockToggle.textContent = screenDock.classList.contains('dock-minimized') ? '☰' : '✕';
    });
  }

  // Primary Header Navigation Links
  if (navItems.home) {
    navItems.home.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('home');
    });
  }

  if (navItems.explore) {
    navItems.explore.addEventListener('click', (e) => {
      e.preventDefault();
      // Strictly show Explore screen without triggering or submitting search
      switchScreen('explore');
    });
  }

  const heroExploreCta = document.getElementById('heroExploreCta') || document.querySelector('.primary-explore-cta');
  if (heroExploreCta) {
    heroExploreCta.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('explore');
    });
  }

  if (navItems.features) {
    navItems.features.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById('cardDiscover') || document.querySelector('.feature-cards-row') || document.getElementById('featuresSection');
      if (currentScreen !== 'home') {
        switchScreen('home', { activeNavSection: 'features', preventScroll: true });
        setTimeout(() => {
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else {
        Object.values(navItems).forEach(item => item && item.classList.remove('active'));
        navItems.features.classList.add('active');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  if (navItems.about) {
    navItems.about.addEventListener('click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById('aboutSection');
      if (currentScreen !== 'home') {
        switchScreen('home', { activeNavSection: 'about', preventScroll: true });
        setTimeout(() => {
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        Object.values(navItems).forEach(item => item && item.classList.remove('active'));
        navItems.about.classList.add('active');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  if (brandHomeBtn) {
    brandHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('home');
    });
  }

  // Generic data-switch routing (used across footers and inline links)
  document.querySelectorAll('[data-switch]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.switch;
      if (target) switchScreen(target);
    });
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --------------------------------------------------------------------------
  // 8. Search & Intent Submission Handlers
  // --------------------------------------------------------------------------
  function executeSearch(query, categoryOverride) {
    if (!query || !query.trim()) {
      showToast('Please describe what you are looking for.');
      return;
    }
    currentIntentQuery = query.trim();
    const cat = categoryOverride || activeCategory || 'Web';

    const prefToggle = document.getElementById('prefRecordHistoryToggle');
    const shouldRecord = !prefToggle || prefToggle.checked;

    if (shouldRecord) {
      const filterRes = rankAndFilterResults(currentIntentQuery, cat);
      const count = filterRes && filterRes.results ? filterRes.results.length : 3;

      // Remove existing entry with exact same query so it moves to top
      searchHistory = searchHistory.filter(h => {
        const q = typeof h === 'string' ? h : (h && h.query ? h.query : '');
        return q.toLowerCase() !== currentIntentQuery.toLowerCase();
      });

      searchHistory.unshift({
        id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        query: currentIntentQuery,
        category: cat,
        timestamp: new Date().toISOString(),
        resultCount: count
      });

      if (searchHistory.length > 50) searchHistory.pop();
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
      } catch (e) {}
    }

    switchScreen('results', { query: currentIntentQuery });
  }

  // Hero Search Form: Execute only after valid submission
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = heroSearchInput ? heroSearchInput.value.trim() : '';
      if (!val) {
        showToast('Please enter an intent or search prompt.');
        if (heroSearchInput) heroSearchInput.focus();
        return;
      }
      executeSearch(val);
    });
  }

  // Explore Search Form: Execute only after valid submission
  if (exploreSearchForm) {
    exploreSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = exploreSearchInput ? exploreSearchInput.value.trim() : '';
      if (!val) {
        showToast('Please describe what you need in your own words.');
        if (exploreSearchInput) exploreSearchInput.focus();
        return;
      }
      executeSearch(val);
    });
  }

  // Results Refine Form
  if (refineSearchForm) {
    refineSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const refineVal = refineQueryInput ? refineQueryInput.value.trim() : '';
      if (refineVal) {
        currentIntentQuery = `${currentIntentQuery} ${refineVal}`;
        if (refineQueryInput) refineQueryInput.value = '';
        renderResultsView(currentIntentQuery);
        showToast('Updated intent with refined criteria.');
      } else {
        renderResultsView(currentIntentQuery);
      }
    });
  }

  // Suggested Search Chips (Hero & Explore chips)
  document.querySelectorAll('.hero-intent-chip[data-query], .intent-chip-pill[data-query]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const query = btn.dataset.query;
      if (query) executeSearch(query);
    });
  });

  // Feature Card Arrow Buttons: Trigger distinct deliberate demo queries
  document.querySelectorAll('.card-circle-arrow-btn[data-feature-query]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const query = btn.dataset.featureQuery;
      const featureName = btn.dataset.featureName || 'Feature Demo';
      showToast(`Demonstrating: ${featureName}`);
      executeSearch(query);
    });
  });

  // Header Search Icon Button
  if (headerSearchBtn) {
    headerSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentScreen === 'home') {
        if (heroSearchInput) heroSearchInput.focus();
      } else if (currentScreen === 'explore') {
        if (exploreSearchInput) exploreSearchInput.focus();
      } else if (currentScreen === 'results') {
        if (refineQueryInput) refineQueryInput.focus();
      } else {
        switchScreen('explore');
      }
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      switchScreen('explore');
    } else if (e.key === 'Escape') {
      closeAllDrawers();
    }
  });

  // --------------------------------------------------------------------------
  // 9. Results Screen Rendering & Dynamic Thumbnails (Matching Screen 04)
  // --------------------------------------------------------------------------
  function createThumbnailHTML(item) {
    if (item.thumbType === 'laptop') {
      return `
        <div class="result-card-thumb-wrap">
          <svg class="thumb-laptop-svg" viewBox="0 0 52 40" fill="none">
            <rect x="8" y="4" width="36" height="24" rx="2.5" fill="#18233D" stroke="#06183D" stroke-width="1.5"/>
            <rect x="10" y="6" width="32" height="20" rx="1.5" fill="url(#laptopScreenGrad)"/>
            <path d="M2 30 L50 30 L45 35 L7 35 Z" fill="#CBD5E1" stroke="#06183D" stroke-width="1.5"/>
            <line x1="22" y1="31" x2="30" y2="31" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
            <defs>
              <linearGradient id="laptopScreenGrad" x1="10" y1="6" x2="42" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#246CF5"/>
                <stop offset="60%" stop-color="#66D8FF"/>
                <stop offset="100%" stop-color="#E8EFFF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      `;
    } else if (item.thumbType === 'pc') {
      return `
        <div class="result-card-thumb-wrap">
          <div class="thumb-pc-logo">PC</div>
        </div>
      `;
    } else if (item.thumbType === 'amazon') {
      return `
        <div class="result-card-thumb-wrap">
          <div class="thumb-amazon-logo">a</div>
        </div>
      `;
    } else {
      return `
        <div class="result-card-thumb-wrap">
          <span style="font-size:22px; font-weight:800; color:var(--blue-royal);">${escapeHtml(item.favicon)}</span>
        </div>
      `;
    }
  }

  function renderResultsView(query) {
    const { intent, results } = rankAndFilterResults(
      query,
      activeCategory,
      activeQuickFilter,
      activeSort
    );

    if (intentSummaryText) {
      intentSummaryText.textContent = query || intent.intentSummary;
    }

    if (!resultsCardStack) return;
    resultsCardStack.innerHTML = '';

    if (results.length === 0) {
      resultsCardStack.innerHTML = `
        <div class="empty-saved-msg" style="background:#fff; border-radius:18px; padding:40px; border:1.5px solid var(--navy-deep)">
          <div style="font-size:28px; margin-bottom:10px;">🔍</div>
          <h3 style="font-family:var(--font-serif); margin-bottom:8px;">No matching results found</h3>
          <p style="color:var(--text-secondary); font-size:14px; max-width:440px; margin:0 auto 16px;">
            We couldn't find sample websites matching this specific filter. Try clearing filters or refining your prompt.
          </p>
          <button type="button" class="qfilter-btn" id="resetFiltersEmptyBtn" style="background:var(--blue-royal); color:#fff;">
            Reset Filters
          </button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersEmptyBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeQuickFilter = null;
          quickFilterPills.forEach(p => p.classList.remove('active'));
          renderResultsView(currentIntentQuery);
        });
      }
      return;
    }

    results.forEach(item => {
      const isSaved = savedBookmarks.some(b => b.id === item.id);

      const card = document.createElement('article');
      card.className = 'result-card-item result-card';
      card.dataset.resultId = item.id;
      card.innerHTML = `
        ${createThumbnailHTML(item)}
        <div class="result-card-content">
          <div class="result-card-top-row">
            <h3 class="result-card-title">${escapeHtml(item.title)}</h3>
            <span class="result-relevance-badge">${item.relevance}% relevant</span>
          </div>
          <div class="result-card-domain">${escapeHtml(item.domain)}</div>
          <p class="result-card-snippet">${escapeHtml(item.desc)}</p>
        </div>
        <div class="result-card-actions">
          <button type="button" class="bookmark-icon-btn ${isSaved ? 'is-saved' : ''}" 
            data-id="${item.id}" 
            aria-label="${isSaved ? 'Remove bookmark' : 'Bookmark this website'}" 
            title="${isSaved ? 'Remove from saved' : 'Save discovery'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="open-website-outline-btn">
            <span>Open website</span>
            <span>→</span>
          </a>
        </div>
      `;

      // In-place bookmark toggle: does NOT navigate or tear down the results DOM
      const bBtn = card.querySelector('.bookmark-icon-btn');
      bBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentlySaved = toggleBookmark(item);
        bBtn.classList.toggle('is-saved', currentlySaved);
        const svg = bBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', currentlySaved ? 'currentColor' : 'none');
        bBtn.setAttribute('aria-label', currentlySaved ? 'Remove bookmark' : 'Bookmark this website');
        bBtn.setAttribute('title', currentlySaved ? 'Remove from saved' : 'Save discovery');
      });

      resultsCardStack.appendChild(card);
    });
  }

  // Edit Intent Handler: Switch to Explore with current query prefilled
  if (editIntentBtn) {
    editIntentBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('explore');
      if (exploreSearchInput) {
        exploreSearchInput.value = currentIntentQuery || '';
        exploreSearchInput.focus();
        exploreSearchInput.select();
      }
      showToast('Edit your intent and press Enter or the arrow button.');
    });
  }

  // Quick Filters (Budget, Student use, Battery life)
  quickFilterPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const f = pill.dataset.filter;
      if (activeQuickFilter === f) {
        activeQuickFilter = null;
        pill.classList.remove('active');
      } else {
        quickFilterPills.forEach(p => p.classList.remove('active'));
        activeQuickFilter = f;
        pill.classList.add('active');
      }
      renderResultsView(currentIntentQuery);
    });
  });

  // More Filters Dropdown
  if (moreFiltersTrigger && moreDropdownMenu) {
    moreFiltersTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      moreDropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      moreDropdownMenu.classList.add('hidden');
    });

    moreItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const f = item.dataset.filter;
        if (f === 'Reset') {
          activeQuickFilter = null;
          quickFilterPills.forEach(p => p.classList.remove('active'));
          showToast('Cleared all refinement filters.');
        } else {
          activeQuickFilter = f;
          showToast(`Applied ${item.textContent.trim()} filter.`);
        }
        moreDropdownMenu.classList.add('hidden');
        renderResultsView(currentIntentQuery);
      });
    });
  }

  // Results Sort Select
  if (resultsSortSelect) {
    resultsSortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderResultsView(currentIntentQuery);
    });
  }

  // Results "Explore Different Intent" button
  if (resultsNewSearchBtn) {
    resultsNewSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('explore');
    });
  }

  // Explore Category Tabs (Web, Articles, Videos, Tools)
  exploreCategoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      exploreCategoryPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCategory = pill.dataset.cat || 'Web';
      showToast(`Filter set to ${activeCategory}.`);
    });
  });

  // Advanced Filters Drawer Toggle
  if (advFilterToggle && advancedFiltersBox) {
    advFilterToggle.addEventListener('click', (e) => {
      e.preventDefault();
      advancedFiltersBox.classList.toggle('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 10. Bookmarks & Saved Discoveries
  // --------------------------------------------------------------------------
  function toggleBookmark(item) {
    const existingIndex = savedBookmarks.findIndex(b => b.id === item.id);
    let isNowSaved = false;
    if (existingIndex > -1) {
      savedBookmarks.splice(existingIndex, 1);
      showToast(`Removed "${item.title}" from saved.`);
      isNowSaved = false;
    } else {
      savedBookmarks.push({
        id: item.id,
        title: item.title,
        domain: item.domain,
        url: item.url,
        savedAt: new Date().toLocaleDateString()
      });
      showToast(`Saved "${item.title}" to your discoveries.`);
      isNowSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedBookmarks));
    updateSavedDrawerUI();
    return isNowSaved;
  }

  function updateSavedDrawerUI() {
    if (savedCountBadge) {
      savedCountBadge.textContent = `${savedBookmarks.length} saved`;
    }
    if (!savedItemsList) return;

    if (savedBookmarks.length === 0) {
      savedItemsList.innerHTML = `
        <div class="empty-saved-msg">
          No saved discoveries yet. Click the bookmark icon on any result card to save it here.
        </div>
      `;
      return;
    }

    savedItemsList.innerHTML = '';
    savedBookmarks.forEach(b => {
      const row = document.createElement('div');
      row.className = 'saved-item-box';
      row.innerHTML = `
        <div>
          <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="saved-item-title">${escapeHtml(b.title)}</a>
          <div class="saved-item-domain">${escapeHtml(b.domain)}</div>
        </div>
        <button type="button" class="saved-remove-btn" data-remove="${b.id}" aria-label="Remove bookmark" title="Remove">✕</button>
      `;
      row.querySelector('[data-remove]').addEventListener('click', () => {
        savedBookmarks = savedBookmarks.filter(x => x.id !== b.id);
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedBookmarks));
        updateSavedDrawerUI();

        // Also update matching card in current results stack if visible
        const cardBtn = document.querySelector(`.bookmark-icon-btn[data-id="${b.id}"]`);
        if (cardBtn) {
          cardBtn.classList.remove('is-saved');
          const svg = cardBtn.querySelector('svg');
          if (svg) svg.setAttribute('fill', 'none');
          cardBtn.setAttribute('aria-label', 'Bookmark this website');
          cardBtn.setAttribute('title', 'Save discovery');
        }
        showToast('Removed saved bookmark.');
      });
      savedItemsList.appendChild(row);
    });
  }

  // --------------------------------------------------------------------------
  // 11. Authentication & Form Validation (Login & Sign Up)
  // --------------------------------------------------------------------------
  function wirePasswordToggle(toggleBtn, inputEl) {
    if (!toggleBtn || !inputEl) return;
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = inputEl.type === 'password';
      inputEl.type = isPassword ? 'text' : 'password';
      const eyeOpen = toggleBtn.querySelector('.eye-open');
      const eyeClosed = toggleBtn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);
      }
    });
  }
  wirePasswordToggle(loginEyeToggle, loginPassword);
  wirePasswordToggle(signupEyeToggle, signupPassword);

  if (switchToSignupBtn) {
    switchToSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('signup');
    });
  }
  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('login');
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const email = loginEmail.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        loginEmailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        loginEmailError.textContent = '';
      }

      const pass = loginPassword.value;
      if (!pass || pass.length < 6) {
        loginPassError.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      } else {
        loginPassError.textContent = '';
      }

      if (!isValid) return;

      if (loginRemember && loginRemember.checked) {
        localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
      }

      currentUser = {
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'Explorer',
        email: email,
        signedInAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      updateUserUI();
      showToast(`Welcome back, ${currentUser.name}!`);
      switchScreen('home');
    });
  }

  // Sign Up Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = signupName.value.trim();
      if (!name || name.length < 2) {
        signupNameError.textContent = 'Please enter your full name.';
        isValid = false;
      } else {
        signupNameError.textContent = '';
      }

      const email = signupEmail.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        signupEmailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        signupEmailError.textContent = '';
      }

      const pass = signupPassword.value;
      if (!pass || pass.length < 6) {
        signupPassError.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      } else {
        signupPassError.textContent = '';
      }

      if (!signupTerms.checked) {
        signupTermsError.textContent = 'You must accept the terms to create an account.';
        isValid = false;
      } else {
        signupTermsError.textContent = '';
      }

      if (!isValid) return;

      currentUser = {
        name: name,
        email: email,
        signedInAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      updateUserUI();
      showToast(`Account created! Welcome to SemanticNav, ${currentUser.name}.`);
      switchScreen('home');
    });
  }

  if (googleAuthBtn) {
    googleAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Google Sign-In is ready for production OAuth integration.');
    });
  }

  if (forgotPassBtn) {
    forgotPassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotModal) forgotModal.classList.remove('hidden');
    });
  }
  if (closeForgotModal) {
    closeForgotModal.addEventListener('click', (e) => {
      e.preventDefault();
      if (forgotModal) forgotModal.classList.add('hidden');
    });
  }
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (forgotEmail && forgotEmail.value) {
        showToast(`Recovery link sent to ${forgotEmail.value}`);
        if (forgotModal) forgotModal.classList.add('hidden');
        forgotEmail.value = '';
      }
    });
  }

  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');
  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('SemanticNav prototype terms: For demonstration use.');
    });
  }
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Privacy Policy: All prototype session data stays local in your browser.');
    });
  }

  // --------------------------------------------------------------------------
  // 12. Profile Drawer & User Session UI
  // --------------------------------------------------------------------------
  function updateUserUI() {
    if (currentUser) {
      const initial = (currentUser.name[0] || 'M').toUpperCase();
      if (drawerAvatar) drawerAvatar.textContent = initial;
      if (drawerUserName) drawerUserName.textContent = currentUser.name;
      if (drawerUserEmail) drawerUserEmail.textContent = currentUser.email;
      if (drawerSignToggle) drawerSignToggle.textContent = 'Sign Out';
    } else {
      if (drawerAvatar) drawerAvatar.textContent = 'M';
      if (drawerUserName) drawerUserName.textContent = 'Guest Explorer';
      if (drawerUserEmail) drawerUserEmail.textContent = 'Not signed in';
      if (drawerSignToggle) drawerSignToggle.textContent = 'Sign In';
    }
    updateSavedDrawerUI();
  }

  if (headerProfileBtn) {
    headerProfileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDrawers();
      switchScreen('profile');
    });
  }

  if (closeDrawerBtn && profileDrawer) {
    closeDrawerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      profileDrawer.classList.add('hidden');
    });
  }

  if (profileDrawer) {
    profileDrawer.addEventListener('click', (e) => {
      if (e.target === profileDrawer) profileDrawer.classList.add('hidden');
    });
  }

  if (drawerSignToggle) {
    drawerSignToggle.addEventListener('click', (e) => {
      e.preventDefault();
      profileDrawer.classList.add('hidden');
      if (currentUser) {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        updateUserUI();
        showToast('Signed out of SemanticNav.');
      } else {
        switchScreen('login');
      }
    });
  }

  function closeAllDrawers() {
    if (profileDrawer) profileDrawer.classList.add('hidden');
    if (forgotModal) forgotModal.classList.add('hidden');
    if (primaryNav) primaryNav.classList.remove('mobile-open');
    if (moreDropdownMenu) moreDropdownMenu.classList.add('hidden');
  }

  // --------------------------------------------------------------------------
  // 13. User Profile, Search History, Saved Discoveries & Preferences Logic
  // --------------------------------------------------------------------------

  // DOM References for Profile View
  const profileBackBtn = document.getElementById('profileBackBtn');
  const bcHomeBtn = document.getElementById('bcHomeBtn');
  const profileAvatarLarge = document.getElementById('profileAvatarLarge');
  const profileDisplayName = document.getElementById('profileDisplayName');
  const profileDisplayEmail = document.getElementById('profileDisplayEmail');
  const profileStatusLabel = document.getElementById('profileStatusLabel');
  const profileMemberSinceText = document.getElementById('profileMemberSinceText');
  const btnEditProfileTrigger = document.getElementById('btnEditProfileTrigger');
  const btnOpenSavedDrawerFromProfile = document.getElementById('btnOpenSavedDrawerFromProfile');

  // Stats
  const statTotalSearches = document.getElementById('statTotalSearches');
  const statTotalSaved = document.getElementById('statTotalSaved');
  const statRecentActivity = document.getElementById('statRecentActivity');
  const statFavoriteCategory = document.getElementById('statFavoriteCategory');

  // Tabs & Panels
  const profileTabs = document.querySelectorAll('.profile-tab[data-tab]');
  const profilePanels = document.querySelectorAll('.profile-tab-panel');
  const historyTabCount = document.getElementById('historyTabCount');
  const savedTabCount = document.getElementById('savedTabCount');

  // Overview Tab
  const overviewRecentSearches = document.getElementById('overviewRecentSearches');
  const overviewSavedPreview = document.getElementById('overviewSavedPreview');
  const overviewViewAllHistoryBtn = document.getElementById('overviewViewAllHistoryBtn');
  const overviewViewAllSavedBtn = document.getElementById('overviewViewAllSavedBtn');

  // History Tab
  const historyFilterInput = document.getElementById('historyFilterInput');
  const historyCatPills = document.querySelectorAll('#historyCategoryFilterPills .hist-cat-pill');
  const btnClearHistoryBtn = document.getElementById('btnClearHistoryBtn');
  const historyEntriesList = document.getElementById('historyEntriesList');
  let activeHistoryCategory = 'all';

  // Saved Discoveries Tab
  const savedFilterInput = document.getElementById('savedFilterInput');
  const savedListCountIndicator = document.getElementById('savedListCountIndicator');
  const profileSavedCardsGrid = document.getElementById('profileSavedCardsGrid');

  // Account Settings Tab
  const settingsProfileForm = document.getElementById('settingsProfileForm');
  const settingsNameInput = document.getElementById('settingsNameInput');
  const settingsEmailInput = document.getElementById('settingsEmailInput');
  const settingsAvatarInput = document.getElementById('settingsAvatarInput');
  const settingsNameError = document.getElementById('settingsNameError');
  const settingsSaveStatus = document.getElementById('settingsSaveStatus');
  const btnExportData = document.getElementById('btnExportData');
  const btnSettingsClearHistory = document.getElementById('btnSettingsClearHistory');
  const btnSettingsSignOut = document.getElementById('btnSettingsSignOut');

  // Preferences Tab
  const prefThemeRadios = document.querySelectorAll('input[name="profileThemeSelect"]');
  const prefCurrentThemeBadge = document.getElementById('prefCurrentThemeBadge');
  const prefDefaultCategorySelect = document.getElementById('prefDefaultCategorySelect');
  const btnSavePrefCategory = document.getElementById('btnSavePrefCategory');
  const prefRecordHistoryToggle = document.getElementById('prefRecordHistoryToggle');

  // Confirmation Modal
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const btnCancelConfirm = document.getElementById('btnCancelConfirm');
  const btnAcceptConfirm = document.getElementById('btnAcceptConfirm');
  let confirmCallback = null;

  function openConfirmModal(title, message, onConfirm, confirmBtnText = 'Confirm') {
    if (!confirmModal) return;
    if (confirmModalTitle) confirmModalTitle.textContent = title;
    if (confirmModalMessage) confirmModalMessage.textContent = message;
    if (btnAcceptConfirm) btnAcceptConfirm.textContent = confirmBtnText;
    confirmCallback = onConfirm;
    confirmModal.classList.remove('hidden');
    confirmModal.setAttribute('aria-hidden', 'false');
  }

  function closeConfirmModal() {
    if (!confirmModal) return;
    confirmModal.classList.add('hidden');
    confirmModal.setAttribute('aria-hidden', 'true');
    confirmCallback = null;
  }

  if (btnCancelConfirm) {
    btnCancelConfirm.addEventListener('click', closeConfirmModal);
  }
  if (btnAcceptConfirm) {
    btnAcceptConfirm.addEventListener('click', () => {
      if (typeof confirmCallback === 'function') {
        confirmCallback();
      }
      closeConfirmModal();
    });
  }
  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) closeConfirmModal();
    });
  }

  // Edit Profile Modal
  const editProfileModal = document.getElementById('editProfileModal');
  const closeEditProfileModal = document.getElementById('closeEditProfileModal');
  const editProfileModalForm = document.getElementById('editProfileModalForm');
  const modalEditName = document.getElementById('modalEditName');
  const modalEditAvatar = document.getElementById('modalEditAvatar');
  const modalEditCategory = document.getElementById('modalEditCategory');
  const modalEditNameError = document.getElementById('modalEditNameError');
  const btnCancelEditModal = document.getElementById('btnCancelEditModal');

  function openEditProfileModal() {
    if (!editProfileModal) return;
    if (modalEditName) modalEditName.value = currentUser ? currentUser.name : '';
    if (modalEditAvatar) modalEditAvatar.value = currentUser ? (currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()) : 'MK';
    if (modalEditCategory) modalEditCategory.value = (currentUser && currentUser.preferredCategory) || activeCategory || 'Web';
    if (modalEditNameError) modalEditNameError.textContent = '';
    editProfileModal.classList.remove('hidden');
    editProfileModal.setAttribute('aria-hidden', 'false');
    if (modalEditName) setTimeout(() => modalEditName.focus(), 120);
  }

  function closeEditProfileModalFunc() {
    if (!editProfileModal) return;
    editProfileModal.classList.add('hidden');
    editProfileModal.setAttribute('aria-hidden', 'true');
  }

  if (btnEditProfileTrigger) {
    btnEditProfileTrigger.addEventListener('click', openEditProfileModal);
  }
  if (closeEditProfileModal) {
    closeEditProfileModal.addEventListener('click', closeEditProfileModalFunc);
  }
  if (btnCancelEditModal) {
    btnCancelEditModal.addEventListener('click', closeEditProfileModalFunc);
  }
  if (editProfileModal) {
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) closeEditProfileModalFunc();
    });
  }

  if (editProfileModalForm) {
    editProfileModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = modalEditName ? modalEditName.value.trim() : '';
      if (!newName || newName.length < 2) {
        if (modalEditNameError) modalEditNameError.textContent = 'Please enter a valid full name.';
        return;
      }
      let initials = modalEditAvatar ? modalEditAvatar.value.trim().toUpperCase() : '';
      if (!initials) {
        initials = newName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'MK';
      }
      const preferredCat = modalEditCategory ? modalEditCategory.value : 'Web';

      if (!currentUser) {
        currentUser = {
          name: newName,
          email: 'explorer@semanticnav.local',
          joinedDate: 'Oct 2024',
          proMember: true
        };
      }
      currentUser.name = newName;
      currentUser.avatar = initials;
      currentUser.preferredCategory = preferredCat;

      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } catch (err) {}

      updateUserUI();
      updateProfileUI();
      closeEditProfileModalFunc();
      showToast('Profile updated successfully!');
    });
  }

  // Time Formatter for relative timestamps
  function formatTimeAgo(isoString) {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffSec = Math.floor((now - d) / 1000);
      if (isNaN(diffSec) || diffSec < 0) return 'Just now';
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recent';
    }
  }

  // Tab Switching
  function switchProfileTab(tabName) {
    profileTabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabName;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    profilePanels.forEach(panel => {
      const isTarget = panel.id === `panel${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
      panel.classList.toggle('active-panel', isTarget);
    });

    if (tabName === 'history') {
      renderProfileHistory();
    } else if (tabName === 'saved') {
      renderProfileSaved();
    } else if (tabName === 'overview') {
      renderProfileOverview();
    }
  }

  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchProfileTab(tab.dataset.tab);
    });
  });

  if (overviewViewAllHistoryBtn) {
    overviewViewAllHistoryBtn.addEventListener('click', () => switchProfileTab('history'));
  }
  if (overviewViewAllSavedBtn) {
    overviewViewAllSavedBtn.addEventListener('click', () => switchProfileTab('saved'));
  }

  // Back Navigation
  if (profileBackBtn) {
    profileBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigationHistory.length > 1) {
        navigationHistory.pop(); // Remove profile
        const prev = navigationHistory[navigationHistory.length - 1];
        switchScreen(prev, { isBackAction: true });
      } else {
        switchScreen('home', { isBackAction: true });
      }
    });
  }

  if (bcHomeBtn) {
    bcHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      switchScreen('home');
    });
  }

  if (btnOpenSavedDrawerFromProfile && profileDrawer) {
    btnOpenSavedDrawerFromProfile.addEventListener('click', (e) => {
      e.preventDefault();
      updateSavedDrawerUI();
      profileDrawer.classList.remove('hidden');
    });
  }

  // Dynamic Time-Based Greeting Function
  function updateTimeBasedGreeting() {
    const greetHeading = document.getElementById('profileGreetHeading');
    const greetQuote = document.getElementById('profileGreetQuote');
    const greetDate = document.getElementById('profileGreetDate');
    const greetIconWrap = document.getElementById('profileGreetIconWrap');

    if (!greetHeading) return;

    const name = (currentUser && currentUser.name) ? currentUser.name : 'Milind';
    const firstName = name.trim().split(' ')[0] || 'Milind';

    const now = new Date();
    const hour = now.getHours();

    let greetingText = '';
    let quoteText = '';
    let iconSvg = '';

    if (hour >= 0 && hour < 5) {
      // Midnight
      greetingText = `Happy Midnight, <span class="profile-name-highlight">${firstName}</span>`;
      quoteText = "Still awake? That makes two of us!";
      iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    } else if (hour >= 5 && hour < 12) {
      // Morning
      greetingText = `Good Morning, <span class="profile-name-highlight">${firstName}</span>`;
      quoteText = "Ready to explore the semantic web? Let's discover something new.";
      iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    } else if (hour >= 12 && hour < 17) {
      // Afternoon
      greetingText = `Good Afternoon, <span class="profile-name-highlight">${firstName}</span>`;
      quoteText = "Afternoon momentum. Continue your research and discovery journeys.";
      iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
      </svg>`;
    } else if (hour >= 17 && hour < 22) {
      // Evening
      greetingText = `Good Evening, <span class="profile-name-highlight">${firstName}</span>`;
      quoteText = "Wrapping up your day? Review your saved discoveries and insights.";
      iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 18a5 5 0 0 0-10 0"></path>
        <line x1="12" y1="9" x2="12" y2="2"></line>
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
        <line x1="1" y1="18" x2="3" y2="18"></line>
        <line x1="21" y1="18" x2="23" y2="18"></line>
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
        <line x1="23" y1="22" x2="1" y2="22"></line>
        <polyline points="16 5 12 9 8 5"></polyline>
      </svg>`;
    } else {
      // Night (22 - 24)
      greetingText = `Good Night, <span class="profile-name-highlight">${firstName}</span>`;
      quoteText = "Still awake? That makes two of us!";
      iconSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#818CF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    }

    greetHeading.innerHTML = greetingText;
    if (greetQuote) greetQuote.textContent = quoteText;
    if (greetDate) {
      greetDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (greetIconWrap) greetIconWrap.innerHTML = iconSvg;
  }

  // Activity Trend Segmented Toggle
  const btnTrendWeekly = document.getElementById('btnTrendWeekly');
  const btnTrendMonthly = document.getElementById('btnTrendMonthly');
  const trendLinePath = document.getElementById('trendLinePath');
  const trendAreaPath = document.getElementById('trendAreaPath');
  const trendNode1 = document.getElementById('trendNode1');
  const trendNode2 = document.getElementById('trendNode2');

  if (btnTrendWeekly && btnTrendMonthly) {
    btnTrendWeekly.addEventListener('click', () => {
      btnTrendWeekly.classList.add('active');
      btnTrendMonthly.classList.remove('active');
      if (trendLinePath) trendLinePath.setAttribute('d', 'M 20 20 L 580 110');
      if (trendAreaPath) trendAreaPath.setAttribute('d', 'M 20 20 L 580 110 L 580 160 L 20 160 Z');
      if (trendNode1) { trendNode1.setAttribute('cx', '20'); trendNode1.setAttribute('cy', '20'); }
      if (trendNode2) { trendNode2.setAttribute('cx', '580'); trendNode2.setAttribute('cy', '110'); }
    });

    btnTrendMonthly.addEventListener('click', () => {
      btnTrendMonthly.classList.add('active');
      btnTrendWeekly.classList.remove('active');
      if (trendLinePath) trendLinePath.setAttribute('d', 'M 20 90 L 180 30 L 380 60 L 580 15');
      if (trendAreaPath) trendAreaPath.setAttribute('d', 'M 20 90 L 180 30 L 380 60 L 580 15 L 580 160 L 20 160 Z');
      if (trendNode1) { trendNode1.setAttribute('cx', '20'); trendNode1.setAttribute('cy', '90'); }
      if (trendNode2) { trendNode2.setAttribute('cx', '580'); trendNode2.setAttribute('cy', '15'); }
    });
  }

  // Quick Links Navigation
  const qlSavedBtn = document.getElementById('qlSavedBtn');
  const qlHistoryBtn = document.getElementById('qlHistoryBtn');
  const qlExploreBtn = document.getElementById('qlExploreBtn');
  const qlSettingsBtn = document.getElementById('qlSettingsBtn');
  const profileQuickActionBtn = document.getElementById('profileQuickActionBtn');

  if (qlSavedBtn) {
    qlSavedBtn.addEventListener('click', () => {
      const tabSaved = document.getElementById('tabSaved');
      if (tabSaved) tabSaved.click();
    });
  }
  if (qlHistoryBtn) {
    qlHistoryBtn.addEventListener('click', () => {
      const tabHistory = document.getElementById('tabHistory');
      if (tabHistory) tabHistory.click();
    });
  }
  if (qlExploreBtn) {
    qlExploreBtn.addEventListener('click', () => {
      switchScreen('explore');
    });
  }
  if (qlSettingsBtn) {
    qlSettingsBtn.addEventListener('click', () => {
      const tabSettings = document.getElementById('tabSettings');
      if (tabSettings) tabSettings.click();
    });
  }
  if (profileQuickActionBtn && profileDrawer) {
    profileQuickActionBtn.addEventListener('click', () => {
      updateSavedDrawerUI();
      profileDrawer.classList.remove('hidden');
    });
  }

  // Render Functions
  function updateProfileUI() {
    // 0. Dynamic Time-Based Greeting
    updateTimeBasedGreeting();

    // 1. Profile Hero & Sidebar Meta
    const name = currentUser ? currentUser.name : 'Milind Kumar';
    const email = currentUser ? currentUser.email : 'milind.kumar@example.com';
    const avatar = currentUser && currentUser.avatar ? currentUser.avatar : (name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'MK');
    const isPro = !currentUser || currentUser.proMember !== false;
    const memberSince = (currentUser && currentUser.joinedDate) ? currentUser.joinedDate : 'Oct 2024';

    if (profileAvatarLarge) profileAvatarLarge.textContent = avatar;
    if (profileDisplayName) profileDisplayName.textContent = name;
    if (profileDisplayEmail) profileDisplayEmail.textContent = email;
    if (profileStatusLabel) profileStatusLabel.textContent = isPro ? 'Pro Member' : 'Standard Member';
    if (profileMemberSinceText) profileMemberSinceText.textContent = `Member since ${memberSince}`;

    // 2. Statistics & Metrics
    const totalSearches = searchHistory.length;
    const totalSaved = savedBookmarks.length;

    if (statTotalSearches) statTotalSearches.textContent = totalSearches > 0 ? totalSearches : '4';
    if (statTotalSaved) statTotalSaved.textContent = totalSaved;
    
    const statTimeSavedEl = document.getElementById('statTimeSaved');
    if (statTimeSavedEl) {
      const hrs = (totalSearches * 0.14 + 5.99).toFixed(2);
      statTimeSavedEl.innerHTML = `${hrs} <span class="val-unit">hrs</span>`;
    }

    const statSuccessRateEl = document.getElementById('statSuccessRate');
    if (statSuccessRateEl) {
      statSuccessRateEl.textContent = '100.0%';
    }

    const statEngagementEl = document.getElementById('statEngagement');
    if (statEngagementEl) {
      statEngagementEl.textContent = '1.88%';
    }

    const statAppliedNumEl = document.getElementById('statAppliedNum');
    if (statAppliedNumEl) {
      statAppliedNumEl.textContent = totalSearches > 0 ? totalSearches : '4';
    }

    const statRefinedNumEl = document.getElementById('statRefinedNum');
    if (statRefinedNumEl) {
      statRefinedNumEl.textContent = Math.floor(totalSearches * 0.2);
    }

    if (statRecentActivity) {
      if (totalSearches > 0) {
        statRecentActivity.textContent = formatTimeAgo(searchHistory[0].timestamp);
      } else {
        statRecentActivity.textContent = 'Active';
      }
    }

    // Favorite Category
    if (statFavoriteCategory) {
      const catCounts = { Web: 0, Articles: 0, Videos: 0, Tools: 0 };
      searchHistory.forEach(h => {
        const c = h.category || 'Web';
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      savedBookmarks.forEach(b => {
        const c = b.category || 'Web';
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
      let topCat = (currentUser && currentUser.preferredCategory) || 'Articles';
      let maxCnt = -1;
      Object.entries(catCounts).forEach(([cat, cnt]) => {
        if (cnt > maxCnt) {
          maxCnt = cnt;
          topCat = cat;
        }
      });
      statFavoriteCategory.textContent = topCat;
    }

    // 3. Tab Counter Badges
    if (historyTabCount) historyTabCount.textContent = totalSearches;
    if (savedTabCount) savedTabCount.textContent = totalSaved;
    if (savedListCountIndicator) savedListCountIndicator.textContent = `${totalSaved} item${totalSaved === 1 ? '' : 's'} saved`;

    // 4. Tab Panels
    renderProfileOverview();
    renderProfileHistory();
    renderProfileSaved();

    // 5. Prepopulate Settings Inputs
    if (settingsNameInput && currentUser) settingsNameInput.value = currentUser.name;
    if (settingsEmailInput && currentUser) settingsEmailInput.value = currentUser.email;
    if (settingsAvatarInput && currentUser) settingsAvatarInput.value = currentUser.avatar || '';

    // 6. Prepopulate Preferences
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    prefThemeRadios.forEach(radio => {
      radio.checked = (radio.value === currentTheme);
    });
    if (prefCurrentThemeBadge) {
      prefCurrentThemeBadge.textContent = currentTheme === 'dark' ? 'Dark Celestial' : 'Warm Ivory';
    }
    if (prefDefaultCategorySelect) {
      prefDefaultCategorySelect.value = (currentUser && currentUser.preferredCategory) || activeCategory || 'Web';
    }
  }

  // Render Overview
  function renderProfileOverview() {
    if (!overviewRecentSearches || !overviewSavedPreview) return;

    // Recent Searches Preview (up to 4)
    if (searchHistory.length === 0) {
      overviewRecentSearches.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>
          <h4 class="empty-state-title">No recent searches</h4>
          <p class="empty-state-desc">Explore intents on the Home or Explore page to start discovering.</p>
        </div>
      `;
    } else {
      const topSearches = searchHistory.slice(0, 4);
      overviewRecentSearches.innerHTML = topSearches.map(item => `
        <div class="overview-search-row">
          <div class="overview-search-main">
            <div class="overview-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <span class="overview-search-query" title="${escapeHtml(item.query)}">${escapeHtml(item.query)}</span>
          </div>
          <div class="overview-search-meta">
            <span class="badge-category">${escapeHtml(item.category || 'Web')}</span>
            <span class="time-ago-text">${formatTimeAgo(item.timestamp)}</span>
            <button type="button" class="btn-repeat-icon" data-query="${escapeHtml(item.query)}" data-cat="${escapeHtml(item.category || 'Web')}" title="Run search again">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>Search ↺</span>
            </button>
          </div>
        </div>
      `).join('');

      overviewRecentSearches.querySelectorAll('.btn-repeat-icon').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.query;
          const c = btn.dataset.cat;
          if (q) executeSearch(q, c);
        });
      });
    }

    // Saved Discoveries Preview (up to 2)
    if (savedBookmarks.length === 0) {
      overviewSavedPreview.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔖</div>
          <h4 class="empty-state-title">No saved discoveries</h4>
          <p class="empty-state-desc">Bookmark websites from search results to quickly find them here.</p>
        </div>
      `;
    } else {
      const topSaved = savedBookmarks.slice(0, 2);
      overviewSavedPreview.innerHTML = topSaved.map(item => `
        <div class="profile-saved-card" data-id="${item.id}">
          <div class="saved-card-top">
            <div class="saved-card-icon">${item.favicon || '🌐'}</div>
            <div class="saved-card-content">
              <h4 class="saved-card-title">${escapeHtml(item.title)}</h4>
              <span class="saved-card-domain">${escapeHtml(item.domain)}</span>
              <p class="saved-card-desc">${escapeHtml(item.desc || '')}</p>
            </div>
          </div>
          <div class="saved-card-footer">
            <span class="saved-date-label">${escapeHtml(item.category || 'Web')} • ★ ${item.rating || '4.8'}</span>
            <div class="saved-card-actions">
              <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-open-website">
                <span>Visit ↗</span>
              </a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Render History Tab
  function renderProfileHistory() {
    if (!historyEntriesList) return;

    const kw = (historyFilterInput ? historyFilterInput.value : '').toLowerCase().trim();
    const filtered = searchHistory.filter(item => {
      const q = (item.query || '').toLowerCase();
      const matchesKw = !kw || q.includes(kw);
      const matchesCat = activeHistoryCategory === 'all' || (item.category || 'Web').toLowerCase() === activeHistoryCategory.toLowerCase();
      return matchesKw && matchesCat;
    });

    if (filtered.length === 0) {
      historyEntriesList.innerHTML = `
        <div class="empty-state-box">
          <div class="empty-state-icon">🔍</div>
          <h4 class="empty-state-title">No search history found</h4>
          <p class="empty-state-desc">${kw ? `No searches matching "${escapeHtml(kw)}"` : 'Your search history is empty. Submit intent searches to see them recorded here.'}</p>
        </div>
      `;
      return;
    }

    historyEntriesList.innerHTML = filtered.map(item => `
      <div class="history-entry-card" data-id="${item.id}">
        <div class="history-entry-info">
          <h4 class="history-entry-query" title="${escapeHtml(item.query)}">${escapeHtml(item.query)}</h4>
          <div class="history-entry-meta">
            <span class="badge-category">${escapeHtml(item.category || 'Web')}</span>
            <span class="time-ago-text">${formatTimeAgo(item.timestamp)}</span>
            <span class="meta-dot">•</span>
            <span>${item.resultCount || 0} results</span>
          </div>
        </div>
        <div class="history-entry-actions">
          <button type="button" class="btn-history-search" data-query="${escapeHtml(item.query)}" data-cat="${escapeHtml(item.category || 'Web')}" title="Search again" aria-label="Search again">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            <span>Repeat ↺</span>
          </button>
          <button type="button" class="btn-history-delete" data-id="${item.id}" title="Remove from history" aria-label="Remove search">
            ✕
          </button>
        </div>
      </div>
    `).join('');

    // Attach row events
    historyEntriesList.querySelectorAll('.btn-history-search').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.dataset.query;
        const c = btn.dataset.cat;
        if (q) executeSearch(q, c);
      });
    });

    historyEntriesList.querySelectorAll('.btn-history-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        searchHistory = searchHistory.filter(h => h.id !== id);
        try {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
        } catch (e) {}
        updateProfileUI();
        showToast('Removed search from history.');
      });
    });
  }

  // Filter input and category pills for history
  if (historyFilterInput) {
    historyFilterInput.addEventListener('input', renderProfileHistory);
  }

  historyCatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      historyCatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeHistoryCategory = pill.dataset.cat || 'all';
      renderProfileHistory();
    });
  });

  // Clear History
  function handleClearHistory() {
    if (searchHistory.length === 0) {
      showToast('Search history is already empty.');
      return;
    }
    openConfirmModal(
      'Clear Search History',
      'Are you sure you want to delete all search history? This action cannot be undone.',
      () => {
        searchHistory = [];
        try {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(searchHistory));
        } catch (e) {}
        updateProfileUI();
        showToast('Search history cleared.');
      },
      'Clear All History'
    );
  }

  if (btnClearHistoryBtn) btnClearHistoryBtn.addEventListener('click', handleClearHistory);
  if (btnSettingsClearHistory) btnSettingsClearHistory.addEventListener('click', handleClearHistory);

  // Render Saved Tab
  function renderProfileSaved() {
    if (!profileSavedCardsGrid) return;

    const kw = (savedFilterInput ? savedFilterInput.value : '').toLowerCase().trim();
    const filtered = savedBookmarks.filter(item => {
      const text = `${item.title} ${item.domain} ${item.desc || ''}`.toLowerCase();
      return !kw || text.includes(kw);
    });

    if (filtered.length === 0) {
      profileSavedCardsGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔖</div>
          <h4 class="empty-state-title">No saved discoveries found</h4>
          <p class="empty-state-desc">${kw ? `No saved bookmarks matching "${escapeHtml(kw)}"` : 'You have not saved any discoveries yet. Bookmark websites from search results to see them here.'}</p>
        </div>
      `;
      return;
    }

    profileSavedCardsGrid.innerHTML = filtered.map(item => `
      <div class="profile-saved-card" data-id="${item.id}">
        <div class="saved-card-top">
          <div class="saved-card-icon">${item.favicon || '🌐'}</div>
          <div class="saved-card-content">
            <h4 class="saved-card-title">${escapeHtml(item.title)}</h4>
            <span class="saved-card-domain">${escapeHtml(item.domain)}</span>
            <p class="saved-card-desc">${escapeHtml(item.desc || '')}</p>
          </div>
        </div>
        <div class="saved-card-footer">
          <span class="saved-date-label">${escapeHtml(item.category || 'Web')} • ★ ${item.rating || '4.8'}</span>
          <div class="saved-card-actions">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-open-website">
              <span>Visit ↗</span>
            </a>
            <button type="button" class="btn-remove-saved" data-remove="${item.id}" title="Remove bookmark" aria-label="Remove bookmark">
              ✕
            </button>
          </div>
        </div>
      </div>
    `).join('');

    profileSavedCardsGrid.querySelectorAll('.btn-remove-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.remove;
        savedBookmarks = savedBookmarks.filter(b => b.id !== id);
        try {
          localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedBookmarks));
        } catch (e) {}
        updateSavedDrawerUI();
        updateProfileUI();

        // Also update matching card in current results stack if visible
        const cardBtn = document.querySelector(`.bookmark-icon-btn[data-id="${id}"]`);
        if (cardBtn) {
          cardBtn.classList.remove('is-saved');
          const svg = cardBtn.querySelector('svg');
          if (svg) svg.setAttribute('fill', 'none');
          cardBtn.setAttribute('aria-label', 'Bookmark this website');
          cardBtn.setAttribute('title', 'Save discovery');
        }

        showToast('Removed saved bookmark.');
      });
    });
  }

  if (savedFilterInput) {
    savedFilterInput.addEventListener('input', renderProfileSaved);
  }

  // Account Settings Form
  if (settingsProfileForm) {
    settingsProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = settingsNameInput ? settingsNameInput.value.trim() : '';
      const email = settingsEmailInput ? settingsEmailInput.value.trim() : '';
      let avatar = settingsAvatarInput ? settingsAvatarInput.value.trim().toUpperCase() : '';

      if (!name || name.length < 2) {
        if (settingsNameError) settingsNameError.textContent = 'Please enter your full name.';
        return;
      }
      if (settingsNameError) settingsNameError.textContent = '';

      if (!avatar) {
        avatar = name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() || 'MK';
      }

      if (!currentUser) {
        currentUser = {
          name: name,
          email: email || 'explorer@semanticnav.local',
          joinedDate: 'Oct 2024',
          proMember: true
        };
      }
      currentUser.name = name;
      if (email) currentUser.email = email;
      currentUser.avatar = avatar;

      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } catch (err) {}

      updateUserUI();
      updateProfileUI();

      if (settingsSaveStatus) {
        settingsSaveStatus.textContent = '✓ Changes saved!';
        setTimeout(() => {
          if (settingsSaveStatus) settingsSaveStatus.textContent = '';
        }, 3000);
      }
      showToast('Profile information updated.');
    });
  }

  // Export Personal Data (JSON)
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      const exportPayload = {
        application: 'SemanticNav',
        exportVersion: '2.4.0',
        exportedAt: new Date().toISOString(),
        profile: currentUser || {
          name: 'Milind Kumar',
          email: 'milind.kumar@example.com',
          avatar: 'MK'
        },
        statistics: {
          totalSearches: searchHistory.length,
          savedBookmarks: savedBookmarks.length,
          favoriteCategory: statFavoriteCategory ? statFavoriteCategory.textContent : 'Web'
        },
        searchHistory: searchHistory,
        savedBookmarks: savedBookmarks,
        preferences: {
          theme: document.documentElement.getAttribute('data-theme') || 'dark',
          defaultCategory: (currentUser && currentUser.preferredCategory) || activeCategory || 'Web',
          recordHistory: prefRecordHistoryToggle ? prefRecordHistoryToggle.checked : true
        }
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `semanticnav_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('SemanticNav data backup downloaded.');
    });
  }

  // Sign Out from Profile Settings
  if (btnSettingsSignOut) {
    btnSettingsSignOut.addEventListener('click', () => {
      openConfirmModal(
        'Sign Out of SemanticNav',
        'Are you sure you want to sign out? Your saved discoveries and search history will remain stored safely in your local browser.',
        () => {
          currentUser = null;
          try {
            localStorage.removeItem(STORAGE_KEYS.USER);
          } catch (e) {}
          updateUserUI();
          updateProfileUI();
          showToast('Signed out of SemanticNav.');
          switchScreen('home');
        },
        'Sign Out'
      );
    });
  }

  // Preferences: Theme Radios
  prefThemeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        applySemanticNavTheme(radio.value);
        showToast(`Theme changed to ${radio.value === 'dark' ? 'Celestial Midnight' : 'Warm Ivory'}.`);
      }
    });
  });

  // Preferences: Default Category
  if (btnSavePrefCategory && prefDefaultCategorySelect) {
    btnSavePrefCategory.addEventListener('click', () => {
      const selected = prefDefaultCategorySelect.value;
      activeCategory = selected;
      if (currentUser) {
        currentUser.preferredCategory = selected;
        try {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        } catch (e) {}
      }
      updateProfileUI();
      showToast(`Default category set to ${selected}.`);
    });
  }

  // Preferences: Record History Toggle
  if (prefRecordHistoryToggle) {
    prefRecordHistoryToggle.addEventListener('change', () => {
      const enabled = prefRecordHistoryToggle.checked;
      showToast(`Search history recording ${enabled ? 'enabled' : 'disabled'}.`);
    });
  }

  // Global Esc key to close any open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmModal && !confirmModal.classList.contains('hidden')) {
        closeConfirmModal();
      }
      if (editProfileModal && !editProfileModal.classList.contains('hidden')) {
        closeEditProfileModalFunc();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 14. Initial Setup on Page Load
  // --------------------------------------------------------------------------
  updateUserUI();
  updateSavedDrawerUI();
  updateProfileUI();

  // Initial screen support for deep-linking & testing (hash or ?screen=...)
  const urlParams = new URLSearchParams(window.location.search);
  const hashScreen = window.location.hash.replace('#', '');
  const initialScreen = urlParams.get('screen') || hashScreen || 'home';
  const initialQuery = urlParams.get('q');

  if (views[initialScreen]) {
    switchScreen(initialScreen, { query: initialQuery });
    const initialTab = urlParams.get('tab');
    if (initialTab && typeof switchProfileTab === 'function') {
      switchProfileTab(initialTab);
    }
  } else {
    switchScreen('home');
  }
});

// Helper function to escape HTML strings safely
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
