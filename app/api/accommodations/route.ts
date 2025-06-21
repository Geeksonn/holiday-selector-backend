import { createAccommodation } from '@/lib/accommodations';
import getUser from '@/lib/auth';

export async function POST(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const user = await getUser(token);
    if (!user) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const accommodation = await request.json();

    try {
        const data = await createAccommodation(token, accommodation);
        return Response.json(data, {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating holiday:', error);
        return Response.json({ error: 'Cannot create holiday' }, { status: 500 });
    }
}
