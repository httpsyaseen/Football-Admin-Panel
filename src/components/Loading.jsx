import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 pt-5 flex-col items-center space-y-4 justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium text-primary">Loading...</p>
    </div>
  );
}
