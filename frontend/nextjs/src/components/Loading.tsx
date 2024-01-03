export function Loading() {
  return (
    <div className="flex justify-center rounded  p-4" aria-label="読み込み中">
      <div className="animate-spin h-7 w-7 border-2 border-gray-900 rounded-full border-t-transparent"></div>
    </div>
  );
}
