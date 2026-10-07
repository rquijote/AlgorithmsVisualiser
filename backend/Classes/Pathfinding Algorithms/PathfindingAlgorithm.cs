namespace Backend.Classes
{
    public class PathfindingAlgorithm
    {
        private int _iterations = 0;
        private List<Log> _log = [];

        public virtual List<int> Traverse(Dictionary<int, List<int>> graph, int startNode)
        {
            List<int> list = new List<int>();
            return list;
        }

        public int GetIterations()
        {
            return _iterations;
        }

        public void IncrementIterations()
        {
            _iterations++;
        }
        public void AddToLog(List<int> logList, string actionMsg, string explanation, Dictionary<string, object> extras = null)
        {
            Log logItem = new Log(new List<int>(logList), actionMsg, explanation, extras);
            _log.Add(logItem);
        }

        public List<Log> GetLog()
        {
            return _log;
        }

        public Log GetSingleLog(int logIndex)
        {
            return _log[logIndex];
        }

        public virtual List<int> Search(Dictionary<int, List<int>> graph, int startNode, int target)
        {
            List<int> list = new List<int>();
            return list;
        }
    }
}
