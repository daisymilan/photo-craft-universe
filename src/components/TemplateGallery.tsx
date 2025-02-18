
import { motion } from "framer-motion";
import { triggerWebhook } from "@/utils/webhookService";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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

// Mock function to simulate polling the server for the processed design
const pollForDesign = async (templateId: number): Promise<string> => {
  // In a real implementation, this would make an API call to check the status
  // For demo purposes, we'll simulate a response after 2 seconds
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demonstration, we'll return a placeholder image
      resolve("/placeholder.svg");
    }, 2000);
  });
};

export const TemplateGallery = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [processedDesign, setProcessedDesign] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollingId, setPollingId] = useState<NodeJS.Timeout | null>(null);

  // Cleanup polling when component unmounts or when selection changes
  useEffect(() => {
    return () => {
      if (pollingId) {
        clearInterval(pollingId);
      }
    };
  }, [pollingId]);

  const startPolling = async (templateId: number) => {
    let attempts = 0;
    const maxAttempts = 10; // Maximum number of polling attempts

    const pollInterval = setInterval(async () => {
      try {
        attempts++;
        const design = await pollForDesign(templateId);
        
        if (design) {
          setProcessedDesign(design);
          setIsProcessing(false);
          clearInterval(pollInterval);
          toast.success("Your design is ready!");
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          setIsProcessing(false);
          toast.error("Design processing timed out. Please try again.");
        }
      } catch (error) {
        clearInterval(pollInterval);
        setIsProcessing(false);
        toast.error("Failed to retrieve processed design");
      }
    }, 2000); // Poll every 2 seconds

    setPollingId(pollInterval);
  };

  const handleTemplateSelect = async (template: typeof templates[0]) => {
    setIsProcessing(true);
    setSelectedTemplate(template);
    setProcessedDesign(null);
    
    try {
      await triggerWebhook("template_selected", {
        templateId: template.id,
        templateName: template.name,
        dimensions: template.dimensions,
        timestamp: new Date().toISOString()
      });
      
      // Start polling for the processed design
      startPolling(template.id);
      
      toast.success(`Processing template "${template.name}". Please wait...`);
    } catch (error) {
      toast.error("Failed to process template. Please try again.");
      console.error("Error selecting template:", error);
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
