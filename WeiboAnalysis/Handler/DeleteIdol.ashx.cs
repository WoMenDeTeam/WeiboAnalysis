using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IdolACINet;
using System.Configuration;

namespace WeiboAnalysis.Handler
{

    /// <summary>
    /// DeleteIdol 的摘要说明
    /// </summary>
    public class DeleteIdol : IHttpHandler
    {

        public static string idolip = ConfigurationManager.AppSettings["IdolHttp"];

        public void ProcessRequest(HttpContext context)
        {
            string result = "{\"success\":1,\"error\":\"\"}";
            context.Response.ContentType = "application/json";
            try
            {
                string switch_on = context.Request["acction"];
                switch (switch_on)
                {
                    case "deleteweibo":
                        DeleteWeibo(context);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception e)
            {
                result = "{\"success\":0,\"error\":\"" + e.ToString() + "\"}";
            }

            context.Response.Write(result);
        }
        public string DeleteWeibo(HttpContext context)
        {
            string result = "{\"success\":1}";
            Connection drecnn = new Connection(idolip, 9001);
            DRECHANGEMETA changeMeta = GetChangeMeta(context);
            ExcuteRemove(drecnn, changeMeta);
            return result;
        }
        public DRECHANGEMETA GetChangeMeta(HttpContext context)
        {
            string targetDatabaseName = context.Request["TargetDatabaseName"];
            targetDatabaseName = string.IsNullOrEmpty(targetDatabaseName) ? "Archive" : targetDatabaseName;
            string docid = context.Request["docid"];
            docid = string.IsNullOrEmpty(docid) ? "0" : docid.Trim();
            DRECHANGEMETA changeMeta = new DRECHANGEMETA();
            changeMeta.Type = "database";
            changeMeta.NewValue = targetDatabaseName;// "Archive";
            changeMeta.Docs = docid;
            return changeMeta;
        }
        public string ExcuteRemove(Connection drecnn, DRECHANGEMETA changeMeta)
        {
            Response res = drecnn.Execute(changeMeta);
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