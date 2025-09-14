export interface ProfileRole {
    readonly role_profile_name: string;
    readonly new_password: string;
}

export const ProfileRoles = {
    Purchase: {
        role_profile_name: 'Purchase',
        new_password: 'P123456@!'
    } as ProfileRole,
    Sales: {
        role_profile_name: 'Sales',
        new_password: 'S123456@!'
    } as ProfileRole,
    Accounts: {
        role_profile_name: 'Accounts',
        new_password: 'A_password_123'
    } as ProfileRole,
    Manufacturing: {
        role_profile_name: 'Manufacturing',
        new_password: 'M123456@!'
    } as ProfileRole,
    Inventory: {
        role_profile_name: 'Inventory',
        new_password: 'I123456@!'
    } as ProfileRole
}  as const;