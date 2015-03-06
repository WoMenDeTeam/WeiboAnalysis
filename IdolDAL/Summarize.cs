using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class Summarize:Command
    {
        public Summarize()
            : base("Summarize")
        {
        }

        public string Text
        {
            set
            {
                this.SetParam(QueryParams.Text, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.Text);
            }
        }

        public string Sentences
        {
            set
            {
                this.SetParam(QueryParams.Sentences, value);
            }
        }
        /// <summary>
        /// Summarize/Summary,取值Concept，Quick，ParagraphConcept
        /// </summary>
        public string Summary
        {
            set
            {
                this.SetParam(QueryParams.Summary, value);
            }
        }

    }
}
