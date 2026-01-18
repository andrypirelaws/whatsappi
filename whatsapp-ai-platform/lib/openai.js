import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIResponse(messages, options = {}) {
    try {
        const completion = await openai.chat.completions.create({
            model: options.model || 'gpt-4',
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 150,
            presence_penalty: 0.6,
            frequency_penalty: 0.3,
        });

        return {
            text: completion.choices.message.content,
            usage: completion.usage,
            model: completion.model
        };
    } catch (error) {
        console.error('Error OpenAI:', error);
        throw error;
    }
}

export async function detectIntent(message) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Clasifica en: purchase_status, raffle_info, payment, complaint, greeting, thanks, other. Responde solo la categoría.`
                },
                { role: 'user', content: message }
            ],
            temperature: 0.3,
            max_tokens: 20
        });
        return completion.choices.message.content.trim().toLowerCase();
    } catch (error) {
        return 'other';
    }
}

export default openai;
