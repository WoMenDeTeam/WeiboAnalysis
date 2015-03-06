using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Util;
using DBDAL.Entity;
using System.Data;
using System.Text;
using BLL.Facade;

namespace WeiboAnalysis.Handler
{

    /// <summary>
    /// Keywords2Handler 的摘要说明
    /// </summary>
    public class Keywords2Handler : IHttpHandler
    {
        private keywords2Entity.keywords2DAO keywordDao = new keywords2Entity.keywords2DAO();
        /// <summary>
        /// DATATABLE转换为Tree形式的JSON格式
        /// </summary>
        /// <param name="rows"></param>
        /// <returns></returns>
        public string DataTableToJson(DataTable dt)
        {

            StringBuilder resultJson = new StringBuilder();
            int rowsCount = dt.Rows.Count;
            if (rowsCount > 0)
            {
                resultJson.Append("[");
                foreach (DataRow item in dt.Rows)
                {
                    resultJson.Append("{");
                    resultJson.AppendFormat("\"name\":\"{0}\",", item["title"]);
                    resultJson.AppendFormat("\"id\":\"{0}\"", item["kid"]);
                    resultJson.Append("},");
                }
                resultJson.Remove(resultJson.Length - 1, 1);
                resultJson.Append("]");

            }
            else
            {
                resultJson.Append("null");
            }

            return resultJson.ToString();
        }

        protected string GetJsonStr(keywords2Entity EditEntity)
        {
            StringBuilder JsonStr = new StringBuilder();
            JsonStr.Append("{");
            JsonStr.AppendFormat("\"{0}\":\"{1}\",", "kid", EncodeByEscape.GetEscapeStr(EditEntity.kid.ToString()));
            JsonStr.AppendFormat("\"{0}\":\"{1}\",", "title", EncodeByEscape.GetEscapeStr(EditEntity.title));
            JsonStr.AppendFormat("\"{0}\":\"{1}\",", "keyword", EncodeByEscape.GetEscapeStr(EditEntity.keyword));
            JsonStr.Append("\"Success\":1}");
            return JsonStr.ToString();
        }
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request["ajaxString"] == "1")
            {
                Dictionary<string, string> Paramas = new Dictionary<string, string>();

                foreach (string key in context.Request.Form.AllKeys)
                {
                    Paramas.Add(key, EncodeByEscape.GetUnEscapeStr(context.Request[key]));
                }
                string res = string.Empty;
                string act = context.Request["act"];
                string idList = context.Request["idList"];
                string val = context.Request["val"];
                try
                {
                    switch (act)
                    {
                        case "power":
                            string power = Util.ConfigUtil.CacheUsreInfo.UserID();
                            int p = string.IsNullOrEmpty(power) ? 0 : Convert.ToInt32(power);
                            UserAccountsEntity uEntity = UserAccountsFacade.GetUserById(p);
                            res = "{\"Success\":1,\"Power\":" + uEntity.Power + "}";
                            //Util.ConfigUtil.CacheUsreInfo.UserID();
                            break;
                        //左侧树操作
                        //初始化数列表
                        case "initial":
                            DataTable dt = keywordDao.GetDataSet("", null).Tables[0];
                            //DataTable Worddt = GetWords();
                            //RecursiveChild(dt, Worddt.Select());//根据根节点进行查询.
                            res = DataTableToJson(dt);
                            break;
                        //左侧树操作
                        //初始化弹出层数据
                        case "initEdit":
                            keywords2Entity lexiconType = keywordDao.FindById(Convert.ToInt64(idList));
                            res = GetJsonStr(lexiconType);
                            break;
                        //左侧树操作
                        //增加树节点
                        case "Add":
                            keywords2Entity addlexiconType = new keywords2Entity();
                            addlexiconType.title = Paramas["title"];
                            addlexiconType.keyword = Paramas["keyword"].ToString().Replace("\n", "\\n").Replace("\"", "\\\"");
                            keywordDao.Add(addlexiconType);
                            res = "{\"Success\":1}";
                            break;
                        //左侧树操作
                        //修改树节点
                        case "EditOne":
                            keywords2Entity editlexiconType = keywordDao.FindById(Convert.ToInt64(Paramas["Id"]));
                            editlexiconType.keyword = Paramas["keyword"];
                            editlexiconType.title = Paramas["title"];
                            keywordDao.Update(editlexiconType);
                            res = "{\"Success\":1}";
                            break;
                        //左侧树操作
                        //删除树节点
                        case "remove":
                            keywords2Entity delentity = new keywords2Entity() { kid = int.Parse(idList) };
                            keywordDao.Delete(delentity);
                            res = "{\"Success\":1}";
                            break;
                        case "markDel":
                            keywordDao.MarkOperate(Paramas["refids"], 1);
                            break;
                        case "markIgnored":
                            keywordDao.MarkOperate(Paramas["refids"], 2);
                            break;
                        case "untreated":
                            keywordDao.MarkOperate(Paramas["refids"], 0);
                            break;
                        default:
                            break;
                    }


                }
                catch (Exception ex)
                {
                    res = "{\"Error\":1,\"ErrorStr\":\"" + ex.ToString() + "\"}";
                }
                finally
                {
                    context.Response.Write(res);
                    context.Response.End();
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