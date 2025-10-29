import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Upload, ShieldQuestion, FileQuestion, Loader } from "lucide-react";
import { createProject } from "@/services/projectService";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/layouts/toast/miniToast";
import { useAuth } from "@/auth/AuthContext";

interface ProjectSubmissionFormProps {
  onClose: () => void;
}

const ProjectSubmissionForm: React.FC<ProjectSubmissionFormProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [tags, setTags] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentTech, setCurrentTech] = useState("");
  const [currentTool, setCurrentTool] = useState("");

  // Key features state
  const [keyFeatures, setKeyFeatures] = useState<
    { name: string; description: string }[]
  >([{ name: "", description: "" }]);

  // Industry options from the backend model
  const industryOptions = [
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Technology",
    "Entertainment",
    "Transportation",
    "Agriculture",
    "Energy",
    "Other",
  ];

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  // Handle technology input
  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTech.trim()) {
      e.preventDefault();
      if (!technologies.includes(currentTech.trim())) {
        setTechnologies([...technologies, currentTech.trim()]);
      }
      setCurrentTech("");
    }
  };

  // Handle tool input
  const handleToolKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTool.trim()) {
      e.preventDefault();
      if (!tools.includes(currentTool.trim())) {
        setTools([...tools, currentTool.trim()]);
      }
      setCurrentTool("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setImageUrl(result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Remove technology
  const removeTech = (techToRemove: string) => {
    setTechnologies(technologies.filter((tech) => tech !== techToRemove));
  };

  // Remove tool
  const removeTool = (toolToRemove: string) => {
    setTools(tools.filter((tool) => tool !== toolToRemove));
  };

  // Add key feature field
  const addKeyFeature = () => {
    setKeyFeatures([...keyFeatures, { name: "", description: "" }]);
  };

  // Remove key feature field
  const removeKeyFeature = (index: number) => {
    const updatedFeatures = [...keyFeatures];
    updatedFeatures.splice(index, 1);
    setKeyFeatures(updatedFeatures);
  };

  // Update key feature field
  const updateKeyFeature = (
    index: number,
    field: "name" | "description",
    value: string
  ) => {
    const updatedFeatures = [...keyFeatures];
    updatedFeatures[index][field] = value;
    setKeyFeatures(updatedFeatures);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      showErrorToast("Project title is required");
      return;
    }

    if (!description.trim()) {
      showErrorToast("Project description is required");
      return;
    }

    // Filter out empty key features
    const validKeyFeatures = keyFeatures.filter(
      (feature) => feature.name.trim() && feature.description.trim()
    );

    try {
      setLoading(true);

      // Create project data
      const projectData = {
        title,
        description,
        industry,
        tags,
        technologies,
        tools,
        image: imageUrl,
        key_features: validKeyFeatures,
      };

      console.log("Submitting project data:", projectData);

      // Submit project
      await createProject(projectData);

      // Show success message and close modal
      showSuccessToast(
        "Project submitted successfully! It will be reviewed by our team before appearing on the platform."
      );
      setLoading(false);
      onClose();

      // Don't navigate to the project page - it's not reviewed yet and will cause a 403/500 error
      // The project will appear in the admin panel for review
    } catch (error) {
      console.error("Error submitting project:", error);
      showErrorToast("Failed to submit project. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto mt-24">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6">
          <div className="text-xl font-sans flex items-center gap-2">
            Project Submission
            <p className="relative group inline-block cursor-pointer">
              <FileQuestion />
              <span
                className="absolute min-w-[300px] mb-2 left-1/2 transform -translate-x-1/2 
               invisible opacity-0 group-hover:visible group-hover:opacity-100 
               bg-black/80 text-white text-xs rounded p-2 
               transition-opacity duration-300 text-wrap z-50"
              >
                The submitted project will be reviewed by the community moderators and will be
                added to the platform if it meets the criteria. This helps us
                maintain the quality of the platform and ensure that only
                relevant and high-quality projects are available.
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="Enter project title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="Describe your project in detail"
                rows={5}
                required
              />
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
              >
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a URL to an image representing your project
              </p>
            </div>

            <div>
              <label
                htmlFor="image"
                className="text-xs font-medium text-gray-700 mb-1 pr-4"
              >
                Or Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs px-2 py-1 bg-blue-500/20 rounded-md text-sm hover:cursor-pointer"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tags & Technologies</h3>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-700/20 text-green-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-green-700 hover:text-green-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="Type tag and press Enter"
              />
            </div>

            <div>
              <label
                htmlFor="technologies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-700/20 text-amber-700"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="ml-1 text-amber-700 hover:text-amber-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="technologies"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyDown={handleTechKeyDown}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="Type technology and press Enter"
              />
            </div>

            <div>
              <label
                htmlFor="tools"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tools Used
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-700/20 text-purple-700"
                  >
                    {tool}
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="ml-1 text-purple-700 hover:text-purple-900"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="tools"
                value={currentTool}
                onChange={(e) => setCurrentTool(e.target.value)}
                onKeyDown={handleToolKeyDown}
                className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                placeholder="Type tool and press Enter"
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Key Features</h3>
              <button
                type="button"
                onClick={addKeyFeature}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-700/20 rounded-md"
              >
                <Plus size={14} className="mr-1" /> Add Feature
              </button>
            </div>

            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Feature {index + 1}</h4>
                  {keyFeatures.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={`feature-name-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Feature Name
                  </label>
                  <input
                    type="text"
                    id={`feature-name-${index}`}
                    value={feature.name}
                    onChange={(e) =>
                      updateKeyFeature(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                    placeholder="Feature name"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`feature-desc-${index}`}
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Feature Description
                  </label>
                  <textarea
                    id={`feature-desc-${index}`}
                    value={feature.description}
                    onChange={(e) =>
                      updateKeyFeature(index, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-200 rounded-md text-sm"
                    placeholder="Describe this feature"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-black rounded-md flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2"><Loader /></span>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Submit Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmissionForm;
