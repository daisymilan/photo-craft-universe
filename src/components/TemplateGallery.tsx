
import { motion } from "framer-motion";

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
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
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
