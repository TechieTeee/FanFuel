export interface DemoAd {
  id: string
  title: string
  description: string
  cta: string
  image: string
  brand: string
  category: 'sports-gear' | 'nutrition' | 'training' | 'lifestyle' | 'tech'
  targetAudience: string[]
  backgroundColor: string
  textColor: string
}

export const demoAds: DemoAd[] = [
  {
    id: 'ad-1',
    title: 'Fuel Your Training',
    description: 'Premium protein powder trusted by Olympic athletes. Get 20% off your first order.',
    cta: 'Shop Now',
    image: '/icons/nutrition.png',
    brand: 'AthleteNutrition Pro',
    category: 'nutrition',
    targetAudience: ['track', 'swimming', 'basketball'],
    backgroundColor: 'from-green-600 to-green-700',
    textColor: 'text-white'
  },
  {
    id: 'ad-2', 
    title: 'Track Performance Like a Pro',
    description: 'Advanced sports analytics platform used by MLS teams. Get insights your favorite athletes use.',
    cta: 'Start Free Trial',
    image: '/icons/chart.png',
    brand: 'SportsTech Analytics',
    category: 'tech',
    targetAudience: ['soccer', 'basketball', 'track'],
    backgroundColor: 'from-blue-600 to-purple-600',
    textColor: 'text-white'
  },
  {
    id: 'ad-3',
    title: 'Olympic-Grade Recovery Gear',
    description: 'Compression therapy devices used by Team USA athletes. Recover faster, train harder.',
    cta: 'Learn More',
    image: '/icons/medical.png', 
    brand: 'RecoveryTech Elite',
    category: 'training',
    targetAudience: ['olympic', 'track', 'swimming'],
    backgroundColor: 'from-red-600 to-orange-600',
    textColor: 'text-white'
  },
  {
    id: 'ad-4',
    title: 'Support Athletes Like You Do',
    description: 'Join 50,000+ fans using crypto to directly support their favorite athletes. No middlemen.',
    cta: 'Get Started',
    image: '/icons/crypto.png',
    brand: 'FanSupport Chain',
    category: 'lifestyle',
    targetAudience: ['all'],
    backgroundColor: 'from-purple-600 to-pink-600', 
    textColor: 'text-white'
  },
  {
    id: 'ad-5',
    title: 'Train Where Champions Train',
    description: 'Elite training facilities now offering memberships. Same equipment used by Olympic medalists.',
    cta: 'Find Location',
    image: '/icons/gym.png',
    brand: 'Champions Fitness',
    category: 'training',
    targetAudience: ['track', 'swimming', 'basketball'],
    backgroundColor: 'from-gray-700 to-gray-800',
    textColor: 'text-white'
  },
  {
    id: 'ad-6',
    title: 'MLS Season Pass',
    description: 'Stream every MLS match live. Follow rising stars like the ones you support on FanFuel.',
    cta: 'Subscribe Now',
    image: '/icons/tv.png',
    brand: 'MLS Season Pass',
    category: 'lifestyle',
    targetAudience: ['soccer'],
    backgroundColor: 'from-green-500 to-blue-500',
    textColor: 'text-white'
  }
]

// Function to get ads relevant to user's supported athletes
export function getRelevantAds(supportedAthletes: string[], maxAds = 2): DemoAd[] {
  // Simple mapping of athlete IDs to sports to avoid circular dependency
  const athleteSports: Record<string, string> = {
    '1': 'track',
    '2': 'soccer', 
    '3': 'swimming',
    '4': 'basketball',
    '5': 'basketball',
    '6': 'soccer',
    '7': 'gymnastics',
    '8': 'tennis'
  }
  
  const userSports = supportedAthletes.map(id => athleteSports[id] || '').filter(Boolean)
  
  const relevantAds = demoAds.filter(ad => 
    ad.targetAudience.includes('all') || 
    ad.targetAudience.some(target => userSports.some(sport => sport.includes(target)))
  )
  
  return relevantAds.slice(0, maxAds)
}