export default function CheckoutPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
        {/* TODO: Add Stripe payment form here */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">Stripe payment integration coming soon...</div>
      </div>
    </main>
  );
}
