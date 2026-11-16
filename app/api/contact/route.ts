import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { ContactInquiry } from "@/src/models/ContactInquiry";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { checkRateLimit, getClientIpFromHeaders } from "@/src/lib/auth/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name cannot exceed 150 characters"),
  email: z.string().email("Please enter a valid email address").max(254, "Email is too long"),
  institution: z.string().max(150, "Institution cannot exceed 150 characters").optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required").max(300, "Subject cannot exceed 300 characters"),
  message: z.string().min(1, "Message is required").max(10000, "Message cannot exceed 10000 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIpFromHeaders(req.headers);
    const rateLimitResult = checkRateLimit({
      key: `contact-inquiry-${ip}`,
      max: 5,
      windowMs: 15 * 60 * 1000, // 5 submissions per 15 minutes
    });

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many contact inquiries submitted. Please try again later.",
          },
        }),
        { status: 429, headers: { "content-type": "application/json" } }
      );
    }

    await dbConnect();
    const body = await req.json();
    const data = contactSchema.parse(body);

    const inquiry = await ContactInquiry.create({
      name: data.name,
      email: data.email,
      institution: data.institution || undefined,
      subject: data.subject,
      message: data.message,
      receivedAt: new Date(),
      ipAddress: ip,
    });

    return sendOk(
      {
        id: String(inquiry._id),
        message: "Your inquiry has been submitted successfully. Thank you for contacting the Laboratory.",
      },
      undefined,
      201
    );
  } catch (err) {
    return handleApiError(err);
  }
}
