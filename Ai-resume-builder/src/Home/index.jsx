'use client'

import Header from "@/components/custom/header"
import {  UserButton } from "@clerk/clerk-react"

const Homepage = () => {
  return (
    <div>
      <Header />
      <UserButton />
    </div>
  )
}

export default Homepage 