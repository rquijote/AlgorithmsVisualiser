namespace Backend.Classes
{
    public class LinearSearch : SearchingAlgorithm
    {
        public override int Search(List<int> list, int number)
        {
            if (list == null) return -1;

            for (int i = 0; i < list.Count; i++)
            {
                incrementIterations();

                AddToLog(list,
                    $"Checking value {list[i]} at index: {i}",
                    "Linear search checks each value in order because no sorted-order shortcut is assumed.",
                    new Dictionary<string, object> { { "highlight", new List<int> { i } } });

                if (list[i] == number)
                {
                    AddToLog(list,
                        $"Found {number} at index: {i}. Took {GetIterations()} iterations.",
                        "The value at this index equals the target, so the search can stop with a match.",
                        new Dictionary<string, object> { { "alertHighlight", new List<int> { i } } });
                    return i;
                }
            }

            AddToLog(list,
                $"Value: {number} not found in the list.",
                "Every value was checked and none matched the target.",
                new Dictionary<string, object>());
            return -1;
        }
    }
}
