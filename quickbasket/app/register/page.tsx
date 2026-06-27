'use client'
import React, { useState } from 'react'
import Welcome from '@/components/Welcome';
import RegisterForm from '@/components/RegisterForm';


const RegisterPage = () => {
    const [step, setStep] = useState(1);
  return (
    <div>
      {step === 1 ? <Welcome nextStep={setStep}/> : <RegisterForm prevStep={setStep} initialIsLogin={false} />}
       
    </div>
  )
}

export default RegisterPage;