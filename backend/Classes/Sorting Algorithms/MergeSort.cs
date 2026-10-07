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
                "Merge Sort Completed.",
                "Every split has been merged back into a sorted segment.",
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
                $"Call #{callId} sorting segment.",
                "This recursive call sorts one segment as part of the divide-and-merge process.",
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
                    "Base case reached for segment.",
                    "A segment with zero or one value is already sorted and cannot be split further.",
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
                "Splitting left side of list.",
                "The segment is divided into smaller pieces so each can be sorted independently.",
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
                "The left recursive call has finished, so this call can continue with the right segment.",
                "return-left",
                depth,
                segmentStart,
                segmentStart + list.Count - 1,
                callId,
                parentCallId);
            AddCallLog(
                list,
                list,
                "Splitting right side of list.",
                "The remaining half is split so it can be sorted independently as well.",
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
                "Both recursive calls have now produced sorted child segments.",
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
                "Merging sorted child segments.",
                "Each child is sorted, so selecting the smaller next value builds a sorted result.",
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
                    "The smaller of the two next values must be added first to preserve ascending order.",
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

                    AddCallLog(
                        merged,
                        list,
                        $"Adding {left[i]} from left",
                        "The left value is less than or equal to the right value, so it comes next in ascending order.",
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

                    AddCallLog(
                        merged,
                        list,
                        $"Adding {right[j]} from right",
                        "The right value is smaller than the left value, so it comes next in ascending order.",
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

                AddCallLog(
                    merged,
                    list,
                    $"Adding leftover {left[i]} from left",
                    "The right segment has no values left, so the already-sorted left remainder can be appended.",
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

                AddCallLog(
                    merged,
                    list,
                    $"Adding leftover {right[j]} from right",
                    "The left segment has no values left, so the already-sorted right remainder can be appended.",
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
                "Finished sorting the merged segment.",
                "Every value from both children has been added in ascending order.",
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
                "The merged segment is sorted and ready to be returned to its parent call.",
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
            string explanation,
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
                explanation,
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
            string explanation,
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

            AddToLog(displayedList, message, explanation, extras);
        }
    }
}
