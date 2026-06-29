import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { TasteQueryManager } from "../../src/ingestion/taste_query_manager.js";

/**
 * ÆRTA AI MCP Server
 * This server connects the Gemma 4 Brain to the local SQLite substrate.
 */
const server = new Server(
  {
    name: "arta-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tasteQueryManager = new TasteQueryManager();
// Initialize the DB connection
await tasteQueryManager.init();

/**
 * Tool Definitions
 * We will implement these incrementally based on the MCP Specification.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_triptych_context",
        description: "Returns the Triptych of Context (Core, Tide, and Gap) to provide the Brain with the user's emotional landscape.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_taste_signals",
        description: "Returns a compact taste profile derived from the user's history.",
        inputSchema: {
          type: "object",
          properties: {
            medium: { 
              type: "string", 
              enum: ["cinema", "literature", "all"],
              description: "Filter by medium" 
            },
            depth: { 
              type: "string", 
              enum: ["compact", "standard", "deep"],
              description: "Detail level of the profile" 
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_triptych_context": {
        const context = await tasteQueryManager.getTriptychContext();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(context, null, 2),
            },
          ],
        };
      }

      case "get_taste_signals": {
        const signals = await tasteQueryManager.getTasteSignals();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(signals, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ÆRTA MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});