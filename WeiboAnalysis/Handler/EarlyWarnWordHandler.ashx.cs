using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BLL.Facade;
using System.Data;
using System.Text;
using System.Web.SessionState;

namespace WeiboAnalysis.Handler
{
    /// <summary>
    /// $codebehindclassname$ 的摘要说明
    /// </summary>
    public class EarlyWarnWordHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            String act = context.Request["act"];
            String retJson = string.Empty;
            String ReadWhere = "IsRead=0";
            DataSet ds = null;
            if (!String.IsNullOrEmpty(act))
            {
                try
                {
                    switch (act)
                    {
                        case "WordWarning":
                            ds = EarlyWarnWordFacade.GetWarningIDS(ReadWhere, "id");
                            if (ds != null && ds.Tables.Count > 0)
                            {
                                context.Session.Add("WarnWordIDS", GenerateIDS(ds.Tables[0]));
                                retJson = "{\"TotalCount\":\"" + ds.Tables[0].Rows.Count + "\"}";
                            }
                            else
                            {
                                retJson = "{\"TotalCount\":0}";
                            }
                            break;
                        case "updateReadState":
                            Object WordSession = context.Session["WarnWordIDS"];
                            String ids = string.Empty;
                            if (WordSession != null)
                            {
                                ids = WordSession.ToString();
                            }
                            if (!String.IsNullOrEmpty(ids))
                            {
                                ids = "ID in (" + ids + ")";
                                EarlyWarnWordFacade.UpdateWarnState(ids);
                                context.Session.Remove("WarnWordIDS");
                                retJson = "{\"Success\":1,\"Count\":\"" + ids.Split(',').Length + "\"}";
                            }
                            else
                            {
                                retJson = "{\"Success\":0}";
                            }
                            break;
                        case "delwarning":
                            string id = context.Request["id"].ToString().Trim();
                            string where = " ID =" + id;
                            EarlyWarnWordFacade.UpdateWarnState(where);
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
