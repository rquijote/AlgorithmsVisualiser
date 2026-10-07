using Backend.Classes;

namespace AlgorithmTests;

[TestClass]
public class AlgorithmLogExplanationTest
{
    [TestMethod]
    public void AllAlgorithms_Emit_Explanations_ForEveryLogEntry()
    {
        BubbleSort bubbleSort = new();
        bubbleSort.Sort([3, 1, 2]);

        InsertionSort insertionSort = new();
        insertionSort.Sort([3, 1, 2]);

        MergeSort mergeSort = new();
        mergeSort.Sort([3, 1, 2]);

        QuickSort quickSort = new();
        quickSort.Sort([3, 1, 2]);

        SelectionSort selectionSort = new();
        selectionSort.Sort([3, 1, 2]);

        LinearSearch linearSearch = new();
        linearSearch.Search([1, 3, 5], 5);

        BinarySearch binarySearch = new();
        binarySearch.Search([1, 3, 5], 4);

        Dictionary<int, List<int>> graph = new()
        {
            { 1, [2, 3] },
            { 2, [4] },
            { 3, [] },
            { 4, [] }
        };

        BreadthFirstSearch breadthFirstSearch = new();
        breadthFirstSearch.Traverse(graph, 1);

        DepthFirstSearch depthFirstSearch = new();
        depthFirstSearch.Traverse(graph, 1);

        List<Log> logs =
        [
            ..bubbleSort.GetLog(),
            ..insertionSort.GetLog(),
            ..mergeSort.GetLog(),
            ..quickSort.GetLog(),
            ..selectionSort.GetLog(),
            ..linearSearch.GetLog(),
            ..binarySearch.GetLog(),
            ..breadthFirstSearch.GetLog(),
            ..depthFirstSearch.GetLog()
        ];

        Assert.IsTrue(logs.Count > 0);
        Assert.IsTrue(logs.All(log => !string.IsNullOrWhiteSpace(log.Explanation)));
        Assert.IsFalse(logs.Any(log =>
            log.ActionMsg.Contains("Current list:") ||
            log.ActionMsg.Contains("Current segment:") ||
            log.ActionMsg.Contains("leftovers in") ||
            log.ActionMsg.Contains("sorted children [") ||
            log.ActionMsg.Contains("Final list: [") ||
            log.ActionMsg.Contains("Final sorted list: [") ||
            log.ActionMsg.Contains("Completed traversal: [") ||
            log.ActionMsg.Contains("to visit next): [")));
    }
}