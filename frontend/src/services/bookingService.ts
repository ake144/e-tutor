import { prisma } from "@/lib/prisma";

export const BookingService = {
  /**
   * Create a new booking and return the created record.
   */
  async createBooking(data: {
    studentId: string;
    tutorId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
  }) {
    // 1. Fetch Tutor Profile to get pricing
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: data.tutorId },
    });

    if (!tutor) throw new Error("Tutor not found");

    // 2. Parse DateTime (Simplified for example)
    const startTime = new Date(`${data.date}T${data.time}:00`);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 Hour session

    // 3. Check Availability (Check for overlapping bookings)
    const conflict = await prisma.booking.findFirst({
        where: {
            tutorId: data.tutorId,
            status: "CONFIRMED",
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } },
                { startTime: { lt: endTime }, endTime: { gte: endTime } }
            ]
        }
    });

    if (conflict) throw new Error("Slot is not available");

    // 4. Create Pending Booking
    const booking = await prisma.booking.create({
      data: {
        studentId: data.studentId,
        tutorId: data.tutorId,
        startTime,
        endTime,
        totalPrice: tutor.hourlyRate,
        status: "PENDING",
      },
    });

    return booking;
  },

  /**
   * Confirm booking after payment
   */
  async confirmBooking(bookingId: string, paymentDetails: any) {
      // payment verification logic here (e.g. verify chapa tx)
      return await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED", meetingUrl: `https://meet.jit.si/${bookingId}` } // Generate meeting link
      });
  }
};