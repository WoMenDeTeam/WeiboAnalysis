using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using DBDAL.Data;
using Util;

namespace BLL.Facade
{
    public class TopicFacade
    {
        private SqlHelper sqlh;
        public SqlHelper sh
        {
            get
            {
                if (sqlh == null)
                {
                    sqlh = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
                }
                return sqlh;
            }
        }
        public TopicFacade()
        {
            sqlh = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
        }

        public string weibotopicjson(DataTable dt, int totalcount)
        {
            StringBuilder jsonstr = new StringBuilder();
            int count = 1;
            jsonstr.Append("{");
            foreach (DataRow row in dt.Rows)
            {
                DateTime dt1 = Convert.ToDateTime(row["STARTTIME"]);
                jsonstr.AppendFormat("\"entity_{0}\":", count);
                jsonstr.Append("{");
                jsonstr.AppendFormat("\"ID\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["ID"].ToString()));
                jsonstr.AppendFormat("\"NAME\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["NAME"].ToString()));
                jsonstr.AppendFormat("\"KEYWORD\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["KEYWORDS"].ToString()));
                jsonstr.AppendFormat("\"STARTTIME\":\"{0}\",", EncodeByEscape.GetEscapeStr(dt1.ToString("yyyy-MM-dd HH:mm")));
                jsonstr.AppendFormat("\"INDUSTRY\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["INDUSTRY"].ToString()));
                jsonstr.AppendFormat("\"ORIGINALCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["ORIGINALCOUNT"].ToString()));
                jsonstr.AppendFormat("\"FORWARDCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["FORWARDCOUNT"].ToString()));
                jsonstr.AppendFormat("\"COMMENTCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["COMMENTCOUNT"].ToString()));
                jsonstr.AppendFormat("\"JOBSTATE\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["JOBSTATE"].ToString()));
                jsonstr.AppendFormat("\"ISREAD\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["ISREAD"].ToString()));
                jsonstr.AppendFormat("\"ISSTOP\":\"{0}\"", EncodeByEscape.GetEscapeStr(row["ISSTOP"].ToString()));
                jsonstr.Append("},");
                count++;
            }
            jsonstr.Append("\"Count\":" + totalcount + "}");
            return jsonstr.ToString();
        }

        public string weibotopicjson(DataTable dt)
        {
            StringBuilder jsonstr = new StringBuilder();
            int count = 1;
            jsonstr.Append("{");
            foreach (DataRow row in dt.Rows)
            {
                jsonstr.AppendFormat("\"entity_{0}\":", count);
                jsonstr.Append("{");
                jsonstr.AppendFormat("\"ID\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["ID"].ToString()));
                jsonstr.AppendFormat("\"NAME\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["NAME"].ToString()));
                jsonstr.AppendFormat("\"KEYWORD\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["KEYWORDS"].ToString()));
                jsonstr.AppendFormat("\"STARTTIME\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["STARTTIME"].ToString()));
                jsonstr.AppendFormat("\"INDUSTRY\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["INDUSTRY"].ToString()));
                jsonstr.AppendFormat("\"ORIGINALCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["ORIGINALCOUNT"].ToString()));
                jsonstr.AppendFormat("\"FORWARDCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["FORWARDCOUNT"].ToString()));
                jsonstr.AppendFormat("\"COMMENTCOUNT\":\"{0}\",", EncodeByEscape.GetEscapeStr(row["COMMENTCOUNT"].ToString()));
                jsonstr.AppendFormat("\"ISSTOP\":\"{0}\"", EncodeByEscape.GetEscapeStr(row["ISSTOP"].ToString()));
                jsonstr.Append("},");
                count++;
            }
            jsonstr.Append("\"Success\":1}");
            return jsonstr.ToString();
        }
        public string GetCategoryList(DataTable dt)
        {
            StringBuilder jsonstr = new StringBuilder();
            int count = 1;
            string[] captions = new string[dt.Columns.Count];
            for (int i = 0; i != dt.Columns.Count; i++)
            {
                captions[i] = dt.Columns[i].Caption;
            }
            jsonstr.Append("{");
            foreach (DataRow row in dt.Rows)
            {
                jsonstr.AppendFormat("\"entity_{0}\":", count);
                jsonstr.Append("{");
                for (int i = 0; i != captions.Length; i++)
                {
                    jsonstr.AppendFormat("\"{0}\":\"{1}\",", captions[i], EncodeByEscape.GetEscapeStr(row[captions[i]].ToString()));
                }
                jsonstr.Length = jsonstr.Length - 1;
                jsonstr.Append("},");
                count++;
            }
            jsonstr.Append("\"Success\":1}");
            return jsonstr.ToString();
        }
        public string GetCategoryList(DataTable dt, int totalcount)
        {
            StringBuilder jsonstr = new StringBuilder();
            int count = 1;
            string[] captions = new string[dt.Columns.Count];
            for (int i = 0; i != dt.Columns.Count; i++)
            {
                captions[i] = dt.Columns[i].Caption;
            }
            jsonstr.Append("{");
            foreach (DataRow row in dt.Rows)
            {
                jsonstr.AppendFormat("\"entity_{0}\":", count);
                jsonstr.Append("{");
                for (int i = 0; i != captions.Length; i++)
                {
                    jsonstr.AppendFormat("\"{0}\":\"{1}\",", captions[i], EncodeByEscape.GetEscapeStr(row[captions[i]].ToString()));
                }
                jsonstr.Length = jsonstr.Length - 1;
                jsonstr.Append("},");
                count++;
            }
            jsonstr.Append("\"Count\":" + totalcount + "}");
            return jsonstr.ToString();
        }
        public int getTotalCount(string tableName, string strwhere)
        {

            int count = 0;
            string searchcountsql = string.Format("select count(*) from {0} {1}", tableName, strwhere);
            count = Convert.ToInt32(sqlh.ExecuteScalar(CommandType.Text, searchcountsql, null));
            return count;
        }
        public DataTable getPager(string tableName, string strwhere, string order, int pageindex, int pagesize)
        {

            int snum = pageindex * pagesize - pagesize;
            int endnum = pageindex * pagesize + 1;
            string sql = string.Format("SELECT TOP {0} * FROM (SELECT ROW_NUMBER() OVER ({5}) AS RowNumber,* FROM  {1} {2} ) _myResults WHERE RowNumber>{3} and RowNumber<{4} {5}", pagesize, tableName, strwhere, snum, endnum, order);
            DataSet ds = sqlh.ExecuteDateSet(sql, null);
            if (ds != null && ds.Tables.Count > 0)
            {
                return ds.Tables[0];
            }
            return null;
        }
    }
}
