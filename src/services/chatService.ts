import { apiRequest } from "./apiClient";

export interface User {
    id: number;
    name: string;
    avatar?: string;
    email?: string;
}

export interface Message {
    body: string;
}

export interface Conversation {
    id: number;
    user_id: number;
    participants: User[];
    last_message?: Message;
    unread_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ConversationsResponse {
    data: Conversation[];
    meta?: any;
}

export interface MessagesResponse {
    data: Message[];
    meta?: any;
}

export interface UnreadCountResponse {
    count: number;
}

export const chatService = {
    // Get all conversations can add review
    getConversations: async () => {
        const response = await apiRequest<ConversationsResponse>({
            endpoint: 'v1/chat/conversations',
            method: 'GET',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data || [];
    },

    // Get single conversation
    getConversation: async (conversationId: number) => {
        const response = await apiRequest<{ data: Conversation }>({
            endpoint: `v1/chat/conversations/${conversationId}`,
            method: 'GET',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data;
    },

    // Create new conversation
    createConversation: async (userId: number) => {
        const response = await apiRequest<{ data: Conversation }>({
            endpoint: 'v1/chat/conversations',
            method: 'POST',
            data: { user_id: userId },
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data;
    },

    // Get messages for a conversation
    getMessages: async (conversationId: number, page = 1) => {
        const response = await apiRequest<MessagesResponse>({
            endpoint: `v1/chat/conversations/${conversationId}/messages`,
            method: 'GET',
            data: { page },
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data || [];
    },

    // Send a message
    sendMessage: async (conversationId: number, formData: FormData) => {
        const response = await apiRequest({
            endpoint: `v1/chat/conversations/${conversationId}/messages`,
            method: 'POST',
            data: formData,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data;
    },

    // sendMessage: async (conversationId: number, messageBody: { body: string }) => {
    //     const response = await apiRequest<{ data: Message }>({
    //         endpoint: `v1/chat/conversations/${conversationId}/messages`,
    //         method: 'POST',
    //         data: messageBody,
    //     });

    //     if (response.error) {
    //         throw new Error(response.error);
    //     }

    //     return response.result?.data;
    // },

    // Delete a message
    deleteMessage: async (conversationId: number, messageId: number) => {
        const response = await apiRequest({
            endpoint: `v1/chat/conversations/${conversationId}/messages/${messageId}`,
            method: 'DELETE',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return true;
    },

    // Mark conversation as read
    markAsRead: async (conversationId: number) => {
        const response = await apiRequest({
            endpoint: `v1/chat/conversations/${conversationId}/read`,
            method: 'POST',
        });

        if (response.error) {
            console.error('Failed to mark as read:', response.error);
        }

        return response;
    },

    // Send typing indicator
    sendTyping: async (conversationId: number) => {
        const response = await apiRequest({
            endpoint: `v1/chat/conversations/${conversationId}/typing`,
            method: 'POST',
        });

        if (response.error) {
            console.error('Failed to send typing:', response.error);
        }

        return response;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await apiRequest<UnreadCountResponse>({
            endpoint: 'v1/chat/unread-count',
            method: 'GET',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.count || 0;
    },

    // Search users
    searchUsers: async (query: string) => {
        const response = await apiRequest<{ data: User[] }>({
            endpoint: 'v1/chat/search-users',
            method: 'GET',
            data: { q: query },
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data || [];
    },

    // Get active users
    getActiveUsers: async () => {
        const response = await apiRequest<{ data: User[] }>({
            endpoint: 'v1/chat/active-users',
            method: 'GET',
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.result?.data || [];
    },
};