import { demoAthletes } from '../../../data/demo-athletes';
import { demoCommentary } from '../../../data/demo-commentary';

export default function Alerts() {
  const [fuelieState, setFuelieState] = useState('waving')
  const [ncaaData, setNcaaData] = useState({ rankings: [], games: [] })
  const [loading, setLoading] = useState(true)
  const [commentary, setCommentary] = useState([])

  useEffect(() => {
    const fetchNCAAData = async () => {
      try {
        const [rankingsRes, gamesRes] = await Promise.all([
          fetch('https://ncaa-api.henrygd.me/rankings/football/fbs/associated-press'),
          fetch('https://ncaa-api.henrygd.me/scoreboard/football/fbs/2025/1')
        ])
        
        const rankingsData = await rankingsRes.json()
        const gamesData = await gamesRes.json()
        
        console.log('Rankings Data:', rankingsData)
        console.log('Games Data:', gamesData)
        
        setNcaaData({
          rankings: rankingsData.data || [],
          games: gamesData.games || []
        })
        
        console.log('Final NCAA Data:', {
          rankings: rankingsData.data || [],
          games: gamesData.games || []
        })
      } catch (error) {
        console.error('Error fetching NCAA data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNCAAData()
  }, [])

  useEffect(() => {
    const fetchCommentary = async () => {
      const analyzedCommentary = await Promise.all(
        demoCommentary.map(async (comment) => {
          const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: comment.text }),
          })
          const analysis = await response.json()
          return { ...comment, ...analysis }
        })
      )
      setCommentary(analyzedCommentary)
    }

    fetchCommentary()
  }, [])

  const getFuelieImage = () => {
    switch(fuelieState) {
      case 'eyes-closed':
        return '/fuelie-eyes-closed.png'
      case 'sitting':
        return '/fuelie-sitting.png'
      default:
        return '/fuelie-waving.png'
    }
  }

  const handleSupportAthlete = (athleteId, amount) => {
    setFuelieState('eyes-closed')
    
    // Simulate processing
    setTimeout(() => {
      setFuelieState('sitting')
      alert(`Successfully sent $${amount} support to athlete!`)
    }, 2000)
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CustomCursor />
      <AnimatedBackground />
      <HoverNavigation />

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-40 px-6 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-3xl font-black text-white bg-gradient-to-r from-[#f59e0b] to-white bg-clip-text text-transparent">
            FanFuel
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/spending" className="text-[#f59e0b] hover:text-white transition-colors duration-300 font-bold uppercase tracking-wide">
            ⛽ FuelStation
          </Link>
<MinimalWallet />
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Page Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-wider mb-4">
            📺 FuelFeed
          </h1>
          <p className="text-xl text-[#f59e0b] font-semibold">
            React with impact - every response fuels champions
          </p>
        </motion.div>

        {/* NCAA News Ticker */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-[#ef4444]/20 to-[#f59e0b]/20 backdrop-blur-lg rounded-xl border border-[#ef4444]/30 mb-8 overflow-hidden max-w-5xl mx-auto"
        >
          <div className="bg-[#ef4444]/30 px-6 py-2 border-b border-[#ef4444]/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">📺 Live NCAA Feed</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#ef4444] rounded-full animate-pulse"></div>
                <span className="text-xs text-[#f59e0b] font-bold uppercase">Breaking</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">
              <span className="text-gray-400 font-medium">⏳ Loading live NCAA data...</span>
            </div>
          ) : ncaaData.rankings.length > 0 || true ? (
            <div className="relative h-12 overflow-hidden">
              <motion.div
                animate={{ x: [1200, -2400] }}
                transition={{ 
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute flex items-center h-full space-x-8 whitespace-nowrap"
              >
{[
                  "🚨 BREAKING: Texas QB Quinn Ewers signs $2.3M NIL deal with Austin tech startup",
                  "🏈 FINAL: #3 Oregon defeats USC 42-28, Dillon Gabriel throws for 394 yards",
                  "📈 RANKING ALERT: Miami jumps 4 spots to #12 after upset victory over Clemson",
                  "💰 NIL NEWS: Stanford basketball star Haley Jones partners with Nike for exclusive line",
                  "⚡ UPSET: Unranked Vanderbilt stuns #9 Alabama 40-35 in overtime thriller",
                  "🏀 TRENDING: UConn's Paige Bueckers leads comeback with 31 points against South Carolina",
                  "💎 NIL DEAL: Duke freshman Cooper Flagg signs multi-year agreement with Jordan Brand",
                  "🔥 LIVE: #1 Texas leads Oklahoma 21-14 at halftime in Red River Showdown",
                  "📊 STAT WATCH: LSU's Jayden Daniels becomes first QB with 3,500 pass + 800 rush yards",
                  "🏆 CHAMPIONSHIP: Michigan State wins Big Ten volleyball title, advances to Final Four",
                  "💸 BREAKING: NCAA approves new NIL collective rules effective immediately",
                  "⭐ RISING STAR: Colorado's Travis Hunter leads Heisman race with two-way dominance",
                  "🚀 TRANSFER PORTAL: Top-rated RB commits to Florida State, bringing $500K NIL package",
                  "🎯 RECORD BROKEN: Tennessee's Dylan Sampson rushes for 285 yards, breaks school record",
                  "💪 COMEBACK: UCF rallies from 21-point deficit to beat Cincinnati 38-35"
                ].map((story, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-white font-medium">{story}</span>
                    {index < 14 && <span className="text-[#ef4444] mx-6 text-xl">•</span>}
                  </div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <span className="text-gray-400 font-medium">📡 NCAA data temporarily unavailable</span>
            </div>
          )}
        </motion.div>

        {/* NCAA Games */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-6 text-center">🏈 Upcoming Games</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading games...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ncaaData.games?.slice(0, 3).map((game, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-lg font-semibold text-white">{game.awayTeam.school} @ {game.homeTeam.school}</p>
                  <p className="text-sm text-gray-400">{new Date(game.startDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* NCAA Rankings */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-6 text-center">🏆 AP Top 5 Football Rankings</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading rankings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {ncaaData.rankings?.slice(0, 5).map((ranking, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-2xl font-black text-[#f59e0b]">#{ranking.rank}</p>
                  <p className="text-lg font-semibold text-white">{ranking.school}</p>
                  <p className="text-sm text-gray-400">({ranking.record})</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Commentary Feed */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">📺 Live FuelFeed</h2>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-pulse shadow-lg shadow-[#ef4444]/30"></div>
              <span className="text-sm text-[#f59e0b] font-bold uppercase tracking-wide">🤖 AI SCANNING</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {commentary.map((comment, index) => {
              const athlete = demoAthletes.find(a => a.id === comment.athlete_id)
              return (
                <motion.div 
                  key={comment.id} 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.01, y: -3 }}
                  className="border-l-4 border-[#ef4444] bg-gray-800/60 p-6 rounded-xl backdrop-blur-md border border-gray-700/30 hover:border-[#ef4444]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-[#ef4444]/20 text-[#ef4444] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-[#ef4444]/30">
                          💬 NEGATIVE SENTIMENT
                        </span>
                        <span className="text-gray-400 text-sm font-medium">{comment.source}</span>
                      </div>
                      <p className="text-white mb-4 text-lg leading-relaxed font-medium">&ldquo;{comment.text}&rdquo;</p>
                      <p className="text-sm text-gray-300">
                        Target: <strong className="text-[#f59e0b]">{athlete?.name}</strong> <span className="text-gray-500">({athlete?.sport})</span>
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="bg-[#ef4444]/20 text-[#ef4444] px-3 py-1 rounded-full text-sm font-black border border-[#ef4444]/30">
                        🔥 {Math.round(comment.intensity * 100)}% Intensity
                      </div>
                      <div className="bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full text-sm font-black border border-[#f59e0b]/30">
                        🚀 {Math.round(comment.virality_score * 100)}% Viral
                      </div>
                    </div>
                  </div>
                  
                  {/* Paid Reactions */}
                  <div className="border-t border-gray-600/50 pt-6 mt-6">
                    <h4 className="font-black mb-4 text-white uppercase tracking-wide">💰 PAID REACTIONS: {athlete?.name}</h4>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 2)}
                        className={`bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 2 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        👏 Clap $2
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 5)}
                        className={`bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 5 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        🔥 Fire $5
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 10)}
                        className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 10 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        💎 Gem $10
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 15)}
                        className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 15 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        💪 Strong $15
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 25)}
                        className={`bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 25 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        🏆 Legend $25
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 50)}
                        className={`bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold text-sm ${comment.suggested_reaction === 50 ? 'ring-2 ring-yellow-400' : ''}`}
                      >
                        👑 King $50
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-medium">
                      💰 Your reaction appears publicly with payment amount • 🏆 100% goes to {athlete?.name}
                    </p>
                  </div>

                  {/* Recommended Athletes */}
                  <div className="border-t border-gray-600/50 pt-6 mt-6">
                    <h4 className="font-black mb-4 text-white uppercase tracking-wide">🔥 You might also like:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {demoAthletes.filter(a => a.sport === athlete?.sport && a.id !== athlete?.id).map(recommendedAthlete => (
                        <div key={recommendedAthlete.id} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                          <p className="font-bold text-white">{recommendedAthlete.name}</p>
                          <p className="text-sm text-gray-400">{recommendedAthlete.sport} - {recommendedAthlete.university}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </motion.div>
      </div>
    </div>
  )
}