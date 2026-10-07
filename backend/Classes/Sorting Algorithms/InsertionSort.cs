namespace Backend.Classes
{
    public class InsertionSort : SortingAlgorithm
    {
        public override List<int> Sort(List<int> list)
        {
            for (int i = 1; i < list.Count; i++)
            {
                int temp = list[i];
                int j = i - 1;
                bool moved = false;

                AddToLog(list,
                    $"Comparing index {j} ({list[j]}) and {i} ({temp})",
                    "The sorted prefix is compared with the next value to find where that value belongs.",
                    new Dictionary<string, object> { { "highlight", new List<int> { j, i } } });

                while (j >= 0 && list[j] > temp)
                {
                    AddToLog(list,
                        $"index at {j + 1} is bigger than index at {j}, index {j} shifted to index {j + 1}",
                        $"The value {list[j]} is greater than {temp}, so it must move right to make room for the inserted value.",
                        new Dictionary<string, object> { { "alertHighlight", new List<int> { j, j + 1 } } });

                    list[j + 1] = list[j];

                    AddToLog(list,
                        $"Shifted {list[j]} from index {j} to index {j + 1}",
                        "The larger value was moved one position right to open a position in the sorted prefix.",
                        new Dictionary<string, object> { { "alertHighlight", new List<int> { j, j + 1 } } });

                    j--;
                    moved = true;
                }

                list[j + 1] = temp;

                if (moved)
                {
                    AddToLog(list,
                        $"Inserted {temp} at index {j + 1}.",
                        "All larger values have shifted right, so this is the next position that keeps the prefix sorted.",
                        new Dictionary<string, object> { { "alertHighlight", new List<int> { j + 1 } } });
                }
                else
                {
                    AddToLog(list,
                        $"No changes needed for {temp} at index {i}",
                        "The sorted prefix is empty or its last value is less than or equal to this value, so it is already in order.",
                        new Dictionary<string, object> { { "highlight", new List<int> { i } } });
                }
            }

            AddToLog(list, "Final sorted list.",
                "Every value has been inserted into the sorted prefix.",
                new Dictionary<string, object>());
            return list;
        }
    }
}
