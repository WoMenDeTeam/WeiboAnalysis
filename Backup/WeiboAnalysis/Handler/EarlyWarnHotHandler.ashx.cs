using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data;
using BLL.Facade;

using System.Web.SessionState;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    public class EarlyWarnHotHandler : IHttpHandler, IRequiresSessionState
    {
        public void ProcessRequest(HttpContext context)
        {
            string act = context.Request["act"];
            string retJson = string.Empty;
            String ReadWhere = "IsRead=0";
            DataSet ds = null;
            if (!string.IsNullOrEmpty(act))
            {
                try
                {
                    switch (act)
                    {
                        case "HotWarning":
                            ds = EarlyWarnHotFacade.GetWarningIDS(ReadWhere, "id");
                            if (ds != null && ds.Tables.Count > 0)
                            {
                                context.Session.Add("WarnHotIDS", GenerateIDS(ds.Tables[0]));
                                retJson = "{\"TotalCount\":\"" + ds.Tables[0].Rows.Count + "\"}";
                            }
                            else
                            {
                                retJson = "{\"TotalCount\":0}";
                            }
                            break;
                        case "updateReadState":
                            Object HotSession = context.Session["WarnHotIDS"];
                            String ids = string.Empty;
                            if (HotSession != null)
                            {
                                ids = HotSession.ToString();
                            }
                            context.Session["WarnHotIDS"].ToString();
                            String UpdateHotWhere = string.Empty;
                            if (!String.IsNullOrEmpty(ids))
                            {
                                UpdateHotWhere = "ID in (" + ids + ")";
                                EarlyWarnHotFacade.UpdateWarnState(UpdateHotWhere);
                                context.Session.Remove("WarnWordIDS");
                                retJson = "{\"Success\":1,\"MinID\":\"" + ids.Split(',')[0] + "\"}";
                            }
                            else
                            {
                                retJson = "{\"Success\":0}";
                            }
                            break;
                        case "delwarning":
                            string id = context.Request["id"].ToString().Trim();
                            string where = " ID =" + id;
                            EarlyWarnHotFacade.UpdateWarnState(where);
                            retJson = "{\"Success\":1}";
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
        private String GenerateIDS(DataTable dt)
        {
            StringBuilder _ids = new StringBuilder();
            foreach (DataRow item in dt.Rows)
            {
                _ids.Append(item["ID"]);
                _ids.Append(",");
            }
            if (_ids.Length > 0)
            {
                _ids.Remove(_ids.Length - 1, 1);
            }
            return _ids.ToString();
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
