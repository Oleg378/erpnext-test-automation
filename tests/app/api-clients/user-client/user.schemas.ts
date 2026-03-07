import {z} from 'zod';

export interface User {
    email: string,
    first_name: string,
    last_name: string,
    username: string,
    new_password: string,
    send_welcome_email: number,
    role_profile_name: string
}

export type UserResponse = z.infer<typeof USER_RESPONSE_SCHEMA>;
export const USER_RESPONSE_SCHEMA = z.object({
    data: z.object({
        name: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        full_name: z.string(),
        username: z.string(),
        send_welcome_email: z.number(),
        role_profile_name: z.string()
    })
});