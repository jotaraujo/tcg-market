import NavLinks from './NavLinks'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

const Header = () => {
	return (
		<header className='mx-auto mt-4 flex w-3/4 items-center justify-between gap-1 rounded-full bg-paper-2 border border-rule  px-10 py-2 mb-10 backdrop-blur-2xl'>
			<span className='text-lg font-bold text-ink'>TCG Market</span>

			<NavLinks />

			<div className='flex items-center gap-3'>
				<SearchBar />
				<UserMenu />
			</div>
		</header>
	)
}

export default Header
