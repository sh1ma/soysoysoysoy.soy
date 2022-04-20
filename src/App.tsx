import React, { useState } from 'react'
import useInterval from 'use-interval'
import './App.css'
import useSound from 'use-sound'
import SoySound from './sound/soy.mp3'
import { PlayFunction } from 'use-sound/dist/types'

type SoyButtonProps = {
  playFunc: PlayFunction
}

const SoyButton: React.FC<SoyButtonProps> = ({ playFunc }) => {
  return (
    <button className='soy-button' onClick={() => playFunc()}>
      そい
    </button>
  )
}

function App() {
  const [play] = useSound(SoySound)
  const [soyCount, setSoyCount] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  useInterval(async () => {
    if (soyCount > bestScore) {
      await setBestScore(soyCount)
    }
    // await setSoyCount(0)
  }, 5000)

  return (
    <div className='App'>
      <header className='App-header'>
        <div onClick={() => bestScore}>
          <a
            href={`https://twitter.com/share?url=soysoysoysoy.soy&text=あなたのそい❣は${bestScore}回でした&hashtags=soysoysoysoysoy`}
            target='_blank'
            rel='noreferrer'
          >
            <p>Tweet</p>
          </a>
        </div>
        <h3>5秒で0にリセットされます 最高記録: {bestScore}そい❣</h3>
        <div onClick={() => setSoyCount(soyCount + 1)}>
          <SoyButton playFunc={play} />
        </div>
        <h3>そい: {soyCount}</h3>
      </header>
    </div>
  )
}

export default App
