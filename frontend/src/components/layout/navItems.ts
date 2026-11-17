import { Heart, Layers, type LucideIcon, Store, User } from 'lucide-react'

export interface NavItem {
	label: string
	href: '/marketplace' | '/sets' | '/favorites' | '/profile'
	icon: LucideIcon
}

// Fonte única dos links de navegação: a nav desktop (NavLinks) e o menu
// mobile (MobileMenu) leem daqui, então um link novo aparece nos dois.
export const NAV_ITEMS: NavItem[] = [
	{ label: 'Mercado', href: '/marketplace', icon: Store },
	{ label: 'Coleções', href: '/sets', icon: Layers },
	{ label: 'Favoritos', href: '/favorites', icon: Heart },
	{ label: 'Perfil', href: '/profile', icon: User },
]
