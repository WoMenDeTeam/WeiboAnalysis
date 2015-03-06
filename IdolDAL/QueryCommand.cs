using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class QueryCommand : Command
    {
        public QueryCommand():base("Query")
        {
            //this.Action = "Query";
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
        public string SecurityInfo
        {
            set
            {
                this.SetParam(QueryParams.SecurityInfo, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.SecurityInfo);
            }
        }
        public bool Delete
        {
            set
            {
                this.SetParam("Delete", value);
            }
        }
        
        public string MatchReference
        {
            set
            {
                this.SetParam(QueryParams.MatchReference, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.MatchReference);
            }
        }
        

        public string FieldText
        {
            set
            {
                this.SetParam(QueryParams.FieldText, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.FieldText);
            }
        }
        public string DatabaseMatch
        {
            set
            {
                this.SetParam(QueryParams.DatabaseMatch, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.DatabaseMatch);
            }
        }
        public string Print
        {
            set
            {
                this.SetParam(QueryParams.Print, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.Print);
            }
        }
        public string PrintFields
        {
            set
            {
                this.SetParam(QueryParams.PrintFields, value);
            }
        }
        public string Combine
        {
            set
            {
                this.SetParam(QueryParams.Combine, value);
            }
        }
        public int MinScore
        {
            set
            {
                this.SetParam(QueryParams.MinScore, value);
            }
            get
            {
                return int.Parse(this.CheckedValue(QueryParams.MinScore));
            }
        }
        public int Start
        {
            set
            {
                this.SetParam(QueryParams.Start, value);
            }
            get
            {
                return int.Parse(this.CheckedValue(QueryParams.Start));
            }
        }

        public bool StoreState
        {
            set
            {
                this.SetParam(QueryParams.StoreState, value);
            }
            get
            {
                return bool.Parse(this.CheckedValue(QueryParams.StoreState));
            }
        }
        public int MaxResults
        {
            set
            {
                this.SetParam(QueryParams.MaxResults, value);
            }
            get
            {
                return int.Parse(this.CheckedValue(QueryParams.MaxResults));
            }
        }
        public DateTime MinDate
        {
            set
            {
                this.SetParam(QueryParams.MinDate, value.ToString("dd\"/\"MM\"/\"yyyy"));
            }
            //get
            //{
            //    return this.CheckedValue(QueryParams.MinDate);
            //}
        }
        public DateTime MaxDate
        {
            set
            {
                this.SetParam(QueryParams.MaxDate, value.ToString("dd\"/\"MM\"/\"yyyy"));
            }
            //get
            //{
            //    return this.CheckedValue(QueryParams.MinDate);
            //}
        }
        public bool Cluster
        {
            set
            {
                this.SetParam(QueryParams.Cluster, value);
            }
            get
            {
                return bool.Parse(this.CheckedValue(QueryParams.Cluster));
            }
        }
        public bool TotalResults
        {
            set
            {
                this.SetParam(QueryParams.TotalResults, value);
            }
        }
        public bool Predict
        {
            set
            {
                this.SetParam("Predict", value);
            }
        }
        public string Summary
        {
            set
            {
                this.SetParam(QueryParams.Summary, value);
            }
            get
            {
                return this.CheckedValue(QueryParams.Cluster);
            }
        }
    }
}
