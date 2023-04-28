export enum RepoApiTags {
	ISSUES = 'issues',
	CLOSED = 'closed'
}

export type RepoPropsType = {
	url: string
}

export type UpdateClosedProps = {
	state: StateProps
	assignees: [] | string[]
} & AddLabelProps

export type AddLabelProps = {
	labels: string[] | []
} & RepoPropsType

export enum StateProps {
	Open = 'open',
	Closed = 'closed'
}

export type AssigneesProps = {
	method: string
	assignees: string[]
} & RepoPropsType

export type AssigneesResponse = {
	login: string
}

export type RepoResponse = {
	number: number
	title: string
	body: string
	assignees: [] | AssigneesResponse[]
	user: AssigneesResponse
	url: string
	updated_at: string
	labels: LabelsProps[] | []
}

export type LabelsProps = {
	name: string
}

export type IssuesResponse = {
	tasks: RepoResponse[]
	columns: ColumnsTypes[]
	columnOrder: ColumnsTag[]
}

export type ColumnsTypes = {
	id: ColumnsTag
	title: string
	taskIds: number[]
}

export enum ColumnsTag {
	First = 'column-1',
	Second = 'column-2',
	Third = 'column-3'
}
