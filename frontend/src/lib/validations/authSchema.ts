import { z } from 'zod'

const emailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.pipe(z.email({ error: 'E-mail inválido' }))

export const signUpSchema = z
	.object({
		email: emailSchema,
		password: z
			.string()
			.min(8, { error: 'A senha deve ter pelo menos 8 caracteres.' }),
		confirmPassword: z.string().min(1, { error: 'Confirme a senha.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		error: 'As senhas não coincidem.',
	})

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, { error: 'Informe a senha.' }),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
