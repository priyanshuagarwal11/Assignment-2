import React from 'react'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading photos"
      />
      <p className="mt-4 text-sm font-medium text-slate-600">Loading photos from Picsum API...</p>
    </div>
  )
}
