import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  institution?: string;
  subject: string;
  message: string;
}

export interface ContactInquiryResponse {
  id: string;
  message: string;
}

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    submitContactInquiry: builder.mutation<ContactInquiryResponse, ContactInquiryPayload>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ContactInquiryResponse }) => response.data,
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const { useSubmitContactInquiryMutation } = contactApi;
