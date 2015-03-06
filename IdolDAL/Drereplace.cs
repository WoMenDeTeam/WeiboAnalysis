using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace IdolACINet
{
    public class Drereplace : Command
    {
        private string postdata;

        public Drereplace()
            : base("DREREPLACE")
        {
            this.Method = "Post";
        }

        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            //builder.Append("action=");
            builder.Append(this.Action).Append("?");
            builder.Append(this.DataParameters(encoding));
            return builder.ToString();
        }

        public override string DataParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            int count = 0;
            foreach (string str in this.Parameters.Keys)
            {
                if (count > 0)
                {
                    builder.Append("&");
                }
                builder.Append(HttpUtility.UrlEncode(str, encoding));
                builder.Append("=");
                builder.Append(HttpUtility.UrlEncode(this.Parameters[str], encoding));
                count++;
            }
            return builder.ToString();
        }

        public override string GetPostData(Encoding encoding)
        {
            return this.postdata;
        }

        public string PostData
        {
            get
            {
                return this.postdata;
            }
            set
            {
                this.postdata = value;
            }

        }

        public bool ReplaceAllRefs
        {
            set
            {
                this.SetParam(QueryParams.ReplaceAllRefs, value);
            }
        }

    }
}
