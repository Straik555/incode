import React, { useMemo, useState } from 'react'
import { Column } from './components'
import { DragDropContext, DragUpdate } from 'react-beautiful-dnd'
import { AssigneesProps, ColumnsTag, StateProps } from './api/repo/type'

import {
	useAddLabelMutation,
	useAddOrDeleteAssigneesMutation,
	useClosedIssuesQuery,
	useGetIssuesQuery,
	useUpdateIssuesMutation
} from './api/repo'
import { useAppDispatch, useRepo } from './hooks/useState'
import { changeUrl } from './store/repoSlice/repoSlice'

function App() {
	const dispatch = useAppDispatch()
	const { url } = useRepo()
	const [value, setValue] = useState<string>(url)

	const { data: dataIssues, isLoading: isLoadingIssues } = useGetIssuesQuery(
		{ url: url.slice(19) },
		{
			skip: !url.length
		}
	)

	const { data: dataClosed, isLoading: isLoadingClosed } = useClosedIssuesQuery(
		{ url: url.slice(19) },
		{
			skip: !url.length
		}
	)

	const [addOrDeleteAssignees, { isLoading: isLoadingAssignees }] =
		useAddOrDeleteAssigneesMutation()
	const [updateIssues, { isLoading: isLoadingUpdateIssues }] =
		useUpdateIssuesMutation()
	const [addLabelClosed, { isLoading: isLoadingLabelClosed }] =
		useAddLabelMutation()

	const urlRepo = useMemo(() => {
		return url.slice(19).split('/')
	}, [url])

	const isLoading = useMemo(
		() =>
			isLoadingIssues ||
			isLoadingClosed ||
			isLoadingAssignees ||
			isLoadingLabelClosed ||
			isLoadingUpdateIssues,
		[
			isLoadingIssues,
			isLoadingClosed,
			isLoadingAssignees,
			isLoadingLabelClosed,
			isLoadingUpdateIssues
		]
	)

	const labels = (index: number): [] | string[] => {
		const labels: string[] = []
		for (let i = 0; i < index; i++) {
			labels.push(String(i))
		}
		return [...labels]
	}

	const onDragEnd = ({ destination, source }: DragUpdate) => {
		if (!destination || !dataIssues) return
		if (
			destination?.droppableId === source.droppableId &&
			destination?.index === source.index
		) {
			return
		}
		const sourceCol = dataIssues.columns.find(
			({ id }) => id === source.droppableId
		)

		const startTaskIds = !!sourceCol ? Array.from(sourceCol.taskIds) : []
		const [removed] = startTaskIds.splice(source.index, 1)
		const repo = dataIssues.tasks.filter(task => task.number === removed)[0]

		const bodyAssignees = ({
			assignees,
			method
		}: Omit<AssigneesProps, 'url'>) => ({
			url: url.slice(19) + '/issues/' + repo.number,
			method,
			assignees
		})

		const update = () => {
			updateIssues({
				url: `${url.slice(19)}/issues/${repo.number}`,
				state: StateProps.Open,
				assignees: [],
				labels: labels(destination?.index)
			})
			dataIssues.tasks
				.slice(destination.index)
				.filter(data => data !== dataIssues.tasks[source.index])
				.map((data, index) =>
					updateIssues({
						url: `${url.slice(19)}/issues/${data.number}`,
						labels: labels(destination?.index + index + 1),
						state: StateProps.Open,
						assignees: []
					})
				)
		}

		if (!!dataClosed && source.droppableId === ColumnsTag.Third) {
			if (destination.droppableId === ColumnsTag.First) {
				return updateIssues({
					url: `${url.slice(19)}/issues/${dataClosed[source.index].number}`,
					state: StateProps.Open,
					assignees: [],
					labels: labels(destination?.index)
				})
			} else if (destination.droppableId === ColumnsTag.Second) {
				return updateIssues({
					url: `${url.slice(19)}/issues/${dataClosed[source.index].number}`,
					state: StateProps.Open,
					assignees: [dataClosed[source.index].user.login],
					labels: labels(destination?.index)
				})
			} else {
				addLabelClosed({
					url: `${url.slice(19)}/issues/${
						dataClosed[source.index].number
					}/labels`,
					labels: labels(destination?.index)
				})
				dataClosed
					.slice(destination.index)
					.filter(data => data !== dataClosed[source.index])
					.map((data, index) =>
						addLabelClosed({
							url: `${url.slice(19)}/issues/${data.number}/labels`,
							labels: labels(destination?.index + index + 1)
						})
					)
			}
		} else if (source.droppableId === ColumnsTag.Second) {
			if (destination.droppableId === ColumnsTag.Third) {
				return updateIssues({
					url: `${url.slice(19)}/issues/${repo.number}`,
					state: StateProps.Closed,
					assignees: [],
					labels: labels(destination?.index)
				})
			} else if (destination.droppableId === ColumnsTag.First) {
				return addOrDeleteAssignees(
					bodyAssignees({
						assignees: [repo.assignees[0].login],
						method: 'DELETE'
					})
				)
			} else {
				update()
			}
		} else {
			if (destination.droppableId === ColumnsTag.Third) {
				return updateIssues({
					url: `${url.slice(19)}/issues/${repo.number}`,
					state: StateProps.Closed,
					assignees: [],
					labels: labels(destination?.index)
				})
			} else if (destination.droppableId === ColumnsTag.Second) {
				return addOrDeleteAssignees(
					bodyAssignees({
						assignees: [repo.user.login],
						method: 'POST'
					})
				)
			} else {
				update()
			}
		}
	}

	return (
		<div className='w-full h-screen'>
			<header>
				<div className='w-full flex justify-between items-center mb-3'>
					<input
						value={value}
						onChange={e => setValue(e.target.value)}
						placeholder='Enter repo URL'
						className='border border-solid py-1 px-3 border-gray-500 w-full mx-4'
					/>
					<button
						className='border border-solid py-1 px-3 border-gray-500 w-[200px] mr-4'
						onClick={() =>
							!!value.length && dispatch(changeUrl({ url: value }))
						}
					>
						Load issues
					</button>
				</div>
			</header>
			<main>
				{!!url && (
					<>
						<a
							href={url.slice(0, 19) + urlRepo[0]}
							className='px-4 text-blue-600'
						>
							{urlRepo[0]}
						</a>
						<a href={url} className='px-4 text-blue-600'>
							{urlRepo[1]}
						</a>
					</>
				)}
				{isLoading ? (
					<h1>Loading...</h1>
				) : (
					<DragDropContext onDragEnd={onDragEnd}>
						<div className='flex items-start justify-between w-full h-full pt-4'>
							{!!dataIssues &&
								dataIssues.columnOrder.map(columnId => {
									const column = dataIssues?.columns?.find(
										column => column.id === columnId
									)
									if (!!column) {
										const tasks = column?.taskIds?.map(taskId => {
											return dataIssues.tasks.filter(
												el => el.number === taskId
											)[0]
										})
										if (columnId === ColumnsTag.Third && !!dataClosed) {
											return (
												<Column
													key={columnId}
													column={{
														id: columnId,
														taskIds: [],
														title: 'DONE'
													}}
													tasks={dataClosed}
												/>
											)
										} else {
											return (
												<Column
													key={column?.id}
													column={column}
													tasks={tasks}
												/>
											)
										}
									}
								})}
						</div>
					</DragDropContext>
				)}
			</main>
		</div>
	)
}

export default App
