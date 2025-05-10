// src/api.js

export async function askChatGPT(question, customerData) {
  const sampleData = customerData.slice(0, 30); // Use only a subset to avoid token overflow

  const context = `
CX Intelligence Toolkit – Customer Sample Dataset

Each object represents a telecom customer, including churn status, cluster ID, plan, billing, campaign response, revenue, etc.

Sample Data:
${JSON.stringify(sampleData, null, 2)}

Business Question:
${question}
`;

  const res = await fetch("https://churn-dashboard-final.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: context })
  });

  const result = await res.json();
  return result.reply;
}
