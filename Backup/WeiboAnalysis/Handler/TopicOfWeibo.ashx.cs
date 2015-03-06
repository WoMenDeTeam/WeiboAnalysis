using System;
using System.Collections;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml.Linq;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    public class TopicOfWeibo : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/josn";
            string act = context.Request["act"];
            string result = "";
            try
            {
                switch (act)
                {
                    case "delete":
                        DeleteItem(context);
                        result = "{\"error\":1}";
                        break;
                    default:
                        result = "{" + GetTopicItemToJson(context) + ",\"error\":1}";
                        break;
                }

            }
            catch (Exception)
            {
                result = "{\"error\":0}";
                //throw;
            }
            context.Response.Write(result);
        }

        public string GetTopicItemToJson(HttpContext context)
        {
            string topicId = context.Request["topicId"] == null ? "0" : context.Request["topicId"].ToString();
            return TopicItemFacade.getByTopicIdToJson(int.Parse(topicId));
        }
        public void DeleteItem(HttpContext context)
        {
            string topicId = context.Request["topicId"] == null ? "0" : context.Request["topicId"].ToString();
            string sqlwhere = context.Request["mainids"];
            TopicItemFacade.deleteByWhere(int.Parse(topicId), sqlwhere);

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
