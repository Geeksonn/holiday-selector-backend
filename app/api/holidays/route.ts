import { getAllHolidays } from '@/app/lib/holidays';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    return Response.json(await getAllHolidays());
}
