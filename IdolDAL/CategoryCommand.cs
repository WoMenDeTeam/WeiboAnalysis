using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class CategoryQueryCommand:Command
    {
        public CategoryQueryCommand()
            : base("CategoryQuery")
        {

        }

        public long Category
        {
            set
            {
                this.SetParam(QueryParams.Category, value);
            }
        }

        public string Databases
        {
            set
            {
                this.SetParam(QueryParams.Databases, value);
            }
        }
        /// <summary>
        /// CategoryQuery/Params
        /// Query action parameters to be added to the category query
        /// 注意和Values 成对出现且正确匹配参数 Params=Sort,MinDate  Values=Date,01/01/2003
        /// </summary>
        public string Params
        {
            set
            {
                this.SetParam(QueryParams.Params, value);
            }
        }

        /// <summary>
        /// CategoryQuery/Values
        /// Values for the specified Params
        /// 注意和Params 成对出现且正确匹配参数 Params=Sort,MinDate  Values=Date,01/01/2003
        /// </summary>
        public string Values
        {
            set
            {
                this.SetParam(QueryParams.Values, value);
            }
        }

        public string PrintFields
        {
            set
            {
                this.SetParam(QueryParams.PrintFields, value);
            }
        }

        /// <summary>
        /// default = 1
        /// </summary>
        public int Start
        {
            set
            {
                this.SetParam(QueryParams.Start, value);
            }
        }
        public int NumResults
        {
            set
            {
                this.SetParam("NumResults", value);
            }
        }

        public bool TotalResults
        {
            set
            {
                this.SetParam("TotalResults", value);
            }
        }

        public int Threshold
        {
            set
            {
                this.SetParam("Threshold", value);
            }
        }
    }

    public class CategoryCreateCommand : Command
    {
        public CategoryCreateCommand():base("CategoryCreate")
        {

        }

        /// <summary>
        /// The ID of the category
        /// 在CategoryCreate/Category时可以指定ID(Category)和Name，也可以Category=分类名，ID由系统生成
        /// </summary>
        public string Category
        {
            set
            {
                this.SetParam(QueryParams.Category, value);
            }
        }

        /// <summary>
        /// The name of the category to be created
        /// </summary>
        public string Name
        {
            set
            {
                this.SetParam(QueryParams.Name, value);
            }
        }

        /// <summary>
        /// The ID of the new category's parent category
        /// </summary>
        public string Parent
        {
            set
            {
                this.SetParam(QueryParams.Parent, value);
            }
        }

        /// <summary>
        /// Returns results only from specific databases
        /// </summary>
        public string Databases
        {
            set
            {
                this.SetParam(QueryParams.Databases, value);
            }
        }

    }

    public class CategoryBuildCommand : Command
    {
        public CategoryBuildCommand()
            : base("CategoryBuild")
        {

        }

        public long Category
        {
            set
            {
                this.SetParam(QueryParams.Category, value);
            }
        }

        /// <summary>
        /// representing the algorithm used to build the category
        /// 0: default algorithm
        /// 1: language categorization
        /// 2: bias toward capitalization/proper name terms
        /// 3: only allow proper name terms; no single words
        /// </summary>
        public int WeightingAlgorithm
        {
            set
            {
                this.SetParam("WeightingAlgorithm", value);
            }
        }

    }

    public class CategorySetTNWCommand : Command
    {
        public CategorySetTNWCommand()
            : base("CategorySetTNW")
        {

        }

        public long Category
        {
            set
            {
                this.SetParam(QueryParams.Category, value);
            }
        }

        public string Terms
        {
            set
            {
                this.SetParam("Terms", value);
            }
        }

        public string Weights
        {
            set
            {
                this.SetParam("Weights", value);
            }
        }
        public bool BuildNow
        {
            set
            {
                this.SetParam(QueryParams.BuildNow, value);
            }
        }
    }

    public class CategoryGetTNWCommand : Command
    {
        public CategoryGetTNWCommand()
            : base("CategoryGetTNW")
        {

        }

        public long Category
        {
            set
            {
                this.SetParam(QueryParams.Category, value);
            }
        }
    }


    
}
