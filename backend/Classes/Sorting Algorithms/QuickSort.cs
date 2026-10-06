namespace Backend.Classes
{
    public class QuickSort : SortingAlgorithm
    {
        private int _nextCallId;

        public override List<int> Sort(List<int> list)
        {
            _nextCallId = 0;
            int rootCallId = _nextCallId++;
            QuickSortRecursion(list, 0, list.Count - 1, 0, rootCallId, null);
            AddToLog(
                list,
                $"Quick Sort Completed [{string.Join(", ", list)}]",
                CreateCallExtras(list, "complete", 0, 0, list.Count - 1, rootCallId, null));
            return list;
        }

        public void QuickSortRecursion(List<int> list, int start, int end, int depth)
        {
            int callId = _nextCallId++;
            QuickSortRecursion(list, start, end, depth, callId, null);
        }

        private void QuickSortRecursion(
            List<int> list,
            int start,
            int end,
            int depth,
            int callId,
            int? parentCallId)
        {
            AddToLog(
                list,
                $"Call #{callId} sorting indices [{start}, {end}].",
                CreateCallExtras(list, "call", depth, start, end, callId, parentCallId));

            if (start >= end)
            {
                var extras = CreateCallExtras(list, "base-case", depth, start, end, callId, parentCallId);
                extras["highlight"] = Enumerable.Range(start, Math.Max(0, end - start + 1)).ToList();
                extras["bgHighlight"] = Enumerable.Range(start, Math.Max(0, end - start + 1)).ToList();

                AddToLog(list,
                    $"Base case reached for indices [{start}, {end}]. Segment: [{string.Join(", ", list.GetRange(start, end - start + 1))}]",
                    extras);
                return;
            }

            var partitionExtras = CreateCallExtras(list, "partition-start", depth, start, end, callId, parentCallId);
            partitionExtras["highlight"] = Enumerable.Range(start, end - start + 1).ToList();
            partitionExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
            AddToLog(list,
                $"Sorting segment [{string.Join(", ", list.GetRange(start, end - start + 1))}]",
                partitionExtras);

            int pivotIndex = Partition(list, start, end, depth, callId, parentCallId);

            var pivotExtras = CreateCallExtras(list, "pivot-positioned", depth, start, end, callId, parentCallId);
            pivotExtras["alertHighlight"] = new List<int> { pivotIndex };
            pivotExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
            pivotExtras["pivotIndex"] = pivotIndex;
            pivotExtras["pivotValue"] = list[pivotIndex];
            AddToLog(list,
                $"Pivot placed at index {pivotIndex} with value {list[pivotIndex]}. Left segment: [{string.Join(", ", list.GetRange(start, pivotIndex - start))}], Right segment: [{string.Join(", ", list.GetRange(pivotIndex + 1, end - pivotIndex))}]",
                pivotExtras);

            int leftCallId = _nextCallId++;
            AddToLog(
                list,
                $"Descending into the left partition [{start}, {pivotIndex - 1}].",
                CreateCallExtras(list, "descend-left", depth, start, end, callId, parentCallId));
            QuickSortRecursion(list, start, pivotIndex - 1, depth + 1, leftCallId, callId);
            AddToLog(
                list,
                $"Returned from the left partition to call #{callId}.",
                CreateCallExtras(list, "return-left", depth, start, end, callId, parentCallId));

            int rightCallId = _nextCallId++;
            AddToLog(
                list,
                $"Descending into the right partition [{pivotIndex + 1}, {end}].",
                CreateCallExtras(list, "descend-right", depth, start, end, callId, parentCallId));
            QuickSortRecursion(list, pivotIndex + 1, end, depth + 1, rightCallId, callId);
            AddToLog(
                list,
                $"Returned from the right partition to call #{callId}.",
                CreateCallExtras(list, "return-right", depth, start, end, callId, parentCallId));

            AddToLog(
                list,
                $"Call #{callId} finished both partitions and is returning.",
                CreateCallExtras(list, "return", depth, start, end, callId, parentCallId));
        }

        public int Partition(List<int> list, int start, int end, int depth)
        {
            return Partition(list, start, end, depth, -1, null);
        }

        private int Partition(List<int> list, int start, int end, int depth, int callId, int? parentCallId)
        {
            int pivotValue = list[end];
            int i = start - 1;
            int temp;

            var pivotExtras = CreateCallExtras(list, "partition-pivot", depth, start, end, callId, parentCallId);
            pivotExtras["highlight"] = new List<int> { end };
            pivotExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
            pivotExtras["pivotValue"] = pivotValue;
            AddToLog(list,
                $"Partitioning with pivot {pivotValue} at index {end}.",
                pivotExtras);

            for (int j = start; j < end; j++)
            {
                var compareExtras = CreateCallExtras(list, "partition-compare", depth, start, end, callId, parentCallId);
                compareExtras["highlight"] = new List<int> { j, end };
                compareExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
                compareExtras["pivotValue"] = pivotValue;
                AddToLog(list,
                    $"Checking if {list[j]} is smaller than or equal to pivot {pivotValue}. Current segment: [{string.Join(", ", list.GetRange(start, end - start + 1))}]",
                    compareExtras);

                if (list[j] <= pivotValue)
                {
                    i++;
                    temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;

                        var moveExtras = CreateCallExtras(list, "partition-move", depth, start, end, callId, parentCallId);
                        moveExtras["highlight"] = new List<int> { end };
                        moveExtras["alertHighlight"] = new List<int> { i, j };
                        moveExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
                        moveExtras["pivotValue"] = pivotValue;
                    AddToLog(list,
                        i == j
                        ? $"Element {list[j]} is in the correct position. Current segment: [{string.Join(", ", list.GetRange(start, end - start + 1))}]"
                        : $"Moved {list[j]} (index {j}) to the left partition at index {i}. Current segment: [{string.Join(", ", list.GetRange(start, end - start + 1))}]",
                            moveExtras);
                    }
                }


                i++;
            temp = list[i];
            list[i] = list[end];
            list[end] = temp;

            var placedExtras = CreateCallExtras(list, "pivot-positioned", depth, start, end, callId, parentCallId);
            placedExtras["alertHighlight"] = new List<int> { i, end };
            placedExtras["bgHighlight"] = Enumerable.Range(start, end - start + 1).ToList();
            placedExtras["pivotIndex"] = i;
            placedExtras["pivotValue"] = pivotValue;
            AddToLog(list,
                $"Moved pivot {pivotValue} to index {i}. Current segment: [{string.Join(", ", list.GetRange(start, end - start + 1))}]",
                placedExtras);

            return i;
        }

        private static Dictionary<string, object> CreateCallExtras(
            List<int> list,
            string phase,
            int depth,
            int start,
            int end,
            int callId,
            int? parentCallId)
        {
            var segmentValues = start <= end
                ? list.GetRange(start, end - start + 1)
                : new List<int>();

            return new Dictionary<string, object>
            {
                { "phase", phase },
                { "depth", depth },
                { "callId", callId },
                { "parentCallId", parentCallId.HasValue ? parentCallId.Value : -1 },
                { "segmentStart", start },
                { "segmentEnd", end },
                { "segmentValues", segmentValues }
            };
        }
    }
}
