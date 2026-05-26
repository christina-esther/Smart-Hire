export default function Spinner({ fullScreen, size = 'md' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-3' };

  const spinner = (
    <div className={`${sizes[size]} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
