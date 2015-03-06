using System;
using System.Collections;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using DBDAL.Entity;
using System.Text;
using BLL.Idol;
using System.Collections.Generic;
using Util;
namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class WeiboStatistics : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/josn";
            string itemid = "48";
            string result = "";// = GetTopicValue(itemid);
            string act = context.Request["act"];
            switch (act)
            {
                case "sql":
                    result = GetTopicValue(itemid);
                    break;
                case "idol":
                    GetIdol(context);
                    break;
                default:
                    GetTopicValue(itemid);
                    break;
            }
            context.Response.Write(result);
        }
        public string GetTopicValue(string id)
        {
            StringBuilder jsonResult = new StringBuilder();
            TopicItemEntity.TopicItemDAO topicDao = new TopicItemEntity.TopicItemDAO();
            var list = topicDao.Find(" topicid=" + id + "", null);
            jsonResult.Append("\"data\":[");
            foreach (var item in list)
            {
                jsonResult.Append(item.MainID.ToString() + ",");
            }
            if (list.Count > 0)
            {
                jsonResult.Remove(jsonResult.Length - 1, 1);
            }
            jsonResult.Append("]");
            return "{" + jsonResult.ToString() + "}";
        }
        public string GetIdol(HttpContext context)
        {
            QueryParamEntity paramEntity = QueryParamsDao.GetEntity(context);
            paramEntity.DataBase = Util.ConfigUtil.CacheUsreInfo.IdolDbName();
            IdolQuery provinceIdolQuery = IdolQueryFactory.GetDisStyle(paramEntity.action);
            //paramEntity.DisplayStyle = 9;
            provinceIdolQuery.queryParamsEntity = paramEntity;
            Dictionary<string, string> list = provinceIdolQuery.GetStaticAllInfo();// GetHtmlStr();


            return "";

        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
