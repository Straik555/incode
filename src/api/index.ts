import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const token = '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'

export const baseApiSlice = createApi({
	reducerPath: 'baseApiIncodeMy',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://api.github.com/repos/',
		prepareHeaders: headers => {
			headers.set('authorization', `Token ${token}`)
			headers.set('Accept', `application/vnd.github+json`)
		}
	}),
	endpoints: () => ({}),
	refetchOnReconnect: true
})
