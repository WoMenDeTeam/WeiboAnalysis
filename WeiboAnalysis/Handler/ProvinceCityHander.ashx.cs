using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// ProvinceCityHander 的摘要说明
    /// </summary>
    public class ProvinceCityHander : IHttpHandler
    {



        public void ProcessRequest(HttpContext context)
        {
            string result = "{\"success\":0}";
            string cityStr = "";
            //context.Response.ContentType = "text/plain";
            string act = context.Request["action"];
            string pid = context.Request["pid"];
            if (string.IsNullOrEmpty(pid))
            {
                pid = "0";
            }
            //if (string.IsNullOrEmpty(act))
            switch (act)
            {
                case "city":
                    cityStr = CaseProvinceCityFacade.GetCityToJson(int.Parse(pid));
                    break;
                default:
                    break;
            }
            if (!string.IsNullOrEmpty(cityStr))
            {
                result = "{" + string.Format("\"data\":{0},\"success\":1", cityStr) + "}";
            }
            context.Response.Write(result);
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