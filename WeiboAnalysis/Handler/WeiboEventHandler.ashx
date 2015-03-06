 <%@ WebHandler Language="C#" Class="WeiboEventHandler" %>

using System;
using System.Web;
using System.Collections.Generic;
using System.Data;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using WeiboAnalysis.WeiboDataSource;
using DBDAL.Data;
using BLL.Idol;
using BLL.Facade;
using WeiboAnalysis.IDOLBLL;
public class WeiboEventHandler : IHttpHandler
{
    private Service1SoapClient IDOLHELPER = null;
    private SqlHelper sqlh = null;
    public void ProcessRequest(HttpContext context)
    {
        string isNearTime = context.Request["isNearTime"]; /*是否查询近期*/
        string nearTime = context.Request["nearTime"]; /*近期时间*/
        BLL.Idol.QueryParamEntity paramEntity = QueryParamsDao.GetEntity(context);
        string basematch = context.Request["basematch"];
        paramEntity.DataBase = Util.ConfigUtil.CacheUsreInfo.IdolDbName();
        if (!string.IsNullOrEmpty(basematch))
        {
            paramEntity.DataBase = Util.ConfigUtil.CacheUsreInfo.IdolDbName() + "+" + basematch;
        }
        string act = context.Request["act"];
        string retJson = string.Empty;
        if (!string.IsNullOrEmpty(act))
        {
            //wds = new TopicManage();
            /*时间空判断*/
            string maxtime;
            try
            {
                switch (act)
                {
                    case "topicOfWeibo":
                    case "favoriteList":
                        paramEntity.MaxDate = string.Empty;
                        paramEntity.MinDate = string.Empty;
                        IdolQuery query = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        paramEntity.DisplayStyle = 9;
                        query.queryParamsEntity = paramEntity;
                        retJson = GetIdolJson(query);
                        break;
                    case "personalDetails":
                        //paramEntity.MaxDate = DateTime.Now.ToString("dd/MM/yyyy"); //string.Empty;
                        // paramEntity.MinDate = DateTime.Now.ToString("dd/MM/yyyy");//string.Empty;
                        IdolQuery detailsQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        paramEntity.DisplayStyle = 9;
                        detailsQuery.queryParamsEntity = paramEntity;
                        retJson = GetIdolJson(detailsQuery);
                        break;
                    case "weiboVideoCountent":
                        /* 微博视频列表加载*/
                        paramEntity.DataBase = Util.ConfigUtil.CacheUsreInfo.IdolVideoDBName();

                        maxtime = context.Request["maxdate"];
                        if (maxtime == null || maxtime == "")
                            paramEntity.MaxDate = GetNearTime("");
                        if (isNearTime != null && isNearTime == "true")
                            paramEntity.MinDate = GetNearTime(nearTime);
                        IdolQuery videoQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        paramEntity.DisplayStyle = 10;
                        videoQuery.queryParamsEntity = paramEntity;
                        retJson = GetIdolJson(videoQuery);
                        break;
                    case "weiboCountent": /*列表类容*/
                        maxtime = context.Request["maxdate"];
                        if (maxtime == null || maxtime == "")
                            paramEntity.MaxDate = GetNearTime("");
                        if (isNearTime != null && isNearTime == "true")
                            paramEntity.MinDate = GetNearTime(nearTime);
                        IdolQuery provinceIdolQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        paramEntity.DisplayStyle = 9;
                        provinceIdolQuery.queryParamsEntity = paramEntity;
                        retJson = GetIdolJson(provinceIdolQuery);
                        break;
                    case "weiboRank":
                        string minTime = context.Request["mindate"];
                        if (string.IsNullOrEmpty(minTime))
                        {
                            paramEntity.MinDate = DateTime.Now.AddDays(-7).ToString("dd/MM/yyyy");
                            //paramEntity.MinDate = new DateTime().AddDays(-7).ToString("dd/MM/yyyy"); //DateTime.Now.ToString("dd/MM/yyyy");
                        }
                        string maxTime = context.Request["maxdate"];
                        if (string.IsNullOrEmpty(maxTime))
                        {
                            paramEntity.MaxDate = DateTime.Now.ToString("dd/MM/yyyy");
                            //paramEntity.MaxDate = DateTime.Now.ToString("dd/MM/yyyy");
                        }
                        IdolQuery weiboRankQury = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        weiboRankQury.queryParamsEntity = paramEntity;
                        retJson = weiboRankQury.GetHtmlStr();
                        break;
                    case "agencyCategory":
                        IdolQuery agencyQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        agencyQuery.queryParamsEntity = paramEntity;
                        // agencyQuery.GetHtmlStr();
                        retJson = GetIdolCategory(agencyQuery);
                        break;
                    case "caselibraryweibo":
                        IdolQuery libraryQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
                        DateTime occurrentTime = string.IsNullOrEmpty(context.Request["OccurrenceTime"]) ? DateTime.Now : DateTime.Parse(context.Request["OccurrenceTime"].ToString());
                        paramEntity.MinDate = occurrentTime.ToString("dd/MM/yyyy");
                        paramEntity.MaxDate = occurrentTime.AddDays(7).ToString("dd/MM/yyyy");
                        paramEntity.DisplayStyle = 9;
                        libraryQuery.queryParamsEntity = paramEntity;
                        retJson = GetIdolJson(libraryQuery);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            context.Response.Write(retJson);
        }
        else
        {
            retJson = "{\"Success\":0});";
        }
    }
    public string GetNearTime(string nearTime)
    {
        bool isSearch = true;
        DateTime dtime = DateTime.Now;
        string[] param = nearTime.Split(',');
        int dateVal = 0;
        if (param.Length > 1)
            dateVal = int.Parse(param[0].ToString());
        if (Math.Abs(dateVal) > 0)
        {
            string act = param[1].ToString();//.ToLower();
            switch (act)
            {
                case "d":
                case "dd":
                    dtime = dtime.AddDays(dateVal);
                    break;
                case "M":
                case "MM":
                    dtime = dtime.AddMonths(dateVal);
                    break;
                case "W":
                    int days = 0 - ((dateVal * 7) - 1);
                    dtime = dtime.AddDays(days);
                    break;
                default:
                    isSearch = false;
                    break;
            }
        }

        if (isSearch)
        {
            return dtime.ToString("dd/MM/yyyy", System.Globalization.DateTimeFormatInfo.InvariantInfo);
        }
        else
        {
            return "";
        }

    }

    public string GetIdolJson(IdolQuery query)
    {
        string resultJson = query.GetHtmlStr();
        return resultJson;

    }
    public string GetIdolCategory(IdolQuery query)
    {
        System.Text.StringBuilder resBulid = new System.Text.StringBuilder();
        Dictionary<string, string> list = query.GetStaticAllInfo();
        resBulid.Append("{\"data\":[");
        string update = "0";
        foreach (var item in list)
        {
            while (true)
            {
                string res = GetTime(update, item.Key, 1);
                if (res == item.Key)
                    break;
                else
                {
                    update = res;
                    resBulid.Append("{");
                    resBulid.AppendFormat("\"y\":{0},\"x\":{1}", 0, res);
                    resBulid.Append("},");
                }
            }
            update = item.Key;
            string key = item.Key;
            resBulid.Append("{");
            resBulid.AppendFormat("\"y\":{0},\"x\":{1}", item.Value, item.Key);
            resBulid.Append("},");
        }
        if (list.Count > 0)
        {
            resBulid.Remove(resBulid.Length - 1, 1);
        }
        resBulid.Append("]}");
        return resBulid.ToString();
    }



    private string GetTime(string odate, string timeStamp, int setp)
    {
        string result = "";
        if (odate != "0")
        {
            int y = int.Parse(odate.Substring(0, 4));
            int m = int.Parse(odate.Substring(4, 2));
            int d = int.Parse(odate.Substring(6, 2));
            DateTime dtime = new DateTime(y, m, d);
            dtime = dtime.AddDays(setp);
            result = dtime.ToString("yyyyMMdd");
        }
        else
        {
            result = timeStamp;
        }
        return result;

    }
    private void InitTopicStatisticData()
    {

    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}