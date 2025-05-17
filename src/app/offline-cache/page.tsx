
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, BookOpen, Sigma, Atom, Leaf, Globe, BookText, Move, Landmark, Binary, InfinityIcon, TrendingUp, Library } from "lucide-react";

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
  {
    id: "literary-devices",
    title: "Key Literary Devices",
    description: "Common techniques used in literature to produce specific effects.",
    category: "Literature",
    icon: <BookText className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Metaphor & Simile",
      "Personification",
      "Irony (Verbal, Situational, Dramatic)",
      "Foreshadowing",
      "Symbolism",
    ],
  },
  {
    id: "newtons-laws",
    title: "Newton's Laws of Motion",
    description: "Three fundamental laws describing the relationship between a body and the forces acting upon it.",
    category: "Physics",
    icon: <Move className="h-8 w-8 text-primary" />,
    contentSummary: [
      "First Law: Inertia",
      "Second Law: F = ma (Force = mass x acceleration)",
      "Third Law: Action and Reaction",
      "Applications in everyday life",
    ],
  },
  {
    id: "french-revolution",
    title: "The French Revolution - Key Events",
    description: "A brief overview of major turning points in the French Revolution.",
    category: "History",
    icon: <Landmark className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Storming of the Bastille (1789)",
      "Declaration of the Rights of Man and of the Citizen",
      "Reign of Terror (1793-1794)",
      "Rise of Napoleon Bonaparte",
    ],
  },
  {
    id: "basic-data-structures",
    title: "Basic Data Structures",
    description: "Fundamental ways of organizing and storing data in computer science.",
    category: "Computer Science",
    icon: <Binary className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Arrays",
      "Linked Lists",
      "Stacks & Queues",
      "Trees (Basics)",
      "Hash Tables (Basics)",
    ],
  },
  {
    id: "big-o-notation",
    title: "Big O Notation",
    description: "Understanding algorithmic complexity and efficiency.",
    category: "Computer Science",
    icon: <InfinityIcon className="h-8 w-8 text-primary" />,
    contentSummary: [
      "O(1) - Constant Time",
      "O(log n) - Logarithmic Time",
      "O(n) - Linear Time",
      "O(n log n) - Linearithmic Time",
      "O(n²) - Quadratic Time",
    ],
  },
  {
    id: "supply-and-demand",
    title: "Supply and Demand",
    description: "Core concepts of market economics.",
    category: "Economics",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Demand Curve",
      "Supply Curve",
      "Market Equilibrium",
      "Price Elasticity",
      "Shifts in Supply/Demand",
    ],
  },
  {
    id: "literary-genres",
    title: "Literary Genres",
    description: "Categories of literary composition.",
    category: "Literature",
    icon: <Library className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Fiction (Novel, Short Story)",
      "Non-Fiction (Biography, Essay)",
      "Poetry (Lyric, Narrative, Epic)",
      "Drama (Tragedy, Comedy)",
      "Fantasy & Science Fiction",
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
            Access key educational content and solved examples.
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
        Note: This page displays sample offline content. The content itself is part of the application code. For true offline access (e.g., loading this page without an internet connection after the first visit), a Progressive Web App (PWA) setup with service workers is required and has been initiated. Ensure you visit this page online once for it to be cached.
      </p>
    </div>
  );
}
