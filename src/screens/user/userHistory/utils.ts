import { BookingStatusType } from './types';
import { Colors } from '../../../theme/colors';

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const getStatusColors = (status: string): { bg: string; text: string } => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'confirmed' || normalizedStatus === 'completed' || normalizedStatus === 'approved') {
        return {
            bg: Colors.statusBg,
            text: Colors.statusText,
        };
    }
    
    if (normalizedStatus === 'cancelled') {
        return {
            bg: Colors.statusSoldBg,
            text: Colors.statusSoldText,
        };
    }
    
    // Default for pending_payment, pending, etc.
    return {
        bg: Colors.statusPendingBg,
        text: Colors.statusPendingText,
    };
};

export const formatStatus = (status: string): string => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

