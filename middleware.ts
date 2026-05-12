import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { baseURL } from '@/utils/BaseURL';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('alexandertel-web-token')?.value;
    const { pathname } = request.nextUrl;

    // Handle API proxies securely
    // When the frontend hits /api/v1/..., we forward it to the real backend
    // and inject the httpOnly cookie as a Bearer token.
    if (pathname.startsWith('/api')) {
        const requestHeaders = new Headers(request.headers);
        
        // Inject token if available
        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }

        // Create the target backend URL
        // If the pathname is /api/v1/user/profile, and baseURL is http://.../api/v1
        // We need to be careful with concatenating.
        // Let's assume baseURL is the root of the API: http://10.10.7.55:5006/api/v1
        const targetUrl = `${baseURL}${pathname.replace('/api/v1', '')}${request.nextUrl.search}`;
        
        return NextResponse.rewrite(new URL(targetUrl), {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/verify-otp', '/reset-password', '/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Bypass for static files, internal Next.js paths, and public assets
    const isInternalPath = pathname.startsWith('/_next') || 
                          pathname.startsWith('/favicon.ico') ||
                          pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2)$/);

    if (isInternalPath) {
        return NextResponse.next();
    }

    // Security Logic:
    
    // 1. If no token and trying to access a protected route -> Redirect to login
    if (!token && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If token exists and trying to access auth pages (login/register) -> Redirect to home
    if (token && isPublicRoute) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};

