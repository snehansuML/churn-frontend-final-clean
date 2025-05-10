import React, { useState, useEffect } from "react";
import { askChatGPT } from "api/api";
import { jsPDF } from "jspdf";

export default function GPTInsights() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState([]);

  // Load real customer dataset
  useEffect(() => {
    fetch("/data/telecom_customers_with_clusters.json")
      .then(res => res.json())
      .then(setCustomerData)
      .catch(err => console.error("Failed to load customer data:", err));
  }, []);

  
  
  const handleChat = async () => {
    if (!question || customerData.length === 0) return;

    setLoading(true);
    setResponse("Thinking...");

    try {
      const reply = await askChatGPT(question, customerData);
      setResponse(reply || "No response from ChatGPT.");
    } catch (err) {
      console.error("ChatGPT error:", err);
      setResponse("❌ Error reaching ChatGPT backend.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("ChatGPT Response:", 10, 10);
    const splitText = doc.splitTextToSize(response, 180);
    doc.text(splitText, 10, 20);
    doc.save("chat_response.pdf");
  };

  console.log("Question:", question);
  console.log("Data sample:", customerData.slice(0, 2));


  return (
    <div className="chart-card">
      <h3>Ask ChatGPT About Your Customer Data</h3>
      <input
        type="text"
        placeholder="e.g. Why is churn high in Cluster 3?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "100%",
          padding: "0.75rem",
          marginBottom: "1rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={handleChat}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          marginRight: "1rem"
        }}
      >
        {loading ? "Thinking..." : "Ask ChatGPT"}
      </button>

      {response && (
        <div
          style={{
            marginTop: "1rem",
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px"
          }}
        >
          <strong>Response:</strong>
          <p>{response}</p>

          <button
            onClick={downloadPDF}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "6px"
            }}
          >
            Download Chat as PDF
          </button>
        </div>
      )}
    </div>
  );
}
