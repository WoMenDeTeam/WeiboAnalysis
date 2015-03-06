<%@ WebHandler Language="C#" Class="WeiboTopicHandler" %>

using System;
using System.Web;
using System.Data;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Text;
using DBDAL.Data;
using BLL.Facade;
using Util;
public class WeiboTopicHandler : IHttpHandler
{
    private TopicManage wds = null;
    public void ProcessRequest(HttpContext context)
    {
        string act = context.Request["act"];
        string retJson = string.Empty;
        act = string.IsNullOrEmpty(Util.ConfigUtil.CacheUsreInfo.SqlDBKey()) ? "" : act;
        if (!string.IsNullOrEmpty(act))
        {
            wds = new TopicManage();
            try
            {
                //SqlHelper sqlh = new SqlHelper("WeiboDBStr");
                switch (act)
                {
                    case "delTopic":
                        string topicID = context.Request["cateid"];
                        if (!string.IsNullOrEmpty(topicID))
                        {
                            retJson = wds.DelTopic(topicID);
                        }
                        break;
                    case "updateTopic": /*追加话题*/
                        string tname = "name='" + context.Request["tName"].Replace("'", "") + "'";
                        string sid = context.Request["sid"];
                        if (wds.TopicUpdate(tname, "", "", sid, "edit"))//sqlh.ExecuteSql(addsql, null) > 0)
                        {
                            retJson = "{\"Success\":1}";
                        }
                        else
                        {
                            retJson = "{\"Success\":0}";
                        }
                        //更新话题统计量，和话题总量
                        break;
                    case "GetTasksCount":
                        string ReadWhere = "IsDel=0 and (JobState ='1' or JobState='2' or JobState='0')";
                        int TasksCount = wds.GetTotalCount(ReadWhere);
                        if (TasksCount > 0)
                        {
                            retJson = "{\"TotalCount\":\"" + TasksCount + "\"}";
                        }
                        else
                        {
                            retJson = "{\"TotalCount\":0}";
                        }
                        break;
                    case "updateJobState":
                        string jobState = context.Request["jobstate"].Replace("'", "");
                        string tid = context.Request["topicid"];
                        switch (jobState)
                        {
                            case null:
                            case "":
                                break;
                            case "0":
                                jobState = "jobstate = '1'";
                                break;
                            case "1":
                                jobState = "jobstate = '0'";
                                break;
                            case "3":
                                jobState = "jobstate = '0'";
                                break;
                        }
                        if (!string.IsNullOrEmpty(jobState))
                        {
                            wds.TopicUpdate(jobState, "", "", tid, "edit");
                            retJson = "{\"Success\":1}";
                        }
                        else
                        {
                            retJson = "{\"Success\":0}";
                        }
                        break;
                    default:
                        break;
                }
            }
            catch
            {
                throw;
            }

        }
        else
        {
            retJson = "{\"Success\":0}";
        }
        context.Response.Write(retJson);
    }
    private string GetCategoryList(DataTable dt)
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
        jsonstr.Append("\"Success\":1}");
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