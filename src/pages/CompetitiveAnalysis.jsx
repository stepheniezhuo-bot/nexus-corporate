import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { TrendingUp, Building2, FileText } from "lucide-react";

const CompetitiveAnalysis = () => {
  const [userInput, setUserInput] = useState("");
  const [defaultBank] = useState("Maybank");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const generateAnalysis = async () => {
    if (!userInput.trim()) {
      setError("Please enter some input for the analysis");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `You are a banking competitive analysis expert. Analyze the following scenario for ${defaultBank}:

User Input: ${userInput}

Please provide a comprehensive competitive analysis that includes:
1. Market Position: Where ${defaultBank} stands in relation to competitors
2. Key Competitors: Identify main competitors and their strengths
3. Competitive Advantages: ${defaultBank}'s unique selling points
4. Areas for Improvement: Where ${defaultBank} could strengthen its position
5. Strategic Recommendations: Actionable insights for ${defaultBank}

Format your response in clear sections with bullet points where appropriate.`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.content && data.content[0]?.text) {
        setAnalysis(data.content[0].text);
      } else {
        setError("Unable to generate analysis. Please try again.");
      }
    } catch (err) {
      setError("Error generating analysis: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAnalysis();
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Card sx={{ mb: 3, borderTop: `4px solid #FFD200` }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ bgcolor: "#FFD200", p: 1.5, borderRadius: 3 }}>
              <TrendingUp size={32} color="white" />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Competitive Analysis Tool
              </Typography>
              <Typography color="text.secondary">
                Powered by AI • Default Bank:{" "}
                <Typography component="span" fontWeight="bold" color="#004684">
                  {defaultBank}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" component="label" fontWeight="semibold" gutterBottom>
          What would you like to analyze?
        </Typography>
        <TextField
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your analysis request..."
          fullWidth
          multiline
          rows={4}
          variant="outlined"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Building2 size={16} />
            Analysis focused on {defaultBank}
          </Typography>
          <Button
            onClick={generateAnalysis}
            disabled={loading || !userInput.trim()}
            variant="contained"
            sx={{ bgcolor: "#004684", "&:hover": { bgcolor: "#003366" } }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileText size={20} />}
          >
            {loading ? "Analyzing..." : "Generate Analysis"}
          </Button>
        </Box>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {analysis && (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, pb: 2, borderBottom: 1, borderColor: "grey.200" }}>
            <FileText size={24} color="#004684" />
            <Typography variant="h5" component="h2" fontWeight="bold">
              Analysis Results
            </Typography>
          </Box>
          <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {analysis}
          </Typography>
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: "grey.200" }}>
            <Button
              onClick={() => {
                setAnalysis(null);
                setUserInput("");
              }}
              sx={{ color: "#004684", fontWeight: "bold" }}
            >
              ← Start New Analysis
            </Button>
          </Box>
        </Card>
      )}

      {!analysis && !loading && (
        <Card sx={{ p: 3, bgcolor: "#FDFCE8", border: `1px solid #FFD200` }}>
          <Typography variant="h6" fontWeight="semibold" gutterBottom>💡 Tips for Better Analysis</Typography>
          <ul>
            <li>Be specific about the aspect you want to analyze (e.g., products, services, market segments)</li>
            <li>Include timeframes if relevant (e.g., "current market position", "trends over the past year")</li>
            <li>Mention specific competitors if you have them in mind</li>
            <li>Ask about specific metrics or KPIs you're interested in</li>
          </ul>
        </Card>
      )}
    </Container>
  );
};

export default CompetitiveAnalysis;
