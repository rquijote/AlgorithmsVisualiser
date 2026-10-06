namespace Backend.Classes
{
    public class MergeSort : SortingAlgorithm
    {
        private int _nextCallId;

        public override List<int> Sort(List<int> list)
        {
            _nextCallId = 0;
            int rootCallId = _nextCallId++;
            List<int> sortedList = MergeSortRecursion(list, 0, 0, rootCallId, null);
            AddCallLog(
                sortedList,
                sortedList,
                $"Merge Sort Completed [{string.Join(", ", sortedList)}]",
                "complete",
                0,
                0,
                sortedList.Count - 1,
                rootCallId,
                null);
            return sortedList;
        }

        private List<int> MergeSortRecursion(
            List<int> list,
            int depth,
            int segmentStart,
            int callId,
            int? parentCallId)
        {
            AddCallLog(
                list,
                list,
                $"Call #{callId} sorting segment [{string.Join(", ", list)}]",
                "call",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);

            if (list.Count <= 1)
            {
                AddCallLog(
                    list,
                    list,
                    $"Base case reached for segment [{string.Join(", ", list)}]",
                    "base-case",
                    depth,
                    segmentStart,
                    segmentStart + list.Count - 1,
                    callId,
                    parentCallId);
                return list;
            }

            int mid = list.Count / 2;

            AddCallLog(
                list,
                list,
                $"Splitting left side of list [{string.Join(", ", list)}]",
                "descend-left",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId,
                new Dictionary<string, object>
                {
                    { "highlight", Enumerable.Range(0, mid).ToList() }
                }
            );

            List<int> left = MergeSortRecursion(
                list.GetRange(0, mid),
                depth + 1,
                segmentStart,
                _nextCallId++,
                callId);

            AddCallLog(
                list,
                list,
                $"Returned from the left child to call #{callId}.",
                "return-left",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);
            AddCallLog(
                list,
                list,
                $"Splitting right side of list [{string.Join(", ", list)}]",
                "descend-right",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId,
                new Dictionary<string, object>
                {
                    { "alertHighlight", Enumerable.Range(mid, list.Count - mid).ToList() }
                });

            List<int> right = MergeSortRecursion(
                list.GetRange(mid, list.Count - mid),
                depth + 1,
                segmentStart + mid,
                _nextCallId++,
                callId);

            AddCallLog(
                list,
                list,
                $"Returned from the right child to call #{callId}.",
                "return-right",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);

            List<int> merged = new List<int>();
            int i = 0, j = 0;

            AddCallLog(
                merged,
                list,
                $"Merging sorted children [{string.Join(", ", left)}] and [{string.Join(", ", right)}].",
                "merge-start",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);

            while (i < left.Count && j < right.Count)
            {
                AddCallLog(
                    merged.Count == 0 ? new List<int> { left[i], right[j] } : merged,
                    list,
                    $"Comparing {left[i]} (left) and {right[j]} (right)",
                    "compare",
                    depth,
                    segmentStart,
                    segmentStart + list.Count - 1,
                    callId,
                    parentCallId,
                    new Dictionary<string, object>
                    {
                        { "highlight", new List<int>() }
                    }
                );

                if (left[i] <= right[j])
                {
                    merged.Add(left[i]);
                    int indexInMerged = merged.Count - 1;

                    var leftoverMessage = (i + 1 < left.Count)
                        ? $"leftovers in left: {string.Join(", ", left.GetRange(i + 1, left.Count - (i + 1)))}. leftovers in right: {string.Join(", ", right.GetRange(j, right.Count - j))}"
                        : "no more leftovers in right";

                    AddCallLog(
                        merged,
                        list,
                        $"Adding {left[i]} from left, {leftoverMessage}",
                        "merge-item",
                        depth,
                        segmentStart,
                        segmentStart + list.Count - 1,
                        callId,
                        parentCallId,
                        new Dictionary<string, object>
                        {
                            { "highlight", new List<int> { indexInMerged } }
                        }
                    );
                    i++;
                }
                else
                {
                    merged.Add(right[j]);
                    int indexInMerged = merged.Count - 1;

                    var leftoverMessage = (j + 1 < right.Count)
                        ? $"leftovers in left: {string.Join(", ", left.GetRange(i, left.Count - i))}. leftovers in right: {string.Join(", ", right.GetRange(j + 1, right.Count - (j + 1)))}"
                        : "no more leftovers in right";

                    AddCallLog(
                        merged,
                        list,
                        $"Adding {right[j]} from right, {leftoverMessage}",
                        "merge-item",
                        depth,
                        segmentStart,
                        segmentStart + list.Count - 1,
                        callId,
                        parentCallId,
                        new Dictionary<string, object>
                        {
                            { "alertHighlight", new List<int> { indexInMerged } }
                        }
                    );
                    j++;
                }
            }

            // Add leftover elements from left
            while (i < left.Count)
            {
                merged.Add(left[i]);
                int indexInMerged = merged.Count - 1;

                string leftoverMessage = (i + 1 < left.Count)
                    ? $"leftovers in left: {string.Join(", ", left.GetRange(i + 1, left.Count - (i + 1)))}. leftovers in right: {string.Join(", ", right.GetRange(j, right.Count - j))}"
                    : "no more leftovers in left";

                AddCallLog(
                    merged,
                    list,
                    $"Adding leftover {left[i]} from left, {leftoverMessage}",
                    "merge-item",
                    depth,
                    segmentStart,
                    segmentStart + list.Count - 1,
                    callId,
                    parentCallId,
                    new Dictionary<string, object>
                    {
                        { "highlight", new List<int> { indexInMerged } }
                    }
                );
                i++;
            }

            // Add leftover elements from right
            while (j < right.Count)
            {
                merged.Add(right[j]);
                int indexInMerged = merged.Count - 1;

                string leftoverMessage = (j + 1 < right.Count && left.Count - i > 0)
                    ? $"leftovers in left: {string.Join(", ", left.GetRange(i, left.Count - i))}. leftovers in right: {string.Join(", ", right.GetRange(j + 1, right.Count - (j + 1)))}"
                    : "no more leftovers in right";

                AddCallLog(
                    merged,
                    list,
                    $"Adding leftover {right[j]} from right, {leftoverMessage}",
                    "merge-item",
                    depth,
                    segmentStart,
                    segmentStart + list.Count - 1,
                    callId,
                    parentCallId,
                    new Dictionary<string, object>
                    {
                        { "alertHighlight", new List<int> { indexInMerged } }
                    }
                );
                j++;
            }

            AddCallLog(
                merged,
                list,
                $"Finished sorting, merged result: [{string.Join(", ", merged)}]",
                "merge-complete",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId,
                new Dictionary<string, object>
                {
                    { "highlight", new List<int>() }
                }
            );
            AddCallLog(
                merged,
                list,
                $"Call #{callId} is returning its merged segment.",
                "return",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);

            return merged;
        }

        private void AddCallLog(
            List<int> displayedList,
            List<int> segmentValues,
            string message,
            string phase,
            int depth,
            int segmentStart,
            int segmentEnd,
            int callId,
            int? parentCallId)
        {
            AddCallLog(
                displayedList,
                segmentValues,
                message,
                phase,
                depth,
                segmentStart,
                segmentEnd,
                callId,
                parentCallId,
                new Dictionary<string, object>());
        }

        private void AddCallLog(
            List<int> displayedList,
            List<int> segmentValues,
            string message,
            string phase,
            int depth,
            int segmentStart,
            int segmentEnd,
            int callId,
            int? parentCallId,
            Dictionary<string, object> additionalExtras)
        {
            var extras = new Dictionary<string, object>
            {
                { "phase", phase },
                { "depth", depth },
                { "callId", callId },
                { "parentCallId", parentCallId.HasValue ? parentCallId.Value : -1 },
                { "segmentStart", segmentStart },
                { "segmentEnd", segmentEnd },
                { "segmentValues", new List<int>(segmentValues) }
            };

            if (additionalExtras != null)
            {
                foreach (var extra in additionalExtras)
                {
                    extras[extra.Key] = extra.Value;
                }
            }

            AddToLog(displayedList, message, extras);
        }
    }
}
