using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace BLL.Idol
{
    public class IdolCommonQuery : IdolQuery
    {
        private Dictionary<string, string> GetParamsDict(int type) {
            Dictionary<string, string> paramsdict = new Dictionary<string, string>();
            if (queryParamsEntity != null) {
                //初始化共有字段
                
                string text = queryParamsEntity.Text;
                if (!string.IsNullOrEmpty(text))
                {
                    paramsdict.Add("Text", text);
                }
                else {
                    paramsdict.Add("Text", "*");
                }
                string mindate = queryParamsEntity.MinDate;
                if (!string.IsNullOrEmpty(mindate)) {
                    paramsdict.Add("MinDate", mindate);
                }
                string maxdate = queryParamsEntity.MaxDate;
                if (!string.IsNullOrEmpty(maxdate))
                {
                    paramsdict.Add("MaxDate", maxdate);
                }
                string fieldtext = queryParamsEntity.FieldText;
                if (!string.IsNullOrEmpty(fieldtext)) {
                    paramsdict.Add("FieldText", fieldtext);
                }
                string sort = queryParamsEntity.Sort;
                if (!string.IsNullOrEmpty(sort)) {
                    paramsdict.Add("Sort", sort);
                }
                string reference = queryParamsEntity.Reference;
                if (!string.IsNullOrEmpty(reference)) {
                    paramsdict.Add("Reference", GetUrl(reference));
                }
                string matchreference = queryParamsEntity.MatchReference;
                if (!string.IsNullOrEmpty(matchreference)) {
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
                //根据type初始化字典
                if (type == 1) {
                    paramsdict.Add("Start", queryParamsEntity.Start.ToString());
                    int End = queryParamsEntity.Start + queryParamsEntity.PageSize - 1;
                    paramsdict.Add("MaxResults", End.ToString());
                    
                    string highlight = queryParamsEntity.Highlight;
                    if (!string.IsNullOrEmpty(highlight))
                    {
                        paramsdict.Add("Highlight", highlight);
                    }
                    paramsdict.Add("Print", queryParamsEntity.Print);
                    paramsdict.Add("Characters", queryParamsEntity.Characters.ToString());
                    string printfields = queryParamsEntity.Print.ToLower() == "all" ? null : queryParamsEntity.PrintFields;
                    if (!string.IsNullOrEmpty(printfields))
                    {
                        paramsdict.Add("PrintFields", printfields);
                    }
                    string summary = queryParamsEntity.Summary;
                    if (!string.IsNullOrEmpty(summary))
                    {
                        paramsdict.Add("Summary", summary);
                    }
                    string totalresults = queryParamsEntity.TotalResults.ToString();
                    if (!string.IsNullOrEmpty(totalresults))
                    {
                        paramsdict.Add("TotalResults", totalresults);
                    }
                }
                else if (type == 2) {
                    paramsdict.Add("Start", "1");
                    paramsdict.Add("MaxResults", "10000");
                    paramsdict.Add("Print", "NoResults");
                    paramsdict.Add("StoreState", "true");
                }
                else if (type == 3) {
                    paramsdict.Add("Print", "NoResults");
                    paramsdict.Add("TotalResults", "true");
                }
            }
            return paramsdict;
        }

        public override string GetHtmlStr()
        {
            IList<IdolNewsEntity> list = GetResultList();
            ResultDisplay display = DisplayFactory.GetDisStyle((DisplayType)Enum.Parse(typeof(DisplayType), queryParamsEntity.DisplayStyle.ToString()));
            display.list = list;
            string disStr = display.Display();
            return disStr;
        }

        public override IList<IdolNewsEntity> GetResultList()
        {
            Dictionary<string, string> paramsDict = GetParamsDict(1);
            IList<IdolNewsEntity> list = newsdao.GetPagerList(queryParamsEntity.action, paramsDict);
            return list;
        }

        public override string GetStoreState()
        {
            Dictionary<string, string> paramsDict = GetParamsDict(2);
            XmlDocument xmldoc = newsdao.GetXmlDoc(queryParamsEntity.action, paramsDict);
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
            nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            XmlNode storestate = xmldoc.SelectSingleNode("//autn:state", nsmgr);
            return storestate.InnerText;
        }

        public override string GetTotalCount()
        {
            Dictionary<string, string> paramsDict = GetParamsDict(3);
            XmlDocument xmldoc = newsdao.GetXmlDoc(queryParamsEntity.action, paramsDict);
            return newsdao.GetArticleCount(xmldoc);
        }

        public override Dictionary<string, string> GetStaticAllInfo()
        {
            throw new NotImplementedException();
        }
    }
}
