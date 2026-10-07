namespace Backend.Classes
{
    public class BreadthFirstSearch : PathfindingAlgorithm
    {
        public override List<int> Traverse(Dictionary<int, List<int>> graph, int startNode) =>
            BFS_Helper(graph, startNode);

        public override List<int> Search(Dictionary<int, List<int>> graph, int startNode, int target) =>
            BFS_Helper(graph, startNode, target);

        private List<int> BFS_Helper(Dictionary<int, List<int>> graph, int startNode, int? targetNode = null)
        {
            HashSet<int> visited = new HashSet<int>();
            Queue<int> queue = new Queue<int>();
            List<int> result = new List<int>();

            if (!graph.ContainsKey(startNode))
            {
                AddToLog(result, "No starting node found.",
                    $"Node {startNode} is not a key in the graph, so traversal cannot begin.",
                    new Dictionary<string, object>());
                return result;
            }

            queue.Enqueue(startNode);

            while (queue.Count > 0)
            {
                int current = queue.Dequeue();
                visited.Add(current);
                result.Add(current);

                AddToLog(
                    result,
                    $"Adding {current} to result.",
                    "The next queued node is visited first, preserving breadth-first order by distance from the start.",
                    new Dictionary<string, object> {
                        { "highlight", visited.ToList() },
                        { "bgHighlight", queue.ToList() }
                    });

                if (current == targetNode)
                {
                    AddToLog(
                        result,
                        $"Target node {targetNode} found. Ending search.",
                        "The node being visited equals the target, so no further nodes need to be explored.",
                        new Dictionary<string, object> {
                            { "highlight", visited.ToList() },
                            { "alertHighlight", new List<int> { current } },
                            { "bgHighlight", queue.ToList() }
                        });
                    return result;
                }

                foreach (int neighbor in graph[current])
                {
                    if (!visited.Contains(neighbor) && !queue.Contains(neighbor))
                    {
                        queue.Enqueue(neighbor);

                        AddToLog(
                            result,
                            $"Node {neighbor} added to queue (to visit next).",
                            $"Node {neighbor} is adjacent to the current node and is neither visited nor already queued.",
                            new Dictionary<string, object> {
                                { "highlight", visited.ToList() },
                                { "bgHighlight", queue.ToList() }
                            });
                    }
                }
            }

            AddToLog(
                result,
                "Completed traversal.",
                "The queue is empty, so every reachable node has been visited.",
                new Dictionary<string, object> {
                    { "highlight", visited.ToList() },
                    { "bgHighlight", new List<int>() }
                });

            if (targetNode.HasValue && !result.Contains(targetNode.Value))
            {
                AddToLog(
                    result,
                    $"Target node {targetNode.Value} not found in graph.",
                    "The queue became empty without visiting the target, so it is not reachable from the start node.",
                    new Dictionary<string, object>());
            }

            return result;
        }
    }
}
