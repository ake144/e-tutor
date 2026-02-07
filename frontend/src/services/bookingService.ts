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

    // 2. Parse DateTime with AM/PM Support
    let timeStr = data.time.trim(); // "10:00 AM"
    // Convert 12h to 24h if needed
    if (timeStr.match(/PM|AM/i)) {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier.toUpperCase() === 'PM') hours = String(parseInt(hours, 10) + 12);
      timeStr = `${hours}:${minutes}`;
    }

    const startTime = new Date(`${data.date}T${timeStr}:00`);
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
  },

  async getUserSessions(userId: string) {
      const bookings = await prisma.booking.findMany({
          where: {
              OR: [
                  { studentId: userId },
                  { tutor: { userId: userId } }
              ],
              status: "CONFIRMED"
          },
          include: {
              tutor: {
                  include: {
                      user: true
                  }
              },
              student: true
          },
          orderBy: {
              startTime: 'asc'
          }
      });

      return bookings.map((b: any) => ({
          id: b.id,
          tutor: b.tutor.user.name,
          student: b.student.name,
          date: b.startTime.toISOString().split('T')[0],
          time: b.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: b.tutor.subjects[0] || "General",
          meetingUrl: b.meetingUrl
      }));
  }
};