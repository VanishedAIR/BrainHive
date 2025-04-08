import { NextResponse } from 'next/server';
// Adjusted the path to the Prisma client
import { prisma } from '@/prisma/client';

export async function POST(req: Request) {
    const { content, image } = await req.json();

    try {
        const post = await prisma.post.create({
            data: {
                content,
                image,
                authorId: 'some-author-id', // Replace with actual author ID
            },
        });
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}