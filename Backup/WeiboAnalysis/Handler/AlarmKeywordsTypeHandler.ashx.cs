using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// AlarmKeywordsTypeHandler 的摘要说明
    /// </summary>
    public class AlarmKeywordsTypeHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string result = "";
            try
            {
                String switch_on = context.Request["act"];
                switch (switch_on)
                {
                    case "getlist":
                        result = GetList(context);
                        break;
                    case "add":
                        result = Add(context);
                        break;
                    case "del":
                        result = Delete(context);
                        break;
                    case "update":
                        result = Update(context);
                        break;
                    default:
                        break;
                }
            }
            catch (Exception e)
            {
                result = e.ToString();
            }
            context.Response.Write(result);
        }
        public string GetList(HttpContext context)
        {
            string result = "";
            string json = AlarmKeywordsTypeFacade.GetList(null, null, 200, 1).ToJson();
            result = string.Format("\"success\":1,\"data\":{0},\"errormsg\":-1", json);
            return "{" + result + "}";
        }
        public string Add(HttpContext context)
        {
            string result = "{\"success\":1}";
            string Name = context.Request["typeName"];
            if (string.IsNullOrEmpty(Name))
            {
                result = "{\"success\":0}";
            }
            else
            {
                AlarmKeywordsTypeFacade.Insert(Name);
                result = GetList(context);
            }

            return result;
        }
        public string Delete(HttpContext context)
        {
            string result = "{\"success\":1}";
            int id = Convert.ToInt32(context.Request["id"]);
            AlarmKeywordsTypeFacade.Del(id);
            result = GetList(context);
            return result;
        }
        public string Update(HttpContext context)
        {
            string result = "{\"success\":1}";
            int id = Convert.ToInt32(context.Request["id"]);
            string Name = context.Request["typeName"];
            if (string.IsNullOrEmpty(Name))
            {
                result = "{\"success\":0}";
            }
            else
            {
                AlarmKeywordsTypeFacade.Update(id, Name);
                result = GetList(context);
            }
            return result;
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