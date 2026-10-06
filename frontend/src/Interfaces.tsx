export interface Log {
    list: number[];
    msg: string;
    extras?: {
        highlight?: number[];
        alertHighlight?: number[]; // For swaps or anything that deviates from normal.
        bgHighlight?: number[]; // Currently for quick sort only, light bg
        depth?: number;
        phase?: string;
        callId?: number;
        parentCallId?: number;
        segmentStart?: number;
        segmentEnd?: number;
        segmentValues?: number[];
        pivotIndex?: number;
        pivotValue?: number;
        toVisitHighlight?: number[];
        visitedHighlight?: number[];
    }
}

export interface RecursiveCall {
    callId: number;
    parentCallId: number | null;
    depth: number;
    segmentStart: number;
    segmentEnd: number;
    segmentValues: number[];
    phase: string;
    message: string;
}

export interface SearchRequest {
    list: number[];
    target: number;
}

export interface PathfindingRequest {
    graph: Record<number, number[]>;
    startNode: number;
    targetNode?: number;
}