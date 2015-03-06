using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Web;

namespace IdolACINet
{
    public class DREADD : Command
    {
        public DREADD()
            : base("DREADD")
        {

        }

        private string indexfile;

        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");
            builder.Append(this.IndexFile);
            builder.Append(this.DataParameters(encoding));
            return builder.ToString();
        }

        //public override string DataParameters(Encoding encoding)
        //{
        //    StringBuilder builder = new StringBuilder();
        //    int count = 0;
        //    foreach (string str in this.Parameters.Keys)
        //    {
        //        if (count > 0)
        //        {
        //            builder.Append("&");
        //        }
        //        builder.Append(HttpUtility.UrlEncode(str, encoding));
        //        builder.Append("=");
        //        builder.Append(HttpUtility.UrlEncode(this.Parameters[str], encoding));
        //        count++;
        //    }
        //    return builder.ToString();
        //}


        public string IndexFile
        {
            get
            {
                return this.indexfile;
            }
            set
            {
                this.indexfile = value;
            }
        }

        public string DREDbName
        {
            set
            {
                base.SetParam("DREDbName", value);
            }
        }

        #region implement command

        //public static IndexCommand DREADD
        //{
        //    get
        //    {
        //        return new IndexCommand("DREADD");
        //    }
        //}

        #endregion

    }

    public class DREADDDATA  : Command
    {
        public DREADDDATA()
            : base("DREADDDATA")
        {
            this.Method = "Post";
        }

        private string postdata;

        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");
            //builder.Append(this.IndexFile);
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


        #region implement command



        #endregion

    }

    public class DREDELETEDOC : Command
    {
        public DREDELETEDOC()
            : base("DREDELETEDOC")
        {

        }

        public string StateID
        {
            set
            {
                base.SetParam("StateID", value);
            }
        }
        public string Docs
        {
            set
            {
                base.SetParam("Docs", value);
            }
        }
        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");

            builder.Append(this.SimpleDataParameters(false));
            return builder.ToString();
        }


    }

    public class DRECHANGEMETA : Command
    {
        public DRECHANGEMETA()
            : base("DRECHANGEMETA")
        {

        }
        public string StateID
        {
            set
            {
                base.SetParam("StateID", value);
            }
        }
        public string Docs
        {
            set
            {
                base.SetParam("Docs", value);
            }
        }
        /// <summary>
        /// 新值
        /// </summary>
        public string NewValue
        {
            set
            {
                base.SetParam("NewValue", value);
            }
        }
        /// <summary>
        /// 修改的字段名；取值：database，date，autnrank，expiredate
        /// </summary>
        public string Type
        {
            set
            {
                base.SetParam("Type", value);
            }
        }

        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");

            builder.Append(this.SimpleDataParameters(false));
            return builder.ToString();
        }
    }

    public class DREEXPORTIDX : Command
    {
        public DREEXPORTIDX()
            : base("DREEXPORTIDX")
        {

        }
        private string filename;

        public string FileName
        {
            get
            {
                return this.filename;
            }
            set
            {
                this.filename = value;
            }
        }

        public string DatabaseMatch
        {
            set
            {
                base.SetParam(QueryParams.DatabaseMatch, value);
            }
        }

        public string StateMatchID
        {
            set
            {
                base.SetParam(QueryParams.StateMatchID, value);
            }
        }

        public long MinID
        {
            set
            {
                base.SetParam(QueryParams.MinID, value);
            }
        }

        public long MaxID
        {
            set
            {
                base.SetParam(QueryParams.MaxID, value);
            }
        }

        public DateTime MaxDate
        {
            set
            {
                base.SetParam(QueryParams.MaxDate, value.ToString("dd\"/\"MM\"/\"yyyy"));
            }
        }

        public DateTime MinDate
        {
            set
            {
                base.SetParam(QueryParams.MinDate, value.ToString("dd\"/\"MM\"/\"yyyy"));
            }
        }

        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");
            builder.Append("FileName=");
            builder.Append(this.FileName);
            builder.Append(this.SimpleDataParameters());
            //builder.Append(this.DataParameters(encoding));
            return builder.ToString();
        }


    }

    public class DRECREATEDBASE : Command
    {
        public DRECREATEDBASE()
            : base("DRECREATEDBASE")
        {
        }

        public string DREDbName
        {
            set;
            get;
        }
        public override string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(this.Action).Append("?");
            builder.Append("DREDbName=");
            builder.Append(this.DREDbName);
            builder.Append(this.SimpleDataParameters());
            return builder.ToString();
        }
    }
}
