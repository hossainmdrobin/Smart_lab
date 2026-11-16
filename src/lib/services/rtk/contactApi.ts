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
    getContactInquiries: builder.query<Array<Record<string, unknown>>, void>({
      query: () => "/contact",
      transformResponse: (response: { data: Array<Record<string, unknown>> }) => response.data,
      providesTags: ["Contact"],
    }),
    submitContactInquiry: builder.mutation<ContactInquiryResponse, ContactInquiryPayload>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ContactInquiryResponse }) => response.data,
      invalidatesTags: ["Contact"],
    }),
    updateContactInquiry: builder.mutation<Record<string, unknown>, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/contact/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Contact"],
    }),
    deleteContactInquiry: builder.mutation<Record<string, unknown>, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: { data: Record<string, unknown> }) => response.data,
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useGetContactInquiriesQuery,
  useSubmitContactInquiryMutation,
  useUpdateContactInquiryMutation,
  useDeleteContactInquiryMutation,
} = contactApi;
