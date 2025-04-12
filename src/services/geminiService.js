const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY is not set in environment variables');
            }
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        } catch (error) {
            console.error('Error initializing Gemini service:', error.message);
            this.model = null;
        }
    }

    async enhanceSearchResults(results) {
        try {
            if (!this.model) {
                console.warn('Gemini model not initialized, returning basic results');
                return results.map(result => ({
                    ...result,
                    summary: 'AI enhancement not available',
                    category: 'Uncategorized',
                    relevance: 5
                }));
            }

            const enhancedResults = await Promise.all(results.map(async (result) => {
                const prompt = `You are an expert search result analyzer. Analyze this search result and provide:
                1. A detailed, informative summary (3-4 sentences) that captures the main points and context
                2. A specific, relevant category from: Technology, Science, Business, Health, Education, Entertainment, Sports, Politics, or Other
                3. A relevance score (1-10) based on how well the content matches the search intent
                
                Search Result:
                Title: ${result.title}
                Snippet: ${result.snippet}
                
                Format your response exactly as:
                Summary: [your detailed summary here]
                Category: [one of the specified categories]
                Relevance: [number between 1-10]`;

                const response = await this.model.generateContent(prompt);
                const text = response.response.text();
                
                // Parse the response
                const [summary, category, relevance] = text.split('\n').map(line => line.trim());
                
                return {
                    ...result,
                    summary: summary.replace('Summary:', '').trim(),
                    category: category.replace('Category:', '').trim(),
                    relevance: parseInt(relevance.replace('Relevance:', '').trim())
                };
            }));

            return enhancedResults;
        } catch (error) {
            console.error('Error enhancing search results:', error.message);
            return results.map(result => ({
                ...result,
                summary: 'Unable to generate summary',
                category: 'Uncategorized',
                relevance: 5
            }));
        }
    }

    async getSearchSuggestions(query) {
        try {
            if (!this.model) {
                console.warn('Gemini model not initialized, returning empty suggestions');
                return [];
            }

            const prompt = `Given the search query: "${query}", provide 5 relevant search suggestions.
            Format each suggestion on a new line.`;

            const response = await this.model.generateContent(prompt);
            const text = response.response.text();
            
            return text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .slice(0, 5);
        } catch (error) {
            console.error('Error getting search suggestions:', error.message);
            return [];
        }
    }

    async generateFAQs(query) {
        try {
            if (!this.model) {
                console.warn('Gemini model not initialized, returning empty FAQs');
                return [];
            }

            const prompt = `Given the search query: "${query}", generate 5 relevant frequently asked questions (FAQs) with detailed answers.
            Each FAQ should be informative and helpful for someone interested in this topic.
            
            Important: Provide answers in plain text format only. DO NOT use markdown formatting, asterisks, bullet points, or any special formatting characters.
            
            Format your response as JSON that can be parsed:
            [
              {
                "question": "What is ${query}?",
                "answer": "Detailed answer here in plain text without any markdown formatting or special characters."
              },
              {
                "question": "Second question about ${query}?",
                "answer": "Detailed answer to second question in plain text only."
              },
              ...and so on for 5 FAQs
            ]`;

            const response = await this.model.generateContent(prompt);
            const text = response.response.text();
            
            try {
                // Extract the JSON part from the response
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                let parsedFaqs;
                
                if (jsonMatch) {
                    parsedFaqs = JSON.parse(jsonMatch[0]);
                } else {
                    // Fallback parsing if JSON extraction fails
                    parsedFaqs = JSON.parse(text);
                }
                
                // Clean up any remaining markdown formatting in the answers
                return parsedFaqs.map(faq => ({
                    question: faq.question,
                    answer: this.cleanMarkdownFormatting(faq.answer)
                }));
            } catch (parseError) {
                console.error('Error parsing FAQ JSON:', parseError.message);
                
                // Fallback to a simple format if JSON parsing fails
                return [
                    {
                        question: `What is ${query}?`,
                        answer: 'Information not available. Please try a different query.'
                    }
                ];
            }
        } catch (error) {
            console.error('Error generating FAQs:', error.message);
            return [];
        }
    }
    
    // Helper method to clean markdown formatting from text
    cleanMarkdownFormatting(text) {
        if (!text) return '';
        
        // Remove asterisks for bold/italic
        let cleaned = text.replace(/\*\*([^*]+)\*\*/g, '$1')  // Bold
                         .replace(/\*([^*]+)\*/g, '$1');      // Italic
        
        // Replace markdown bullet points with plain text
        cleaned = cleaned.replace(/^\s*\*\s+/gm, '• ');
        
        // Replace markdown numbered lists with plain text numbers
        cleaned = cleaned.replace(/^\s*\d+\.\s+/gm, (match) => match);
        
        // Remove any remaining markdown syntax like #, >, -, etc.
        cleaned = cleaned.replace(/^#+\s+/gm, '')            // Headers
                         .replace(/^>\s+/gm, '')             // Blockquotes
                         .replace(/^-\s+/gm, '• ')           // Dashed lists
                         .replace(/`([^`]+)`/g, '$1')        // Inline code
                         .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // Links
        
        return cleaned;
    }
}

module.exports = new GeminiService(); 