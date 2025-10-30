'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { CONTRACT_ADDRESS, STUDY_ABI } from './contracts/Study'
import CoursesSection from './components/CoursesSection'
import NotesSection from './components/NotesSection'
import AchievementsSection from './components/AchievementsSection'
import GoalsSection from './components/GoalsSection'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  // Read contract data
  const { data: courses, refetch: refetchCourses } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: STUDY_ABI,
    functionName: 'getUserCourses',
    args: address ? [address] : undefined,
  })

  const { data: notes, refetch: refetchNotes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: STUDY_ABI,
    functionName: 'getUserNotes',
    args: address ? [address] : undefined,
  })

  const { data: achievements, refetch: refetchAchievements } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: STUDY_ABI,
    functionName: 'getUserAchievements',
    args: address ? [address] : undefined,
  })

  const { data: goals, refetch: refetchGoals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: STUDY_ABI,
    functionName: 'getUserGoals',
    args: address ? [address] : undefined,
  })

  const { data: entryFee } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: STUDY_ABI,
    functionName: 'entryFee',
  })

  const refetchAll = () => {
    refetchCourses()
    refetchNotes()
    refetchAchievements()
    refetchGoals()
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-card border border-border rounded-lg p-4 md:p-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">Study DApp</h1>
              <p className="text-gray-400 text-sm md:text-base">Track Your Learning Journey, On-Chain Forever</p>
            </div>

            {!isConnected ? (
              <button
                onClick={() => open?.()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full md:w-auto"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-2 rounded-lg font-mono text-sm w-full md:w-auto text-center">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={() => open?.()}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Switch Wallet
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        {!isConnected ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Track Your Learning Journey
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Store your courses, notes, achievements, and learning goals on the blockchain.
              Permanent, verifiable, and owned by you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-white font-bold mb-2">Courses</h3>
                <p className="text-gray-400 text-sm">Track progress and completion</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-white font-bold mb-2">Notes</h3>
                <p className="text-gray-400 text-sm">Store study notes with tags</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-white font-bold mb-2">Achievements</h3>
                <p className="text-gray-400 text-sm">Certificates and milestones</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-white font-bold mb-2">Goals</h3>
                <p className="text-gray-400 text-sm">Set and track learning goals</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <CoursesSection
              courses={courses}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <NotesSection
              notes={notes}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <AchievementsSection
              achievements={achievements}
              entryFee={entryFee}
              refetch={refetchAll}
            />
            <GoalsSection
              goals={goals}
              entryFee={entryFee}
              refetch={refetchAll}
            />
          </div>
        )}
      </div>
    </div>
  )
}
