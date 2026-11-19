import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url) {
	throw new Error('Variável de ambiente ausente: VITE_SUPABASE_URL')
}
if (!publishableKey) {
	throw new Error('Variável de ambiente ausente: VITE_SUPABASE_PUBLISHABLE_KEY')
}

export const supabase = createClient(url, publishableKey, {
	auth: { flowType: 'pkce' },
})
