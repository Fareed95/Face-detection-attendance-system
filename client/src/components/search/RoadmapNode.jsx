export default function RoadmapNode({ 
  title, 
  type = 'default', 
  isCompleted = false,
  children,
  description,
  isRecommended = false 
}) {
  const getNodeStyle = () => {
    switch (type) {
      case 'main':
        return 'bg-yellow-300 border-yellow-400';
      case 'recommended':
        return 'bg-purple-100 border-purple-300';
      case 'optional':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-[#f8e5b9] border-[#e5d4a1]';
    }
  };

  return (
    <div className="relative">
      <div className={`
        ${getNodeStyle()}
        rounded-md p-3 px-4
        border-2
        transition-all
        cursor-pointer
        hover:shadow-lg
        min-w-[180px]
        relative
      `}>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <div className="absolute -left-2 -top-2 bg-purple-600 rounded-full p-1">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {isRecommended && (
            <div className="absolute -right-2 -top-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              Recommended
            </div>
          )}
          <span className="text-black font-medium">{title}</span>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="ml-8 mt-4 pl-4 border-l-2 border-dashed border-gray-300">
          {children}
        </div>
      )}
    </div>
  );
} 