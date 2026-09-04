import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { usePrefs } from '../../Hooks/PrefsContext'

const Voice = () => {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const recognitionRef = useRef(null)
  const { prefs } = usePrefs()

  const langMap = {
    English: 'en-US',
    Urdu: 'ur-PK',
    Hindi: 'hi-IN',
    Arabic: 'ar-SA',
  }

  const stop = () => {
    try {
      recognitionRef.current?.stop()
    } catch (_) {
      /* ignore */
    }
    setListening(false)
  }

  const close = () => {
    stop()
    setOpen(false)
    setError('')
    setTranscript('')
  }

  const start = () => {
    setError('')
    setTranscript('')
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice search is not supported in this browser. Try Chrome.')
      setOpen(true)
      return
    }

    // Stop any previous instance first
    stop()

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = langMap[prefs.language] || 'en-US'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onspeechend = () => {
      // keep modal open; recognition will end after result
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognition.onerror = (e) => {
      setListening(false)
      if (e.error === 'not-allowed') setError('Microphone permission denied. Allow mic access.')
      else if (e.error === 'no-speech') setError('No speech detected. Tap the mic and try again.')
      else if (e.error !== 'aborted') setError(`Voice error: ${e.error}`)
    }
    recognition.onresult = (event) => {
      let text = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
      const isFinal = event.results[event.results.length - 1]?.isFinal
      if (isFinal && text.trim()) {
        const q = text.trim()
        setTimeout(() => {
          close()
          navigate(`/result/${encodeURIComponent(q)}`)
        }, 350)
      }
    }

    setOpen(true)
    // slight delay so modal mounts before mic starts (avoids instant abort)
    window.setTimeout(() => {
      try {
        recognition.start()
      } catch (_) {
        setError('Could not start microphone. Click Try again.')
        setListening(false)
      }
    }, 200)
  }

  useEffect(() => () => stop(), [])

  return (
    <>
      <button
        type="button"
        title="Search with your voice"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          start()
        }}
        className="rounded-full p-2.5 m-1 text-white bg-[#222] hover:bg-[#3d3d3d] flex-shrink-0"
        aria-label="Voice search"
      >
        <i className="fa-solid fa-microphone"></i>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="bg-[#212121] w-full max-w-lg rounded-2xl p-8 text-center text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-medium mb-2">
              {listening ? 'Listening...' : error ? 'Try again' : 'Voice search'}
            </h3>
            <p className="text-[#aaa] text-sm mb-8 min-h-[24px]">
              {transcript || error || 'Speak now'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (listening) stop()
                else start()
              }}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl ${
                listening ? 'bg-red-600 animate-pulse' : 'bg-[#3ea6ff] text-black'
              }`}
            >
              <i className="fa-solid fa-microphone"></i>
            </button>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 rounded-full bg-[#303030] hover:bg-[#3f3f3f] text-sm"
              >
                Cancel
              </button>
              {!listening ? (
                <button
                  type="button"
                  onClick={start}
                  className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
                >
                  Try again
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Voice
