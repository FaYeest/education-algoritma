# Quick Integration Snippets

Copy-paste these code blocks to your Quiz components.

## 1. Add Imports (Top of file)

```javascript
// Add these imports at the top
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { useSoundManager } from '../hooks/useSoundManager'
```

## 2. Initialize Sound Manager (In component)

```javascript
export default function QuizLLM() {
  // ... existing state declarations ...
  
  // ADD THIS LINE
  const sound = useSoundManager()
  
  // ... rest of component ...
}
```

## 3. Sound Toggle Button (Add to JSX)

```jsx
{/* ADD THIS - Floating Sound Button */}
{gameStarted && (
  <button
    onClick={sound.toggleMute}
    className="fixed top-20 right-4 z-50 p-4 border-4 border-black dark:border-brutal-bg bg-brutal-warning hover:bg-brutal-primary transition-colors shadow-brutal hover:scale-110 transform transition-transform"
    title={sound.isMuted ? "Turn Sound On" : "Turn Sound Off"}
  >
    {sound.isMuted ? (
      <SpeakerXMarkIcon className="w-6 h-6 text-white" />
    ) : (
      <SpeakerWaveIcon className="w-6 h-6 text-white" />
    )}
  </button>
)}
```

## 4. Start BGM (In startGame function)

```javascript
const startGame = async (selectedDifficulty) => {
  setDifficulty(selectedDifficulty)
  setGameStarted(true)
  
  // ADD THIS LINE
  sound.playBGM()
  
  await fetchQuestions(selectedDifficulty)
}
```

## 5. Play Answer Sounds (In handleAnswer function)

Find the line where you check if answer is correct, then add:

```javascript
const handleAnswer = (answerIndex) => {
  // ... existing code ...
  
  const isCorrect = answerIndex === questions[currentQuestion].correctAnswer
  setAnsweredCorrect(isCorrect)
  setShowExplanation(true)
  
  // ADD THESE LINES
  if (isCorrect) {
    sound.playCorrect()
  } else {
    sound.playWrong()
  }
  
  // ... rest of function ...
}
```

## 6. Stop BGM & Play Complete Sound (Add useEffect)

```javascript
// ADD THIS EFFECT
useEffect(() => {
  if (showResult) {
    sound.stopBGM()
    sound.playComplete()
  }
}, [showResult, sound])
```

## 7. Stop BGM on Reset (In resetQuiz function)

```javascript
const resetQuiz = () => {
  // ... existing reset code ...
  
  // ADD THIS LINE
  sound.stopBGM()
  
  // ... rest of reset ...
}
```

## 8. Optional: Tick Sound (Modify timer useEffect)

```javascript
useEffect(() => {
  if (!gameStarted || showResult || selectedAnswer !== null) return
  
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        handleTimeout()
        return 0
      }
      
      // ADD THESE LINES - Play tick when time is low
      if (prev <= 10 && prev > 0) {
        sound.playTick()
      }
      
      return prev - 1
    })
  }, 1000)

  return () => clearInterval(timer)
}, [gameStarted, showResult, selectedAnswer, currentQuestion, sound])
```

---

## ✅ Checklist

After integration, verify:

- [ ] Sound button appears when quiz starts
- [ ] BGM plays when quiz starts
- [ ] Correct sound plays on right answer
- [ ] Wrong sound plays on wrong answer
- [ ] Complete sound plays when quiz ends
- [ ] Sound stops when quiz resets
- [ ] Mute button works
- [ ] Preferences persist (refresh page)
- [ ] Tick sound plays at last 10 seconds (optional)

---

## 🎯 Files to Edit

Apply these snippets to:
1. `src/pages/QuizLLM.jsx`
2. `src/pages/Quiz.jsx`

Both files need the same integration!

---

## 🔊 Test Commands

```bash
# Make sure hook file exists
ls src/hooks/useSoundManager.js

# Restart dev server
npm run dev

# Open browser
# Click Start Quiz
# Sound should play!
```

---

**Ready to integrate! Follow the snippets in order.** 🎵
