import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import useProjects from "../../hooks/useProjects";
import Button from "../../components/ui/Button";
import {
  Calendar,
  Eye,
  Heart,
  Pencil,
  Share2,
  Trash2,
  Copy,
  Twitter,
  Linkedin,
  Play,
  Clock,
  LineChart,
  MessageSquareQuote,
  Plus,
  ChevronLeft,
  Star,
  Award,
  Target,
  Sparkles,
  Zap,
  AlertTriangle,
  Search,
  FolderOpen,
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getThemeColors } = useTheme();
  const { getProjectById, deleteProject, incrementEngagement } = useProjects();
  const colors = getThemeColors();
  const overviewRef = useRef(null);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        // Increment engagement when viewing details
        incrementEngagement(id);

        // Add animation class to overview after loading
        setTimeout(() => {
          if (overviewRef.current) {
            overviewRef.current.classList.add("animate-fade-in");
          }
        }, 300);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, getProjectById, incrementEngagement]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    setDeleteLoading(true);
    try {
      await deleteProject(id);
      navigate("/projects");
    } catch (error) {
      setError(error.message);
      setDeleteLoading(false);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyProjectLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Project link copied to clipboard!");
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4"
          style={{ borderColor: colors.primary }}
        ></div>
        <p
          className="text-lg animate-pulse flex items-center"
          style={{ color: colors.text }}
        >
          <Clock className="mr-2 h-5 w-5" />
          Loading project details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-red-700 mb-2 flex items-center justify-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Something went wrong
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16 animate-fade-in max-w-md mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-yellow-700 mb-4 flex items-center justify-center">
            <Search className="mr-2 h-5 w-5" />
            Project not found
          </h2>
          <p className="text-yellow-600 mb-6">
            The project you're looking for might have been removed or is
            unavailable.
          </p>
          <Button onClick={() => navigate("/projects")}>
            <FolderOpen className="mr-1 h-4 w-4" />
            Explore Other Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-container animate-fade-in">
      {/* Hero Section */}
      <div className="bg-[#0a1029] py-10 mb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center text-white">
              <Calendar className="h-5 w-5 mr-2 text-blue-300" />
              <span>
                {new Date(project.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center text-white">
              <Eye className="h-5 w-5 mr-2 text-blue-300" />
              <span>{project.analytics?.views || 0} Views</span>
            </div>
            <div className="flex items-center text-white">
              <Heart className="h-5 w-5 mr-2 text-blue-300" />
              <span>{project.analytics?.engagement || 0} Engagements</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pb-4">
            <Link to={`/projects/${id}/edit`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium flex items-center shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/30">
                <Pencil className="h-4 w-4 mr-2 animate-pulse" />
                Edit Project
              </button>
            </Link>

            <div className="relative">
              <button
                onClick={handleShare}
                className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium flex items-center shadow-lg transition-all hover:scale-105 hover:shadow-lg"
              >
                <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                Share
              </button>
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white z-10 animate-fade-in">
                  <div className="py-1">
                    <button
                      onClick={copyProjectLink}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-2 text-gray-500" />
                      Copy Link
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=Check out this project: ${
                        project.title
                      }&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                      Share on Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.href
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      Share on LinkedIn
                    </a>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`w-12 h-12 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all hover:scale-105 hover:shadow-red-600/30 ${
                deleteLoading ? "opacity-50" : ""
              }`}
              title="Delete Project"
            >
              {deleteLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Media Gallery */}
        {project.mediaGallery && project.mediaGallery.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl font-bold mb-6 inline-flex items-center relative"
              style={{ color: colors.text }}
            >
              <Sparkles className="mr-2 text-blue-500" size={20} />
              Project Gallery
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></span>
            </h2>
            <div className="mb-6">
              <div
                className="aspect-video rounded-xl overflow-hidden shadow-xl border-2 relative group"
                style={{ borderColor: colors.primary }}
              >
                {project.mediaGallery[activeImageIndex].type === "image" ? (
                  <img
                    src={project.mediaGallery[activeImageIndex].url}
                    alt={
                      project.mediaGallery[activeImageIndex].caption ||
                      `Project media`
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <iframe
                      src={project.mediaGallery[activeImageIndex].url}
                      title={
                        project.mediaGallery[activeImageIndex].caption ||
                        `Project video`
                      }
                      className="w-full h-full"
                      allowFullScreen
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-20 h-20 text-white opacity-50 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-black/50 rounded-full px-3 py-1 text-white text-xs">
                  {activeImageIndex + 1} / {project.mediaGallery.length}
                </div>
              </div>
              {project.mediaGallery[activeImageIndex].caption && (
                <p
                  className="mt-3 text-center italic px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
                  style={{ color: colors.text }}
                >
                  <MessageSquareQuote className="inline-block h-4 w-4 mr-2 text-blue-500" />
                  {project.mediaGallery[activeImageIndex].caption}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {project.mediaGallery.map((media, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-lg overflow-hidden transition-all transform hover:scale-105 ${
                    activeImageIndex === index
                      ? "ring-4 ring-offset-2 shadow-lg"
                      : "opacity-70 hover:opacity-100 shadow-sm"
                  }`}
                  style={{ ringColor: colors.primary }}
                  onClick={() => setActiveImageIndex(index)}
                >
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={media.caption || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview */}
        <div
          className="mb-16 opacity-0 transition-opacity duration-500"
          ref={overviewRef}
        >
          <h2
            className="text-2xl font-bold mb-6 inline-flex items-center relative"
            style={{ color: colors.text }}
          >
            <Target className="mr-2 text-blue-500" size={20} />
            Project Overview
            <span
              className="absolute bottom-0 left-0 w-full h-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></span>
          </h2>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-l-4 hover:shadow-xl transition-shadow duration-300"
            style={{
              backgroundColor: colors.background,
              borderLeftColor: colors.primary,
            }}
          >
            <div className="relative px-4">
              <p
                className="text-lg leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: colors.text, wordBreak: "break-word", maxWidth: "100%" }}
              >
                {project.overview || "No overview available"}
              </p>
            </div>
          </div>
        </div>

        {/* Tools Used */}
        {project.tools && project.tools.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl font-bold mb-6 inline-flex items-center relative"
              style={{ color: colors.text }}
            >
              <Zap className="mr-2 text-blue-500" size={20} />
              Tools & Technologies
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></span>
            </h2>
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              style={{ backgroundColor: colors.background }}
            >
              <div className="flex flex-wrap gap-3 stagger-children">
                {project.tools.map((tool, index) => (
                  <div
                    key={index}
                    className="px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-110 hover:-rotate-3 shadow-md flex items-center"
                    style={{
                      backgroundColor: colors.accent,
                      color: "#fff",
                    }}
                  >
                    {tool.icon ? (
                      <img
                        src={tool.icon}
                        alt=""
                        className="w-4 h-4 inline-block mr-2"
                      />
                    ) : (
                      <Star className="h-4 w-4 mr-2" />
                    )}
                    {tool.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {project.timeline && project.timeline.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl font-bold mb-6 inline-flex items-center relative"
              style={{ color: colors.text }}
            >
              <Clock className="mr-2 text-blue-500" size={20} />
              Project Timeline
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></span>
            </h2>
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              style={{ backgroundColor: colors.background }}
            >
              <div className="relative">
                {/* Timeline line */}
                <div
                  className="absolute left-6 md:left-8 top-0 h-full w-0.5"
                  style={{ backgroundColor: colors.primary }}
                ></div>

                <div className="space-y-8 stagger-children">
                  {project.timeline.map((event, index) => (
                    <div key={index} className="relative group">
                      <div className="flex items-start">
                        {/* Timeline dot */}
                        <div
                          className="absolute left-6 md:left-8 w-5 h-5 rounded-full transform -translate-x-1/2 mt-1.5 transition-all group-hover:scale-125 flex items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>

                        <div className="ml-12 md:ml-16 transition-all group-hover:translate-x-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                            <h3
                              className="font-bold text-lg"
                              style={{ color: colors.primary }}
                            >
                              {event.title}
                            </h3>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium flex items-center"
                              style={{
                                backgroundColor: colors.accent + "40",
                                color: colors.text,
                              }}
                            >
                              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <p
                            className="text-base"
                            style={{ color: colors.text }}
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outcomes */}
        {project.outcomes && (
          <div className="mb-16">
            <h2
              className="text-2xl font-bold mb-6 inline-flex items-center relative"
              style={{ color: colors.text }}
            >
              <Award className="mr-2 text-blue-500" size={20} />
              Project Outcomes
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></span>
            </h2>

            {/* Metrics */}
            {project.outcomes.metrics &&
              project.outcomes.metrics.length > 0 && (
                <div className="mb-10">
                  <h3
                    className="text-xl font-semibold mb-6 flex items-center"
                    style={{ color: colors.text }}
                  >
                    <LineChart className="mr-2 text-blue-500" size={18} />
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                    {project.outcomes.metrics.map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl hover:-rotate-1 text-center"
                        style={{ backgroundColor: colors.background }}
                      >
                        <p
                          className="font-medium text-lg mb-3 flex items-center justify-center"
                          style={{ color: colors.text }}
                        >
                          <Target className="h-4 w-4 mr-2 text-blue-500" />
                          {metric.label}
                        </p>
                        <p
                          className="text-4xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
                          style={{
                            backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                          }}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Testimonials */}
            {project.outcomes.testimonials &&
              project.outcomes.testimonials.length > 0 && (
                <div>
                  <h3
                    className="text-xl font-semibold mb-6 flex items-center"
                    style={{ color: colors.text }}
                  >
                    <MessageSquareQuote
                      className="mr-2 text-blue-500"
                      size={18}
                    />
                    Testimonials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
                    {project.outcomes.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-t-4 relative transform transition-all hover:scale-102 hover:shadow-xl group"
                        style={{
                          backgroundColor: colors.background,
                          borderTopColor: colors.primary,
                        }}
                      >
                        <div
                          className="absolute -top-4 left-6 w-8 h-8 rounded-full flex items-center justify-center transform transition-transform group-hover:rotate-12"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <MessageSquareQuote className="h-4 w-4 text-white" />
                        </div>
                        <p
                          className="mb-4 text-lg italic"
                          style={{ color: colors.text, wordBreak: "break-word", maxWidth: "100%" }}
                        >
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p
                              className="font-semibold"
                              style={{ color: colors.text }}
                            >
                              {testimonial.author}
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: colors.text }}
                            >
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Call to Action */}
        <div
          className="mb-16 bg-gradient-to-r rounded-xl shadow-xl p-8 text-center transform transition-transform hover:scale-102"
          style={{
            backgroundImage: `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}30)`,
          }}
        >
          <h2
            className="text-2xl font-bold mb-4 flex items-center justify-center"
            style={{ color: colors.text }}
          >
            <Sparkles className="mr-2 text-blue-500" size={20} />
            Ready to create another amazing project?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto" style={{ color: colors.text }}>
            Use your creative skills to build something new and showcase it in
            your portfolio.
          </p>
          <Link to="/projects/create">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium text-lg flex items-center shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/30 mx-auto">
              <Plus className="h-5 w-5 mr-2" />
              Start New Project
            </button>
          </Link>
        </div>

        {/* Back to Projects */}
        <div className="text-center mb-12">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-medium transition-colors hover:translate-x-1 transform px-4 py-2 rounded-full hover:bg-gray-100"
            style={{ color: colors.primary }}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to All Projects
          </Link>
        </div>
      </div>

      {/* Add the CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .project-details-container {
          overflow-x: hidden;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
