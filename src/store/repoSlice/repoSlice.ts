import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type RepoProps = {
	url: string
}

const initialState: RepoProps = {
	url: ''
}

export const repoSlice = createSlice({
	name: 'repoSlice',
	initialState,
	reducers: {
		changeUrl(state, { payload }: PayloadAction<RepoProps>) {
			state.url = payload.url
		}
	}
})

export const { changeUrl } = repoSlice.actions
export default repoSlice.reducer
