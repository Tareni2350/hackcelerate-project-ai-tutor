
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    description: "Fundamental algebraic principles and formulas used to solve equations and analyze relationships.",
    category: "Mathematics",
    icon: <Sigma className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Variables and expressions: Using symbols to represent unknown values.",
      "Solving linear equations: Finding the value of a variable that makes an equation true (e.g., 2x + 3 = 7).",
      "Understanding polynomials: Expressions involving variables raised to non-negative integer powers (e.g., x² + 3x - 4).",
      "Graphing functions: Visualizing relationships between variables on a coordinate plane.",
      "Inequalities: Comparing expressions using symbols like <, >, ≤, ≥.",
    ],
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis Explained",
    description: "The vital process by which green plants, algae, and some bacteria use sunlight, water, and carbon dioxide to create their own food (glucose) and release oxygen.",
    category: "Biology",
    icon: <Leaf className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Inputs: Sunlight (energy), Water (H₂O), Carbon Dioxide (CO₂).",
      "Outputs: Glucose (C₆H₁₂O₆ - sugar/food), Oxygen (O₂).",
      "Role of Chlorophyll: The green pigment in chloroplasts that absorbs light energy.",
      "Light-dependent reactions: Convert light energy into chemical energy (ATP and NADPH). Occur in thylakoid membranes.",
      "Light-independent reactions (Calvin Cycle): Use ATP and NADPH to convert CO₂ into glucose. Occur in the stroma.",
    ],
  },
  {
    id: "atomic-structure",
    title: "Understanding Atomic Structure",
    description: "The basic building blocks of matter: atoms, composed of a nucleus containing protons and neutrons, surrounded by electrons in shells or orbitals.",
    category: "Chemistry",
    icon: <Atom className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Protons: Positively charged particles in the nucleus; determine the element's atomic number.",
      "Neutrons: Neutral particles in the nucleus; contribute to the atomic mass.",
      "Electrons: Negatively charged particles orbiting the nucleus in specific energy levels.",
      "Atomic Number (Z): Number of protons; defines the element.",
      "Mass Number (A): Sum of protons and neutrons.",
      "Electron Shells and Orbitals: Regions where electrons are likely to be found.",
      "Isotopes: Atoms of the same element with different numbers of neutrons.",
      "Ions: Atoms that have gained or lost electrons, resulting in a net electrical charge.",
    ],
  },
  {
    id: "world-capitals",
    title: "Major World Capitals",
    description: "A quick reference guide to important capital cities around the globe, serving as centers of government and often cultural hubs.",
    category: "Geography",
    icon: <Globe className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Washington D.C. (USA): Capital of the United States.",
      "London (UK): Capital of the United Kingdom.",
      "Paris (France): Capital of France.",
      "Tokyo (Japan): Capital of Japan.",
      "Beijing (China): Capital of the People's Republic of China.",
      "Ottawa (Canada): Capital of Canada.",
      "Canberra (Australia): Capital of Australia.",
      "New Delhi (India): Capital of India.",
    ],
  },
  {
    id: "literary-devices",
    title: "Key Literary Devices",
    description: "Common techniques used in literature to produce specific effects, enhance meaning, and engage the reader.",
    category: "Literature",
    icon: <BookText className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Metaphor: A direct comparison between two unlike things (e.g., 'Her eyes were stars.').",
      "Simile: A comparison using 'like' or 'as' (e.g., 'He runs like the wind.').",
      "Personification: Giving human qualities to inanimate objects or animals (e.g., 'The wind whispered.').",
      "Irony (Verbal, Situational, Dramatic): A contrast between expectation and reality.",
      "Foreshadowing: Hints or clues about future events in the story.",
      "Symbolism: An object, person, or idea that represents something else.",
      "Alliteration: Repetition of initial consonant sounds (e.g., 'Peter Piper picked...').",
    ],
  },
  {
    id: "newtons-laws",
    title: "Newton's Laws of Motion",
    description: "Three fundamental laws describing the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
    category: "Physics",
    icon: <Move className="h-8 w-8 text-primary" />,
    contentSummary: [
      "First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
      "Second Law (F = ma): The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (Force = mass × acceleration).",
      "Third Law (Action-Reaction): For every action, there is an equal and opposite reaction.",
      "Applications: Understanding how vehicles move, planetary orbits, and everyday interactions.",
    ],
  },
  {
    id: "french-revolution",
    title: "The French Revolution - Key Events",
    description: "A period of social and political upheaval in late 18th-century France, leading to the end of the monarchy and the establishment of a republic.",
    category: "History",
    icon: <Landmark className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Storming of the Bastille (July 14, 1789): Symbolic start of the revolution.",
      "Declaration of the Rights of Man and of the Citizen (August 1789): Foundational document outlining individual freedoms.",
      "Reign of Terror (1793-1794): Period of extreme violence and mass executions.",
      "Rise of Napoleon Bonaparte: Military leader who rose to power and became Emperor.",
      "Causes: Social inequality, financial crisis, Enlightenment ideas.",
    ],
  },
  {
    id: "basic-data-structures",
    title: "Basic Data Structures",
    description: "Fundamental ways of organizing and storing data in computer science to enable efficient access and modification.",
    category: "Computer Science",
    icon: <Binary className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Arrays: Ordered collections of elements, typically of the same type, accessed by an index.",
      "Linked Lists: Collections of nodes where each node contains data and a pointer to the next node.",
      "Stacks: Last-In, First-Out (LIFO) structure; operations include push (add) and pop (remove).",
      "Queues: First-In, First-Out (FIFO) structure; operations include enqueue (add) and dequeue (remove).",
      "Trees (Basics): Hierarchical structures with a root node and child nodes (e.g., Binary Trees).",
      "Hash Tables (Basics): Use a hash function to map keys to array indices for fast lookups.",
    ],
  },
  {
    id: "big-o-notation",
    title: "Big O Notation",
    description: "A mathematical notation used in computer science to describe the limiting behavior of a function when the argument tends towards a particular value or infinity. It characterizes an algorithm's efficiency in terms of time or space complexity.",
    category: "Computer Science",
    icon: <InfinityIcon className="h-8 w-8 text-primary" />,
    contentSummary: [
      "O(1) - Constant Time: Execution time is constant, regardless of input size.",
      "O(log n) - Logarithmic Time: Execution time grows logarithmically with input size (e.g., binary search).",
      "O(n) - Linear Time: Execution time grows linearly with input size (e.g., iterating through a list).",
      "O(n log n) - Linearithmic Time: Common for efficient sorting algorithms (e.g., merge sort, quicksort).",
      "O(n²) - Quadratic Time: Execution time grows quadratically with input size (e.g., nested loops over the same collection).",
      "O(2ⁿ) - Exponential Time: Execution time doubles with each addition to the input data set (e.g., some recursive algorithms).",
    ],
  },
  {
    id: "supply-and-demand",
    title: "Supply and Demand",
    description: "Core concepts of market economics that determine the price and quantity of goods and services. Supply represents how much the market can offer, while demand refers to how much of a product or service is desired by buyers.",
    category: "Economics",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Demand Curve: Shows the relationship between price and quantity demanded (typically downward sloping).",
      "Supply Curve: Shows the relationship between price and quantity supplied (typically upward sloping).",
      "Market Equilibrium: The point where the supply and demand curves intersect, determining equilibrium price and quantity.",
      "Price Elasticity: Measures how responsive quantity demanded or supplied is to a change in price.",
      "Shifts in Supply/Demand: Factors (e.g., income, tastes, input costs) that cause the entire curve to move.",
      "Surplus and Shortage: Conditions where quantity supplied exceeds quantity demanded, or vice-versa.",
    ],
  },
  {
    id: "literary-genres",
    title: "Literary Genres",
    description: "Categories of literary composition, characterized by similarities in form, style, or subject matter.",
    category: "Literature",
    icon: <Library className="h-8 w-8 text-primary" />,
    contentSummary: [
      "Fiction: Imaginative narrative (e.g., Novel, Short Story, Novella).",
      "Non-Fiction: Factual prose (e.g., Biography, Autobiography, Essay, History).",
      "Poetry: Expressive writing often using rhythm, rhyme, and meter (e.g., Lyric, Narrative, Epic, Haiku).",
      "Drama: Works intended for performance, with dialogue and stage directions (e.g., Tragedy, Comedy, Melodrama).",
      "Fantasy: Contains magical or supernatural elements.",
      "Science Fiction: Based on imagined future scientific or technological advances.",
      "Mystery/Thriller: Revolves around solving a crime or a suspenseful plot.",
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
            Access key educational content and solved examples. Click on a card to view details.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offlineResources.map((resource) => (
          <Dialog key={resource.id}>
            <DialogTrigger asChild>
              <Card className="shadow-lg flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-200">
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
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{resource.description}</p>
                  <h4 className="font-semibold mb-1 text-foreground/80 text-sm">Key Points Preview:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-foreground/70">
                    {resource.contentSummary.slice(0, 2).map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                    {resource.contentSummary.length > 2 && <li>...and more</li>}
                  </ul>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{resource.title}</DialogTitle>
                    <DialogDescription className="text-md">{resource.category}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-foreground/90">
                    {resource.contentSummary.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-8 italic text-sm">
        Note: This page displays sample offline content. For true offline access (e.g., loading this page without an internet connection after the first visit), a Progressive Web App (PWA) setup with service workers has been initiated. Ensure you visit this page online once for it to be cached by the service worker.
      </p>
    </div>
  );
}

