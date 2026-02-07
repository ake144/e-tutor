export async function POST(req: Request) {
      try {

      }
      catch (error) {
        console.error("Payment initiation error:", error);
        return new Response("Failed to initiate payment", { status: 500 });
      }
}