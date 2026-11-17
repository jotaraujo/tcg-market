import { CheckIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

// Select do Radix com a mesma casca visual do DropdownMenu (superfície, borda,
// raio e sombra vêm dos tokens). O Trigger fica por conta de quem usa: no
// FilterBar ele é uma pílula, então não há estilo de trigger aqui.
const Select = SelectPrimitive.Root
const SelectTrigger = SelectPrimitive.Trigger
const SelectGroup = SelectPrimitive.Group

function SelectContent({
	className,
	children,
	sideOffset = 6,
	align = 'start',
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot='select-content'
				position='popper'
				sideOffset={sideOffset}
				align={align}
				className={cn(
					'menu-pop z-50 max-h-(--radix-select-content-available-height) min-w-[max(var(--radix-select-trigger-width),12rem)] max-w-80 origin-(--radix-select-content-transform-origin) overflow-hidden rounded-card border border-rule bg-popover text-popover-foreground shadow-menu',
					className,
				)}
				{...props}
			>
				{/* O Viewport é quem rola: o Content só limita a altura */}
				<SelectPrimitive.Viewport className='p-xs'>
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			data-slot='select-label'
			className={cn(
				'px-sm pt-xs pb-2xs text-sm font-medium text-ink-2',
				className,
			)}
			{...props}
		/>
	)
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot='select-item'
			className={cn(
				'relative flex w-full cursor-pointer select-none items-center rounded-input py-xs pr-xl pl-sm text-sm text-ink outline-hidden data-highlighted:bg-paper-3 data-[state=checked]:font-medium data-disabled:pointer-events-none data-disabled:opacity-50',
				className,
			)}
			{...props}
		>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
			<span className='pointer-events-none absolute right-sm grid place-items-center'>
				<SelectPrimitive.ItemIndicator>
					<CheckIcon aria-hidden='true' className='size-4 text-primary-hover' />
				</SelectPrimitive.ItemIndicator>
			</span>
		</SelectPrimitive.Item>
	)
}

function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-slot='select-separator'
			className={cn('-mx-xs my-xs h-px bg-rule', className)}
			{...props}
		/>
	)
}

export {
	Select,
	SelectTrigger,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
}
