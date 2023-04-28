import React, { FC } from 'react'
import cn from 'clsx'
import Text from '../Text'
import { ColumnProps } from './Column.types'
import { Draggable, Droppable } from 'react-beautiful-dnd'

const Column: FC<ColumnProps> = ({ column, tasks }) => {
	return (
		<div className='w-full'>
			<Text className='text-center'>{column.title}</Text>
			<Droppable droppableId={column.id}>
				{(droppableProvided, droppableSnapshot) => (
					<div
						className='flex flex-col w-full p-2 justify-center '
						ref={droppableProvided.innerRef}
						{...droppableProvided.droppableProps}
					>
						<div className='flex flex-col w-full border border-solid p-3 border-gray-900 bg-gray-200 h-[600px]'>
							{tasks?.map((task, index) => {
								return (
									<Draggable
										key={task.number}
										draggableId={`${task.number}`}
										index={index}
									>
										{(draggableProvided, draggableSnapshot) => {
											return (
												<div
													className={cn(
														'mt-3 border border-solid  border-gray-900 rounded-lg p-2 bg-white',
														{
															'outline-transparent':
																!!draggableSnapshot.isDragging,
															'outline-white': !draggableSnapshot.isDragging,
															'shadow-[unset]': !!draggableSnapshot.isDragging,
															'shadow-[0_5px_10px_silver]':
																!draggableSnapshot.isDragging
														}
													)}
													ref={draggableProvided.innerRef}
													{...draggableProvided.draggableProps}
													{...draggableProvided.dragHandleProps}
												>
													<Text>{task.body}</Text>
												</div>
											)
										}}
									</Draggable>
								)
							})}
						</div>
					</div>
				)}
			</Droppable>
		</div>
	)
}

export default Column
