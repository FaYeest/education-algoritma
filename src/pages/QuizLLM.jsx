import { useState, useEffect } from 'react'
import { 
  TrophyIcon, 
  XMarkIcon, 
  CheckIcon,
  ArrowPathIcon,
  ClockIcon,
  FireIcon,
  LightBulbIcon,
  StarIcon,
  SparklesIcon,
  CalendarIcon,
  CpuChipIcon,
  HandThumbUpIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/solid'
import { useSoundManager } from '../hooks/useSoundManager'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function QuizLLM() {
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
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [answersHistory, setAnswersHistory] = useState([]) // Track all answers
  const [showReview, setShowReview] = useState(false) // Toggle review mode

  // Sound Manager
  const sound = useSoundManager()

  // Sound effects for completion and timer
  useEffect(() => {
    if (showResult) {
      sound.stopBGM()
      sound.playComplete()
    }
  }, [showResult, sound])

  useEffect(() => {
    if (!gameStarted || showResult || selectedAnswer !== null) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        // Play tick sound in last 10 seconds
        if (prev <= 10 && prev > 0) {
          sound.playTick()
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, showResult, selectedAnswer, currentQuestion, sound])

  const fetchQuestions = async (selectedDifficulty) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_URL}/api/quiz/${selectedDifficulty}?count=10`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }
      
      const data = await response.json()
      
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions)
        setGameStarted(true)
      } else {
        throw new Error('No questions available')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching questions:', err)
    } finally {
      setLoading(false)
    }
  }

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
    
    // Play sound based on answer
    if (isCorrect) {
      sound.playCorrect()
    } else {
      sound.playWrong()
    }
    
    // Save answer to history
    const answerRecord = {
      question: questions[currentQuestion],
      userAnswer: answerIndex,
      isCorrect: isCorrect,
      timeSpent: 30 - timeLeft,
      pointsEarned: isCorrect ? 10 + Math.floor(timeLeft / 3) : 0
    }
    setAnswersHistory([...answersHistory, answerRecord])
    
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
    setQuestions([])
    setError(null)
    setAnswersHistory([])
    setShowReview(false)
    sound.stopBGM() // Stop background music
  }

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
    fetchQuestions(selectedDifficulty)
    sound.playBGM() // Start background music
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-brutal-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-black uppercase">Memuat Pertanyaan...</h2>
          <p className="text-sm font-bold uppercase opacity-70 mt-2">Menggunakan AI untuk generate pertanyaan unik</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card-brutal bg-brutal-danger text-white p-8 text-center">
          <XMarkIcon className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase mb-4">Error</h2>
          <p className="text-lg font-bold mb-6">{error}</p>
          <button
            onClick={resetQuiz}
            className="btn-brutal bg-white text-brutal-danger px-6 py-3 font-black uppercase"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8">
          <TrophyIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 text-brutal-warning" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase mb-4">
            KUIS ALGORITMA AI
          </h1>
          <p className="text-lg sm:text-xl font-bold uppercase tracking-wide opacity-80">
            Pertanyaan baru setiap hari dengan AI!
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {[
            { id: 'easy', name: 'MUDAH', desc: 'Untuk pemula', color: 'bg-brutal-success', icon: StarIcon },
            { id: 'medium', name: 'SEDANG', desc: 'Level menengah', color: 'bg-brutal-warning', icon: FireIcon },
            { id: 'hard', name: 'SULIT', desc: 'Tantangan ahli', color: 'bg-brutal-danger', icon: TrophyIcon }
          ].map((level) => (
            <button
              key={level.id}
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
            </button>
          ))}
        </div>

        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 mt-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
            <LightBulbIcon className="w-6 h-6 text-brutal-warning" />
            FITUR BARU:
          </h3>
          <ul className="space-y-2 font-bold uppercase text-sm">
            <li className="flex items-center gap-2">
              <CpuChipIcon className="w-5 h-5 text-brutal-primary" />
              Pertanyaan di-generate oleh AI
            </li>
            <li className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brutal-success" />
              Pertanyaan baru setiap hari
            </li>
            <li className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-brutal-warning" />
              Random selection - tidak ada pertanyaan yang sama
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-brutal-secondary" />
              Jawab dalam 30 detik
            </li>
            <li className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-brutal-danger" />
              Bangun streak untuk bonus poin
            </li>
            <li className="flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-brutal-warning" />
              Penjelasan detail setiap jawaban
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (showResult) {
    const maxScore = questions.length * 20
    const percentage = Math.round((score / maxScore) * 100)
    
    // Review Mode
    if (showReview) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowReview(false)}
              className="btn-brutal bg-brutal-secondary text-white px-6 py-3 font-black uppercase"
            >
              ← KEMBALI KE HASIL
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-6 flex items-center gap-3">
            <AcademicCapIcon className="w-10 h-10 text-brutal-primary" />
            REVIEW JAWABAN
          </h2>

          <div className="space-y-6">
            {answersHistory.map((record, index) => {
              const question = record.question
              const userAnswer = record.userAnswer
              const isCorrect = record.isCorrect

              return (
                <div key={index} className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6">
                  {/* Question Number and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-lg">
                      PERTANYAAN {index + 1}
                    </span>
                    <div className={`px-4 py-2 font-black text-sm ${
                      isCorrect 
                        ? 'bg-brutal-success text-white' 
                        : 'bg-brutal-danger text-white'
                    } border-3 border-black`}>
                      {isCorrect ? '✓ BENAR' : '✗ SALAH'}
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-lg font-bold mb-4 leading-relaxed">
                    {question.question}
                  </h3>

                  {/* Answers */}
                  <div className="space-y-3 mb-4">
                    {question.answers.map((answer, ansIndex) => {
                      const isUserAnswer = ansIndex === userAnswer
                      const isCorrectAnswer = ansIndex === question.correctAnswer
                      
                      return (
                        <div
                          key={ansIndex}
                          className={`p-4 border-3 font-bold ${
                            isCorrectAnswer
                              ? 'bg-brutal-success text-white border-brutal-success'
                              : isUserAnswer && !isCorrect
                              ? 'bg-brutal-danger text-white border-brutal-danger'
                              : 'bg-white dark:bg-brutal-dark border-black dark:border-brutal-bg'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{answer}</span>
                            {isCorrectAnswer && (
                              <CheckIcon className="w-6 h-6" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XMarkIcon className="w-6 h-6" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4 text-sm font-bold uppercase">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>{record.timeSpent}d digunakan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon className="w-5 h-5 text-brutal-warning" />
                      <span>+{record.pointsEarned} poin</span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="card-brutal bg-brutal-warning bg-opacity-10 p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <LightBulbIcon className="w-6 h-6 text-brutal-warning flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-black uppercase text-sm mb-2">PENJELASAN:</h4>
                        <p className="text-sm font-medium leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowReview(false)}
              className="btn-brutal bg-brutal-primary text-white px-8 py-4 text-lg font-black uppercase hover:scale-105 transition-transform flex-1"
            >
              LIHAT HASIL
            </button>
            <button
              onClick={resetQuiz}
              className="btn-brutal bg-brutal-secondary text-white px-8 py-4 text-lg font-black uppercase hover:scale-105 transition-transform flex-1"
            >
              <ArrowPathIcon className="w-6 h-6 inline-block mr-2" />
              MAIN LAGI
            </button>
          </div>
        </div>
      )
    }
    
    // Results Screen
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-8 text-center">
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

          <p className="text-lg font-bold uppercase mb-8 opacity-80 flex items-center justify-center gap-2">
            {percentage >= 80 ? (
              <>
                <SparklesIcon className="w-6 h-6 text-brutal-success" />
                Kamu menguasai algoritma!
              </>
            ) : percentage >= 60 ? (
              <>
                <HandThumbUpIcon className="w-6 h-6 text-brutal-warning" />
                Pemahaman yang baik!
              </>
            ) : (
              <>
                <BookOpenIcon className="w-6 h-6 text-brutal-secondary" />
                Jangan menyerah, terus berlatih!
              </>
            )}
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

          {/* Review Button */}
          <button
            onClick={() => setShowReview(true)}
            className="btn-brutal bg-brutal-warning text-white px-8 py-4 text-lg font-black uppercase hover:scale-105 transition-transform w-full mb-4 flex items-center justify-center gap-3"
          >
            <AcademicCapIcon className="w-6 h-6" />
            REVIEW JAWABAN
          </button>

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
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sound Toggle Button */}
      {gameStarted && (
        <button
          onClick={sound.toggleMute}
          className="fixed top-20 right-4 z-50 p-4 border-4 border-black dark:border-brutal-bg bg-brutal-warning hover:bg-brutal-primary transition-colors shadow-brutal hover:scale-110 transform transition-transform"
          title={sound.isMuted ? "Nyalakan Suara" : "Matikan Suara"}
        >
          {sound.isMuted ? (
            <SpeakerXMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <SpeakerWaveIcon className="w-6 h-6 text-white" />
          )}
        </button>
      )}

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

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold uppercase">Pertanyaan {currentQuestion + 1}/{questions.length}</span>
          <span className="text-sm font-bold uppercase">
            {difficulty === 'easy' ? 'MUDAH' : difficulty === 'medium' ? 'SEDANG' : 'SULIT'}
          </span>
        </div>
        <div className="h-4 border-3 border-black dark:border-brutal-bg bg-brutal-bg dark:bg-brutal-dark">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-brutal-primary transition-all duration-300"
          />
        </div>
      </div>

      <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-6 sm:p-8 mb-6">
        <h3 className="text-xl sm:text-2xl font-black uppercase mb-6 leading-tight">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctAnswer
            const showFeedback = selectedAnswer !== null

            return (
              <button
                key={index}
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
              </button>
            )
          })}
        </div>
      </div>

      {answeredCorrect !== null && (
        <div className="space-y-4">
          <div className={`card-brutal p-4 text-center ${
            answeredCorrect 
              ? 'bg-brutal-success text-white' 
              : 'bg-brutal-danger text-white'
          }`}>
            <p className="text-lg font-black uppercase flex items-center justify-center gap-2">
              {answeredCorrect ? (
                <>
                  <CheckIcon className="w-6 h-6" />
                  BENAR! +{10 + Math.floor(timeLeft / 3)} POIN
                </>
              ) : (
                <>
                  <XMarkIcon className="w-6 h-6" />
                  SALAH! JAWABAN YANG BENAR: {question.answers[question.correctAnswer]}
                </>
              )}
            </p>
            {answeredCorrect && streak > 1 && (
              <p className="text-sm font-bold uppercase mt-1 flex items-center justify-center gap-2">
                <FireIcon className="w-5 h-5" />
                STREAK {streak}X!
              </p>
            )}
          </div>
          
          {showExplanation && question.explanation && (
            <div className="card-brutal bg-brutal-bg dark:bg-brutal-dark p-4">
              <div className="flex items-start gap-3">
                <LightBulbIcon className="w-6 h-6 text-brutal-warning flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-black uppercase text-sm mb-2">PENJELASAN:</h4>
                  <p className="text-sm font-medium leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
