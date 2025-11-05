"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RippleButton } from "@/components/ui/ripple-button"
import { CheckCircle2, Clock } from "lucide-react"

interface Step4ConfirmationProps {
  boAmount: number
  usdtAmount: number
  exchangeRate: number
  calculateCommissionBO: (bo: number) => number
  calculateReceiveUSDT: (usdt: number, bo: number) => number
  isSimulation: boolean
  onFinish: () => void
}

export default function Step4Confirmation({
  boAmount,
  usdtAmount,
  exchangeRate,
  calculateCommissionBO,
  calculateReceiveUSDT,
  isSimulation,
  onFinish,
}: Step4ConfirmationProps) {
  const receiveUSDT = calculateReceiveUSDT(usdtAmount, boAmount)
  const commissionBO = calculateCommissionBO(boAmount)

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">GRACIAS POR REALIZAR TU PAGO</CardTitle>
        <CardDescription>Tu transacción está siendo procesada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSimulation ? (
          // Simulation: Success message with checkmark
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4 mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">¡Pago recibido!</h3>
            <p className="text-muted-foreground max-w-md text-balance">
              Los USDT se enviarán a tu billetera y recibirás un email de confirmación.
            </p>
          </div>
        ) : (
          // Real payment: Pending verification message
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-4 mb-4">
              <Clock className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-muted-foreground max-w-md text-balance">
              En cuanto recibamos la confirmación del banco y tu pago haya sido verificado, los USDT se enviarán a tu
              billetera y recibirás un email de confirmación.
            </p>
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-base mb-3">Resumen final de la operación</h3>
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

        <RippleButton onClick={onFinish} className="w-full h-12 text-base font-semibold" size="lg">
          Finalizar
        </RippleButton>
      </CardContent>
    </Card>
  )
}
