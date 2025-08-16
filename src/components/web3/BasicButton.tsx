'use client'

export default function BasicButton() {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        alert(`Wallet Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
      } else {
        alert('Please install MetaMask')
      }
    } catch (error) {
      alert(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        zIndex: 9999,
        position: 'relative',
        pointerEvents: 'auto'
      }}
    >
      🔗 Connect Wallet
    </button>
  )
}