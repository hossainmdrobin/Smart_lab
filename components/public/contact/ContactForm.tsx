"use client";

import { useState, type FormEvent } from "react";
import { useSubmitContactInquiryMutation } from "@/src/lib/services/rtk/contactApi";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ContactForm() {
  const [submitInquiry, { isLoading }] = useSubmitContactInquiryMutation();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    try {
      await submitInquiry(formData).unwrap();
      setSubmitted(true);
      setFormData({ name: "", email: "", institution: "", subject: "", message: "" });
    } catch (err: unknown) {
      const errorData = err as { data?: { error?: { message?: string; details?: Record<string, string | string[]> } } };
      if (errorData?.data?.error) {
        setErrorMessage(errorData.data.error.message || "Failed to submit inquiry.");
        if (errorData.data.error.details) {
          const details: Record<string, string> = {};
          for (const [k, v] of Object.entries(errorData.data.error.details)) {
            details[k] = Array.isArray(v) ? v[0] : String(v);
          }
          setFieldErrors(details);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#10243A]">Inquiry Submitted Successfully</h3>
        <p className="mt-2 text-sm text-[#64748B]">
          Thank you for reaching out to the Laboratory of Algorithmic Life Sciences. Our team will review your inquiry and respond accordingly.
        </p>
        <div className="mt-6">
          <Button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-lg bg-[#10243A] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1b3a5c]"
          >
            Send Another Inquiry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#10243A]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-[#1E293B] shadow-sm focus:border-[#10243A] focus:outline-none focus:ring-1 focus:ring-[#10243A] ${
                fieldErrors.name ? "border-red-500 bg-red-50/50" : "border-[#CBD5E1] bg-white"
              }`}
              placeholder="Dr. Jane Doe"
            />
            {fieldErrors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#10243A]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-[#1E293B] shadow-sm focus:border-[#10243A] focus:outline-none focus:ring-1 focus:ring-[#10243A] ${
                fieldErrors.email ? "border-red-500 bg-red-50/50" : "border-[#CBD5E1] bg-white"
              }`}
              placeholder="jane.doe@institution.edu"
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-[#10243A]">
            Institution / Organization <span className="text-xs text-[#64748B]">(Optional)</span>
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            aria-describedby={fieldErrors.institution ? "institution-error" : undefined}
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-[#1E293B] shadow-sm focus:border-[#10243A] focus:outline-none focus:ring-1 focus:ring-[#10243A] ${
              fieldErrors.institution ? "border-red-500 bg-red-50/50" : "border-[#CBD5E1] bg-white"
            }`}
            placeholder="University or Research Institute Name"
          />
          {fieldErrors.institution && (
            <p id="institution-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.institution}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-[#10243A]">
            Inquiry Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-[#1E293B] shadow-sm focus:border-[#10243A] focus:outline-none focus:ring-1 focus:ring-[#10243A] ${
              fieldErrors.subject ? "border-red-500 bg-red-50/50" : "border-[#CBD5E1] bg-white"
            }`}
            placeholder="Research Collaboration / Prospective Student Inquiry / General Question"
          />
          {fieldErrors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#10243A]">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-[#1E293B] shadow-sm focus:border-[#10243A] focus:outline-none focus:ring-1 focus:ring-[#10243A] ${
              fieldErrors.message ? "border-red-500 bg-red-50/50" : "border-[#CBD5E1] bg-white"
            }`}
            placeholder="Please detail your inquiry, research interests, or collaboration proposal..."
          />
          {fieldErrors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#64748B]">
            <span className="text-red-500">*</span> Required fields. Data is handled confidentially per laboratory privacy guidelines.
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-[#10243A] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1b3a5c] focus:outline-none focus:ring-2 focus:ring-[#10243A] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Send Inquiry"}
          </button>
        </div>
      </form>
    </Card>
  );
}
