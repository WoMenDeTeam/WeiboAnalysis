using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using IdolACINet;
using System.Xml;
using Util;

namespace BLL.Idol
{
    public class IdolStatic : IdolQuery
    {
        public override string GetHtmlStr()
        {

            Dictionary<string, string> paramsDict = GetParamsDict();
            XmlDocument xmldoc = newsdao.GetXmlDoc("GetQueryTagValues", paramsDict);
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
            nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            XmlNodeList nodes = xmldoc.SelectNodes("autnresponse/responsedata/autn:field/autn:value", nsmgr);
            StringBuilder jsonstr = new StringBuilder();
            int count = 1;
            jsonstr.Append("{");
            foreach (XmlNode node in nodes)
            {
                string Title = node.InnerText;
                string Num = node.Attributes["count"].InnerText;
                jsonstr.AppendFormat("\"entity_{0}\":", count);
                jsonstr.Append("{");
                jsonstr.AppendFormat("\"title\":\"{0}\",", EncodeByEscape.GetEscapeStr(Title));
                jsonstr.AppendFormat("\"count\":\"{0}\"", Num);
                jsonstr.Append("},");
                count++;

            }
            jsonstr.Append("\"Success\":1}");
            return jsonstr.ToString();
        }

        public override IList<IdolNewsEntity> GetResultList()
        {
            throw new NotImplementedException();
        }

        public override string GetStoreState()
        {
            throw new NotImplementedException();
        }

        public override string GetTotalCount()
        {
            throw new NotImplementedException();
        }
        //public QueryParamEntity queryparamEntity = new QueryParamEntity();
        private Dictionary<string, string> GetParamsDict()
        {
            Dictionary<string, string> paramsdict = new Dictionary<string, string>();
            if (queryParamsEntity != null)
            {
                //初始化共有字段

                string text = queryParamsEntity.Text;
                if (!string.IsNullOrEmpty(text))
                {
                    paramsdict.Add("Text", text);
                }
                else
                {
                    paramsdict.Add("Text", "*");
                }
                string mindate = queryParamsEntity.MinDate;
                if (!string.IsNullOrEmpty(mindate))
                {
                    paramsdict.Add("MinDate", mindate);
                }
                string maxdate = queryParamsEntity.MaxDate;
                if (!string.IsNullOrEmpty(maxdate))
                {
                    paramsdict.Add("MaxDate", maxdate);
                }
                string fieldtext = queryParamsEntity.FieldText;
                if (!string.IsNullOrEmpty(fieldtext))
                {
                    paramsdict.Add("FieldText", fieldtext);
                }
                string sort = queryParamsEntity.Sort;
                if (!string.IsNullOrEmpty(sort))
                {
                    paramsdict.Add("Sort", sort);
                }
                string reference = queryParamsEntity.Reference;
                if (!string.IsNullOrEmpty(reference))
                {
                    paramsdict.Add("Reference", GetUrl(reference));
                }
                string matchreference = queryParamsEntity.MatchReference;
                if (!string.IsNullOrEmpty(matchreference))
                {
                    paramsdict.Add("MatchReference", GetUrl(matchreference));
                }
                string databse = queryParamsEntity.DataBase;
                if (!string.IsNullOrEmpty(databse))
                {
                    paramsdict.Add("DataBaseMatch", databse);
                }
                string predict = queryParamsEntity.Predict;
                if (!string.IsNullOrEmpty(predict))
                {
                    paramsdict.Add("Predict", predict);
                }
                string combine = queryParamsEntity.Combine;
                if (!string.IsNullOrEmpty(combine))
                {
                    paramsdict.Add("Combine", combine);
                }
                string minscore = queryParamsEntity.MinScore;
                if (!string.IsNullOrEmpty(minscore))
                {
                    paramsdict.Add("MinScore", minscore);
                }
                string statematchid = queryParamsEntity.StateMatchID;
                if (!string.IsNullOrEmpty(statematchid))
                {
                    paramsdict.Add("StateMatchID", statematchid);
                }
                string filename = queryParamsEntity.FieldName;
                if (!string.IsNullOrEmpty(filename))
                {
                    paramsdict.Add("FieldName", filename);
                }

                string dateperiod = queryParamsEntity.DatePeriod;
                if (!string.IsNullOrEmpty(dateperiod))
                {
                    paramsdict.Add("DatePeriod", dateperiod);
                }

                bool documentcount = queryParamsEntity.DocumentCount;
                if (documentcount)
                {
                    paramsdict.Add("DocumentCount", documentcount.ToString());
                }
                string maxResults = queryParamsEntity.MaxResults;
                if (!string.IsNullOrEmpty(maxResults))
                {
                    paramsdict.Add("MaxValues", maxResults);
                }

            }
            return paramsdict;
        }

        public override Dictionary<string, string> GetStaticAllInfo()
        {
            int top = queryParamsEntity.DisNum;
            bool tag = queryParamsEntity.DisOther;
            Dictionary<string, string> list = new Dictionary<string, string>();
            Dictionary<string, string> paramsDict = GetParamsDict();
            XmlDocument xmldoc = newsdao.GetXmlDoc("GetQueryTagValues", paramsDict);
            if (xmldoc != null)
            {
                if (top == 0)
                {
                    list = GetStaticInfo(xmldoc);
                }
                else
                {
                    list = GetStaticInfo(xmldoc, top, tag);
                }
            }
            return list;
        }


        private static Dictionary<string, string> GetStaticInfo(XmlDocument xmldoc, int top, Boolean tag)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
            nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            XmlNodeList nodes = xmldoc.SelectNodes("autnresponse/responsedata/autn:field/autn:value", nsmgr);
            int count = 0;
            int othernum = 0;
            foreach (XmlNode node in nodes)
            {
                if (count > top)
                {
                    string Num = node.Attributes["count"].InnerText;
                    othernum += Convert.ToInt32(Num);
                }
                else
                {
                    string Title = node.InnerText;
                    string Num = node.Attributes["count"].InnerText;
                    dict.Add(Title, Num);
                }
                count++;
            }
            if (tag && othernum > 0)
            {
                dict.Add("其他", othernum.ToString());
            }

            return dict;
        }

        private static Dictionary<string, string> GetStaticInfo(XmlDocument xmldoc)
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
            nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            XmlNodeList nodes = xmldoc.SelectNodes("autnresponse/responsedata/autn:field/autn:value", nsmgr);
            foreach (XmlNode node in nodes)
            {

                string Title = node.InnerText;
                string Num = node.Attributes["count"].InnerText;
                dict.Add(Title, Num);

            }
            return dict;
        }
    }
}
