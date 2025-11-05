"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RippleButton } from "@/components/ui/ripple-button"
import { ArrowLeftRight } from "lucide-react"

interface Step1ExchangeProps {
  boAmount: number
  usdtAmount: number
  setBoAmount: (amount: number) => void
  setUsdtAmount: (amount: number) => void
  exchangeRate: number
  calculateCommissionBO: (bo: number) => number
  calculateCommissionUSDT: (bo: number) => number
  calculateReceiveUSDT: (usdt: number, bo: number) => number
  onNext: () => void
}

export default function Step1Exchange({
  boAmount,
  usdtAmount,
  setBoAmount,
  setUsdtAmount,
  exchangeRate,
  calculateCommissionBO,
  calculateCommissionUSDT,
  calculateReceiveUSDT,
  onNext,
}: Step1ExchangeProps) {
  const handleBoChange = (value: string) => {
    const bo = Number.parseFloat(value) || 0
    setBoAmount(bo)
    setUsdtAmount(Number((bo / exchangeRate).toFixed(2)))
  }

  const handleUsdtChange = (value: string) => {
    const usdt = Number.parseFloat(value) || 0
    setUsdtAmount(usdt)
    setBoAmount(Number((usdt * exchangeRate).toFixed(2)))
  }

  const commissionBO = calculateCommissionBO(boAmount)
  const receiveUSDT = calculateReceiveUSDT(usdtAmount, boAmount)

  const isValidAmount = boAmount > 0 && usdtAmount > 0

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">PASO 1 - CAMBIO</CardTitle>
        <CardDescription>Ingresa el monto que deseas intercambiar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exchange Form */}
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="bo-amount" className="text-base font-medium">
                Bolivianos (BO)
              </Label>
              <div className="relative">
                <Input
                  id="bo-amount"
                  type="number"
                  placeholder="0.00"
                  value={boAmount || ""}
                  onChange={(e) => handleBoChange(e.target.value)}
                  className="text-lg h-14 pr-16"
                  step="0.01"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">BO</span>
              </div>
            </div>

            <div className="pb-2">
              <div className="bg-muted rounded-full p-3">
                <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="usdt-amount" className="text-base font-medium">
                Tether (USDT)
              </Label>
              <div className="relative">
                <Input
                  id="usdt-amount"
                  type="number"
                  placeholder="0.00"
                  value={usdtAmount || ""}
                  onChange={(e) => handleUsdtChange(e.target.value)}
                  className="text-lg h-14 pr-16"
                  step="0.01"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  USDT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Details */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tipo de cambio</span>
            <span className="font-semibold">{exchangeRate.toFixed(2)} BO = 1 USDT</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comisión en BO</span>
            <span className="font-semibold">{commissionBO.toFixed(2)} BO</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-base font-medium">Monto a recibir</span>
            <span className="text-lg font-bold text-primary">{receiveUSDT.toFixed(2)} USDT</span>
          </div>
        </div>

        <RippleButton
          onClick={onNext}
          disabled={!isValidAmount}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          Continuar
        </RippleButton>
      </CardContent>
    </Card>
  )
}
