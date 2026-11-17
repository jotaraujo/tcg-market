import { Popover as PopoverPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/lib/utils'

// Popover do Radix com a mesma casca visual do Select/DropdownMenu (superfície,
// borda, raio e sombra vêm dos tokens). O Trigger fica por conta de quem usa.
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

function PopoverContent({
	className,
	align = 'start',
	sideOffset = 6,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot='popover-content'
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'menu-pop z-50 w-(--radix-popover-trigger-width) min-w-72 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-card border border-rule bg-popover p-0 text-popover-foreground shadow-menu outline-hidden',
					className,
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}

export { Popover, PopoverTrigger, PopoverContent }
