
import { PhotoUpload } from "@/components/PhotoUpload";
import { TemplateGallery } from "@/components/TemplateGallery";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Photo Craft Universe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your photos into stunning social media content with our
            beautiful templates and intuitive tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PhotoUpload />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Choose Your Template
          </h2>
          <TemplateGallery />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
