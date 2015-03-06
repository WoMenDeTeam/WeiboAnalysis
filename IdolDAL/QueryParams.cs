using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class QueryParams
    {
        public static string Text
        {
            get
            {
                return "Text";
            }
        }
        public static string FieldText
        {
            get
            {
                return "FieldText";
            }
        }
        public static string DatabaseMatch
        {
            get
            {
                return "DatabaseMatch";
            }
        }
        public static string MatchID
        {
            get
            {
                return "MatchID";
            }
        }

        public static string TotalResults
        {
            get
            {
                return "TotalResults";
            }
        }

        public static string MaxResults
        {
            get
            {
                return "MaxResults";
            }
        }
        public static string Start
        {
            get
            {
                return "Start";
            }
        }

        public static string SecurityInfo
        {
            get
            {
                return "SecurityInfo";
            }
        }

        public static string MatchReference
        {
            get
            {
                return "MatchReference";
            }
        }
        /// <summary>
        /// 注意日期格式 DD/MM/YY(YY)
        /// </summary>
        public static string MinDate
        {
            get
            {
                return "MinDate";
            }
        }
        /// <summary>
        /// 注意日期格式 DD/MM/YY(YY)
        /// </summary>
        public static string MaxDate
        {
            get
            {
                return "MaxDate";
            }
        }
        public static string Sort
        {
            get
            {
                return "Sort";
            }
        }
        public static string MinScore
        {
            get
            {
                return "MinScore";
            }
        }
        public static string MinID
        {
            get
            {
                return "MinID";
            }
        }
        public static string MaxID
        {
            get
            {
                return "MaxID";
            }
        }

        public static string Combine
        {
            get
            {
                return "Combine";
            }
        }
        public static string QuerySummary
        {
            get
            {
                return "QuerySummary";
            }
        }
        /// <summary>
        /// Determines which type of summary is generated
        /// </summary>
        public static string Summary
        {
            get
            {
                return "Summary";
            }
        }
        public static string Cluster
        {
            get
            {
                return "Cluster";
            }
        }

        public static string Print
        {
            get
            {
                return "Print";
            }
        }

        public static string StoreState
        {
            get
            {
                return "StoreState";
            }
        }
        public static string StateMatchID
        {
            get
            {
                return "StateMatchID";
            }
        }

        public static string Highlight
        {
            get
            {
                return "Highlight";
            }
        }
        public static string StartTag
        {
            get
            {
                return "StartTag";
            }
        }
        public static string EndTag
        {
            get
            {
                return "EndTag";
            }
        }


        public static string DREDbName
        {
            get
            {
                return "DREDbName";
            }
        }

        public static string DREQuery
        {
            get
            {
                return "DREQuery";
            }
        }

        /// <summary>
        /// The desired number of sentences in the summary
        /// </summary>
        public static string Sentences
        {
            get
            {
                return "Sentences";
            }
        }

        #region Category
        /// <summary>
        /// The ID of the category。CategoryQuery/Category
        /// 在CategoryCreate/Category时可以指定ID(Category)和Name，也可以Category=分类名，ID由系统生成
        /// </summary>
        public static string Category
        {
            get
            {
                return "Category";
            }
        }

        /// <summary>
        /// CategoryCreate/Name The name of the category to be created
        /// </summary>
        public static string Name
        {
            get
            {
                return "Name";
            }
        }

        /// <summary>
        /// CategoryCreate/Parent
        /// </summary>
        public static string Parent
        {
            get
            {
                return "Parent";
            }
        }

        /// <summary>
        /// CategoryQuery/Databases Databases=Finance,Business
        /// </summary>
        public static string Databases
        {
            get
            {
                return "Databases";
            }
        }
        
        /// <summary>
        /// CategoryQuery/Params
        /// Query action parameters to be added to the category query
        /// 注意和Values 成对出现且正确匹配参数 Params=Sort,MinDate  Values=Date,01/01/2003
        /// </summary>
        public static string Params
        {
            get
            {
                return "Params";
            }
        }

        /// <summary>
        /// CategoryQuery/Values
        /// Values for the specified Params
        /// 注意和Params 成对出现且正确匹配参数 Params=Sort,MinDate  Values=Date,01/01/2003
        /// </summary>
        public static string Values
        {
            get
            {
                return "Values";
            }
        }
        /// <summary>
        /// Query，CategoryQuery/PrintFields
        /// </summary>
        public static string PrintFields
        {
            get
            {
                return "PrintFields";
            }
        }

        public static string NumResults
        {
            get
            {
                return "NumResults";
            }
        }

        public static string BuildNow
        {
            get
            {
                return "BuildNow";
            }
        }

        #endregion

        public static string Interval
        {
            get
            {
                return "Interval";
            }
        }
        /// <summary>
        /// Cluster
        /// </summary>
        public static string TargetJobname
        {
            get
            {
                return "TargetJobname";
            }
        }

        public static string SourceJobname
        {
            get
            {
                return "SourceJobname";
            }
        }

        /// <summary>
        /// ClusterSnapshot/NumClusters default=25
        /// </summary>
        public static string NumClusters
        {
            get
            {
                return "NumClusters";
            }
        }
        
        /// <summary>
        /// ClusterCluster/WhatsNew bool
        /// </summary>
        public static string WhatsNew
        {
            get
            {
                return "WhatsNew";
            }
        }

        /// <summary>
        /// ClusterCluster/BindLevel
        /// </summary>
        public static string BindLevel
        {
            get
            {
                return "BindLevel";
            }
        }

        
        /// <summary>
        /// ClusterSnapshot/SeedSize long default=14 取值[1-20]
        /// </summary>
        public static string SeedSize
        {
            get
            {
                return "SeedSize";
            }
        }

        /// <summary>
        /// ClusterSnapshot/SeedBindLevel long default=8 取值[1-20]
        /// </summary>
        public static string SeedBindLevel
        {
            get
            {
                return "SeedBindLevel";
            }
        }

        public static string StartDate
        {
            get
            {
                return "StartDate";
            }
        }
        public static string EndDate
        {
            get
            {
                return "EndDate";
            }
        }

        public static string DoMapping
        {
            get
            {
                return "DoMapping";
            }
        }
        /// <summary>
        /// ClusterResults/MaxTerms long
        /// </summary>
        public static string MaxTerms
        {
            get
            {
                return "MaxTerms";
            }
        }

        /// <summary>
        /// DREREPLACE/ReplaceAllRefs bool
        /// </summary>
        public static string ReplaceAllRefs
        {
            get
            {
                return "ReplaceAllRefs";
            }
        } 
        

    }

    public class QueryParamValue
    {
        /// <summary>
        /// summary=Concept
        /// </summary>
        public static string Concept
        {
            get
            {
                return "Concept";
            }
        }
        /// <summary>
        /// summary=Context
        /// </summary>
        public static string Context
        {
            get
            {
                return "Context";
            }
        }
        public static string True
        {
            get
            {
                return "true";
            }
        }
        public static string False
        {
            get
            {
                return "false";
            }
        }

        /// <summary>
        /// Query/Print=All
        /// </summary>
        public static string All
        {
            get
            {
                return "All";
            }
        }
        /// <summary>
        /// Query/Print=Fields :whose PrintType property is set to true in the configuration file 
        /// </summary>
        public static string Fields
        {
            get
            {
                return "Fields";
            }
        }

        /// <summary>
        /// Query/Print=NoResults
        /// </summary>
        public static string NoResults
        {
            get
            {
                return "NoResults";
            }
        }
        
    }
}
