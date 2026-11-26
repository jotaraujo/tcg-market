import {
	getResendRemainingSeconds,
	RESEND_COOLDOWN_SECONDS,
} from '@/lib/resendCooldown'

describe('getResendRemainingSeconds', () => {
	it('should use a 60 second cooldown by default', () => {
		expect(RESEND_COOLDOWN_SECONDS).toBe(60)
	})

	it('should return the seconds left while the cooldown is running', () => {
		expect(getResendRemainingSeconds(0, 20_000)).toBe(40)
	})

	it('should round partial seconds up', () => {
		expect(getResendRemainingSeconds(0, 20_400)).toBe(40)
		expect(getResendRemainingSeconds(0, 59_001)).toBe(1)
	})

	it('should return 0 once the cooldown has passed', () => {
		expect(getResendRemainingSeconds(0, 60_000)).toBe(0)
		expect(getResendRemainingSeconds(0, 90_000)).toBe(0)
	})

	it('should never exceed the cooldown when the clock goes backwards', () => {
		expect(getResendRemainingSeconds(10_000, 0)).toBe(60)
	})

	it('should accept a custom cooldown', () => {
		expect(getResendRemainingSeconds(0, 5_000, 10)).toBe(5)
	})
})