'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { setTheme } from '@/lib/slices/themeSlice'

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      dispatch(setTheme(savedTheme === 'dark'))
    }
  }, [dispatch])

  return <>{children}</>
}