"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RippleButton } from "@/components/ui/ripple-button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface Step3PaymentProps {
  boAmount: number
  usdtAmount: number
  exchangeRate: number
  calculateCommissionBO: (bo: number) => number
  calculateReceiveUSDT: (usdt: number, bo: number) => number
  onNext: () => void
  onSimulate: () => void
  onBack: () => void
}

export default function Step3Payment({
  boAmount,
  usdtAmount,
  exchangeRate,
  calculateCommissionBO,
  calculateReceiveUSDT,
  onNext,
  onSimulate,
  onBack,
}: Step3PaymentProps) {
  const receiveUSDT = calculateReceiveUSDT(usdtAmount, boAmount)
  const commissionBO = calculateCommissionBO(boAmount)

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">PASO 3 - PAGO</CardTitle>
        <CardDescription>Escanea el código QR para realizar el pago</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-2 rounded-2xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QR%20Simple-H34b5T6agsSn2fKYrKcJp0N27hufCo.jpeg"
              alt="QR Code de pago"
              width={280}
              height={280}
              className="w-full max-w-[280px] h-auto"
            />
          </div>
          <button
            onClick={onSimulate}
            className="mt-4 text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
          >
            simular pago recibido
          </button>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-base mb-3">Detalle de la operación</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monto pagado (BO)</span>
            <span className="font-semibold">{boAmount.toFixed(2)} BO</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tipo de cambio</span>
            <span className="font-semibold">{exchangeRate.toFixed(2)} BO = 1 USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comisión en BO</span>
            <span className="font-semibold">{commissionBO.toFixed(2)} BO</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monto recibido (USDT)</span>
            <span className="text-lg font-bold text-primary">{receiveUSDT.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Red</span>
            <span className="font-semibold">Polygon</span>
          </div>
        </div>

        <div className="flex gap-3">
          <RippleButton variant="outline" onClick={onBack} className="flex-1 h-12 text-base bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </RippleButton>
          <RippleButton onClick={onNext} className="flex-1 h-12 text-base font-semibold">
            He realizado el pago
          </RippleButton>
        </div>
      </CardContent>
    </Card>
  )
}
