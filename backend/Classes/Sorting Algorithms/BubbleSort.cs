namespace Backend.Classes
{
    public class BubbleSort : SortingAlgorithm
    {
        public override List<int> Sort(List<int> list)
        {
            for (int i = 0; i < list.Count - 1; i++)
            {
                AddToLog(list, $"Starting pass {i + 1} over the list.",
                    "Bubble sort scans adjacent values from left to right, moving larger values toward the end.",
                    new Dictionary<string, object>());

                bool swappedThisPass = false;

                for (int j = 1; j < list.Count - i; j++)
                {
                    AddToLog(list, $"Comparing index {j - 1} ({list[j - 1]}) and {j} ({list[j]})",
                        "The adjacent values must be compared to decide whether their order needs to be reversed.",
                        new Dictionary<string, object> { { "highlight", new List<int> { j - 1, j } } });

                    if (list[j] < list[j - 1])
                    {
                        Swap(list, j, j - 1);
                        swappedThisPass = true;
                    }
                    else
                    {
                        AddToLog(list, $"No swap needed between index {j - 1} ({list[j - 1]}) and {j} ({list[j]})",
                            "The left value is less than or equal to the right value, so this pair is already in order.",
                            new Dictionary<string, object> { { "highlight", new List<int> { j - 1, j } } });
                    }
                }

                if (!swappedThisPass)
                {
                    AddToLog(list, $"No swaps in pass {i + 1}, list is sorted.",
                        "A complete pass made no changes, so every adjacent pair is already ordered.",
                        new Dictionary<string, object>());
                    break;
                }
            }

            SetList(list);
            AddToLog(list, "Final sorted list.",
                "All required passes are complete, leaving the list in ascending order.",
                new Dictionary<string, object>());
            return list;
        }

        private void Swap(List<int> list, int index1, int index2)
        {
            int temp = list[index1];
            list[index1] = list[index2];
            list[index2] = temp;

            AddToLog(list,
                $"Swapped index {index1} ({list[index1]}) with index {index2} ({list[index2]}).",
                "The right-hand value was smaller than the left-hand value, so swapping them moves the larger value right.",
                new Dictionary<string, object> { { "alertHighlight", new List<int> { index1, index2 } } });
        }
    }
}
