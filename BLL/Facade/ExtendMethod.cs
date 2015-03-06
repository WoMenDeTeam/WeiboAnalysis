using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using Util;

namespace BLL.Facade
{
    public static class ExtendMethod
    {
        public static String ToJson(this DataTable dt, int totalcount)
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

        /// <summary>
        /// 新DataTableToJson
        /// 创建时间:2013-04-02
        /// 最后时间:2013-04-02
        /// </summary>
        /// <param name="dt"></param>
        /// <returns>[{data},{data},{data}...]</returns>
        public static string ToJson(this DataTable dt)
        {
            StringBuilder resultJson = new StringBuilder();
            int rowsCount = dt.Rows.Count;
            int columsCount = dt.Columns.Count;
            if (rowsCount <= 0) return null;
            resultJson.Append("[");
            foreach (DataRow item in dt.Rows)
            {
                resultJson.Append("{");
                for (int i = 0; i < columsCount; i++)
                {

                    string key = dt.Columns[i].ColumnName;
                    string value = item[key].ToString();
                    value.Replace("\"", "“");
                    resultJson.AppendFormat("\"{0}\":\"{1}\",", key, value);
                }
                resultJson.Remove(resultJson.Length - 1, 1);
                resultJson.Append("},");
            }
            resultJson.Remove(resultJson.Length - 1, 1);
            resultJson.Append("]");
            return resultJson.ToString();
        }
        public static string ToJson(this DataTable dt, string[] Encode)
        {
            StringBuilder resultJson = new StringBuilder();
            int rowsCount = dt.Rows.Count;
            int columsCount = dt.Columns.Count;
            if (rowsCount <= 0) return null;
            resultJson.Append("[");
            foreach (DataRow item in dt.Rows)
            {
                resultJson.Append("{");
                for (int i = 0; i < columsCount; i++)
                {
                    bool isEncode = false;
                    string key = dt.Columns[i].ColumnName;
                    string value = item[key].ToString();
                    for (int j = 0; j < Encode.Length; j++)
                    {
                        if (key.ToLower().Equals(Encode[j].ToLower()))
                        {
                            isEncode = true;
                        }
                    }
                    if (isEncode)
                    {
                        resultJson.AppendFormat("\"{0}\":\"{1}\",", key, EncodeByEscape.GetEscapeStr(value));
                    }
                    else
                    {
                        resultJson.AppendFormat("\"{0}\":\"{1}\",", key, value);
                    }
                }
                resultJson.Remove(resultJson.Length - 1, 1);
                resultJson.Append("},");
            }
            resultJson.Remove(resultJson.Length - 1, 1);
            resultJson.Append("]");
            return resultJson.ToString();
        }

    }
}
