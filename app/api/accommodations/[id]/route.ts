import { updateAccommodation } from '@/lib/accommodations';
import getUser from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const user = await getUser(token);
    if (!user) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const modification = await request.json();
        if (!modification || typeof modification !== 'object') {
            return Response.json({ error: 'Invalid modification data' }, { status: 400 });
        }

        await updateAccommodation(token, id, modification);
        return Response.json({ message: 'Holiday updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating holiday:', error);
        return Response.json({ error: 'Cannot update holiday' }, { status: 500 });
    }
}
