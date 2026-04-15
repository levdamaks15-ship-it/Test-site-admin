'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAiInsightAction(data: any) {
  if (!API_KEY) {
    return "Ошибка конфигурации: API ключ не обнаружен. Пожалуйста, добавь GEMINI_API_KEY в переменные окружения Vercel.";
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    const prompt = `
      ТЫ: Элитный бизнес-консультант по недвижимости (RentFlow AI).
      КОНТЕКСТ: Платформа "Arenda LUX" (Казахстан).
      ДАННЫЕ: ${JSON.stringify(data)}
      
      ЗАДАЧА:
      1. Проанализируй текущую выручку и заказы.
      2. Предложи 3 конкретные стратегии (ценообразование, маркетинг, сервис).
      3. Стиль: Профессиональный, лаконичный, с использованием символа ✦.
      
      ОТВЕТ В ФОРМАТЕ MARKDOWN.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return `Ошибка RentFlow AI: ${error.message || "Не удалось связаться с сервером аналитики."}`;
  }
}
