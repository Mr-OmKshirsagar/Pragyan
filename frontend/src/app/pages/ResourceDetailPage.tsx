import { motion } from 'motion/react';
import { ChevronLeft, ExternalLink, BookOpen, Video, FileText, Lightbulb } from 'lucide-react';
import { Resource } from '../types/roadmap';
import { GlassButton } from '../components/GlassButton';

interface ResourceDetailPageProps {
  resource: Resource;
  taskTitle: string;
  onBack: () => void;
}

export function ResourceDetailPage({ resource, taskTitle, onBack }: ResourceDetailPageProps) {
  const getResourceIcon = (type?: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-8 h-8 text-red-400" />;
      case 'documentation':
        return <BookOpen className="w-8 h-8 text-blue-400" />;
      case 'article':
        return <FileText className="w-8 h-8 text-purple-400" />;
      case 'interactive':
        return <Lightbulb className="w-8 h-8 text-yellow-400" />;
      default:
        return <BookOpen className="w-8 h-8 text-blue-400" />;
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case 'mdn':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'w3schools':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'youtube':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      case 'freecodecamp':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <p className="text-slate-400 text-sm mb-1">Resource for:</p>
            <h1 className="text-3xl font-bold text-white">{taskTitle}</h1>
          </div>
        </motion.div>

        {/* Resource Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 rounded-lg p-8 mb-8 backdrop-blur-sm"
        >
          {/* Resource Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              {getResourceIcon(resource.type)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{resource.title}</h2>
              {resource.platform && (
                <div
                  className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${getPlatformColor(
                    resource.platform
                  )}`}
                >
                  {resource.platform}
                </div>
              )}
            </div>
          </div>

          {/* Resource Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Resource Type</p>
              <p className="text-white capitalize">
                {resource.type ? resource.type.replace(/_/g, ' ') : 'Learning Material'}
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Resource URL</p>
              <p className="text-blue-400 break-all text-sm font-mono">{resource.url}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <GlassButton className="w-full flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Resource
              </GlassButton>
            </a>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
        >
          <p className="text-blue-200 text-sm">
            💡 <span className="font-semibold">Tip:</span> Take notes while going through this resource.
            Try to understand the concepts and practice with examples.
          </p>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            ← Back to Task
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
