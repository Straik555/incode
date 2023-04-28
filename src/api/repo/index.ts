import { baseApiSlice } from '../index'
import {
	AddLabelProps,
	AssigneesProps,
	ColumnsTag,
	IssuesResponse,
	LabelsProps,
	RepoApiTags,
	RepoPropsType,
	RepoResponse,
	StateProps,
	UpdateClosedProps
} from './type'
import dayjs from 'dayjs'

const RepoApiTagTypes = [RepoApiTags.ISSUES, RepoApiTags.CLOSED]

const enhancedBaseApiSlice = baseApiSlice.enhanceEndpoints({
	addTagTypes: RepoApiTagTypes
})

const repoApi = enhancedBaseApiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: build => ({
		getIssues: build.query<IssuesResponse, RepoPropsType>({
			query: ({ url }) => ({
				url: `${url}/issues`,
				method: 'GET'
			}),
			transformResponse: (response: RepoResponse[]): IssuesResponse => {
				const columns = [
					{
						id: ColumnsTag.First,
						title: 'TO-DO',
						taskIds: []
					},
					{
						id: ColumnsTag.Second,
						title: 'IN-PROGRESS',
						taskIds: []
					},
					{
						id: ColumnsTag.Third,
						title: 'COMPLETED',
						taskIds: []
					}
				]

				const newColumns = (number: number, id: ColumnsTag) =>
					columns.map(column => {
						if (column.id === id) {
							column.taskIds.push(number as never)
						}
					})
				const labels = (index: number): LabelsProps[] => {
					const labels: LabelsProps[] = []
					for (let i = 0; i <= index; i++) {
						labels.push({ name: String(i) })
					}
					return [...labels]
				}
				response
					// .map((res, index) => {
					// 	console.log('index', index)
					// 	console.log('index', !res.labels.length && labels(index))
					// 	return !!res.labels.length ? res : { ...res, labels: labels(index) }
					// })
					.sort((a, b) => {
						if (dayjs(b.updated_at).isBefore(dayjs(a.updated_at))) {
							return -1
							// } else if (dayjs(a.updated_at).isBefore(dayjs(b.updated_at))) {
							// 	return -1
						} else return 0
					})
					// .map((res, index) => {
					// 	console.log('index', index)
					// 	console.log('index', !res.labels.length && labels(index))
					// 	return !!res.labels.length ? res : { ...res, labels: labels(index) }
					// })
					.sort((a, b) => {
						if (a.labels.length > b.labels.length) {
							return 1
						} else if (a.labels.length < b.labels.length) {
							return -1
						} else {
							if (dayjs(b.updated_at).isBefore(dayjs(a.updated_at))) {
								return -1
							} else {
								return 0
							}
						}
					})
					.map(col => {
						if (!!col.assignees.length) {
							newColumns(col.number, ColumnsTag.Second)
						} else {
							newColumns(col.number, ColumnsTag.First)
						}
					})

				return {
					tasks: [...response],
					columns,
					columnOrder: [ColumnsTag.First, ColumnsTag.Second, ColumnsTag.Third]
				}
			},
			providesTags: [RepoApiTags.ISSUES]
		}),
		addOrDeleteAssignees: build.mutation<RepoResponse, AssigneesProps>({
			query: ({ url, method, assignees }) => ({
				url: url + '/assignees',
				method,
				body: {
					assignees,
					state: StateProps.Open
				}
			}),
			invalidatesTags: [RepoApiTags.ISSUES]
		}),
		closedIssues: build.query<RepoResponse[], RepoPropsType>({
			query: ({ url }) => ({
				url: `${url}/issues?state=closed`,
				method: 'GET'
			}),
			transformResponse: (res: RepoResponse[]) => {
				return res.sort((a, b) => {
					if (a.labels.length > b.labels.length) {
						return 1
					} else if (a.labels.length < b.labels.length) {
						return -1
					} else {
						if (dayjs(b.updated_at).isBefore(dayjs(a.updated_at))) {
							return -1
						} else {
							return 0
						}
					}
				})
			},
			providesTags: [RepoApiTags.CLOSED]
		}),
		updateIssues: build.mutation<RepoResponse[], UpdateClosedProps>({
			query: ({ url, state, assignees, labels }) => ({
				url,
				method: 'PATCH',
				body: {
					state,
					assignees,
					labels
				}
			}),
			invalidatesTags: [RepoApiTags.ISSUES, RepoApiTags.CLOSED]
		}),
		addLabel: build.mutation<Pick<RepoResponse, 'labels'>, AddLabelProps>({
			query: ({ url, labels }) => ({
				method: 'PUT',
				url,
				body: {
					labels
				}
			}),
			invalidatesTags: [RepoApiTags.CLOSED]
		})
	})
})

export const {
	useGetIssuesQuery,
	useAddOrDeleteAssigneesMutation,
	useClosedIssuesQuery,
	useUpdateIssuesMutation,
	useAddLabelMutation
} = repoApi
