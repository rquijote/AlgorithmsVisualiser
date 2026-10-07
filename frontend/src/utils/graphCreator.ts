export interface GraphCreatorRow {
  node: string;
  neighbors: string;
}

export interface GraphLayoutNode {
  x: number;
  y: number;
}

export interface GraphCreatorResult {
  graph: Record<number, number[]>;
  root: number | null;
  positions: Record<number, GraphLayoutNode>;
  levelCount: number;
  error: string;
  isValid: boolean;
}

function parseIntegerList(value: string): number[] | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  const tokens = trimmed.split(/[\s,]+/);
  if (tokens.some((token) => !/^-?\d+$/.test(token))) {
    return null;
  }

  const values = tokens.map(Number);
  if (values.some((value) => !Number.isSafeInteger(value))) {
    return null;
  }

  return values;
}

export function buildGraphFromRows(rows: GraphCreatorRow[], rootDraft: string): GraphCreatorResult {
  const rootTrimmed = rootDraft.trim();
  if (!rootTrimmed || !/^-?\d+$/.test(rootTrimmed)) {
    return {
      graph: {},
      root: null,
      positions: {},
      levelCount: 0,
      error: "Enter a valid root node.",
      isValid: false,
    };
  }

  const root = Number(rootTrimmed);
  if (!Number.isSafeInteger(root)) {
    return {
      graph: {},
      root: null,
      positions: {},
      levelCount: 0,
      error: "Enter a valid root node.",
      isValid: false,
    };
  }

  const graph: Record<number, number[]> = {};
  const definedNodes = new Set<number>();

  for (const row of rows) {
    const nodeText = row.node.trim();
    const neighborsText = row.neighbors.trim();

    if (!nodeText && !neighborsText) {
      continue;
    }

    if (!nodeText) {
      return {
        graph: {},
        root: null,
        positions: {},
        levelCount: 0,
        error: "Each row needs a node value.",
        isValid: false,
      };
    }

    if (!/^-?\d+$/.test(nodeText)) {
      return {
        graph: {},
        root: null,
        positions: {},
        levelCount: 0,
        error: "Node values must be whole numbers.",
        isValid: false,
      };
    }

    const node = Number(nodeText);
    if (!Number.isSafeInteger(node)) {
      return {
        graph: {},
        root: null,
        positions: {},
        levelCount: 0,
        error: "Node values must be whole numbers.",
        isValid: false,
      };
    }

    if (definedNodes.has(node)) {
      return {
        graph: {},
        root: null,
        positions: {},
        levelCount: 0,
        error: `Node ${node} appears more than once.`,
        isValid: false,
      };
    }

    const neighborValues = parseIntegerList(row.neighbors);
    if (neighborValues === null) {
      return {
        graph: {},
        root: null,
        positions: {},
        levelCount: 0,
        error: "Neighbors must be whole numbers separated by commas or spaces.",
        isValid: false,
      };
    }

    graph[node] = neighborValues;
    definedNodes.add(node);

    for (const neighbor of neighborValues) {
      if (!graph[neighbor]) {
        graph[neighbor] = [];
      }
    }
  }

  if (!(root in graph)) {
    return {
      graph,
      root: null,
      positions: {},
      levelCount: 0,
      error: "Root must match a node in the graph.",
      isValid: false,
    };
  }

  const visited = new Set<number>();
  const queue: Array<{ node: number; level: number }> = [{ node: root, level: 1 }];
  const levels = new Map<number, number[]>();
  const parentMap = new Map<number, number | null>();
  parentMap.set(root, null);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    if (visited.has(current.node)) {
      continue;
    }

    visited.add(current.node);

    if (current.level > 8) {
      return {
        graph,
        root,
        positions: {},
        levelCount: 0,
        error: "The graph can have at most 8 levels from the root.",
        isValid: false,
      };
    }

    const levelNodes = levels.get(current.level) ?? [];
    levelNodes.push(current.node);
    levels.set(current.level, levelNodes);

    for (const neighbor of graph[current.node] ?? []) {
      if (!visited.has(neighbor)) {
        if (!parentMap.has(neighbor)) {
          parentMap.set(neighbor, current.node);
        }
        queue.push({ node: neighbor, level: current.level + 1 });
      }
    }
  }

  const canvasWidth = 700;
  const levelSpacing = 92;
  const topPadding = 52;
  const positions: Record<number, GraphLayoutNode> = {};

  const orderedLevels = [...levels.entries()].sort(([left], [right]) => left - right);
  const totalLevels = orderedLevels.length;

  const leafWidths = new Map<number, number>();

  function getSubtreeWidth(node: number): number {
    const children = (graph[node] ?? []).filter((child) => parentMap.get(child) === node);

    if (children.length === 0) {
      return 1;
    }

    const childWidths = children.map((child) => getSubtreeWidth(child));
    const totalChildrenWidth = childWidths.reduce((sum, width) => sum + width, 0);
    const gap = children.length > 1 ? 0.45 * (children.length - 1) : 0;
    const width = Math.max(1, totalChildrenWidth + gap);
    leafWidths.set(node, width);
    return width;
  }

  getSubtreeWidth(root);

  function layoutNode(node: number, left: number, right: number, level: number) {
    const children = (graph[node] ?? []).filter((child) => parentMap.get(child) === node);
    const centerX = (left + right) / 2;
    positions[node] = {
      x: centerX,
      y: topPadding + (level - 1) * levelSpacing,
    };

    if (children.length === 0) {
      return;
    }

    if (children.length === 1) {
      layoutNode(children[0], centerX, centerX, level + 1);
      return;
    }

    const widths = children.map((child) => leafWidths.get(child) ?? 1);
    const totalWidth = widths.reduce((sum, width) => sum + width, 0);
    const totalGap = 36 * (children.length - 1);
    const usableWidth = Math.max(0, right - left - totalGap);
    let cursor = left;

    children.forEach((child, index) => {
      const segmentWidth = totalWidth > 0 ? (usableWidth * widths[index]) / totalWidth : usableWidth / children.length;
      const segmentLeft = cursor;
      const segmentRight = segmentLeft + segmentWidth;
      layoutNode(child, segmentLeft, segmentRight, level + 1);
      cursor = segmentRight + 36;
    });
  }

  const rootSpanFactor = 0.82;
  const rootSpanWidth = canvasWidth * rootSpanFactor;
  const rootLeft = (canvasWidth - rootSpanWidth) / 2;
  const rootRight = rootLeft + rootSpanWidth;

  layoutNode(root, rootLeft, rootRight, 1);

  return {
    graph,
    root,
    positions,
    levelCount: totalLevels,
    error: "",
    isValid: true,
  };
}
