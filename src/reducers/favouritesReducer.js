export const FAVOURITES_STORAGE_KEY = 'photo_gallery_favourites'

/**
 * Reads initial favourites from localStorage safely.
 * Returns an array of photo IDs.
 */
export const getInitialFavourites = () => {
  try {
    const saved = localStorage.getItem(FAVOURITES_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (err) {
    console.error('Failed to parse favourites from localStorage:', err)
    return []
  }
}

/**
 * Reducer function for managing favourites state.
 *
 * Supported action:
 * - TOGGLE_FAVOURITE: Adds the photo ID if not present, or removes it if already present.
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = action.payload
      if (state.includes(id)) {
        return state.filter((favId) => favId !== id)
      } else {
        return [...state, id]
      }
    }
    default:
      return state
  }
}
