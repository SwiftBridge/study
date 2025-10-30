'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, STUDY_ABI } from '../contracts/Study'
import { formatDistanceToNow } from 'date-fns'

export default function CoursesSection({ courses, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('')
  const [instructor, setInstructor] = useState('')
  const [progress, setProgress] = useState(0)
  const { address } = useAccount()

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'addCourse',
      args: [title, platform, instructor, Number(progress)],
      value: entryFee,
    })
  }

  const handleUpdateProgress = (courseId, newProgress) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'updateCourseProgress',
      args: [courseId, Number(newProgress)],
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setTitle('')
      setPlatform('')
      setInstructor('')
      setProgress(0)
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📖</span>
          <h2 className="text-2xl font-bold text-white">Courses</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Course Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Platform</label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="e.g., Udemy, Coursera"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Instructor</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
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
              {!isPending && !isConfirming && 'Add Course'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Course added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display courses */}
      {!courses || courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-gray-400">No courses added yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Add Course" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...courses].reverse().map((course) => {
            const isOwner = address && course.owner.toLowerCase() === address.toLowerCase()

            return (
              <div
                key={course.id.toString()}
                className={`bg-gray-900 p-6 rounded-lg border ${
                  course.completed
                    ? 'border-green-700 bg-gradient-to-br from-green-900/20 to-gray-900'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white flex-1">{course.title}</h3>
                  {course.completed && (
                    <span className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-sm ml-3">
                      ✓ Complete
                    </span>
                  )}
                </div>

                {(course.platform || course.instructor) && (
                  <div className="mb-4 space-y-1">
                    {course.platform && (
                      <p className="text-primary-500 text-sm">📚 {course.platform}</p>
                    )}
                    {course.instructor && (
                      <p className="text-gray-400 text-sm">👨‍🏫 {course.instructor}</p>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-primary-500 font-bold">{course.progress.toString()}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        course.completed ? 'bg-green-500' : 'bg-primary-600'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Update Progress (Only for owner) */}
                {isOwner && !course.completed && (
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={course.progress.toString()}
                      onChange={(e) => handleUpdateProgress(course.id, e.target.value)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      disabled={isPending || isConfirming}
                    />
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  Added {formatDistanceToNow(new Date(Number(course.timestamp) * 1000), { addSuffix: true })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
