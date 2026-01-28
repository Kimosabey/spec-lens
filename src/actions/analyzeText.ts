'use server';

import { AnalysisResult, Input } from "@/types/data-contract";

export async function analyzeText(input: Input): Promise<AnalysisResult> {
    const NLP_URL = process.env.NLP_SERVICE_URL || "http://speclens-nlp:8000/analyze";

    try {
        const response = await fetch(NLP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NLP Service Error (${response.status}): ${errorText}`);
        }

        const result = await response.json() as AnalysisResult;
        return result;

    } catch (e) {
        console.error("Pipeline Bridge Failed:", e);
        throw e;
    }
}
