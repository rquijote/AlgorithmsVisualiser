using System.Net;
using Backend.Classes;

namespace AlgorithmTests;

[TestClass]
public class BreadthFirstSearchTest
{
    BreadthFirstSearch bfs = new BreadthFirstSearch();

    [TestMethod]
    public void BFS_Traverses_Basic_Graph()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 3 } },
            {2, new List<int> { 4 } },
            {3, new List<int> { 5 } },
            {4, new List<int>() },
            {5, new List<int>() },
        };

        List<int> result = bfs.Traverse(graph, 1);
        List<int> expected = [ 1, 2, 3, 4, 5 ];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Returns_Correct_Search()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 3 } },
            {2, new List<int> { 4 } },
            {3, new List<int> { 5 } },
            {4, new List<int>() },
            {5, new List<int>() },
        };

        List<int> result = bfs.Search(graph, 1, 4);
        List<int> expected = [1, 2, 3, 4];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Returns_Cannot_Find_Search()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 3 } },
            {2, new List<int> { 4 } },
            {3, new List<int> { 5 } },
            {4, new List<int>() },
            {5, new List<int>() },
        };

        List<int> result = bfs.Search(graph, 1, 9);
        List<int> expected = [1, 2, 3, 4, 5];
        CollectionAssert.AreEqual(expected, result);
        string expectedString = "Target node 9 not found in graph.";
        List<Log> logList = bfs.GetLog();
        Log resultLog = bfs.GetSingleLog(logList.Count - 1);
        Assert.AreEqual(expectedString, resultLog.ActionMsg);
    }

    [TestMethod]
    public void BFS_Get_Iterations_Correct()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 3 } },
            {2, new List<int> { 4 } },
            {3, new List<int> { 5 } },
            {4, new List<int>() },
            {5, new List<int>() },
        };

        bfs.Traverse(graph, 1);
        int result = bfs.GetIterations();
        int expected = 5;
        Assert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Wont_Repeat_Visited_Nodes()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 4 } },
            {2, new List<int> { 3, 5 } },
            {3, new List<int> { 6 } },
            {4, new List<int>() { 5 } },
            {5, new List<int>() },
            {6, new List<int>() { 1 } },
        };

        List<int> result = bfs.Traverse(graph, 1);
        List<int> expected = [1, 2, 4, 3, 5, 6];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Handles_Single_Node()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { } }
        };

        List<int> result = bfs.Traverse(graph, 1);
        List<int> expected = [1];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Handles_Disconnected_Graphs()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2 } },
            {2, new List<int>() },
            {3, new List<int> { 4 } },
            {4, new List<int>() }
        };

        List<int> result = bfs.Traverse(graph, 1);
        List<int> expected = [1, 2];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void BFS_Handles_No_Starting_Node()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>();

        List<int> result = bfs.Traverse(graph, 1);
        List<int> expected = [];
        CollectionAssert.AreEqual(expected, result);
    }
    
    [TestMethod]
    public void BFS_Returns_Log()
    {
        Dictionary<int, List<int>> graph = new Dictionary<int, List<int>>
        {
            {1, new List<int> { 2, 4 } },
            {2, new List<int> { 3, 5 } },
            {3, new List<int> { 6 } },
            {4, new List<int>() { 5 } },
            {5, new List<int>() },
            {6, new List<int>() { 1 } },
        };

        List<int> result = bfs.Traverse(graph, 1);
        List<Log> logList = bfs.GetLog();
        Assert.IsNotNull(logList);
        Assert.AreNotEqual(0, logList.Count);
    }
}
