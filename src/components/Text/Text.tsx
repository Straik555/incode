import React, { createElement, FC } from 'react'
import cl from 'clsx'
import { TextProps } from './Text.types'

const Text: FC<TextProps> = ({
	as = 'p',
	className,
	children,
	noCap,
	...restProps
}) => {
	return createElement(
		as,
		{
			...restProps,
			className: cl(
				{
					capitalize: !noCap
				},
				className
			)
		},
		children
	)
}

export default Text
