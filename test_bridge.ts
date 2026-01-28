import { analyzeText } from "./src/actions/analyzeText";

async function test() {
    console.log("Testing Bridge...");
    try {
        const result = await analyzeText({ text: "Test input" });
        console.log("Bridge Success!");
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error("Bridge Failed:", e);
    }
}

test();
