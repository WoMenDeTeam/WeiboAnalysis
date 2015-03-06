using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;
using System.Text.RegularExpressions;

namespace BLL.Facade
{
    public class AccidentAlarmFacade
    {
        private static readonly AccidentAlarmEntity.AccidentAlarmDAO dao = new AccidentAlarmEntity.AccidentAlarmDAO();
        public static void AddEntity(string id, string title, string context, string url, string deadCount, string injuredCount, string lostCount, string isMassDeath)
        {
            AccidentAlarmEntity entity = new AccidentAlarmEntity();
            entity.Title = title;
            entity.Content = "";
            entity.Url = GetUrlChecked(url);
            entity.PublishTime = DateTime.Now;
            entity.CreateTime = DateTime.Now;
            entity.DeadCount = Convert.ToInt32(deadCount);
            entity.InjuredCount = Convert.ToInt32(injuredCount);
            entity.LostCount = Convert.ToInt32(lostCount);
            entity.IsMassDeath = Convert.ToInt32(isMassDeath);
            entity.AlarmState = 0;
            dao.Add(entity);
        }
        public static void DeleteByID(string id)
        {
            AccidentAlarmEntity entity = new AccidentAlarmEntity() { ID = Convert.ToInt32(id) };
            dao.Delete(entity);
        }
        private static string GetUrlChecked(string inputUrl)
        {
            string sRegex = @"http(s)?://";
            Regex myrx = new Regex(sRegex);
            bool r = myrx.IsMatch(inputUrl);
            if (!r)
            {
                inputUrl = "http://" + inputUrl;
            }
            //Regex reg = new Regex("B");Match mat = reg.Match(str);while(mat.Success){MessageBox.Show(mat.Index.ToString());//位置mat = reg.Match(str, mat.Index+mat.Length);}
            return inputUrl;
        }
        public static DataTable GetLatestAlarm(string where)
        {
            return dao.GetDataSet(where);
        }
        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        public static DataTable GetPageList(string where, string orderBy, int pageSize, int pageNumber)
        {
            if (string.Equals(null, orderBy) || orderBy == "")
            {
                orderBy = " AlarmState DESC ";
            }
            return dao.GetPager(where, null, orderBy, pageSize, pageNumber);
        }
        public static void UpdateEntity(string id, string title, string context, string url, string deadCount, string injuredCount, string lostCount, string isMassDeath)
        {
            AccidentAlarmEntity entity = dao.FindById(Convert.ToInt32(id));
            entity.Title = title;
            entity.Url = GetUrlChecked(url);
            entity.DeadCount = Convert.ToInt32(deadCount);
            entity.InjuredCount = Convert.ToInt32(injuredCount);
            entity.LostCount = Convert.ToInt32(lostCount);
            entity.IsMassDeath = Convert.ToInt32(isMassDeath);
            dao.Update(entity);

        }
        public static void UpdateAlarmState(int id, int state)
        {
            dao.UpdateAlarmState(id, state);
        }
        public static void UpdateAlarmState(string ids, int state)
        {
            dao.UpdateAlarmStateByIds(ids, state);
        }
        public static void AddTag(int id, int startTag, string remark)
        {
            var entity = dao.FindById(id);
            entity.Tag = startTag;
            entity.Remark = remark;
            dao.Update(entity);
        }
        public static int CountTagInfo(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
    }
}
