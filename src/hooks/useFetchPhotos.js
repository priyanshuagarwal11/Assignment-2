import { useState, useEffect } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

/**
 * Custom hook to fetch photos from Picsum API
 * @returns {{ photos: Array, loading: boolean, error: string | null }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to fetch photos (HTTP status ${response.status})`)
        }
        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while fetching photos.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()

    return () => {
      controller.abort()
    }
  }, [])

  return { photos, loading, error }
}
