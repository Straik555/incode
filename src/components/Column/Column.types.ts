import { ColumnsTypes, IssuesResponse } from '../../api/repo/type'

export type ColumnProps = {
	column: ColumnsTypes
} & Pick<IssuesResponse, 'tasks'>
