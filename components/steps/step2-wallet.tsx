"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RippleButton } from "@/components/ui/ripple-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, ArrowLeft, Info, AlertCircle } from "lucide-react"

interface Step2WalletProps {
  walletAddress: string
  setWalletAddress: (address: string) => void
  email: string
  setEmail: (email: string) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2Wallet({
  walletAddress,
  setWalletAddress,
  email,
  setEmail,
  onNext,
  onBack,
}: Step2WalletProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [walletError, setWalletError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateWalletAddress = (address: string): boolean => {
    if (!address || address.trim() === "") {
      setWalletError("La dirección de billetera es obligatoria.")
      return false
    }

    // Check for whitespace, emojis, or invalid characters
    if (/\s/.test(address)) {
      setWalletError("La dirección no debe contener espacios en blanco.")
      return false
    }

    // Polygon uses Ethereum address format: 0x followed by 40 hex characters
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/

    if (!ethereumAddressRegex.test(address)) {
      setWalletError("Dirección de billetera inválida. Verifique el formato o la red correspondiente.")
      return false
    }

    setWalletError("")
    return true
  }

  const validateEmail = (emailValue: string): boolean => {
    const trimmedEmail = emailValue.trim()

    if (!trimmedEmail) {
      setEmailError("El correo electrónico es obligatorio.")
      return false
    }

    // Standard email regex with proper domain validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError("Correo electrónico inválido. Ingrese un formato válido (usuario@dominio.com).")
      return false
    }

    // Additional check for invalid domains
    const domain = trimmedEmail.split("@")[1]
    if (!domain || domain.length < 3 || !domain.includes(".")) {
      setEmailError("Correo electrónico inválido. Ingrese un formato válido (usuario@dominio.com).")
      return false
    }

    setEmailError("")
    return true
  }

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setWalletAddress(value) // Preserve exact case
    if (value) {
      validateWalletAddress(value)
    } else {
      setWalletError("")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (value) {
      validateEmail(value)
    } else {
      setEmailError("")
    }
  }

  const handleContinue = () => {
    const isWalletValid = validateWalletAddress(walletAddress)
    const isEmailValid = validateEmail(email)

    if (isWalletValid && isEmailValid) {
      // Trim email before saving
      setEmail(email.trim())
      onNext()
    }
  }

  const isFormValid = walletAddress && email && !walletError && !emailError

  const handleScanQR = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)

    try {
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = async () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const jsQR = (await import("jsqr")).default
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          setWalletAddress(code.data)
          validateWalletAddress(code.data)
        } else {
          alert("No se pudo detectar un código QR en la imagen")
        }

        URL.revokeObjectURL(imageUrl)
        setIsScanning(false)
      }

      img.src = imageUrl
    } catch (error) {
      console.error("Error scanning QR:", error)
      setIsScanning(false)
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">PASO 2 - ENVÍO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="wallet-address" className="text-base font-medium">
            Dirección de billetera
          </Label>
          <div className="flex gap-2">
            <Input
              id="wallet-address"
              type="text"
              placeholder="Ej. 0x1234abcd..."
              value={walletAddress}
              onChange={handleWalletChange}
              className={`text-base h-12 font-mono ${walletError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              required
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <RippleButton
              variant="outline"
              size="icon"
              onClick={handleScanQR}
              disabled={isScanning}
              className="h-12 w-12 shrink-0 bg-transparent"
            >
              <QrCode className="w-5 h-5" />
            </RippleButton>
          </div>
          <p className="text-sm text-muted-foreground">Ingresa la dirección de tu billetera USDT</p>
          {walletError && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{walletError}</span>
            </div>
          )}
          {isScanning && <p className="text-sm text-muted-foreground animate-pulse">Escaneando código QR...</p>}
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            La red utilizada por defecto es <strong>Polygon</strong>. Asegúrate de que tu billetera sea compatible con
            esta red.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-medium">
            Correo electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={handleEmailChange}
            className={`text-base h-12 ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          <p className="text-sm text-muted-foreground">Para recibir el respaldo del comprobante de compra</p>
          {emailError && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{emailError}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <RippleButton variant="outline" onClick={onBack} className="flex-1 h-12 text-base bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </RippleButton>
          <RippleButton
            onClick={handleContinue}
            disabled={!isFormValid}
            className="flex-1 h-12 text-base font-semibold"
          >
            Continuar
          </RippleButton>
        </div>
      </CardContent>
    </Card>
  )
}
