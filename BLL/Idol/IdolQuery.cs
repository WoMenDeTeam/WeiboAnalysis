using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Web;

namespace BLL.Idol
{
    public abstract class IdolQuery
    {
        /* public */
        public QueryParamEntity queryParamsEntity;
        
        protected static IdolNewsEntity.IdolNewsDao newsdao = new IdolNewsEntity.IdolNewsDao(); 
        
        public abstract IList<IdolNewsEntity> GetResultList();
        public abstract string GetTotalCount();
        public abstract string GetStoreState();
        public abstract string GetHtmlStr();
        public abstract Dictionary<string, string> GetStaticAllInfo();

        protected static string GetUrl(string weburl)
        {
            StringBuilder urlstr = new StringBuilder();
            string[] reflist = weburl.Split('+');
            foreach (string url in reflist)
            {
                if (urlstr.Length > 0)
                {
                    urlstr.Append("+");
                }

                urlstr.Append(System.Web.HttpUtility.UrlEncode(url));
            }
            return urlstr.ToString();
        }
    }

    public class IdolQueryFactory
    {
        public static IdolQuery GetDisStyle(string type)
        {
            string disType = type.ToLower();
            switch (disType)
            {
                case "query":
                    return new IdolCommonQuery();
                case "categoryquery":
                    return new IdolCategoryQuery();
                case "agentgetresults":
                    return new IdolAgentQuery();
                case "getquerytagvalues":
                    return new IdolStatic();  
                default:
                    return new IdolCommonQuery();
            }
        }
    }
}
