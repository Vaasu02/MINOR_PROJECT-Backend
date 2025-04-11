const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

class GoogleSearchService {
    constructor() {
        this.apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
        this.searchEngineId = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
    }

    async search(query, options = {}) {
        try {
            const response = await customsearch.cse.list({
                auth: this.apiKey,
                cx: this.searchEngineId,
                q: query,
                num: options.num || 10,
                safe: options.safeSearch ? 'active' : 'off',
                lr: options.language ? `lang_${options.language}` : undefined,
                cr: options.region ? options.region : undefined
            });

            return response.data.items.map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }));
        } catch (error) {
            console.error('Google Search Error:', error);
            throw new Error('Failed to perform search');
        }
    }
}

module.exports = new GoogleSearchService(); 