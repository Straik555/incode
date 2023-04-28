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
