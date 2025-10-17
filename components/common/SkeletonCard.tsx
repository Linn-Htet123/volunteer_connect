import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export const SkeletonCard = () => (
  <Card className="overflow-hidden p-0 border-0 shadow-none mb-4">
    <Skeleton className="w-full h-50 rounded-t-lg rounded-b-none" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
  </Card>
);
