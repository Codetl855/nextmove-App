export type TabType = 'Booking' | 'Auction';

export type BookingStatusType = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingData {
    property_id: number;
    property_title: string;
    property_address: string;
    property_price: string;
    property_type: string;
    property_created_at: string;
    booking_created_at: string;
    check_in: string;
    check_out: string;
    duration_days: number;
    status: BookingStatusType | string;
    user_email: string;
    user_mobile: string;
    primary_image: string;
}

export interface AuctionBid {
    id: number;
    user_id: number;
    property_id: number;
    property_owner_id: number;
    amount: number;
    status: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        profile_image_url: string | null;
    };
    property: {
        id: number;
        title: string;
        address: string;
        price: number;
        property_type: string;
    };
    created_at: string;
    updated_at: string;
}




