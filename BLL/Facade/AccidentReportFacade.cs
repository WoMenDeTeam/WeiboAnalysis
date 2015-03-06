using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Text.RegularExpressions;
using System.Data;
using Util;

namespace BLL.Facade
{
    public class AccidentReportFacade
    {
        private static readonly AccidentReportEntity.AccidentReportDAO dao = new AccidentReportEntity.AccidentReportDAO();

        public static void ReoprtOperating(string id, string title, string content, string url, string department, string state, string publishtime, string createtime, string occurrencetime, string accidentlevel, string regulatorydepartment, string area, string action)
        {
            AccidentReportEntity entity = new AccidentReportEntity();
            entity.ID = Convert.ToInt32(id);
            entity.Title = title;
            entity.Content = content;
            entity.Url = GetUrlChecked(url);
            entity.Department = department;
            entity.State = Convert.ToInt32(state);
            entity.PublishTime = Convert.ToDateTime(publishtime);
            entity.CreateTime = Convert.ToDateTime(createtime);
            entity.OccurrenceTime = Convert.ToDateTime(occurrencetime);
            entity.AccidentLevel = accidentlevel;
            entity.RegulatoryDepartment = regulatorydepartment;
            entity.Area = area;
            switch (action)
            {
                case "add":
                    Add(entity);
                    break;
                case "update":
                    Update(entity);
                    break;
                default:
                    break;
            }
        }
        public static void Add(AccidentReportEntity entity)
        {
            dao.Add(entity);
        }
        public static void Update(AccidentReportEntity entity)
        {
            dao.Update(entity);
        }
        private static string GetUrlChecked(string inputUrl)
        {
            string sRegex = @"http(s)?://";
            Regex myrx = new Regex(sRegex);
            bool r = myrx.IsMatch(inputUrl);
            if (!r)
            {
                inputUrl = "http://" + inputUrl;
            }
            //Regex reg = new Regex("B");Match mat = reg.Match(str);while(mat.Success){MessageBox.Show(mat.Index.ToString());//位置mat = reg.Match(str, mat.Index+mat.Length);}
            return inputUrl;
        }
        public static void DeleteByid(string ids, int state)
        {
            dao.DeleteByids(ids, state);
        }
        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetPageList(string where, string orderBy, int pageSize, int pageNumber)
        {
            if (string.Equals(null, orderBy) || orderBy == "")
            {
                orderBy = " State DESC ";
            }
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static DataTable GetLatestAlarm(string where)
        {
            return dao.GetDataSet(where, null).Tables[0];
        }

        public static string GetPager(string where, string orderby, int pageSize, int start)
        {
            string res = string.Empty;
            int pageNumber = start / pageSize + 1;
            int rowcount = dao.GetPagerRowsCount(where, null);
            DataTable dt = dao.GetPager(where, null, orderby, pageSize, pageNumber);
            StringBuilder jsonstr = new StringBuilder();
            if (dt.Rows.Count > 0)
            {
                jsonstr.Append("{\"totalcount\":\"").Append(rowcount).Append("\",");
                jsonstr.Append("\"entitylist\":{");
                int count = 1;
                foreach (DataRow row in dt.Rows)
                {
                    jsonstr.AppendFormat("\"entity_{0}\":", count);
                    jsonstr.Append("{");
                    jsonstr.AppendFormat("\"id\":\"{0}\",", row["ID"]);
                    jsonstr.AppendFormat("\"title\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["Title"].ToString()));
                    jsonstr.AppendFormat("\"occurrencetime\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["OccurrenceTime"].ToString()));
                    jsonstr.AppendFormat("\"department\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["Department"].ToString()));
                    jsonstr.AppendFormat("\"accidentlevel\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["AccidentLevel"].ToString()));
                    jsonstr.AppendFormat("\"regulatorydepartment\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["RegulatoryDepartment"].ToString()));
                    jsonstr.AppendFormat("\"area\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["Area"].ToString()));
                    jsonstr.AppendFormat("\"url\":\"{0}\"", EncodeByEscape.GetEscapeStr(row["Url"].ToString()));

                    jsonstr.Append("},");
                    count++;
                }
                jsonstr.Append("\"Success\":1}}");
            }
            else
            {
                jsonstr.Append("{\"Success\":1,\"TotalCount\":0,\"totalcount\":0}");
                //if (data || parseInt(data["TotalCount"]) == 0) {

            }
            return jsonstr.ToString();
        }
    }
}
