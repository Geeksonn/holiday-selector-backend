import getUser from '@/lib/auth';
import { getAllHolidays, createHoliday } from '@/lib/holidays';

export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const user = await getUser(token);
    if (!user) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const data = await getAllHolidays(token, user.id);

        return Response.json(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error retrieving holiday data:', error);
        return Response.json({ error: 'Cannot retrieve holiday data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return Response.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const user = await getUser(token);
    if (!user) {
        return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const holiday = await request.json();

    try {
        const data = await createHoliday(token, holiday);
        return Response.json(JSON.stringify(data), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error creating holiday:', error);
        return Response.json({ error: 'Cannot create holiday' }, { status: 500 });
    }
}
