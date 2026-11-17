import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

// Command (cmdk) no padrão do shadcn, com a casca visual dos tokens do projeto.
// O cmdk cuida do filtro, do teclado e dos papéis ARIA (listbox/option).
function Command({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			data-slot='command'
			className={cn(
				'flex w-full flex-col overflow-hidden bg-popover text-popover-foreground',
				className,
			)}
			{...props}
		/>
	)
}

function CommandInput({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div
			data-slot='command-input-wrapper'
			className='flex h-11 items-center gap-xs border-b border-rule px-sm'
		>
			<SearchIcon aria-hidden='true' className='size-4 shrink-0 text-ink-2' />
			<CommandPrimitive.Input
				data-slot='command-input'
				className={cn(
					'h-full w-full bg-transparent text-sm text-ink outline-hidden placeholder:text-ink-3 disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				{...props}
			/>
		</div>
	)
}

function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-slot='command-list'
			className={cn(
				'max-h-80 overflow-y-auto overflow-x-hidden p-xs',
				className,
			)}
			{...props}
		/>
	)
}

function CommandEmpty({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-slot='command-empty'
			className={cn('py-lg text-center text-sm text-ink-2', className)}
			{...props}
		/>
	)
}

function CommandItem({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			data-slot='command-item'
			className={cn(
				'relative flex w-full cursor-pointer select-none items-center gap-xs rounded-input px-sm py-xs text-sm text-ink outline-hidden data-[selected=true]:bg-paper-3 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
				className,
			)}
			{...props}
		/>
	)
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandItem }
