import getUser from '@/lib/auth';
import { getHolidayById, deleteHoliday } from '@/lib/holidays';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        const data = await getHolidayById(token, id);

        return Response.json(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error retrieving holiday data:', error);
        return Response.json({ error: 'Cannot retrieve holiday data' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        await deleteHoliday(token, id);
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting holiday:', error);
        return Response.json({ error: 'Cannot delete holiday' }, { status: 500 });
    }
}
