import React, { useState } from 'react';
import { Loader2, TrendingUp, Building2, FileText } from 'lucide-react';

export default function CompetitiveAnalysis() {
  const [userInput, setUserInput] = useState('');
  const [defaultBank] = useState('Maybank');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const generateAnalysis = async () => {
    if (!userInput.trim()) {
      setError('Please enter some input for the analysis');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Call the Anthropic API with the competitive analysis prompt
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
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

Format your response in clear sections with bullet points where appropriate.`
            }
          ],
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]?.text) {
        setAnalysis(data.content[0].text);
      } else {
        setError('Unable to generate analysis. Please try again.');
      }
    } catch (err) {
      setError('Error generating analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnalysis();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border-t-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Competitive Analysis Tool
              </h1>
              <p className="text-gray-600 mt-1">
                Powered by AI • Default Bank: <span className="font-semibold text-yellow-600">{defaultBank}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            What would you like to analyze?
          </label>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your analysis request... (e.g., 'Compare Maybank's digital banking services with competitors', 'Analyze Maybank's position in the SME lending market')"
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none resize-none transition-colors"
            rows="4"
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="w-4 h-4" />
              <span>Analysis focused on {defaultBank}</span>
            </div>
            
            <button
              onClick={generateAnalysis}
              disabled={loading || !userInput.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-100">
              <FileText className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Analysis Results
              </h2>
            </div>
            
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setUserInput('');
                }}
                className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2 transition-colors"
              >
                ← Start New Analysis
              </button>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!analysis && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">💡 Tips for Better Analysis</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Be specific about the aspect you want to analyze (e.g., products, services, market segments)</li>
              <li>• Include timeframes if relevant (e.g., "current market position", "trends over the past year")</li>
              <li>• Mention specific competitors if you have them in mind</li>
              <li>• Ask about specific metrics or KPIs you're interested in</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
