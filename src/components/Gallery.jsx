import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react'
import { useFetchPhotos } from '../hooks/useFetchPhotos'
import {
  favouritesReducer,
  getInitialFavourites,
  FAVOURITES_STORAGE_KEY,
} from '../reducers/favouritesReducer'
import { SearchBar } from './SearchBar'
import { PhotoCard } from './PhotoCard'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'

export function Gallery() {
  // Requirement 6: Custom hook provides photos, loading, error
  const { photos, loading, error } = useFetchPhotos()

  // Requirement 5: Manage favourites using useReducer with localStorage persistence
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    getInitialFavourites
  )

  // Persist favourites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites))
    } catch (err) {
      console.error('Failed to save favourites to localStorage:', err)
    }
  }, [favourites])

  // Search input state
  const [searchTerm, setSearchTerm] = useState('')

  // Requirement 7: useCallback on the search filter handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  // Action dispatcher to toggle favourite
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id })
  }, [])

  // Requirement 7: useMemo to compute filtered photos list by author in real-time
  const filteredPhotos = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase()
    if (!trimmed) {
      return photos
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    )
  }, [photos, searchTerm])

  return (
    <div className="space-y-8">
      {/* Search Filter Section */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {/* Search Summary Meta */}
        {!loading && !error && (
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredPhotos.length}</strong> of{' '}
              {photos.length} photos
            </span>
            <span>
              Favourites saved: <strong className="text-red-500">{favourites.length}</strong>
            </span>
          </div>
        )}
      </section>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && <ErrorMessage message={error} />}

      {/* Photo Grid */}
      {!loading && !error && (
        <>
          {filteredPhotos.length > 0 ? (
            /* Requirement 3: Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={favourites.includes(photo.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          ) : (
            /* Empty state for search */
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-slate-800">No photos found</h4>
              <p className="text-sm text-slate-500 mt-1">
                No photos match the author name "{searchTerm}". Try another search term.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Clear search filter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
