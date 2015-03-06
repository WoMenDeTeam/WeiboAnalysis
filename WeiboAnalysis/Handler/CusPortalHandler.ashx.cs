using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using BLL.Facade;
using System.Web;
using System.Web.SessionState;
using Util;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// CusPortalHandler 的摘要说明
    /// </summary>
    public class CusPortalHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string act = context.Request["act"];
            string retJson = string.Empty;
            string userid = Util.ConfigUtil.CacheUsreInfo.UserID();
            if (!string.IsNullOrEmpty(act) && !string.IsNullOrEmpty(userid))
            {
                try
                {
                    switch (act)
                    {
                        case "save":
                            String cusStr = context.Request["str"];
                            if (!string.IsNullOrEmpty(cusStr))
                            {
                                CustomPortalFacade.Update(userid, cusStr);
                                retJson = "{\"Success\":1}";
                            }
                            else
                            {
                                retJson = "{\"Success\":0}";
                            }
                            break;
                        case "get":
                            retJson = "{\"data\":\"" + CustomPortalFacade.GetCustomStr(userid) + "\"}";
                            break;
                        case "checkExist":
                            if (CustomPortalFacade.GetTotalCount("userid = " + userid) > 0)
                            {
                                retJson = "{\"Success\":1}";
                            }
                            else
                            {
                                retJson = "{\"Success\":0}";
                            }
                            break;
                        case "add":
                            if (CustomPortalFacade.GetTotalCount("userid = " + userid) <= 0)
                            {
                                String addCusStr = context.Request["str"];
                                if (!string.IsNullOrEmpty(addCusStr))
                                    CustomPortalFacade.Insert(userid, addCusStr);
                                retJson = "{\"Success\":1}";
                            }
                            else
                            {
                                retJson = "{\"Success\":0}";
                            }
                            break;
                        default:
                            retJson = "{\"Success\":0}";
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