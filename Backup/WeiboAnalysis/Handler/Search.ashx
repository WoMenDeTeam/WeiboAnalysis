<%@ WebHandler Language="C#" Class="Search" %>

using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using System.Threading;
using BLL.Idol;
public class Search : IHttpHandler
{
    
    public void ProcessRequest (HttpContext context) {
        string action = context.Request["action"];
        if (!string.IsNullOrEmpty(action))
        {
            action = action.ToLower();
            QueryParamEntity queryParamsEntity = new QueryParamEntity();
            switch (action)
            {
                case "query":
                    DoSearch(context, queryParamsEntity);
                    break;
                case "categoryquery":
                    DoSearch(context, queryParamsEntity);
                    break;
                case "agentgetresults":
                    DoSearch(context, queryParamsEntity);
                    break;                
                default:
                    DoSearch(context, queryParamsEntity);
                    break;
            }
        }
    }

    private void DoSearch(HttpContext context, QueryParamEntity queryParamsEntity)
    {
        bool isinresult = false;
        string StateMatchID = string.Empty;
        string action = context.Request["action"];
        string isresult = context.Request["isresult"];
        if (!string.IsNullOrEmpty(isresult)) {
            isinresult = true;
        }
        if (!string.IsNullOrEmpty(action))
        {
            action = action.ToLower();
            queryParamsEntity = QueryParamsDao.GetEntity(context);
            //if (action == "categoryquery")
            //{
            //    string categoryid = context.Request["category"];
            //    CATEGORYEntity entity = CategoryFacade.GetCategoryEntity(categoryid);
            //    if (entity.QUERYTYPE == "commonquery")
            //    {
            //        action = "query";
            //        string text = context.Request["text"];
            //        if (!string.IsNullOrEmpty(text))
            //        {
            //            queryParamsEntity.Text = text;
            //        }
            //        else
            //        {
            //            queryParamsEntity.Text = entity.KEYWORD;
            //        }
            //        string minscore = entity.MINSCORE;
            //        if (!string.IsNullOrEmpty(minscore))
            //        {
            //            queryParamsEntity.MinScore = minscore;
            //        }
            //        else
            //        {
            //            queryParamsEntity.MinScore = "10";
            //        }
            //    }
            //    else
            //    {
            //        string minscore = entity.MINSCORE;
            //        if (!string.IsNullOrEmpty(minscore))
            //        {
            //            queryParamsEntity.MinScore = minscore;
            //        }
            //        else
            //        {
            //            queryParamsEntity.MinScore = "10";
            //        }
            //    }
            //}            
            IdolQuery idolquery = IdolQueryFactory.GetDisStyle(action);
            queryParamsEntity.action = action;           
            idolquery.queryParamsEntity = queryParamsEntity;
            if (isinresult)
            {
                StateMatchID = idolquery.GetStoreState();
            }
            string backstr = idolquery.GetHtmlStr();
            if (!string.IsNullOrEmpty(StateMatchID)) {
                backstr = backstr + "※" + StateMatchID;
            }
            context.Response.Write(backstr);
        }
    }
    public bool IsReusable {
        get {
            return false;
        }
    }
}
