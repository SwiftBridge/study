'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, STUDY_ABI } from '../contracts/Study'
import { formatDistanceToNow } from 'date-fns'

export default function NotesSection({ notes, entryFee, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = async (e) => {
    e.preventDefault()

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: STUDY_ABI,
      functionName: 'addNote',
      args: [title, content, tags],
      value: entryFee,
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setTitle('')
      setContent('')
      setTags('')
      setShowForm(false)
      refetch()
    }, 2000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <h2 className="text-2xl font-bold text-white">Study Notes</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          {showForm ? 'Cancel' : '+ Add Note'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-900 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Note Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Hooks Summary"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write your study notes here..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., react, javascript, hooks"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
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
              {!isPending && !isConfirming && 'Add Note'}
            </button>
          </div>

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 text-green-400 px-4 py-3 rounded-lg">
              Note added successfully!
            </div>
          )}
        </form>
      )}

      {/* Display notes */}
      {!notes || notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-gray-400">No study notes yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "+ Add Note" to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...notes].reverse().map((note) => (
            <div
              key={note.id.toString()}
              className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-primary-600 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-3">{note.title}</h3>

              <div className="text-gray-300 mb-4 whitespace-pre-wrap break-words">
                {note.content}
              </div>

              {note.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-900/30 border border-primary-700 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-400">
                Added {formatDistanceToNow(new Date(Number(note.timestamp) * 1000), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
