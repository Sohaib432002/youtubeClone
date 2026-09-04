/** Category synonyms / topic keywords used for home chips + related ranking */

export const CATEGORY_SYNONYMS = {
  Music: [
    'music',
    'song',
    'songs',
    'singer',
    'album',
    'lyrics',
    'remix',
    'concert',
    'playlist',
    'rap',
    'hip hop',
    'pop',
    'rock',
    'melody',
    'official audio',
    'music video',
  ],
  Gaming: [
    'gaming',
    'game',
    'gameplay',
    'gamer',
    'esports',
    'ranked',
    'walkthrough',
    'stream',
    'fortnite',
    'minecraft',
    'valorant',
    'pc game',
    'console',
  ],
  Live: ['live', 'livestream', 'live stream', 'breaking live', 'watch live'],
  News: ['news', 'headline', 'breaking', 'report', 'journalism', 'world news', 'politics'],
  Sports: [
    'sports',
    'football',
    'soccer',
    'nba',
    'cricket',
    'match',
    'highlights',
    'goal',
    'tournament',
    'athlete',
    'championship',
  ],
  Movies: ['movie', 'film', 'cinema', 'trailer', 'hollywood', 'bollywood', 'netflix', 'blockbuster'],
  Comedy: ['comedy', 'funny', 'standup', 'stand-up', 'joke', 'humor', 'sketch'],
  Education: [
    'education',
    'learn',
    'lesson',
    'course',
    'tutorial',
    'explained',
    'lecture',
    'study',
    'classroom',
  ],
  Technology: [
    'technology',
    'tech',
    'gadget',
    'smartphone',
    'review',
    'software',
    'hardware',
    'innovation',
    'device',
    'iphone',
    'android',
  ],
  Programming: [
    'programming',
    'coding',
    'code',
    'developer',
    'javascript',
    'python',
    'react',
    'web development',
    'software engineering',
    'api',
    'frontend',
    'backend',
  ],
  Science: ['science', 'physics', 'chemistry', 'biology', 'experiment', 'research', 'space'],
  Mathematics: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'equation', 'numbers'],
  AI: [
    'ai',
    'artificial intelligence',
    'machine learning',
    'neural',
    'llm',
    'chatgpt',
    'deep learning',
    'gpt',
  ],
  'Data Science': [
    'data science',
    'data analysis',
    'pandas',
    'analytics',
    'dataset',
    'visualization',
    'statistics',
  ],
  Business: ['business', 'startup', 'entrepreneur', 'company', 'strategy', 'marketing'],
  Finance: ['finance', 'investing', 'stock', 'money', 'crypto', 'budget', 'trading'],
  Podcasts: ['podcast', 'episode', 'interview', 'conversation', 'talk show'],
  Entertainment: ['entertainment', 'celebrity', 'show', 'tv', 'viral', 'pop culture'],
  Travel: ['travel', 'vlog', 'trip', 'tour', 'destination', 'adventure', 'vacation'],
  Food: ['food', 'recipe', 'cooking', 'chef', 'kitchen', 'restaurant', 'cuisine'],
  Fitness: ['fitness', 'workout', 'gym', 'exercise', 'training', 'health', 'muscle'],
  Fashion: ['fashion', 'style', 'outfit', 'clothing', 'runway', 'makeup', 'beauty'],
  Tutorials: ['tutorial', 'how to', 'guide', 'step by step', 'walkthrough', 'tips'],
  Documentary: ['documentary', 'docuseries', 'true story', 'investigation', 'wildlife'],
  History: ['history', 'historical', 'ancient', 'civilization', 'war', 'empire', 'century'],
  Trending: ['trending', 'viral', 'popular', 'hot'],
  'Recently Uploaded': ['new', 'latest', 'uploaded', 'just released'],
}

export function getCategorySynonyms(category = '') {
  const key = String(category || '')
  if (CATEGORY_SYNONYMS[key]) return CATEGORY_SYNONYMS[key]
  const found = Object.keys(CATEGORY_SYNONYMS).find(
    (k) => k.toLowerCase() === key.toLowerCase()
  )
  return found ? CATEGORY_SYNONYMS[found] : [key.toLowerCase()].filter(Boolean)
}

/** Score how well text matches a category chip (0 = no match). */
export function scoreCategoryMatch(text = '', category = '') {
  if (!category || category === 'All') return 1
  if (category === 'Trending' || category === 'Recently Uploaded') return 1

  const hay = String(text).toLowerCase()
  const key = category.toLowerCase()
  let score = 0

  if (hay.includes(key)) score += 40

  getCategorySynonyms(category).forEach((term) => {
    const t = String(term).toLowerCase()
    if (!t) return
    if (hay.includes(t)) score += t === key ? 20 : 12
  })

  return score
}

/** Infer best category label from title/description/tags. */
export function inferCategoryFromText(text = '', fallback = '') {
  let best = fallback || ''
  let bestScore = 0
  Object.keys(CATEGORY_SYNONYMS).forEach((cat) => {
    if (cat === 'Trending' || cat === 'Recently Uploaded' || cat === 'Live') return
    const s = scoreCategoryMatch(text, cat)
    if (s > bestScore) {
      bestScore = s
      best = cat
    }
  })
  return bestScore >= 12 ? best : fallback || ''
}
