import { NextRequest, NextResponse } from "next/server";


export default function middleware(request: NextRequest) {
    const apiKey = request.cookies.get("apiKey");
    
    if (!apiKey) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/faturas/:path*',
    ]
}