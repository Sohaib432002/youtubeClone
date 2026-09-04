import { useState } from 'react'
import { useAuth } from '../../Hooks/AuthContext'

const SignInModal = () => {
  const { showSignIn, closeSignIn, signIn } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (!showSignIn) return null

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    signIn({ name, email })
    setName('')
    setEmail('')
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={closeSignIn}
    >
      <div
        className="bg-[#212121] text-white w-full max-w-md rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <button type="button" onClick={closeSignIn} className="text-[#AAAAAA] hover:text-white">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <p className="text-sm text-[#AAAAAA] mb-4">
          Sign in to sync your profile, history, and subscriptions on this device.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email (optional)"
            className="bg-[#121212] border border-[#3f3f3f] rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-2 bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
