using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IdolACINet;
using System.Configuration;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// EditIdolTag 的摘要说明
    /// </summary>
    public class EditIdolTag : IHttpHandler
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
                    case "editdoc":
                        ExcuteEdit(context);
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
        public void ExcuteEdit(HttpContext context)
        {
            Connection cnn = new Connection(idolip, 9001);
            Drereplace drereplace = new Drereplace();

            string docId = context.Request["docid"];// "4137474";
            string fieldName = context.Request["fieldName"];// "EMOTION";
            string fieldValue = context.Request["fieldValue"];
            docId = string.IsNullOrEmpty(docId) ? "4137474" : docId.Trim();
            fieldName = string.IsNullOrEmpty(fieldName) ? "EMOTION" : fieldName.Trim();
            fieldValue = string.IsNullOrEmpty(fieldValue) ? "0" : fieldValue.Trim();
            drereplace.ReplaceAllRefs = true;
            drereplace.PostData = "#DREDOCID " + docId + "\n#DREFIELDNAME " + fieldName + "\n#DREFIELDVALUE " + fieldValue + "\n#DREENDDATANOOP\n\n";
            cnn.Execute(drereplace);
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