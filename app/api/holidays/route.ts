import { getAllHolidays } from '@/app/lib/holidays';

export async function GET(request: Request) {
    return Response.json(await getAllHolidays());
}
