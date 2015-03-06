using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Web;
using Util;

namespace BLL.Idol
{
    public class QueryParamEntity
    {
        public string MaxResults = "";
        public string action = "query";
        public int Start = 1;
        public int PageSize = 10;
        public int DisplayStyle = 4;
        public bool TotalResults = true;
        public int Characters = 300;
        public string Highlight = null;
        public string Print = "all";
        public string PrintFields = "";
        public string Summary = "context";
        public string Predict = "false";
        public string Combine = null;
        public string DataBase = ConfigurationManager.AppSettings["DATABASE"];
        public string MinScore = null;
        public string MinDate = string.Empty;
        public string MaxDate = string.Empty;
        public string FieldText = string.Empty;
        public string Sort = "Relevance";
        public string StateMatchID = null;
        //public string StoreState = null;
        public string Reference = null;
        public string MatchReference = null;

        /* query */
        public string Text = "*";

        /* categoryquery */
        public string Category = null;
        public string QueryText = null;

        /*agentquery*/
        public string AgentName = null;
        public string UserName = null;


        /*GetQueryTagValues*/
        public string FieldName = null;
        public bool DocumentCount = true;
        public int DisNum = 0;
        public bool DisOther = false;
        public string DatePeriod = null;
        public QueryParamEntity()
        {

        }
    }

    public static class QueryParamsDao
    {
        public static QueryParamEntity GetEntity(HttpContext context)
        {
            QueryParamEntity paramsEntity = new QueryParamEntity();
            string action = context.Request["action"];
            if (!string.IsNullOrEmpty(action))
            {
                paramsEntity.action = action;
            }
            paramsEntity.Text = context.Request["text"];
            paramsEntity.DisplayStyle = Convert.ToInt32(context.Request["display_style"]);
            string Print = context.Request["print"];
            if (!string.IsNullOrEmpty(Print))
            {
                paramsEntity.Print = Print;
            }
            string Start = context.Request["start"];
            if (!string.IsNullOrEmpty(Start))
            {
                paramsEntity.Start = Convert.ToInt32(Start);
            }
            string PageSize = context.Request["page_size"];
            if (!string.IsNullOrEmpty(PageSize))
            {
                paramsEntity.PageSize = Convert.ToInt32(PageSize);
            }
            string PrintFields = context.Request["printfields"];
            if (!string.IsNullOrEmpty(PrintFields))
            {
                paramsEntity.PrintFields = PrintFields;
            }
            string Combine = context.Request["combine"];
            if (!string.IsNullOrEmpty(Combine))
            {
                paramsEntity.Combine = Combine;
            }
            string DataBase =  context.Request["database"];
            if (!string.IsNullOrEmpty(DataBase))
            {
                paramsEntity.DataBase = DataBase;
            }
            string MinScore = context.Request["minscore"];
            if (!string.IsNullOrEmpty(MinScore))
            {
                paramsEntity.MinScore = MinScore;
            }
            string MinDate = context.Request["mindate"];
            if (!string.IsNullOrEmpty(MinDate))
            {
                paramsEntity.MinDate = MinDate;
            }
            string MaxDate = context.Request["maxdate"];
            if (!string.IsNullOrEmpty(MaxDate))
            {
                paramsEntity.MaxDate = MaxDate;
            }
            string FieldText = context.Request["fieldtext"];
            if (!string.IsNullOrEmpty(FieldText))
            {
                paramsEntity.FieldText = FieldText;
            }
            string Sort = context.Request["sort"];
            if (!string.IsNullOrEmpty(Sort))
            {
                paramsEntity.Sort = Sort;
            }
            string StateMatchID = context.Request["statematchid"];
            if (!string.IsNullOrEmpty(StateMatchID))
            {
                paramsEntity.StateMatchID = StateMatchID;
            }
            string TotalResults = context.Request["totalresults"];
            if (!string.IsNullOrEmpty(TotalResults))
            {
                paramsEntity.TotalResults = Convert.ToBoolean(TotalResults);
            }
            string AgentName = context.Request["agentname"];
            if (!string.IsNullOrEmpty(AgentName))
            {
                paramsEntity.AgentName = AgentName;
            }
            string UserName = context.Request["username"];
            if (!string.IsNullOrEmpty(UserName))
            {
                paramsEntity.UserName = UserName;
            }
            string Category = context.Request["category"];
            if (!string.IsNullOrEmpty(Category))
            {
                paramsEntity.Category = Category;
            }
            string QueryText = context.Request["querytext"];
            if (!string.IsNullOrEmpty(QueryText))
            {
                paramsEntity.QueryText = QueryText;
            }
            string Characters = context.Request["characters"];
            if (!string.IsNullOrEmpty(Characters))
            {
                paramsEntity.Characters = Convert.ToInt32(Characters);
            }
            string Highlight = context.Request["highlight"];
            if (!string.IsNullOrEmpty(Highlight))
            {
                paramsEntity.Highlight = Highlight;
            }
            string Summary = context.Request["summary"];
            if (!string.IsNullOrEmpty(Summary))
            {
                paramsEntity.Summary = Summary;
            }
            string Predict = context.Request["predict"];
            if (!string.IsNullOrEmpty(Predict))
            {
                paramsEntity.Predict = Predict;
            }
            string Reference = context.Request["reference"];
            if (!string.IsNullOrEmpty(Reference))
            {
                paramsEntity.Reference = EncodeByEscape.GetUnEscapeStr(Reference);
            }
            string MatchReference = context.Request["matchreference"];
            if (!string.IsNullOrEmpty(MatchReference))
            {
                paramsEntity.MatchReference = EncodeByEscape.GetUnEscapeStr(MatchReference);
            }

            string FieldName = context.Request["fieldname"];
            if (!string.IsNullOrEmpty(FieldName))
            {
                paramsEntity.FieldName = FieldName;
            }

            string DocumentCount = context.Request["documentcount"];
            if (!string.IsNullOrEmpty(DocumentCount))
            {
                paramsEntity.DocumentCount = Convert.ToBoolean(DocumentCount);
            }

            string DisNum = context.Request["disnum"];
            if (!string.IsNullOrEmpty(DisNum))
            {
                paramsEntity.DisNum = Convert.ToInt32(DisNum);
            }

            string DisOther = context.Request["disother"];
            if (!string.IsNullOrEmpty(DisOther))
            {
                paramsEntity.DisOther = Convert.ToBoolean(DisOther);
            }

            string DatePeriod = context.Request["dateperiod"];
            if (!string.IsNullOrEmpty(DatePeriod))
            {
                paramsEntity.DatePeriod = DatePeriod;
            }
            string MaxResults = context.Request["maxresults"];
            if (!string.IsNullOrEmpty(MaxResults))
            {
                paramsEntity.MaxResults = MaxResults;
            }
            return paramsEntity;
        }
    }
}
