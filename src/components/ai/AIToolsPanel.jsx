import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  RefreshCw,
  MessageSquare,
  Search,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Shield,
  Edit3
} from "lucide-react";
import { useAIImageGenerate, useAITextAnalysis } from "@/hooks/useAI";

const AIToolsPanel = () => {
  const [activeTab, setActiveTab] = useState("image");
  
  // Image generation
  const { generating, image, generateImage } = useAIImageGenerate();
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("thumbnail");

  // Text analysis
  const { analyzing, result, summarize, getSentiment, extractKeywords, moderateContent, improveText } = useAITextAnalysis();
  const [textInput, setTextInput] = useState("");
  const [analysisType, setAnalysisType] = useState("summarize");

  const handleGenerateImage = () => {
    if (imagePrompt.trim()) {
      generateImage(imagePrompt, imageStyle);
    }
  };

  const handleAnalyzeText = () => {
    if (!textInput.trim()) return;
    
    switch (analysisType) {
      case "summarize":
        summarize(textInput);
        break;
      case "sentiment":
        getSentiment(textInput);
        break;
      case "keywords":
        extractKeywords(textInput);
        break;
      case "moderate":
        moderateContent(textInput);
        break;
      case "improve":
        improveText(textInput);
        break;
    }
  };

  const imageStyles = [
    { value: "thumbnail", label: "Thumbnail" },
    { value: "avatar", label: "Avatar" },
    { value: "banner", label: "Banner" },
    { value: "product", label: "Product" },
    { value: "artistic", label: "Artistic" },
    { value: "minimal", label: "Minimal" },
  ];

  const analysisTypes = [
    { value: "summarize", label: "Summarize", icon: FileText },
    { value: "sentiment", label: "Sentiment", icon: ThumbsUp },
    { value: "keywords", label: "Keywords", icon: Tag },
    { value: "moderate", label: "Moderate", icon: Shield },
    { value: "improve", label: "Improve", icon: Edit3 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image Gen
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <div className="flex flex-wrap gap-2">
                {imageStyles.map((style) => (
                  <Button
                    key={style.value}
                    variant={imageStyle === style.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageStyle(style.value)}
                  >
                    {style.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe your image</label>
              <Textarea
                placeholder="A futuristic gaming setup with neon lights..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGenerateImage} 
              disabled={generating || !imagePrompt.trim()}
              className="w-full"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>

            {image && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Generated Content:</p>
                <div className="prose prose-sm max-w-none">
                  {typeof image === "string" ? image : JSON.stringify(image)}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <div className="flex flex-wrap gap-2">
                {analysisTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={analysisType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAnalysisType(type.value)}
                    className="flex items-center gap-1"
                  >
                    <type.icon className="h-3 w-3" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter text to analyze</label>
              <Textarea
                placeholder="Paste or type your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleAnalyzeText} 
              disabled={analyzing || !textInput.trim()}
              className="w-full"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Text
                </>
              )}
            </Button>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                <p className="text-sm font-medium">Analysis Result:</p>
                
                {result.summary && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Summary</p>
                    <p className="text-sm">{result.summary}</p>
                  </div>
                )}

                {result.keyPoints && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Key Points</p>
                    <ul className="list-disc list-inside text-sm">
                      {result.keyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.sentiment && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Sentiment:</p>
                    <Badge variant={
                      result.sentiment === "positive" ? "default" : 
                      result.sentiment === "negative" ? "destructive" : 
                      "secondary"
                    }>
                      {result.sentiment === "positive" ? <ThumbsUp className="h-3 w-3 mr-1" /> : 
                       result.sentiment === "negative" ? <ThumbsDown className="h-3 w-3 mr-1" /> : null}
                      {result.sentiment}
                    </Badge>
                    {result.confidence && (
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(result.confidence * 100)}% confidence)
                      </span>
                    )}
                  </div>
                )}

                {result.keywords && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.map((kw, i) => (
                        <Badge key={i} variant="outline">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.safe !== undefined && (
                  <div className="flex items-center gap-2">
                    <Shield className={result.safe ? "h-4 w-4 text-green-500" : "h-4 w-4 text-red-500"} />
                    <span className="text-sm">
                      {result.safe ? "Content is safe" : `Flagged: ${result.flags?.join(", ")}`}
                    </span>
                  </div>
                )}

                {result.improved && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Improved Text</p>
                    <p className="text-sm bg-background p-2 rounded">{result.improved}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIToolsPanel;
