
'use server';
/**
 * @fileOverview An AI flow to generate a mind map for a given complex concept.
 *
 * - generateMindmap - A function that handles the mind map generation process.
 * - GenerateMindmapInput - The input type for the generateMindmap function.
 * - GenerateMindmapOutput - The return type for the generateMindmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const mindmapDepthLevels = ["Overview", "Detailed"] as const;

export const GenerateMindmapInputSchema = z.object({
  concept: z.string().min(3, { message: "Concept must be at least 3 characters." }).max(200, {message: "Concept cannot exceed 200 characters."}),
  depth: z.enum(mindmapDepthLevels).optional().default("Overview").describe("The desired depth or detail level of the mind map."),
  numMainBranches: z.coerce.number().min(2, {message: "Must have at least 2 main branches."}).max(7, {message: "Cannot exceed 7 main branches."}).optional().default(4).describe("Suggested number of main branches from the central concept."),
});
export type GenerateMindmapInput = z.infer<typeof GenerateMindmapInputSchema>;

// Recursive schema for mind map nodes
const MindMapNodeSchema: z.ZodType<MindMapNode> = z.object({
  id: z.string().describe("A unique identifier for this node (e.g., 'root', 'branch-1', 'branch-1-1')."),
  text: z.string().describe("The text/label for this mind map node."),
  children: z.array(z.lazy(() => MindMapNodeSchema)).optional().describe("An array of child nodes branching from this node."),
});

// Define the type explicitly for recursion
export interface MindMapNode {
  id: string;
  text: string;
  children?: MindMapNode[];
}

export const GenerateMindmapOutputSchema = z.object({
  rootNode: MindMapNodeSchema.describe("The root node of the mind map, representing the main concept and its branches."),
  summary: z.string().optional().describe("A brief textual summary or overview of the mind map's structure or key takeaways."),
});
export type GenerateMindmapOutput = z.infer<typeof GenerateMindmapOutputSchema>;

export async function generateMindmap(input: GenerateMindmapInput): Promise<GenerateMindmapOutput> {
  return generateMindmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindmapPrompt',
  input: {schema: GenerateMindmapInputSchema},
  output: {schema: GenerateMindmapOutputSchema},
  prompt: `You are an expert in creating structured mind maps for complex concepts.
The user wants to generate a mind map for the concept: "{{{concept}}}".

Consider the requested depth: "{{{depth}}}".
For "Overview", focus on the primary branches and direct sub-points.
For "Detailed", try to go one or two levels deeper for each main branch.

Aim for around {{{numMainBranches}}} main branches stemming directly from the central concept, unless the concept naturally lends itself to more or fewer.

Please generate a mind map with a clear hierarchical structure. The main concept should be the root.
Each node in the mind map must have a unique 'id' string (e.g., "root", "branch-1", "branch-1-sub-1") and 'text' content.
Child nodes should be nested under their parent in the 'children' array.

Your output MUST be a JSON object adhering to the following schema:
{
  "rootNode": {
    "id": "string (e.g., 'root')",
    "text": "string (the central concept)",
    "children": [
      {
        "id": "string (e.g., 'branch-1')",
        "text": "string (main branch 1)",
        "children": [
          { "id": "string (e.g., 'branch-1-1')", "text": "string (sub-point)" }
          // ... more sub-points or deeper children
        ]
      }
      // ... more main branches
    ]
  },
  "summary": "string (optional: A brief textual summary of the mind map structure or key insights)"
}

Example of a simple mind map structure for "Photosynthesis" (Overview, 3 main branches):
{
  "rootNode": {
    "id": "root",
    "text": "Photosynthesis",
    "children": [
      {
        "id": "inputs",
        "text": "Inputs",
        "children": [
          { "id": "sunlight", "text": "Sunlight (Energy)" },
          { "id": "water", "text": "Water (H2O)" },
          { "id": "co2", "text": "Carbon Dioxide (CO2)" }
        ]
      },
      {
        "id": "process",
        "text": "Process Stages",
        "children": [
          { "id": "light-dependent", "text": "Light-Dependent Reactions" },
          { "id": "calvin-cycle", "text": "Calvin Cycle (Light-Independent)" }
        ]
      },
      {
        "id": "outputs",
        "text": "Outputs",
        "children": [
          { "id": "glucose", "text": "Glucose (C6H12O6)" },
          { "id": "oxygen", "text": "Oxygen (O2)" }
        ]
      }
    ]
  },
  "summary": "Photosynthesis is the process plants use to convert light energy into chemical energy, taking in sunlight, water, and CO2, and producing glucose and oxygen through light-dependent reactions and the Calvin cycle."
}

Now, generate the mind map for the concept: "{{{concept}}}".
`,
});

const generateMindmapFlow = ai.defineFlow(
  {
    name: 'generateMindmapFlow',
    inputSchema: GenerateMindmapInputSchema,
    outputSchema: GenerateMindmapOutputSchema,
  },
  async (input: GenerateMindmapInput) => {
    const {output} = await prompt(input);
    if (!output || !output.rootNode) {
      console.error("generateMindmapFlow: AI prompt did not return a valid root node for the mind map.", {input, output});
      throw new Error("The AI was unable to generate a mind map for the given concept. The root node is missing.");
    }
    // Ensure IDs are somewhat unique if AI doesn't do a great job, simple prefixing for now.
    // A more robust solution might involve UUIDs or hashing.
    let counter = 0;
    function ensureNodeIds(node: MindMapNode, parentId: string = "node"): void {
      node.id = `${parentId}-${counter++}`;
      if (node.children) {
        node.children.forEach(child => ensureNodeIds(child, node.id));
      }
    }
    ensureNodeIds(output.rootNode, 'root');

    return output;
  }
);

