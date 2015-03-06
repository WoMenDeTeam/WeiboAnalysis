using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace Util
{
    public class TimeHelp
    {
        /// <summary>
        /// 获得距离1970-01-01的秒数
        /// </summary>
        /// <param name="newDate">时间参数</param>
        /// <returns></returns>
        public static double GetTimeStamp(DateTime newDate)
        {
            DateTime oldDate = new DateTime(1970, 1, 1);          

            // Difference in days, hours, and minutes.
            TimeSpan ts = newDate - oldDate;
            
            return ts.TotalSeconds;
        }

        /// <summary>
        /// 获得距离1970-01-01的毫秒数
        /// </summary>
        /// <param name="newDate">时间参数</param>
        /// <returns></returns>
        public static double GetMilliSecond(DateTime newDate)
        {
            DateTime oldDate = new DateTime(1970, 1, 1);

            // Difference in days, hours, and minutes.
            TimeSpan ts = newDate - oldDate;

            return ts.TotalMilliseconds;
        }

        public static int GetMilliDay(DateTime newDate,DateTime compareDate){
            TimeSpan ts = newDate - compareDate;

            return Convert.ToInt32(ts.TotalDays);
        }

        /// <summary>
        /// 获得时间
        /// </summary>
        /// <param name="totalSecond">秒数</param>
        /// <returns></returns>
        public static DateTime GetDateTime(long totalSecond)
        {
            long str = 60 * 60 * 24 * 516;
            TimeSpan ts = new TimeSpan((totalSecond + str) * TimeSpan.TicksPerSecond);
            
            DateTime oldDate = new DateTime(1970, 1, 1);
            
            return oldDate.Add(ts);

        }

        public static string ConvertToActualTimeString(string totalSecond, string timespan)
        {
            if (string.IsNullOrEmpty(totalSecond))
            {
                return "";
            }
            long time_str = 0;
            long.TryParse(totalSecond, out time_str);
            if (time_str == 0)
            {
                return totalSecond;
            }
            TimeSpan ts = new TimeSpan(time_str * TimeSpan.TicksPerSecond);
            int days = Convert.ToInt32(timespan);
            DateTime oldDate = new DateTime(1970, 1, 1);
            DateTime nowdate = oldDate.Add(ts).AddDays(days);
            return nowdate.ToString("yyyy-MM-dd HH:mm");

        }

        /// <summary>
        /// 获得时间
        /// </summary>
        /// <param name="totalSecond">秒数</param>
        /// <returns></returns>
        public static string ConvertToDateTimeString(string totalSecond)
        {
            if (string.IsNullOrEmpty(totalSecond))
            {
                return "";
            }

            long time_str = 0;
            long.TryParse(totalSecond, out time_str);
            if (time_str == 0)
            {
                return totalSecond;
            }

            TimeSpan ts = new TimeSpan(time_str * TimeSpan.TicksPerSecond);

            DateTime oldDate = new DateTime(1970, 1, 1);
            DateTime nowdate = oldDate.Add(ts);
            return nowdate.ToString("yyyy-MM-dd HH:mm");

        }
        // <summary>
        /// 获得时间
        /// </summary>
        /// <param name="totalSecond">秒数</param>
        /// <returns></returns>
        public static string ConvertToDateTimeString(string totalSecond, string foramtStr)
        {
            if (string.IsNullOrEmpty(totalSecond))
            {
                return "";
            }
            long time_str = 0;
            long.TryParse(totalSecond, out time_str);
            if (time_str == 0)
            {
                return totalSecond;
            }
            TimeSpan ts = new TimeSpan(time_str * TimeSpan.TicksPerSecond);
            DateTime oldDate = new DateTime(1970, 1, 1, 0, 0, 0);
            DateTime nowdate = oldDate.Add(ts);
            return nowdate.ToString(foramtStr);
        }

        public static string GetDateTimeStr(int days) {
            DateTime nowTime = DateTime.Now;
            DateTime backTime = nowTime.AddDays(days);
            return backTime.ToString("yyyy-MM-dd");
        }


    }
}
