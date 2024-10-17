import LoadingSpinner from "./_components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <LoadingSpinner />
    </div>
  );
}
