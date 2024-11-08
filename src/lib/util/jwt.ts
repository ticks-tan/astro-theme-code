import { createSigner, createVerifier } from 'fast-jwt';

export function createJWT(
    payload: string | Buffer | { [key: string]: any },
    expiresIn: string = '3h',
): string {
    const signer = createSigner({
        key: import.meta.env.ADMIN_JWT_SECRET,
        expiresIn,
    });
    return signer(payload);
}

export function verifyJWT<T = any>(jwt: string | Buffer): T {
    const verify = createVerifier({
        key: import.meta.env.ADMIN_JWT_SECRET,
    });
    return verify(jwt);
}

export function verifyAuthCookie(cookie: string | Buffer) {
    try {
        const authPayload = verifyJWT<{ user: string }>(cookie);
        return authPayload.user === (import.meta.env.ADMIN_USER ?? 'test');
    } catch (_e) {}
    return false;
}
