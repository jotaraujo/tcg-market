import { exchangeHandlers } from './exchange'
import { proxyHandlers } from './proxy'
import { ygoprodeckHandlers } from './ygoprodeck'

export const handlers = [
	...exchangeHandlers,
	...ygoprodeckHandlers,
	...proxyHandlers,
]
