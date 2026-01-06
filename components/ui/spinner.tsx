export default function Spinner({
  size = "md", color = "blue" }: {
    size?: "sm" | "md" | "lg";
    color?: "blue" | "gray" | "white" | "green";
  }) {
  // Mapping sizes to Tailwind classes
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-8",
  };

  // Mapping colors to Tailwind classes
  const colorClasses = {
    blue: "border-blue-500",
    gray: "border-gray-300",
    white: "border-white",
    green: "border-green-800"
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">...</span>
    </div>
  );
}