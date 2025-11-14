import { useEffect, useRef, useState } from "react"
import "./App.css"

function App() {
  const GAME_DURATION_MS = 5_000
  const TICK_MS = 100
  const AUDIO_POOL_SIZE = 6

  const [timeLeftMs, setTimeLeftMs] = useState<number>(GAME_DURATION_MS)
  const [score, setScore] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const audioPoolRef = useRef<HTMLAudioElement[] | null>(null)
  const audioIndexRef = useRef<number>(0)

  // prepare audio pool once
  useEffect(() => {
    const pool: HTMLAudioElement[] = []
    for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
      const audio = new Audio("/soy.wav")
      audio.preload = "auto"
      pool.push(audio)
    }
    audioPoolRef.current = pool
    return () => {
      // cleanup
      audioPoolRef.current?.forEach((a) => {
        a.pause()
        a.src = ""
      })
      audioPoolRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setTimeLeftMs((prev) => {
        const next = Math.max(0, prev - TICK_MS)
        if (next === 0) {
          clearInterval(intervalId)
          setIsRunning(false)
        }
        return next
      })
    }, TICK_MS)

    return () => clearInterval(intervalId)
  }, [isRunning])

  const startGame = () => {
    setScore(0)
    setTimeLeftMs(GAME_DURATION_MS)
    setIsRunning(true)
  }

  const resetGame = () => {
    setIsRunning(false)
    setScore(0)
    setTimeLeftMs(GAME_DURATION_MS)
  }

  const handleClick = () => {
    if (!isRunning) return
    setScore((s) => s + 1)
    // play sound
    const pool = audioPoolRef.current
    if (pool && pool.length > 0) {
      const idx = audioIndexRef.current % pool.length
      audioIndexRef.current = (audioIndexRef.current + 1) % pool.length
      const audio = pool[idx]
      try {
        // rewind and play; allow overlapping via pool
        audio.currentTime = 0
        void audio.play()
      } catch {
        // ignore playback errors (e.g., autoplay restrictions)
      }
    }
  }

  const secondsLeft = (timeLeftMs / 1000).toFixed(1)
  const isFinished = !isRunning && timeLeftMs === 0
  const shareText = `あなたのそい❣は${score}回でした https://soysoysoysoy.soy #soysoysoysoysoy`
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}`

  return (
    <div className="game-root">
      <h1>soysoysoysoy.soy</h1>
      <div className="hud">
        <div className="timer" aria-live="polite">
          残り時間: {secondsLeft}s
        </div>
        <div className="score" aria-live="polite">
          連打数: {score}
        </div>
      </div>

      <div className="controls">
        {!isRunning && !isFinished && (
          <button className="primary" onClick={startGame}>
            スタート
          </button>
        )}

        <button
          className="tap"
          onClick={handleClick}
          disabled={!isRunning}
          aria-disabled={!isRunning}
        >
          そい❣
        </button>

        {!isRunning && isFinished && (
          <>
            <button className="secondary" onClick={startGame}>
              もう一度
            </button>
            <a
              className="secondary"
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitterでシェア
            </a>
          </>
        )}

        {!isRunning && !isFinished && (
          <button className="secondary" onClick={resetGame}>
            リセット
          </button>
        )}
      </div>

      {isFinished && (
        <div className="result" role="status">
          あなたのそい❣は {score} 回でした
        </div>
      )}
    </div>
  )
}

export default App
