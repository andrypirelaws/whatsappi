import axios from 'axios';

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

class WhatsAppService {
    async sendMessage(to, text) {
        try {
            const response = await axios.post(
                WHATSAPP_API_URL,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to,
                    type: 'text',
                    text: { body: text }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error enviando WhatsApp:', error.response?.data || error.message);
            throw error;
        }
    }

    async sendTemplate(to, templateName, components = []) {
        try {
            const response = await axios.post(
                WHATSAPP_API_URL,
                {
                    messaging_product: 'whatsapp',
                    to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: { code: 'es' },
                        components
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error enviando template:', error.response?.data);
            throw error;
        }
    }

    async markAsRead(messageId) {
        try {
            await axios.post(
                WHATSAPP_API_URL,
                {
                    messaging_product: 'whatsapp',
                    status: 'read',
                    message_id: messageId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }
}

export default new WhatsAppService();
