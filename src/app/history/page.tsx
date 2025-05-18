
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Client-side db instance
import { collection, query, orderBy, getDocs, type Timestamp } from 'firebase/firestore';
import { HistoryItemCard, type HistoryEntryServer } from './components/history-item-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History as HistoryIcon, AlertCircle } from 'lucide-react';

// Convert server-side HistoryEntry to client-side with Date object
export interface HistoryEntryClient extends Omit<HistoryEntryServer, 'timestamp'> {
  id: string;
  timestamp: Date | null;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryEntryClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => {
          const data = doc.data() as HistoryEntryServer;
          return {
            ...data,
            id: doc.id,
            timestamp: data.timestamp ? (data.timestamp as unknown as Timestamp).toDate() : null,
          };
        });
        setHistoryItems(items);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err instanceof Error ? err.message : "Failed to load history. Ensure Firestore is configured correctly and you have permission to read the 'history' collection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <HistoryIcon className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Learning History</h1>
          <p className="text-muted-foreground">
            Review your past interactions and learning sessions.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Activity Log</CardTitle>
          <CardDescription>
            Browse through your previously generated explanations, quizzes, and analyses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-md shadow-sm">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading History</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && historyItems.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No history found. Start using the AI Tutor features to build your learning log!
            </p>
          )}

          {!isLoading && !error && historyItems.length > 0 && (
            <div className="space-y-6">
              {historyItems.map(item => (
                <HistoryItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
       <p className="text-center text-muted-foreground mt-8 italic text-sm">
        Note: History is saved to Firestore. Ensure your Firestore security rules are configured to allow reads and writes to the 'history' collection. This version does not implement user-specific history; all entries are currently global.
      </p>
    </div>
  );
}
