import { z } from "zod";

const ROLES = ["STORE_MANAGER", "MARKETING", "CRM", "ACHATS"] as const;

const STORES = [
  "BV000", "BV001", "BV002", "BV003", "BV004", "BV006", "BV008", "BV009", "BV010",
  "BV013", "BV015", "BV023", "BV033", "BV119", "BV125", "BV129", "BV145", "BV147",
  "BV149", "BV153", "BV158", "BV163", "BV175", "BV185", "BV192", "BV206", "BV218",
  "BV309", "BV512", "BV513", "BV514", "BV515", "BV517", "BV518", "BV519", "BV520",
  "BV523", "BV524", "BV525", "BV526", "BV529", "BV530", "BV531", "BV534", "BV535",
  "BV539", "BV540", "BV541", "BV542", "BV543", "BV549", "BV551", "BV553", "BV555",
  "BVFR", "MTLOG",
] as const;

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, "Minimum 3 characters").max(100, "Maximum 100 characters"),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one digit"),
    confirmPassword: z.string(),
    role: z.enum(ROLES, { message: "Please select a role" }),
    store_id: z.string().optional(),
    department: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const setupPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one digit"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export { ROLES, STORES };
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SetupPasswordFormData = z.infer<typeof setupPasswordSchema>;
