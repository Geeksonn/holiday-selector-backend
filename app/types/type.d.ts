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
