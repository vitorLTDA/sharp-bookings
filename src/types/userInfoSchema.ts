import { z } from "zod";

export const userInfoSchema = z.object({
	email: z.email("O email não foi preenchido, ou está incorreto."),
	phone: z
		.string("O número de telefone é obrigatório.")
		.min(
			13,
			"Seu número de telefone deve ter 11 digitos (lembre de incluir o 9)",
		)
		.max(
			13,
			"Seu número de telefone deve conter até no máximo 11 digitos (incluindo o 9)",
		),
	name: z.string("O nome da quem a reserva está sendo feita é obrigatório."),
});

export type UserInfoSchema = z.infer<typeof userInfoSchema>;
