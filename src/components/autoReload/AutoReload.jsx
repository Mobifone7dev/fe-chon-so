'use client'
import { useEffect } from 'react'

export default function AutoReloadOnChunkError() {
  useEffect(() => {
    const handler = (e) => {
      if (e?.message?.includes('ChunkLoadError')) {
        console.log('Reloading due to chunk error...')
        window.location.reload()
      }
    }
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  return null
}
