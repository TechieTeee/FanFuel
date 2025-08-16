import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/fanfuel-logo.png"
            alt="FanFuel Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-gray-900">FanFuel</span>
        </div>
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Launch App
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/fuelie-waving.png"
              alt="Fuelie Mascot Waving"
              width={200}
              height={200}
              className="animate-bounce"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Where Fans <span className="text-blue-600">Fuel</span> the Future
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform sports commentary into athlete revenue through tokenized fan reactions. 
            Support your favorite athletes when they face criticism with instant blockchain payments.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Supporting Athletes
            </Link>
            <Link 
              href="/about"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">💸</div>
            <h3 className="text-xl font-bold mb-3">$1.7B NIL Market</h3>
            <p className="text-gray-600">Concentrated among 2% of elite athletes, leaving 798,000+ underrepresented student-athletes with minimal NIL revenue.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-3">$2.3B Commentary Economy</h3>
            <p className="text-gray-600">Sports commentary generates billions annually with zero athlete compensation from mentions and discussions.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">😤</div>
            <h3 className="text-xl font-bold mb-3">Fan Frustration</h3>
            <p className="text-gray-600">Fans want to financially support athletes against criticism but lack direct, meaningful ways to help.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-12 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How FanFuel Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-bold mb-2">AI Detection</h4>
              <p className="text-gray-600">Gemini AI analyzes sports commentary in real-time for athlete mentions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h4 className="font-bold mb-2">Fan Alerts</h4>
              <p className="text-gray-600">Instant notifications when your favorite athletes face criticism</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold mb-2">Tap-to-Pay</h4>
              <p className="text-gray-600">One-tap financial support via Chiliz, Flow, and cross-chain bridges</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-bold mb-2">NFT Rewards</h4>
              <p className="text-gray-600">Collect unique reaction NFTs as proof of your athlete support</p>
            </div>
          </div>
        </div>

        {/* Blockchain Partners */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Powered by Leading Blockchain Partners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Chiliz Chain</h3>
              <p className="text-gray-600">SportFi foundation with 2M+ sports fans and EVM compatibility</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">LayerZero</h3>
              <p className="text-gray-600">Omnichain infrastructure enabling cross-chain NFT bridging</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">Flow</h3>
              <p className="text-gray-600">Consumer-grade UX with mainstream adoption focus</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Image
              src="/fuelie-sitting.png"
              alt="Fuelie Sitting"
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-2xl font-bold">FanFuel</span>
          </div>
          <p className="text-gray-400 mb-6">Transforming Sports Commentary into Athlete Revenue</p>
          <p className="text-sm text-gray-500">Built for ETHGlobal NY 2025 Hackathon</p>
        </div>
      </footer>
    </div>
  );
}
