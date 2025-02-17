
import { motion } from "framer-motion";
import { triggerWebhook } from "@/utils/webhookService";
import { toast } from "sonner";
import { useState } from "react";

const templates = [
  {
    id: 1,
    name: "Instagram Square",
    thumbnail: "/placeholder.svg",
    dimensions: "1080 x 1080",
  },
  {
    id: 2,
    name: "Story Template",
    thumbnail: "/placeholder.svg",
    dimensions: "1080 x 1920",
  },
  {
    id: 3,
    name: "Facebook Post",
    thumbnail: "/placeholder.svg",
    dimensions: "1200 x 630",
  },
  {
    id: 4,
    name: "Twitter Post",
    thumbnail: "/placeholder.svg",
    dimensions: "1200 x 675",
  },
];

export const TemplateGallery = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [processedDesign, setProcessedDesign] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTemplateSelect = async (template: typeof templates[0]) => {
    setIsProcessing(true);
    setSelectedTemplate(template);
    
    try {
      // Send template selection to webhook
      await triggerWebhook("template_selected", {
        templateId: template.id,
        templateName: template.name,
        dimensions: template.dimensions,
        timestamp: new Date().toISOString()
      });
      
      // Since we're using no-cors mode, we can't get the processed design directly from the response
      // In a real implementation, you might want to:
      // 1. Set up a WebSocket connection to receive the processed design
      // 2. Poll an API endpoint to check for the processed design
      // 3. Have the webhook service call back to your application
      
      // For now, we'll show a message explaining the situation
      toast.success(
        `Template "${template.name}" selected! In a production environment, the processed design would be displayed here. Currently, the webhook is triggered but we can't display the result due to CORS restrictions.`,
        { duration: 5000 }
      );
    } catch (error) {
      toast.error("Failed to process template. Please try again.");
      console.error("Error selecting template:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full py-8">
      {selectedTemplate && (
        <div className="mb-8 p-4 bg-violet-50 rounded-lg">
          <h3 className="text-lg font-medium text-violet-900 mb-2">
            Selected Template: {selectedTemplate.name}
          </h3>
          <p className="text-sm text-violet-700">
            {isProcessing ? (
              "Processing your design..."
            ) : (
              `Template dimensions: ${selectedTemplate.dimensions}`
            )}
          </p>
          {processedDesign && (
            <div className="mt-4">
              <img
                src={processedDesign}
                alt="Processed Design"
                className="max-w-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-violet-500' : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.dimensions}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
