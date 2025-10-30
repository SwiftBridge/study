'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, STUDY_ABI } from '../contracts/Study'
import { formatDistanceToNow } from 'date-fns'

export default function AchievementsSection({ achievements, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [certificateUrl, setCertificateUrl] = useState('')

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'addAchievement',
      args: [title, description, certificateUrl],
      value: entryFee,
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setTitle('')
      setDescription('')
      setCertificateUrl('')
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Achievement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Achievement Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Developer Certification"
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
              placeholder="Brief description of your achievement..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Certificate URL</label>
            <input
              type="url"
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
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
              {!isPending && !isConfirming && 'Add Achievement'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Achievement added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display achievements */}
      {!achievements || achievements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-gray-400">No achievements yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Add Achievement" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...achievements].reverse().map((achievement) => (
            <div
              key={achievement.id.toString()}
              className="bg-gradient-to-br from-yellow-900/20 via-gray-900 to-gray-900 p-6 rounded-lg border border-yellow-700/50 hover:border-yellow-600 transition-colors"
            >
              <div className="text-4xl mb-3 text-center">🏆</div>

              <h3 className="text-lg font-bold text-white text-center mb-3">
                {achievement.title}
              </h3>

              {achievement.description && (
                <p className="text-gray-300 text-sm mb-4 text-center">
                  {achievement.description}
                </p>
              )}

              {achievement.certificateUrl && (
                <div className="flex justify-center mb-4">
                  <a
                    href={achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-400 text-sm font-semibold flex items-center gap-2"
                  >
                    View Certificate
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              <div className="text-xs text-gray-400 text-center">
                Earned {formatDistanceToNow(new Date(Number(achievement.timestamp) * 1000), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}