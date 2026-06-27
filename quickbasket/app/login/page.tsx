'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/RegisterForm'

const LoginPage = () => {
  const router = useRouter()
  const goHome = (s: number) => router.push('/')

  return (
    <div>
      <RegisterForm prevStep={goHome} initialIsLogin={true} />
    </div>
  )
}

export default LoginPage
