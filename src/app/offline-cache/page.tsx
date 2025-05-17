import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, BookOpen, Sigma, Atom, Leaf, Globe } from "lucide-react";

interface OfflineResource {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  contentSummary: string[];
}

const offlineResources: OfflineResource[] = [
  {
    id: "algebra-basics",
    title: "Key Concepts in Algebra",
    description: "Fundamental algebraic principles and formulas.",
    category: "Mathematics",
    icon: <Sigma className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Variables and expressions",
      "Solving linear equations",
      "Understanding polynomials",
      "Graphing functions",
    ],
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis Explained",
    description: "The process by which green plants use sunlight, water, and carbon dioxide.",
    category: "Biology",
    icon: <Leaf className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Inputs: Sunlight, Water, CO2",
      "Outputs: Glucose, Oxygen",
      "Role of Chlorophyll",
      "Light-dependent and Light-independent reactions",
    ],
  },
  {
    id: "atomic-structure",
    title: "Understanding Atomic Structure",
    description: "The basic building blocks of matter: atoms and their components.",
    category: "Chemistry",
    icon: <Atom className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Protons, Neutrons, Electrons",
      "Atomic Number and Mass Number",
      "Electron Shells and Orbitals",
      "Isotopes and Ions",
    ],
  },
  {
    id: "world-capitals",
    title: "Major World Capitals",
    description: "A quick reference guide to important capital cities around the globe.",
    category: "Geography",
    icon: <Globe className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Washington D.C. (USA)",
      "London (UK)",
      "Paris (France)",
      "Tokyo (Japan)",
      "Beijing (China)",
    ],
  },
];

export default function OfflineCachePage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Archive className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Offline Knowledge Cache</h1>
          <p className="text-muted-foreground">
            Access key educational content and solved examples even without an internet connection.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offlineResources.map((resource) => (
          <Card key={resource.id} className="shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 pb-3">
              <div className="p-2 bg-primary/10 rounded-md">
                {resource.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{resource.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm mb-3">{resource.description}</p>
              <h4 className="font-semibold mb-1 text-foreground/80">Key Points:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                {resource.contentSummary.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-8 italic">
        Note: This page demonstrates sample offline content. In a real application, this data would be cached for offline access.
      </p>
    </div>
  );
}
