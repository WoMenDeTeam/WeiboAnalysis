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
    public class MonitorInfo : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/json";
            string result = "";
            string act = context.Request["act"] == null ? "" : context.Request["act"].ToLower().ToString();
            switch (act)
            {
                case "getattention":
                    result = GetAttentionJson(context);
                    break;
                case "addattention":

                    result = AddAttention(context); //添加关注
                    break;
                case "removeattention":
                    result = RemoveAttention(context);//取消关注
                    break;
                case "isattention":
                    // result = IsAttention(context);//是否关注过
                    break;
                default:
                    result = TopicAct(context);
                    break;
            }
            context.Response.Write(result);
        }

        public string TopicAct(HttpContext context)
        {
            string result = "";
            string urldata = context.Request["data"] == null ? "" : context.Request["data"].ToString();
            string topicname = context.Request["topicName"].ToString();
            string[] modata = urldata.Remove(urldata.Length - 1, 1).Split('|');
            string topicVals = "";
            int id = AddTopic(topicname);
            foreach (var item in modata)
            {
                topicVals += "(" + id.ToString() + "," + item + "),";
            }
            topicVals = topicVals.Remove(topicVals.Length - 1, 1);
            int resSuccess = AddTopicItem(topicVals);
            if (resSuccess > 0)
            {
                result = "{\"success\":1}";
            }
            else
            {
                result = "{\"success\":0}";
            }
            return result;
        }

        public int AddTopic(string name)
        {
            TopicManage topicManager = new TopicManage();
            return topicManager.AddTopicEntity(name, "", "");
        }
        public int AddTopicItem(string vals)
        {
            //TopicItemEntity.TopicItemDAO topicSqlHelper = new TopicItemEntity.TopicItemDAO();
            int result = TopicItemFacade.Add(vals);
            return result;
        }
        //添加关注
        public string AddAttention(HttpContext context)
        {
            string result = "{\"success\":0}";
            string WebSource = context.Request["webSource"];// string.IsNullOrEmpty(context.Request["webSource"]) ? 1 : int.Parse(context.Request["webSource"].ToString());
            string Nick = context.Request["nick"].ToString();
            string UserName = context.Request["userName"].ToString();
            //entity.UserName = userName;
            //entity.Nick = nick;
            //entity.WebSource
            var count = FollowerEntityFacade.GetTotalCount("UserName='" + UserName + "' and WebSource=" + WebSource);
            if (count <= 0)
            {
                result = FollowerEntityFacade.Add(UserName, Nick, WebSource);
                FollowerStateFacade.AddFollowerState(UserName, int.Parse(WebSource));
            }
            else
            {
                result = "{\"success\":0,\"act\":\"tj\"}";
            }

            if (result == "1")
            {
                result = "{\"success\":1,\"act\":\"tj\"}";
            }
            return result;
        }
        //public string IsAttention(HttpContext context)
        //{
        //    string result = "";
        //    //FollowerEntity entity = FollowerEntityFacade.FindByUserName(context.Request["userName"].ToString(), context.Request["webSource"].ToString());
        //    if (entity == null)
        //    {
        //        result = "{\"success\":1,\"data\":\"false\"}";
        //    }
        //    else
        //    {
        //        result = "{\"success\":1,\"data\":\"true\"}";
        //        //result = "{\"data\":[{\"userName\":\"" + entity.UsernName + "\",\"webSource\":\"" + entity.WebSource + "\",\"id\":\"" + entity.ID + "\"}]}";
        //    }
        //    return result;
        //}
        //取消关注
        public string RemoveAttention(HttpContext context)
        {
            string result = "{\"success\":0}";

            int webSource = string.IsNullOrEmpty(context.Request["webSource"]) ? 1 : int.Parse(context.Request["webSource"].ToString());
            string nick = context.Request["nick"].ToString();
            string userName = context.Request["userName"].ToString();
            // result = FollowerEntityFacade.Add(entity);
            result = FollowerEntityFacade.Delete(userName, webSource);
            FollowerStateFacade.UpdateFollowerState(userName, webSource);
            if (result == "1")
            {
                result = "{\"success\":1,\"act\":\"qx\"}";
            }
            return result;
        }
        //获取关注人
        public string GetAttentionJson(HttpContext context)
        {
            string result = FollowerEntityFacade.GetAttentionToJson();
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
