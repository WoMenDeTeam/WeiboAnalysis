using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public class ClusterSnapshot : Command
    {
        public ClusterSnapshot()
            : base("ClusterSnapshot")
        {
            
        }

        public string DREQuery
        {
            set
            {
                this.SetParam(QueryParams.DREQuery, value);
            }
            //get
            //{
            //    return this.CheckedValue(QueryParams.DREQuery);
            //}
        }

        public string NumClusters
        {
            set
            {
                this.SetParam(QueryParams.NumClusters, value);
            }
        }
        

    }


    public class ClusterSGDataGen : Command
    {
        public ClusterSGDataGen()
            : base("ClusterSGDataGen")
        {

        }

        public string SourceJobname
        {
            set
            {
                this.SetParam(QueryParams.SourceJobname, value);
            }
            //get
            //{
            //    return this.CheckedValue(QueryParams.DREQuery);
            //}
        }

        public string TargetJobname
        {
            set
            {
                this.SetParam(QueryParams.TargetJobname, value);
            }
        }

        //public DateTime StartDate
        //{
        //    set
        //    {
        //        DateTime oldDate = new DateTime(1970, 1, 1);

        //        // Difference in days, hours, and minutes.
        //        TimeSpan ts = value - oldDate;

        //        long differenceInSeconds = (long)ts.TotalSeconds;
        //        this.SetParam(QueryParams.StartDate, differenceInSeconds);
        //    }
        //}

        //public DateTime EndDate
        //{
        //    set
        //    {
        //        DateTime oldDate = new DateTime(1970, 1, 1);

        //        // Difference in days, hours, and minutes.
        //        TimeSpan ts = value - oldDate;

        //        long differenceInSeconds = (long)ts.TotalSeconds;
        //        this.SetParam(QueryParams.EndDate, differenceInSeconds);
        //    }
        //}

        //public DateTime EndDate
        //{
        //    set
        //    {
        //        DateTime oldDate = new DateTime(1970, 1, 1);

        //        // Difference in days, hours, and minutes.
        //        TimeSpan ts = value - oldDate;

        //        long differenceInSeconds = (long)ts.TotalSeconds;
        //        this.SetParam(QueryParams.EndDate, differenceInSeconds);
        //    }
        //}

    }
}
