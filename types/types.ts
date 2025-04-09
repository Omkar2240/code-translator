export interface TranslateRequest {
    code: string;
    sourceLang: string;
    targetLang: string;
  }
  
  export interface TranslateResponse {
    translatedCode: string;
  }
  