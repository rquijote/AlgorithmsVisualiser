namespace Backend.Classes
{
    public class Log
    {
        public List<int> List { get; set; }
        public string ActionMsg { get; set; }
        public string Explanation { get; set; }
        public Dictionary<string, object> Extras { get; set; }

        public Log(List<int> list, string actionMsg, string explanation, Dictionary<string, object> extras)
        {
            List = list;
            ActionMsg = actionMsg;
            Explanation = explanation;
            Extras = extras ?? new Dictionary<string, object>();
        }
    }
}
