import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { Button } from '../ui/button'

const UserMenu = () => {
  const { isAuthenticated, user, logout } = useAuthStore()

  const initials = user?.slice(0, 2).toUpperCase() ?? '??'

	return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full outline-none ring-accent focus-visible:ring-2 cursor-pointer'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='' alt={user ?? 'Usuário'}/>
            <AvatarFallback className='bg-transparent'>
              {isAuthenticated ? initials : <User className='h-4 w-4'/>}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='rounded-full border-rule'>
        {isAuthenticated ? (
          <DropdownMenuItem onClick={logout} className='rounded-full focus:bg-paper'>
            <LogOut className='mr-2 h-4 w-4'/>
            Sair
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className='focus:bg-accent-hover rounded-full border-rule'>
            Fazer Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
