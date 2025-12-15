import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrophyIcon, 
  XMarkIcon, 
  CheckIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/solid'
import { quizQuestions } from '../utils/quizData'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answeredCorrect, setAnsweredCorrect] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const questions = quizQuestions[difficulty]

  useEffect(() => {
    if (!gameStarted || showResult || selectedAnswer !== null) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, showResult, selectedAnswer, currentQuestion])

  const handleTimeout = () => {
    setAnsweredCorrect(false)
    setStreak(0)
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setAnsweredCorrect(null)
        setTimeLeft(30)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer
    setAnsweredCorrect(isCorrect)
    setShowExplanation(true)
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3)
      setScore(score + 10 + timeBonus)
      setStreak(streak + 1)
      setCorrectAnswers(correctAnswers + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setAnsweredCorrect(null)
        setShowExplanation(false)
        setTimeLeft(30)
      } else {
        setShowResult(true)
      }
    }, 3500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setAnsweredCorrect(null)
    setTimeLeft(30)
    setStreak(0)
    setGameStarted(false)
    setShowExplanation(false)
    setCorrectAnswers(0)
  }

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
    setGameStarted(true)
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <TrophyIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 text-brutal-warning" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase mb-4">
            KUIS ALGORITMA
          </h1>
          <p className="text-lg sm:text-xl font-bold uppercase tracking-wide opacity-80">
            Uji pengetahuan algoritma kamu!
          </p>
        </motion.div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {[
            { id: 'easy', name: 'MUDAH', desc: 'Untuk pemula', color: 'bg-brutal-success', icon: StarIcon },
            { id: 'medium', name: 'SEDANG', desc: 'Level menengah', color: 'bg-brutal-warning', icon: FireIcon },
            { id: 'hard', name: 'SULIT', desc: 'Tantangan ahli', color: 'bg-brutal-danger', icon: TrophyIcon }
          ].map((level, index) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => startGame(level.id)}
              className={`card-brutal ${level.color} text-white p-6 text-left hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase mb-2">
                    {level.name}
                  </h3>
                  <p className="text-sm sm:text-base font-bold uppercase opacity-90">
                    {level.desc}
                  </p>
                </div>
                <level.icon className="w-12 h-12" />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 mt-8 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
            <LightBulbIcon className="w-6 h-6 text-brutal-warning" />
            CARA BERMAIN:
          </h3>
          <ul className="space-y-2 font-bold uppercase text-sm">
            <li>✓ Jawab pertanyaan dalam 30 detik</li>
            <li>✓ Bangun streak untuk bonus poin</li>
            <li>✓ Jawaban lebih cepat = lebih banyak poin</li>
            <li>✓ Dapatkan {questions.length} pertanyaan per putaran</li>
            <li>✓ Lihat penjelasan setelah menjawab</li>
          </ul>
        </motion.div>
      </div>
    )
  }

  if (showResult) {
    const maxScore = questions.length * 20
    const percentage = Math.round((score / maxScore) * 100)
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8 text-center"
        >
          <TrophyIcon className={`w-24 h-24 mx-auto mb-6 ${
            percentage >= 80 ? 'text-brutal-success' : 
            percentage >= 60 ? 'text-brutal-warning' : 
            'text-brutal-danger'
          }`} />
          
          <h2 className="text-4xl sm:text-5xl font-black uppercase mb-6">
            {percentage >= 80 ? 'LUAR BIASA!' : 
             percentage >= 60 ? 'BAGUS SEKALI!' : 
             'TERUS BELAJAR!'}
          </h2>

          <p className="text-lg font-bold uppercase mb-8 opacity-80">
            {percentage >= 80 ? '🎉 Kamu menguasai algoritma!' : 
             percentage >= 60 ? '👍 Pemahaman yang baik!' : 
             '📚 Jangan menyerah, terus berlatih!'}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-brutal bg-brutal-primary text-white p-4">
              <div className="text-3xl sm:text-4xl font-black">{score}</div>
              <div className="text-xs sm:text-sm font-bold uppercase">Skor</div>
            </div>
            <div className="card-brutal bg-brutal-success text-white p-4">
              <div className="text-3xl sm:text-4xl font-black">{percentage}%</div>
              <div className="text-xs sm:text-sm font-bold uppercase">Akurasi</div>
            </div>
            <div className="card-brutal bg-brutal-warning text-white p-4">
              <div className="text-3xl sm:text-4xl font-black">{correctAnswers}/{questions.length}</div>
              <div className="text-xs sm:text-sm font-bold uppercase">Benar</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="btn-brutal bg-brutal-primary text-white px-8 py-4 text-lg font-black uppercase hover:scale-105 transition-transform"
            >
              <ArrowPathIcon className="w-6 h-6 inline-block mr-2" />
              MAIN LAGI
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-brutal bg-brutal-secondary text-white px-8 py-4 text-lg font-black uppercase hover:scale-105 transition-transform"
            >
              KEMBALI
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-brutal bg-brutal-primary text-white p-3 text-center">
          <div className="text-2xl font-black">{score}</div>
          <div className="text-xs font-bold uppercase">Skor</div>
        </div>
        <div className="card-brutal bg-brutal-warning text-white p-3 text-center">
          <ClockIcon className="w-6 h-6 mx-auto mb-1" />
          <div className="text-2xl font-black">{timeLeft}d</div>
        </div>
        <div className="card-brutal bg-brutal-danger text-white p-3 text-center">
          <FireIcon className="w-6 h-6 mx-auto mb-1" />
          <div className="text-2xl font-black">{streak}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold uppercase">Pertanyaan {currentQuestion + 1}/{questions.length}</span>
          <span className="text-sm font-bold uppercase">
            {difficulty === 'easy' ? 'MUDAH' : difficulty === 'medium' ? 'SEDANG' : 'SULIT'}
          </span>
        </div>
        <div className="h-4 border-3 border-black dark:border-brutal-bg bg-brutal-bg dark:bg-brutal-dark">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brutal-primary"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 sm:p-8 mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-black uppercase mb-6 leading-tight">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correctAnswer
              const showFeedback = selectedAnswer !== null

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-left font-bold uppercase border-3 transition-all ${
                    showFeedback && isCorrect
                      ? 'bg-brutal-success text-white border-brutal-success'
                      : showFeedback && isSelected && !isCorrect
                      ? 'bg-brutal-danger text-white border-brutal-danger'
                      : 'bg-white dark:bg-brutal-dark border-black dark:border-brutal-bg hover:bg-brutal-primary hover:text-white'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{answer}</span>
                    {showFeedback && isCorrect && (
                      <CheckIcon className="w-6 h-6" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XMarkIcon className="w-6 h-6" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback Message with Explanation */}
      <AnimatePresence>
        {answeredCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className={`card-brutal p-4 text-center ${
              answeredCorrect 
                ? 'bg-brutal-success text-white' 
                : 'bg-brutal-danger text-white'
            }`}>
              <p className="text-lg font-black uppercase">
                {answeredCorrect 
                  ? `🎉 BENAR! +${10 + Math.floor(timeLeft / 3)} POIN` 
                  : `❌ SALAH! JAWABAN YANG BENAR: ${question.answers[question.correctAnswer]}`
                }
              </p>
              {answeredCorrect && streak > 1 && (
                <p className="text-sm font-bold uppercase mt-1">
                  🔥 STREAK {streak}X!
                </p>
              )}
            </div>
            
            {showExplanation && question.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4"
              >
                <div className="flex items-start gap-3">
                  <LightBulbIcon className="w-6 h-6 text-brutal-warning flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black uppercase text-sm mb-2">PENJELASAN:</h4>
                    <p className="text-sm font-medium leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
