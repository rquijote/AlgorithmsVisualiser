using Backend.Classes;

namespace AlgorithmTests;

[TestClass]
public class MergeSortTest
{
    MergeSort mergeSort = new MergeSort();

    [TestMethod]
    public void Merge_Sort_Returns_Correct_Results()
    {
        List<int> input = new List<int> { 6, 3, 8, 9, 2 };
        List<int> expected = [2, 3, 6, 8, 9];
        List<int> result = mergeSort.Sort(input);
        CollectionAssert.AreEqual(result, expected);
    }

    [TestMethod]
    public void Merge_Sort_Returns_Correct_Results_2()
    {
        List<int> input = new List<int> { 7, 2, 5, 9 };
        List<int> expected = [2, 5, 7, 9];
        List<int> result = mergeSort.Sort(input);
        CollectionAssert.AreEqual(result, expected);
    }

    [TestMethod]
    public void Merge_Sort_Returns_Correct_Results_3()
    {
        List<int> input = new List<int> { 0, 0, 8, 9 };
        List<int> expected = [0, 0, 8, 9];
        List<int> result = mergeSort.Sort(input);
        CollectionAssert.AreEqual(result, expected);
    }

    [TestMethod]
    public void Merge_Sort_Reset_Returns_Empty_Values()
    {
        List<int> input = new List<int> { 6, 3, 8, 9, 2 };
        mergeSort.Sort(input);
        mergeSort.Reset();
        List<Log> result = mergeSort.GetLog();
        List<Log> expected = [];
        CollectionAssert.AreEqual(expected, result);
    }

    [TestMethod]
    public void Merge_Sort_Returns_Log()
    {
        List<int> input = new List<int> { 6, 3, 8, 9, 2, 10, 2, 1, 4 };
        mergeSort.Sort(input);
        List<Log> logList = mergeSort.GetLog();
        Assert.IsNotNull(logList);
        Assert.AreNotEqual(0, logList.Count);
    }

    [TestMethod]
    public void Merge_Sort_Log_Tracks_Base_Cases_Returns_And_Merges()
    {
        List<int> input = new List<int> { 6, 3, 8, 9, 2 };
        mergeSort.Sort(input);
        List<Log> logList = mergeSort.GetLog();

        Assert.IsTrue(logList.Any(log => Equals(log.Extras["phase"], "base-case")));
        Assert.IsTrue(logList.Any(log => Equals(log.Extras["phase"], "return-left")));
        Assert.IsTrue(logList.Any(log => Equals(log.Extras["phase"], "return-right")));
        Assert.IsTrue(logList.Any(log => Equals(log.Extras["phase"], "merge-complete")));
        Assert.IsTrue(logList.Where(log => log.Extras.ContainsKey("phase"))
            .All(log => log.Extras.ContainsKey("callId") && log.Extras.ContainsKey("parentCallId")));
    }
}
