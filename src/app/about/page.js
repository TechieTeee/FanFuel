import Image from "next/image"
import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/fanfuel-logo.png"
            alt="FanFuel Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-gray-900">FanFuel</span>
        </Link>
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Launch App
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <Image
            src="/fuelie-sitting.png"
            alt="Fuelie Sitting"
            width={150}
            height={150}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About FanFuel</h1>
          <p className="text-xl text-gray-600">
            The first tap-to-pay platform transforming everyday purchases into athlete prosperity
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">The Problem We&apos;re Solving</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
            <p className="text-lg text-gray-800">
              Sports revenue is concentrated among elite leagues while talented athletes across WNBA, Olympics, MLS, women&apos;s soccer, boxing, UFC, and emerging sports face massive pay disparities despite growing followings and achievements.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Commentary Economy Gap</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Sports commentary generates $2.3B annually</li>
                <li>• Zero athlete compensation for mentions</li>
                <li>• Athletes criticized without financial recourse</li>
                <li>• Fans frustrated with inability to help</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Web3 Barriers</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Complex wallet setup processes</li>
                <li>• High gas fees on major networks</li>
                <li>• Poor user experience for mainstream fans</li>
                <li>• Fragmented cross-chain experiences</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Innovative Solution</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <p className="text-lg text-gray-800">
              FanFuel creates direct revenue streams from commentary mentions through AI-powered sentiment analysis, 
              instant fan mobilization, and seamless multi-chain blockchain experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🤖 AI-Powered Analysis</h3>
              <p className="text-gray-600 mb-4">
                Google Gemini analyzes sports commentary in real-time, identifying when athletes face criticism 
                and calculating the optimal fan response strategy.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Real-time sentiment analysis</li>
                <li>• Virality prediction scoring</li>
                <li>• Automated trend detection</li>
                <li>• Dynamic NFT metadata generation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">⚡ Multi-Chain Infrastructure</h3>
              <p className="text-gray-600 mb-4">
                Three strategic blockchain partners provide the perfect foundation for sports fan engagement 
                and mainstream adoption.
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Chiliz: Sports-native with 2M+ fans</li>
                <li>• Flow: Consumer-grade UX</li>
                <li>• LayerZero: Seamless cross-chain bridging</li>
                <li>• Unified fan identity across networks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How FanFuel Works</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Commentary Detection</h3>
                <p className="text-gray-600">
                  Our AI continuously monitors sports commentary across social media, forums, and traditional media. 
                  When athletes are mentioned with negative sentiment, the system immediately triggers alerts.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Fan Mobilization</h3>
                <p className="text-gray-600">
                  Fans following their favorite athletes receive instant notifications with context about the criticism 
                  and suggested support actions. Our Fuelie mascot guides them through the response process.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Blockchain Payment</h3>
                <p className="text-gray-600">
                  One-tap payments send support directly to athletes via our multi-chain infrastructure. 
                  80% goes to the athlete, 20% covers platform costs. Payments work across Chiliz, Flow, and other networks.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
              <div>
                <h3 className="text-xl font-bold mb-2">NFT Collection</h3>
                <p className="text-gray-600">
                  Each support action creates a unique reaction NFT with AI-generated metadata. 
                  Fans collect these as proof of their loyalty, and athletes can showcase fan support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">C</span>
              </div>
              <h3 className="font-bold mb-2">Chiliz Chain</h3>
              <p className="text-sm text-gray-600">SportFi foundation with existing fan ecosystem and EVM compatibility</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">L</span>
              </div>
              <h3 className="font-bold mb-2">LayerZero</h3>
              <p className="text-sm text-gray-600">Omnichain infrastructure enabling seamless cross-chain experiences</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">F</span>
              </div>
              <h3 className="font-bold mb-2">Flow</h3>
              <p className="text-sm text-gray-600">Consumer-grade blockchain UX designed for mainstream adoption</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">G</span>
              </div>
              <h3 className="font-bold mb-2">Gemini AI</h3>
              <p className="text-sm text-gray-600">Advanced AI for real-time sentiment analysis and content generation</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Fuel the Future?</h2>
            <p className="text-xl mb-8">
              Join the revolution transforming sports commentary into athlete prosperity.
            </p>
            <Link 
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Launch FanFuel
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}