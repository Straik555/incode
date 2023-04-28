import { HTMLAttributes } from 'react'

export type TextProps = {
  as?: string
  className?: string
  noCap?: boolean
} & HTMLAttributes<
  | HTMLSpanElement
  | HTMLParagraphElement
  >
