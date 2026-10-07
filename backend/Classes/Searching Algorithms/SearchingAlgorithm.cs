namespace Backend.Classes
{
    public class SearchingAlgorithm
    {
        private int _iterations = 0;
        private List<Log> _log = [];

        public virtual int Search(List<int> list, int number)
        {
            return 0;
        }

        public int GetIterations()
        {
            return _iterations;
        }

        public void incrementIterations()
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
    }
}
