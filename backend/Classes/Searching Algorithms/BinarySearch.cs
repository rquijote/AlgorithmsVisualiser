namespace Backend.Classes
{
    public class BinarySearch : SearchingAlgorithm
    {
        public override int Search(List<int> list, int number)
        {
            int low = 0, high = list.Count - 1;

            while (low <= high)
            {
                incrementIterations();
                int mid = low + (high - low) / 2;

                AddToLog(list,
                    $"Checking middle index: {mid}, value: {list[mid]}",
                    "The middle value is checked so the sorted search range can be reduced by half.",
                    new Dictionary<string, object>
                    {
                        { "highlight", new List<int> { mid } },
                        { "bgHighlight", Enumerable.Range(low, high - low + 1).ToList() }
                    });

                if (list[mid] == number)
                {
                    AddToLog(list,
                        $"Found value: {number} at index: {mid}. Took {GetIterations()} iterations.",
                        "The middle value equals the target, so the search is complete.",
                        new Dictionary<string, object>
                        {
                            { "alertHighlight", new List<int> { mid } }
                        });
                    return mid;
                }

                if (list[mid] < number)
                {
                    AddToLog(list,
                        $"Value: {list[mid]} is smaller than {number}. Changing low: {low} to {mid + 1}",
                        "Because the list is sorted and the middle value is below the target, the target can only be to its right.",
                        new Dictionary<string, object>
                        {
                            { "highlight", new List<int> { mid } },
                            { "bgHighlight", Enumerable.Range(low, high - low + 1).ToList() }
                        });
                    low = mid + 1;
                }
                else
                {
                    AddToLog(list,
                        $"Value: {list[mid]} is larger than {number}. Changing high: {high} to {mid - 1}",
                        "Because the list is sorted and the middle value is above the target, the target can only be to its left.",
                        new Dictionary<string, object>
                        {
                            { "highlight", new List<int> { mid } },
                            { "bgHighlight", Enumerable.Range(low, high - low + 1).ToList() }
                        });
                    high = mid - 1;
                }
            }

            AddToLog(list,
                $"Couldn't find value: {number}",
                "The remaining search range is empty, so no index can contain the target.",
                new Dictionary<string, object>
                {
                });
            return -1;
        }
    }
}
