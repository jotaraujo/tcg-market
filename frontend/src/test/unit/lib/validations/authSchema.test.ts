import { loginSchema, signUpSchema } from "#/lib/validations/authSchema"

describe('loginSchema', () => {
  it('should trim and lowercase the email', () => {
    const result = loginSchema.parse({
      email: ' Ana@Mail.COM  ',
      password: 'x'
    })
    expect(result.email).toBe('ana@mail.com')
  })

  it('should accept a short password, with no minimum length', () => {
    const result = loginSchema.safeParse({ email: 'a@b.co', password: 'X' })
    expect(result.success).toBe(true)
  })

  it('should reject an empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.co', password: '' })
    expect(result.success).toBe(false)
  })

    it('should reject an invalid email', () => {
    const result = loginSchema.safeParse({ email: 'a@', password: 'x' })
    expect(result.success).toBe(false)
  })
})

describe('signUpSchema', () => {
	it('should trim and lowercase the email', () => {
		const result = signUpSchema.parse({
			email: '  Ana@Mail.COM ',
			password: '12345678',
			confirmPassword: '12345678',
		})
		expect(result.email).toBe('ana@mail.com')
	})

	it('should reject an invalid email, a short password and empty fields', () => {
		expect(
			signUpSchema.safeParse({
				email: 'a@',
				password: '1234567',
				confirmPassword: '1234567',
			}).success,
		).toBe(false)
		expect(
			signUpSchema.safeParse({ email: '', password: '', confirmPassword: '' })
				.success,
		).toBe(false)
	})

	it('should point the mismatch error at confirmPassword', () => {
		const result = signUpSchema.safeParse({
			email: 'a@b.co',
			password: '12345678',
			confirmPassword: '87654321',
		})
		const fields = result.success
			? []
			: result.error.issues.map((issue) => issue.path[0])
		expect(fields).toContain('confirmPassword')
	})

	it('should accept a valid sign-up', () => {
		const result = signUpSchema.safeParse({
			email: 'a@b.co',
			password: '12345678',
			confirmPassword: '12345678',
		})
		expect(result.success).toBe(true)
	})
})