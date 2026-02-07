"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Currency } from "lucide-react"
import { toast } from "sonner"

interface ChapaButtonProps {
    amount: number
    email: string
    firstName: string
    currency?: string
    lastName: string
    txRef: string
    phone_number?: string
    courseSlug: string
    onSuccess?: () => void
}

export function ChapaButton({ amount, email, firstName, lastName, phone_number, txRef, courseSlug }: ChapaButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePayment = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/payments/chapa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    email,
                    first_name: firstName,
                    currency: "ETB",
                    last_name: lastName,
                    tx_ref: txRef,
                    phone_number,
                    slug: courseSlug,
                    // payment_options: "telebirr,cbe_birr,amole,card",

                }),
            })

            const data = await response.json()

            console.log("Chapa response:", data)


            if (data.checkout_url) {
                window.location.href = data.checkout_url
            } else {
                toast.error("Failed to initialize payment")
            }
        } catch (error) {
            console.error("Chapa error:", error)
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-800 font-medium mb-2">Pay with Chapa</p>
                <p className="text-sm text-green-600 mb-6">
                    You will be redirected to Chapa's secure payment page to complete your purchase using Telebirr, CBE Birr,M-pessa,local or international cards.
                </p>

                {/* <div className="flex justify-center gap-4 mb-6">
                    <div className="h-8 bg-white rounded px-2 flex items-center border">Telebirr</div>
                    <div className="h-8 bg-white rounded px-2 flex items-center border">CBE Birr</div>
                    <div className="h-8 bg-white rounded px-2 flex items-center border">M-Pessa</div>
                </div> */}

                <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full cursor-pointer h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            Pay {amount.toLocaleString()} ETB
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    )}
                </Button>
            </div>
        </div>
    )
}