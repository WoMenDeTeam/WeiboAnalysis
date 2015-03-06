<%@ WebHandler Language="C#" Class="SqlSearch" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Data;
using System.Text;
using BLL.Facade;
using Util;
public class SqlSearch : IHttpHandler
{
    private TopicManage tm = null;
    public void ProcessRequest(HttpContext context)
    {

        string action = context.Request["action"];
        int Start = Convert.ToInt32(context.Request["start"]);
        int PageSize = Convert.ToInt32(context.Request["page_size"]);
        tm = new TopicManage();
        String jsonStr = String.Empty;
        switch (action)
        {

            case "getwordwarninglist":
                string wordwarningstrWhere = " B.WORDWARNINGID IS NOT NULL AND B.USERNAME LIKE '%admin%'";
                string wordwarningstrcountWhere = " WORDWARNINGID IS NOT NULL AND USERNAME LIKE '%admin%'";
                // context.Response.Write(AlarmFacade.GetWordWarningJsonStr(wordwarningstrWhere, "", Start, PageSize, wordwarningstrcountWhere));
                break;
            case "getpageviewwarninglist":
                string pageviewwarningstrWhere = " B.WARNINGMSGID IS NOT NULL AND B.USERNAME LIKE '%admin%'";
                string pageviewwarningstrcountWhere = " WARNINGMSGID IS NOT NULL AND USERNAME LIKE '%admin%'";
                //  context.Response.Write(AlarmFacade.GetSiteWarningJsonStr(pageviewwarningstrWhere, "", Start, PageSize, pageviewwarningstrcountWhere));
                break;
            case "weibotopiccontent":

                string stime = context.Request["stime"];
                string etime = context.Request["etime"];
                string topicOrderby = context.Request["orderby"];
                string topicWhere = context.Request["where"];
                jsonStr = tm.GetTopicPager("", topicWhere, "", stime, etime, Start, PageSize, topicOrderby);
                break;
            case "friendsContent":
                string friendsGroupid = context.Request["groupid"];
                break;
            case "fellowContent":
                string fellowGroupid = context.Request["groupid"];
                break;
            case "warnWordList":
                //wordCount
                string warnWordWhere = string.Empty;
                int wordCount;
                if (!string.IsNullOrEmpty(context.Request["wordCount"]))
                {
                    wordCount = Convert.ToInt32(context.Request["wordCount"]);
                    warnWordWhere = "IsRead=1";
                }
                else
                {
                    wordCount = EarlyWarnWordFacade.GetTotalCount("");
                }
                string warnWordOrderBy = " eww.IsRead, eww.Timestamp DESC ";
                jsonStr = EarlyWarnWordFacade.GetList(warnWordWhere, warnWordOrderBy, PageSize, Start).ToJson(wordCount);
                break;
            case "warnHotList":
                //minID
                string warnHotOrderBy = string.Empty;
                string warnHotWhere = string.Empty;
                if (!string.IsNullOrEmpty(context.Request["minID"]))
                {
                    string minID = context.Request["minID"];
                    warnHotWhere = "id >=" + minID + " and IsRead=1";
                    warnHotOrderBy = "increment desc";
                }
                else
                {
                    warnHotOrderBy = " ewh.Timestamp DESC ,ewh.IsRead ";
                }
                int warnHotcount = EarlyWarnHotFacade.GetTotalCount(warnHotWhere);
                jsonStr = EarlyWarnHotFacade.GetList(warnHotWhere, warnHotOrderBy, PageSize, Start).ToJson(warnHotcount);
                break;
            case "loadComments":
                string topicId = context.Request["topicid"];
                if (!string.IsNullOrEmpty(topicId))
                {
                    int cmCount = ReItemFacade.GetTotalCount(topicId);
                    jsonStr = ReItemFacade.GetComments(topicId, "", PageSize, Start).ToJson(cmCount);
                }
                break;
            default:
                break;
        }
        context.Response.Write(jsonStr);
    }

    private string GetCategoryList(DataTable dt, int totalcount)
    {
        StringBuilder jsonstr = new StringBuilder();
        int count = 1;
        string[] captions = new string[dt.Columns.Count];
        for (int i = 0; i != dt.Columns.Count; i++)
        {
            captions[i] = dt.Columns[i].Caption;
        }
        jsonstr.Append("{");
        foreach (DataRow row in dt.Rows)
        {
            jsonstr.AppendFormat("\"entity_{0}\":", count);
            jsonstr.Append("{");
            for (int i = 0; i != captions.Length; i++)
            {
                jsonstr.AppendFormat("\"{0}\":\"{1}\",", captions[i], EncodeByEscape.GetEscapeStr(row[captions[i]].ToString()));
            }
            jsonstr.Length = jsonstr.Length - 1;
            jsonstr.Append("},");
            count++;
        }
        jsonstr.Append("\"Count\":" + totalcount + "}");
        return jsonstr.ToString();
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}