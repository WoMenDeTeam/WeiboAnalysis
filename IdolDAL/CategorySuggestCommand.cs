using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class CategorySuggestFromDocumentCommand:Command
    {
        public CategorySuggestFromDocumentCommand()
            : base("CategorySuggestFromDocument")
        {

        }

        public long DocID
        {
            set
            {
                this.SetParam("DocID", value);
            }
        }

        public string DocRef
        {
            set
            {
                this.SetParam("DocRef", value);
            }
        }

        public int NumResults
        {
            set
            {
                this.SetParam(QueryParams.NumResults, value);
            }
        }

        /// <summary>
        /// only suggests results from this category and its descendants
        /// </summary>
        public string Schema
        {
            set
            {
                this.SetParam("Schema", value);
            }
        }

        public bool ShowCategoryPath
        {
            set
            {
                this.SetParam("ShowCategoryPath", value);
            }
        }

        /// <summary>
        /// 需要先设置ShowCategoryPath=true
        /// </summary>
        public bool FullPathOnly
        {
            set
            {
                this.SetParam("FullPathOnly", value);
            }
        }

    }
}
