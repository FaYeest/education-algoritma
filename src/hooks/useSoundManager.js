// Sound Manager Hook
import { useEffect, useRef, useState } from 'react'

export const useSoundManager = () => {
  const bgmRef = useRef(null)
  const correctRef = useRef(null)
  const wrongRef = useRef(null)
  const completeRef = useRef(null)
  const tickRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)

  useEffect(() => {
    // Load sounds from local storage preferences
    const savedMuted = localStorage.getItem('soundMuted')
    const savedVolume = localStorage.getItem('soundVolume')
    
    if (savedMuted !== null) {
      setIsMuted(savedMuted === 'true')
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume))
    }
  }, [])

  // Initialize audio elements
  useEffect(() => {
    // BGM - Simple game music (we'll use Web Audio API to generate)
    bgmRef.current = new Audio()
    correctRef.current = new Audio()
    wrongRef.current = new Audio()
    completeRef.current = new Audio()
    tickRef.current = new Audio()

    // Set volume for all sounds
    const updateVolume = (audio, vol) => {
      if (audio) audio.volume = vol
    }

    updateVolume(bgmRef.current, volume * 0.3) // BGM lebih pelan
    updateVolume(correctRef.current, volume)
    updateVolume(wrongRef.current, volume)
    updateVolume(completeRef.current, volume)
    updateVolume(tickRef.current, volume * 0.5)

    // Loop BGM
    if (bgmRef.current) {
      bgmRef.current.loop = true
    }

    return () => {
      stopBGM()
    }
  }, [volume])

  const playBGM = () => {
    if (!isMuted && bgmRef.current) {
      // Generate simple game music using Web Audio API
      generateGameMusic()
      bgmRef.current.play().catch(e => console.log('BGM play failed:', e))
    }
  }

  const stopBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.pause()
      bgmRef.current.currentTime = 0
    }
  }

  const playCorrect = () => {
    if (!isMuted && correctRef.current) {
      generateCorrectSound()
      correctRef.current.play().catch(e => console.log('Correct sound failed:', e))
    }
  }

  const playWrong = () => {
    if (!isMuted && wrongRef.current) {
      generateWrongSound()
      wrongRef.current.play().catch(e => console.log('Wrong sound failed:', e))
    }
  }

  const playComplete = () => {
    if (!isMuted && completeRef.current) {
      generateCompleteSound()
      completeRef.current.play().catch(e => console.log('Complete sound failed:', e))
    }
  }

  const playTick = () => {
    if (!isMuted && tickRef.current) {
      generateTickSound()
      tickRef.current.play().catch(e => console.log('Tick sound failed:', e))
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem('soundMuted', newMuted.toString())
    
    if (newMuted) {
      stopBGM()
    }
  }

  const setVolumeLevel = (vol) => {
    setVolume(vol)
    localStorage.setItem('soundVolume', vol.toString())
  }

  // Generate sounds using Web Audio API
  const generateGameMusic = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const duration = 4 // 4 seconds loop
    const sampleRate = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Simple upbeat melody
    const notes = [262, 294, 330, 349, 392, 440, 494, 523] // C major scale
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noteIndex = Math.floor(t * 4) % notes.length
      const freq = notes[noteIndex]
      data[i] = Math.sin(2 * Math.PI * freq * t) * 0.1 * Math.exp(-t % 1)
    }

    const blob = bufferToWave(buffer, buffer.length)
    bgmRef.current.src = URL.createObjectURL(blob)
  }

  const generateCorrectSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const duration = 0.3
    const sampleRate = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Happy ascending notes
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 440 * Math.pow(2, t * 2) // Ascending
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5) * 0.3
    }

    const blob = bufferToWave(buffer, buffer.length)
    correctRef.current.src = URL.createObjectURL(blob)
  }

  const generateWrongSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const duration = 0.4
    const sampleRate = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Sad descending buzz
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const freq = 200 * Math.pow(0.5, t * 2) // Descending
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3) * 0.3
    }

    const blob = bufferToWave(buffer, buffer.length)
    wrongRef.current.src = URL.createObjectURL(blob)
  }

  const generateCompleteSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const duration = 1.5
    const sampleRate = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Victory fanfare
    const notes = [262, 330, 392, 523] // C E G C
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      const noteIndex = Math.floor(t * 3)
      const freq = notes[Math.min(noteIndex, notes.length - 1)]
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 2) * 0.3
    }

    const blob = bufferToWave(buffer, buffer.length)
    completeRef.current.src = URL.createObjectURL(blob)
  }

  const generateTickSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const duration = 0.05
    const sampleRate = audioContext.sampleRate
    const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Short tick
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 50) * 0.2
    }

    const blob = bufferToWave(buffer, buffer.length)
    tickRef.current.src = URL.createObjectURL(blob)
  }

  // Helper function to convert AudioBuffer to WAV Blob
  const bufferToWave = (abuffer, len) => {
    const numOfChan = abuffer.numberOfChannels
    const length = len * numOfChan * 2 + 44
    const buffer = new ArrayBuffer(length)
    const view = new DataView(buffer)
    const channels = []
    let offset = 0
    let pos = 0

    // Write WAV header
    setUint32(0x46464952) // "RIFF"
    setUint32(length - 8) // file length - 8
    setUint32(0x45564157) // "WAVE"
    setUint32(0x20746d66) // "fmt " chunk
    setUint32(16) // length = 16
    setUint16(1) // PCM (uncompressed)
    setUint16(numOfChan)
    setUint32(abuffer.sampleRate)
    setUint32(abuffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
    setUint16(numOfChan * 2) // block-align
    setUint16(16) // 16-bit
    setUint32(0x61746164) // "data" - chunk
    setUint32(length - pos - 4) // chunk length

    // Write interleaved data
    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i))
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]))
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(pos, sample, true)
        pos += 2
      }
      offset++
    }

    return new Blob([buffer], { type: 'audio/wav' })

    function setUint16(data) {
      view.setUint16(pos, data, true)
      pos += 2
    }

    function setUint32(data) {
      view.setUint32(pos, data, true)
      pos += 4
    }
  }

  return {
    playBGM,
    stopBGM,
    playCorrect,
    playWrong,
    playComplete,
    playTick,
    toggleMute,
    setVolumeLevel,
    isMuted,
    volume
  }
}
