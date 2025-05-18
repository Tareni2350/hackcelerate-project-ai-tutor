
"use client";

import type { MindMapNode } from "@/ai/flows/generate-mindmap-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, CornerDownRight, Minus } from "lucide-react";

interface MindMapNodeDisplayProps {
  node: MindMapNode;
  level: number;
  isLastChildStack: boolean[]; // To track if parent nodes were last children
}

function MindMapNodeDisplay({ node, level, isLastChildStack }: MindMapNodeDisplayProps) {
  const cardBaseClasses = "mb-3 shadow-sm";
  const cardColorClasses = level === 0 
    ? "bg-primary/10 border-primary/30" 
    : level === 1 
    ? "bg-accent/10 border-accent/30" 
    : "bg-card/80 border-border";

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={cn("relative pl-0", level > 0 ? "ml-8" : "")}>
      {level > 0 && (
        <div className="absolute -left-6 top-[18px] h-full flex items-start">
          {isLastChildStack.slice(0, -1).map((isLast, idx) => (
            <div key={idx} className={cn("w-5 h-full", !isLast ? "border-l border-muted-foreground/30" : "")}></div>
          ))}
          <CornerDownRight className="h-5 w-5 text-muted-foreground/50 -translate-x-1" />
          <Minus className="h-px w-2 text-muted-foreground/50 mt-[9px] -translate-x-1" />
        </div>
      )}
      
      <Card className={cn(cardBaseClasses, cardColorClasses)}>
        <CardHeader className="py-2 px-3">
          <CardTitle className={cn("text-base", level === 0 ? "text-lg font-semibold text-primary-foreground dark:text-primary" : "text-sm font-medium")}>
            {node.text}
          </CardTitle>
        </CardHeader>
      </Card>

      {hasChildren && (
        <div className={cn("relative", level === 0 ? "mt-4" : "mt-2")}>
          {node.children?.map((childNode, index) => (
            <MindMapNodeDisplay
              key={childNode.id}
              node={childNode}
              level={level + 1}
              isLastChildStack={[...isLastChildStack, index === (node.children?.length ?? 0) - 1]}
            />
          ))}
        </div>
      )}
    </div>
  );
}


interface MindMapDisplayProps {
  rootNode: MindMapNode;
}

export function MindMapDisplay({ rootNode }: MindMapDisplayProps) {
  if (!rootNode) return <p className="text-muted-foreground">No mind map data to display.</p>;

  return (
    <div className="mt-4 space-y-4 overflow-x-auto p-1">
      <MindMapNodeDisplay node={rootNode} level={0} isLastChildStack={[]} />
    </div>
  );
}
