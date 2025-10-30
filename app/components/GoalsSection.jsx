'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, STUDY_ABI } from '../contracts/Study'
import { formatDistanceToNow } from 'date-fns'

export default function GoalsSection({ goals, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const { address } = useAccount()

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const targetTimestamp = new Date(targetDate).getTime() / 1000

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'addGoal',
      args: [title, description, targetTimestamp],
      value: entryFee,
    })
  }

  const handleMarkAchieved = (goalId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'markGoalAchieved',
      args: [goalId],
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setTitle('')
      setDescription('')
      setTargetDate('')
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <h2 className="text-2xl font-bold text-white">Learning Goals</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Goal Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master React Hooks"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What do you want to achieve?"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Target Date *</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-400">
              Fee: <span className="text-primary-500 font-bold">{entryFee ? `${Number(entryFee) / 1e18} ETH` : '...'}</span>
            </p>
            <button
              type="submit"
              disabled={isPending || isConfirming}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isPending && 'Sending...'}
              {isConfirming && 'Confirming...'}
              {!isPending && !isConfirming && 'Add Goal'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Goal added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display goals */}
      {!goals || goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🎯</div>
          <p className="text-gray-400">No learning goals yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Add Goal" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...goals].reverse().map((goal) => {
            const isOwner = address && goal.owner.toLowerCase() === address.toLowerCase()
            const targetDateObj = new Date(Number(goal.targetDate) * 1000)
            const isOverdue = !goal.achieved && targetDateObj < new Date()

            return (
              <div
                key={goal.id.toString()}
                className={`p-6 rounded-lg border ${
                  goal.achieved
                    ? 'bg-gradient-to-br from-green-900/20 to-gray-900 border-green-700'
                    : isOverdue
                    ? 'bg-gradient-to-br from-red-900/20 to-gray-900 border-red-700'
                    : 'bg-gray-900 border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {isOwner && !goal.achieved && (
                      <button
                        onClick={() => handleMarkAchieved(goal.id)}
                        disabled={isPending || isConfirming}
                        className="mt-1 text-2xl hover:scale-125 transition-transform"
                      >
                        ⬜
                      </button>
                    )}
                    {(!isOwner || goal.achieved) && (
                      <span className="mt-1 text-2xl">
                        {goal.achieved ? '✅' : '⬜'}
                      </span>
                    )}
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl mb-2 ${goal.achieved ? 'line-through text-gray-500' : 'text-white'}`}>
                        {goal.title}
                      </h3>
                    </div>
                  </div>
                  {goal.achieved && (
                    <span className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-sm ml-3">
                      Achieved
                    </span>
                  )}
                  {isOverdue && !goal.achieved && (
                    <span className="bg-red-900/30 border border-red-700 text-red-400 px-3 py-1 rounded-full text-sm ml-3">
                      Overdue
                    </span>
                  )}
                </div>

                {goal.description && (
                  <p className={`mb-4 ml-11 ${goal.achieved ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                    {goal.description}
                  </p>
                )}

                <div className="ml-11 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Target:</span>
                    <span className={isOverdue && !goal.achieved ? 'text-red-400 font-semibold' : 'text-primary-500 font-semibold'}>
                      {targetDateObj.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400">
                    Set {formatDistanceToNow(new Date(Number(goal.timestamp) * 1000), { addSuffix: true })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
