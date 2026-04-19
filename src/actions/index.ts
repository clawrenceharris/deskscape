export type ActionResultWithData<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
}

export type ActionResult = {
    success: true;
} | {
    success: false;
    error: string;
}