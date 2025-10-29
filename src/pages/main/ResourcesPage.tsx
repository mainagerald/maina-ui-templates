import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Resource, getResources } from "../../services/resourceService";
import {
  Newspaper,
  Search,
  Calendar,
  Tag,
  ArrowRight,
  Rss,
  Bell,
  Bot,
  RefreshCw,
  ExternalLink,
  LucideNewspaper,
} from "lucide-react";
import { Spinner } from "@/components/layouts/state";

// Resource type adapter to match the UI components
type UIResource = {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  date: string;
  category: string;
  image: string;
  url: string;
  tags: string[];
  featured: boolean;
};

// Type definition for tag props to fix TypeScript errors
type TagProps = {
  tag: string;
  index: number;
};

// Categories for filtering
const categories = [
  "All",
  "Research",
  "Industry",
  "Open Source",
  "Developer Tools",
  "Business",
  "Ethics",
];

// News article card component
const NewsCard = ({ article }: { article: UIResource }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl overflow-hidden flex flex-col h-full"
  >
    <div className="h-60 overflow-hidden relative">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover rounded-xl"
      />
      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
        {article.category}
      </div>
      {article.featured && (
        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          Featured
        </div>
      )}
    </div>

    <div className="p-5 flex-grow flex flex-col">
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Calendar className="w-3 h-3 mr-1" />
        <span>{article.date}</span>
        <span className="mx-2">•</span>
        <span>{article.source}</span>
      </div>

      <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-4 flex-grow text-sm">
        {article.content.startsWith("Share this")
          ? article.content
              .replace("Share this", "")
              .split(" ")
              .slice(0, 100)
              .join(" ")
          : article.content.split(" ").slice(0, 100).join(" ") + "..."}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        {article.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 text-sm font-sans flex items-center hover:underline mt-1"
      >
        Read Full Article <ArrowRight className="ml-1 w-4 h-4" />
      </a>
    </div>
  </motion.div>
);

// Featured article component
const FeaturedArticle = ({ article }: { article: UIResource }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-transparent rounded-xl overflow-hidden"
  >
    <div className="relative min-h-[400px]">
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover rounded-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 rounded-xl">
        <div className="flex gap-2 mb-3">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
            {article.category}
          </span>
          <span className="inline-block bg-amber-500 text-white px-3 py-1 text-xs rounded-full">
            Featured
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{article.title}</h2>
        <div className="flex items-center text-white/80">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="mr-2">{article.date}</span>
          <span className="mr-2">•</span>
          <span>{article.source}</span>
        </div>
      </div>
    </div>

    <div className="p-6 flex flex-col">
      <p className="text-gray-700 mb-6 text-sm">
        {article.content.split(" ").slice(0, 150).join(" ")}...
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {article.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block underline text-blue-600 py-3 px-6 rounded-lg flex items-center hover:text-blue-800 transition-colors"
        >
          Read Full Article <ExternalLink size={18} className="ml-2" />
        </a>
      </div>
    </div>
  </motion.div>
);

// News update feature component
const NewsUpdateFeature = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered News Collection",
      description:
        "Our intelligent agent continuously scans the web for the latest AI and software development news.",
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-blue-600" />,
      title: "Daily Updates",
      description:
        "Fresh content added daily to keep you informed about the rapidly evolving tech landscape.",
    },
    {
      icon: <Tag className="h-6 w-6 text-blue-600" />,
      title: "Smart Categorization",
      description:
        "News is automatically categorized and tagged for easy filtering and discovery.",
    },
    {
      icon: <Bell className="h-6 w-6 text-blue-600" />,
      title: "Custom Alerts",
      description:
        "Set up personalized notifications for topics and technologies you care about most.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Helper function to convert Resource to UIResource format
const mapResourceToUIFormat = (resource: Resource): UIResource => {
  return {
    id: resource.public_id,
    title: resource.title,
    content: resource.content || "",
    summary: resource.summary || resource.description,
    source: resource.source_name || resource.source,
    date: resource.published_date
      ? new Date(resource.published_date).toLocaleDateString()
      : new Date().toLocaleDateString(),
    category: resource.resource_type || "Uncategorized",
    image:
      resource.image_url ||
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    url: resource.url || "#",
    tags: Array.isArray(resource.tags) ? resource.tags : [],
    featured: resource.is_featured || false,
  };
};

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<UIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await getResources((status = "approved"));
        console.log("response on mount", response);

        if (response && Array.isArray(response)) {
          const uiResources = response.map(mapResourceToUIFormat);

          console.log("uiResources", uiResources);

          if (uiResources.length > 0 && !uiResources.some((r) => r.featured)) {
            uiResources[0].featured = true;
          }

          setResources(uiResources);

          console.log("resources", resources);
        } else {
          setError("Invalid response format from API");
          setResources([]);
        }
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to fetch resources. Please try again later.");
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const resourceCategories = [
    "All",
    ...new Set(resources.map((resource) => resource.category)),
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "All" || resource.category === activeCategory;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredResource = resources.find((resource) => resource.featured);

  return (
    <main className="responsive-container mt-16">
      <div className="space-y-12 mt-20 mb-20 bg-transparent">
        {/* Search and Filter */}
        <section className="mb-4 pb-2 bg-transparent">
          <div className="text-2xl font-sans flex flex-row text-black">
            <LucideNewspaper
              size={20}
              className="mr-2 text-green-600 p-1 h-8 w-8 border rounded-full"
            />
            Discover the latest news and updates from aggregated sources, with
            AI-powered insights and analysis.
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner />{" "}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex justify-center items-center py-20">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {/* No Resources State */}
        {!loading && !error && resources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No resources available. Check back later for updates.
            </p>
          </div>
        )}

        {/* Content when resources are loaded */}
        {!loading && !error && resources.length > 0 && (
          <>
            {/* Featured Resource */}
            {featuredResource && (
              <section className="mb-10 pt-1 bg-inherit">
                <FeaturedArticle article={featuredResource as UIResource} />
              </section>
            )}

            {/* Latest Resources */}
            <section className="mb-16 bg-transparent">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-sans">Latest</h2>
                <div className="flex items-center text-blue-600">
                  <Rss size={16} className="mr-2" />
                  <span>Subscribe to updates</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources
                  .filter((resource) => !resource.featured)
                  .map((resource) => (
                    <NewsCard key={resource.id} article={resource} />
                  ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No resources found matching your criteria. Try adjusting
                    your filters.
                  </p>
                </div>
              )}
            </section>

            {/* News Update Feature */}
            <section className="mb-16 bg-transparent">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  How Our Resource System Works
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our AI-powered resource aggregation system keeps you informed
                  with minimal effort.
                </p>
              </div>
              <NewsUpdateFeature />
            </section>

            {/* <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-green-600/30 text-white p-10 rounded-2xl text-center"
            >
              <Newspaper className="h-12 w-12 mx-auto mb-6 text-black/80" />
              <h2 className="text-3xl text-black/80 mb-4">Never Miss an Update</h2>
              <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto">
                Subscribe to our weekly newsletter and get the latest AI and software development news delivered to your inbox.
              </p>
              
              <div className="max-w-md mx-auto flex flex-col">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow py-3 px-4 rounded-3xl focus:outline-none text-gray-100"
                />
                <button className="mt-2 inline-block bg-black text-white py-2 px-3 rounded-3xl hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.section> */}
          </>
        )}
      </div>
    </main>
  );
};

export default ResourcesPage;
