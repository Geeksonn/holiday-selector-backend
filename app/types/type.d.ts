declare interface Holiday {
    id?: string;
    title: string;
    start_date: string;
    end_date: string;
    participants: string[];
    number_accommodations?: number;
    number_rooms?: number;
    max_price?: number;
    max_distance?: number;
    max_travel_time?: number;
}

declare interface Accommodation {
    id?: string;
    name: string;
    rooms: number;
    price: number;
    distance: number;
    travel_time: number;
    description: string;
    website: string;
    holiday_id: string; // ID of the holiday this accommodation belongs to
    votes: string[]; // list of emails
    added_by: string; // email of the user who added the accommodation
}
