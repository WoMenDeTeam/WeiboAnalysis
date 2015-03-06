using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL.Idol
{
    public class IdolAgentQuery : IdolQuery
    {
        private Dictionary<string, string> GetParamsDict()
        {
            Dictionary<string, string> paramsdict = new Dictionary<string, string>();
            if (queryParamsEntity != null)
            {
                //初始化共有字段
                //paramsdict.Add("action", "AgentGetResults");
                string username = queryParamsEntity.UserName;
                if (!string.IsNullOrEmpty(username))
                {
                    paramsdict.Add("UserName", username);
                }
                string agentname = queryParamsEntity.AgentName;
                if (!string.IsNullOrEmpty(agentname))
                {
                    paramsdict.Add("AgentName", agentname);
                }

                paramsdict.Add("DreoutputEncoding", "utf8");
                paramsdict.Add("DreSentences", "true");
                paramsdict.Add("DreXmlmeta", "3");
                string mindate = queryParamsEntity.MinDate;
                if (!string.IsNullOrEmpty(mindate))
                {
                    paramsdict.Add("DreMinDate", mindate);
                }
                string maxdate = queryParamsEntity.MaxDate;
                if (!string.IsNullOrEmpty(maxdate))
                {
                    paramsdict.Add("DreMaxDate", maxdate);
                }
                string fieldtext = queryParamsEntity.FieldText;
                if (!string.IsNullOrEmpty(fieldtext))
                {
                    paramsdict.Add("DreFieldText", fieldtext);
                }
                string sort = queryParamsEntity.Sort;
                if (!string.IsNullOrEmpty(sort))
                {
                    paramsdict.Add("DreSort", sort);
                }                          
                string combine = queryParamsEntity.Combine;
                if (!string.IsNullOrEmpty(combine))
                {
                    paramsdict.Add("DreCombine", combine);
                }
                string summary = queryParamsEntity.Summary;
                if (!string.IsNullOrEmpty(summary))
                {
                    paramsdict.Add("DreSummary", summary);
                }
                paramsdict.Add("DrePrint", queryParamsEntity.Print);
                paramsdict.Add("DreCharacters", queryParamsEntity.Characters.ToString());
                string printfields = queryParamsEntity.Print.ToLower() == "all" ? null : queryParamsEntity.PrintFields;
                if (!string.IsNullOrEmpty(printfields))
                {
                    paramsdict.Add("DrePrintFields", printfields);
                }
                string totalresults = queryParamsEntity.TotalResults.ToString();
                if (!string.IsNullOrEmpty(totalresults))
                {
                    paramsdict.Add("DreTotalResults", totalresults);
                }
                paramsdict.Add("DreStart", queryParamsEntity.Start.ToString());
                int End = queryParamsEntity.Start + queryParamsEntity.PageSize - 1;
                paramsdict.Add("DreMaxResults", End.ToString());
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
            Dictionary<string, string> paramsDict = GetParamsDict();
            IList<IdolNewsEntity> list = newsdao.GetPagerList("AgentGetResults", paramsDict);
            return list;
        }

        public override string GetStoreState()
        {
            throw new NotImplementedException();
        }

        public override string GetTotalCount()
        {
            throw new NotImplementedException();
        }

        public override Dictionary<string, string> GetStaticAllInfo()
        {
            throw new NotImplementedException();
        }
    }
}
