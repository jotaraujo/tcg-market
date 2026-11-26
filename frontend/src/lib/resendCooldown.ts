export const RESEND_COOLDOWN_SECONDS = 60

// Segundos que ainda faltam para liberar o reenvio. Recebe `now` em vez de
// chamar Date.now() para ser uma função pura (e fácil de testar).
export function getResendRemainingSeconds(
	lastSentAt: number,
	now: number,
	cooldownSeconds = RESEND_COOLDOWN_SECONDS,
): number {
	const elapsedSeconds = (now - lastSentAt) / 1000
	const remaining = Math.ceil(cooldownSeconds - elapsedSeconds)
	// O teto cobre o relógio andar para trás; o piso, o cooldown já ter passado.
	return Math.min(cooldownSeconds, Math.max(0, remaining))
}
