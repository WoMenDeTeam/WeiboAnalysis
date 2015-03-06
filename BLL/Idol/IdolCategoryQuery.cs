using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace BLL.Idol
{
    public class IdolCategoryQuery : IdolQuery
    {
        private Dictionary<string, string> GetParamsDict(int type)
        {
            Dictionary<string, string> paramsdict = new Dictionary<string, string>();
            if (queryParamsEntity != null)
            {
                //初始化共有字段               
                paramsdict.Add("Category", queryParamsEntity.Category);
                string querytext = queryParamsEntity.QueryText;
                if (!string.IsNullOrEmpty(querytext)) {
                    paramsdict.Add("QueryText", querytext);
                }
                string databse = queryParamsEntity.DataBase;
                if (!string.IsNullOrEmpty(databse))
                {
                    paramsdict.Add("Databases", databse);
                }

                string predict = queryParamsEntity.Predict;
                if (!string.IsNullOrEmpty(predict))
                {
                    paramsdict.Add("Predict", predict);
                }
                
                StringBuilder paramstr = new StringBuilder();
                StringBuilder valuesstr = new StringBuilder();    
                string mindate = queryParamsEntity.MinDate;
                if (!string.IsNullOrEmpty(mindate))
                {
                    paramstr.Append("MinDate,");
                    valuesstr.AppendFormat("{0},", mindate);                   
                }
                string maxdate = queryParamsEntity.MaxDate;
                if (!string.IsNullOrEmpty(mindate))
                {
                    paramstr.Append("MaxDate,");
                    valuesstr.AppendFormat("{0},", maxdate); 
                }
                string fieldtext = queryParamsEntity.FieldText;
                if (!string.IsNullOrEmpty(fieldtext))
                {
                    paramstr.Append("FieldText,");
                    valuesstr.AppendFormat("{0},", fieldtext);                     
                }
                string sort = queryParamsEntity.Sort;
                if (!string.IsNullOrEmpty(sort))
                {
                    paramstr.Append("Sort,");
                    valuesstr.AppendFormat("{0},", sort);                         
                }
                string reference = queryParamsEntity.Reference;
                if (!string.IsNullOrEmpty(reference))
                {
                    paramstr.Append("Reference,");
                    valuesstr.AppendFormat("{0},", GetUrl(reference));  
                }
                string matchreference = queryParamsEntity.MatchReference;
                if (!string.IsNullOrEmpty(matchreference))
                {
                    paramstr.Append("MatchReference,");
                    valuesstr.AppendFormat("{0},", GetUrl(matchreference));                      
                }
                string combine = queryParamsEntity.Combine;
                if (!string.IsNullOrEmpty(combine))
                {
                    paramstr.Append("Combine,");
                    valuesstr.AppendFormat("{0},", combine);     
                }
                string minscore = queryParamsEntity.MinScore;
                if (!string.IsNullOrEmpty(minscore))
                {
                    paramstr.Append("MinScore,");
                    valuesstr.AppendFormat("{0},", minscore);
                }
                string statematchid = queryParamsEntity.StateMatchID;
                if (!string.IsNullOrEmpty(statematchid))
                {
                    paramstr.Append("StateMatchID,");
                    valuesstr.AppendFormat("{0},", statematchid);
                }                
               
                //根据type初始化字典
                if (type == 1)
                {
                    paramsdict.Add("Start", queryParamsEntity.Start.ToString());
                    paramsdict.Add("Numresults", queryParamsEntity.PageSize.ToString());

                    
                    string highlight = queryParamsEntity.Highlight;
                    if (!string.IsNullOrEmpty(highlight))
                    {
                        paramstr.Append("Highlight,");
                        valuesstr.AppendFormat("{0},", highlight);                         
                    }
                    string print = queryParamsEntity.Print;
                    if (!string.IsNullOrEmpty(print))
                    {
                        paramstr.Append("Print,");
                        valuesstr.AppendFormat("{0},", print);
                    }
                    paramstr.Append("Characters,");
                    valuesstr.AppendFormat("{0},", queryParamsEntity.Characters.ToString());                    
                    string printfields = queryParamsEntity.Print.ToLower() == "all" ? null : queryParamsEntity.PrintFields;
                    if (!string.IsNullOrEmpty(printfields))
                    {
                        paramsdict.Add("PrintFields", printfields);
                    }
                    string summary = queryParamsEntity.Summary;
                    if (!string.IsNullOrEmpty(summary))
                    {
                        paramstr.Append("Summary,");
                        valuesstr.AppendFormat("{0},", summary);                        
                    }
                    string totalresults = queryParamsEntity.TotalResults.ToString();
                    if (!string.IsNullOrEmpty(totalresults))
                    {
                        paramsdict.Add("TotalResults", totalresults);                        
                    }
                    paramsdict.Add("Params", paramstr.ToString().Substring(0, paramstr.Length - 1));
                    paramsdict.Add("Values", valuesstr.ToString().Substring(0, valuesstr.Length - 1));
                }
                else if (type == 2)
                {
                    paramsdict.Add("Start", "1");
                    paramsdict.Add("Numresults", "10000");
                    paramstr.Append("Print,");
                    valuesstr.Append("NoResults,");
                    paramstr.Append("StoreState,");
                    valuesstr.Append("true,");
                    paramsdict.Add("Params", paramstr.ToString().Substring(0, paramstr.Length - 1));
                    paramsdict.Add("Values", valuesstr.ToString().Substring(0, valuesstr.Length - 1));
                }
                else if (type == 3)
                {
                    paramstr.Append("Print,");
                    valuesstr.Append("NoResults,");
                    paramsdict.Add("Params", paramstr.ToString().Substring(0, paramstr.Length - 1));
                    paramsdict.Add("Values", valuesstr.ToString().Substring(0, valuesstr.Length - 1));
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
            IList<IdolNewsEntity> list = newsdao.GetPagerList("categoryquery", paramsDict);
            return list;
        }

        public override string GetStoreState()
        {
            Dictionary<string, string> paramsDict = GetParamsDict(2);
            XmlDocument xmldoc = newsdao.GetXmlDoc("categoryquery", paramsDict);
            XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
            nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            XmlNode storestate = xmldoc.SelectSingleNode("//autn:state", nsmgr);
            return storestate.InnerText;
        }

        public override string GetTotalCount()
        {
            Dictionary<string, string> paramsDict = GetParamsDict(3);
            XmlDocument xmldoc = newsdao.GetXmlDoc("categoryquery", paramsDict);
            return newsdao.GetArticleCount(xmldoc);
        }

        public override Dictionary<string, string> GetStaticAllInfo()
        {
            throw new NotImplementedException();
        }
    }
}
