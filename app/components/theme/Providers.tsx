"use client"
import { ThemeProvider } from 'next-theme'
import React from 'react'

function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'></ThemeProvider>
  )
}

export default Providers
