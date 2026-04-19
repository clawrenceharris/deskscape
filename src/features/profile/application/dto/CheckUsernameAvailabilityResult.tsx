export type CheckUsernameAvailabilityResult = {
    isAvailable: boolean;
    success: true;
} | {
    success: false;
    error: string;
}