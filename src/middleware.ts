import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            const isLoggedIn = !!token
            const isOnDashboard =
                req.nextUrl.pathname.startsWith('/dashboard') ||
                req.nextUrl.pathname.startsWith('/opportunities') ||
                req.nextUrl.pathname.startsWith('/documents') ||
                req.nextUrl.pathname.startsWith('/calendar') ||
                req.nextUrl.pathname.startsWith('/settings')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false
            }
            return true
        },
    },
})

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/opportunities/:path*',
        '/documents/:path*',
        '/calendar/:path*',
        '/settings/:path*',
    ],
}
