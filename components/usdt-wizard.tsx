"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Step1Exchange from "./steps/step1-exchange"
import Step2Wallet from "./steps/step2-wallet"
import Step3Payment from "./steps/step3-payment"
import Step4Confirmation from "./steps/step4-confirmation"

export default function UsdtWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [boAmount, setBoAmount] = useState(0)
  const [usdtAmount, setUsdtAmount] = useState(0)
  const [walletAddress, setWalletAddress] = useState("")
  const [email, setEmail] = useState("")
  const [isSimulation, setIsSimulation] = useState(false)

  const EXCHANGE_RATE = 13.25
  const COMMISSION_RATE = 0.03

  const calculateCommissionBO = (bo: number) => 0
  const calculateCommissionUSDT = (bo: number) => 0

  const calculateReceiveUSDT = (usdt: number, bo: number) => Number(usdt.toFixed(2))

  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleRealPayment = () => {
    setIsSimulation(false)
    nextStep()
  }

  const handleSimulatedPayment = () => {
    setIsSimulation(true)
    nextStep()
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            Compra USDT fácil y seguro
          </h1>
          <p className="text-muted-foreground text-lg">Intercambia Bolivianos por USDT en minutos</p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors ${step < currentStep ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
          >
            {currentStep === 1 && (
              <Step1Exchange
                boAmount={boAmount}
                usdtAmount={usdtAmount}
                setBoAmount={setBoAmount}
                setUsdtAmount={setUsdtAmount}
                exchangeRate={EXCHANGE_RATE}
                calculateCommissionBO={calculateCommissionBO}
                calculateCommissionUSDT={calculateCommissionUSDT}
                calculateReceiveUSDT={calculateReceiveUSDT}
                onNext={nextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2Wallet
                walletAddress={walletAddress}
                setWalletAddress={setWalletAddress}
                email={email}
                setEmail={setEmail}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3Payment
                boAmount={boAmount}
                usdtAmount={usdtAmount}
                exchangeRate={EXCHANGE_RATE}
                calculateCommissionBO={calculateCommissionBO}
                calculateCommissionUSDT={calculateCommissionUSDT}
                calculateReceiveUSDT={calculateReceiveUSDT}
                onNext={handleRealPayment}
                onSimulate={handleSimulatedPayment}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <Step4Confirmation
                boAmount={boAmount}
                usdtAmount={usdtAmount}
                exchangeRate={EXCHANGE_RATE}
                calculateCommissionBO={calculateCommissionBO}
                calculateCommissionUSDT={calculateCommissionUSDT}
                calculateReceiveUSDT={calculateReceiveUSDT}
                isSimulation={isSimulation}
                onFinish={() => {
                  setCurrentStep(1)
                  setBoAmount(0)
                  setUsdtAmount(0)
                  setWalletAddress("")
                  setEmail("")
                  setIsSimulation(false)
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
