using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    public class FollowerHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            String act = context.Request["act"];
            String retJson = string.Empty;
            String ID = context.Request["keyID"];
            String UserName = context.Request["userName"];
            String WebSource = context.Request["webSource"];
            String Start = context.Request["start"];
            String PageSize = context.Request["page_size"];
            if (!String.IsNullOrEmpty(act))
            {
                try
                {
                    switch (act)
                    {
                        case "InitFollower":
                            int str = Convert.ToInt32(Start);
                            int pageSize = Convert.ToInt32(PageSize);
                            String pageWhere = context.Request["where"];
                            String pageOrderBy = context.Request["orderBy"];
                            int totalCount = FollowerEntityFacade.GetTotalCount(pageWhere);
                            retJson = FollowerEntityFacade.GetJsonList(pageWhere, pageOrderBy, pageSize, str).ToJson(totalCount);
                            break;
                        case "update":
                            retJson = "{\"Success\":1}";
                            break;
                        case "insert":
                            retJson = "{\"Success\":1}";
                            break;
                        case "delete":
                            int id = context.Request["id"] == null ? 0 : int.Parse(context.Request["id"].ToString());
                            FollowerEntityFacade.DeleteById(id);
                            retJson = "{\"Success\":1}";
                            break;
                        case "getlistuserbygroupid":
                            int gid = Convert.ToInt32(context.Request["id"].ToString());
                            string result = FollowerEntityFacade.GetlistUserByGroupid(gid);
                            if (!string.IsNullOrEmpty(result))
                            {
                                retJson = "{\"Success\":1,\"data\":" + result + "}";
                            }
                            else
                            {
                                retJson = "{\"Success\":1}";
                            }
                            break;
                    }
                    context.Response.Write(retJson);
                }
                catch
                {

                    throw;
                }
            }
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
