"use client"
import { ThemeProvider } from 'next-themes'
import React from 'react'

function Providers() {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'></ThemeProvider>
  )
}

export default Providers
