'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAiInsightAction(data: any) {
  if (!API_KEY) {
    return "Ошибка конфигурации: API ключ не обнаружен на сервере.";
  }

  try {
    // Используем ТОЧНОЕ НАЗВАНИЕ из твоего списка: gemini-flash-latest (без 1.5)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Ты — элитный бизнес-консультант.
      Проанализируй данные: ${JSON.stringify(data)}
      Дай 3 коротких совета по бизнесу на русском языке.
      Используй эмодзи ✦.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    return `Ошибка ИИ: ${error.message || "Неизвестная ошибка"}`;
  }
}
