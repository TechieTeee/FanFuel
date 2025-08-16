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
            Turn your everyday purchases into athlete support. Every tap, swipe, and purchase automatically 
            sends a percentage to your chosen athletes, plus get alerts to provide extra support during critical moments.
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
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-3">$7T Daily Spending</h3>
            <p className="text-gray-600">Fans spend trillions on everyday purchases but none of this supports their favorite athletes directly.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">😤</div>
            <h3 className="text-xl font-bold mb-3">Fan Frustration</h3>
            <p className="text-gray-600">Fans want to financially support athletes but current methods are complex, limited, and disconnected from daily life.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-12 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How FanFuel Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏃‍♂️</span>
              </div>
              <h4 className="font-bold mb-2">Choose Your Athletes</h4>
              <p className="text-gray-600">Select your favorite underrepresented athletes to support through your everyday spending</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-bold mb-2">Tap-to-Pay Daily</h4>
              <p className="text-gray-600">Use FanFuel for everyday purchases - coffee, gas, groceries, anything you buy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold mb-2">Auto-Split Revenue</h4>
              <p className="text-gray-600">A percentage of every purchase automatically goes to your chosen athletes via blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚨</span>
              </div>
              <h4 className="font-bold mb-2">Critical Moment Alerts</h4>
              <p className="text-gray-600">AI detects when athletes face criticism and suggests extra support opportunities</p>
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
          <p className="text-gray-400 mb-6">Transforming Everyday Purchases into Athlete Revenue</p>
          <p className="text-sm text-gray-500">Built for ETHGlobal NY 2025 Hackathon</p>
        </div>
      </footer>
    </div>
  );
}
