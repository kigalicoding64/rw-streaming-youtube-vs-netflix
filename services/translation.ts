
import { LanguageCode, ContentItem, ContentTranslation } from '../types';
import { api } from './api';
import { kero } from './gemini';

class TranslationService {
  async getTranslatedContent(item: ContentItem, targetLang: LanguageCode): Promise<ContentTranslation> {
    // 1. Check if same language
    if (item.originalLanguage === targetLang) {
      // Fix: Added missing 'language' property to conform to ContentTranslation interface
      return {
        title: item.title,
        description: item.description,
        category: item.category,
        isAiGenerated: false,
        verifiedByAdmin: true,
        language: targetLang
      };
    }

    // 2. Check Cache
    const cached = api.getTranslation(item.id, targetLang);
    if (cached) return cached;

    // 3. Translate with AI with a safety wrapper
    try {
      const translated = await kero.translateContent(
        { title: item.title, description: item.description, category: item.category },
        targetLang,
        item.originalLanguage
      );

      // 4. Save to Cache only if it didn't error out
      if (!translated.translationError) {
        api.saveTranslation(item.id, targetLang, translated);
      }
      
      return translated;
    } catch (error) {
      console.error("TranslationService: Error calling Kero", error);
      // Return original content but flag as translation failed
      // Fix: Added missing 'language' property to the error fallback object
      return {
        title: item.title,
        description: item.description,
        category: item.category,
        isAiGenerated: false,
        verifiedByAdmin: false,
        translationError: true,
        language: targetLang
      };
    }
  }

  // Common UI labels
  getLabel(key: string, lang: LanguageCode): string {
    const labels: Record<string, Record<LanguageCode, string>> = {
      'watch_now': {
        'rw': 'Kureba ubu',
        'en': 'Watch Now',
        'fr': 'Regarder maintenant',
        'sw': 'Tazama sasa',
        'zh': '立即观看',
        'hi': 'अभी देखें',
        'am': 'አሁን ይመልከቱ',
        'ar': 'شاهد الآن'
      },
      'trending': {
        'rw': 'Ibikunzwe ubu',
        'en': 'Trending Now',
        'fr': 'Tendances',
        'sw': 'Inayovuma',
        'zh': '热门',
        'hi': 'प्रचलित',
        'am': 'በመታየት ላይ ያለ',
        'ar': 'رائج'
      }
    };
    return labels[key]?.[lang] || labels[key]?.['en'] || key;
  }
}

export const translator = new TranslationService();
