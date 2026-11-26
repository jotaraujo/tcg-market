import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'

interface FormFieldProps extends ComponentProps<'input'> {
	label: string
	error?: string
}

const FormField = ({ id, label, error, ...inputProps }: FormFieldProps) => {
	return (
		<div className='flex flex-col gap-xs'>
			<label htmlFor={id} className='text-sm font-medium text-ink'>
				{label}
			</label>
			<Input
				id={id}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${id}-error` : undefined}
				className='h-10'
				{...inputProps}
			/>
			{error && (
				<p id={`${id}-error`} className='text-sm text-destructive'>
					{error}
				</p>
			)}
		</div>
	)
}

export default FormField
