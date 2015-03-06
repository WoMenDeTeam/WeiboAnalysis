using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;
using System.Data;

namespace BLL.Facade
{
    public static class CaseEventFacade
    {
        private static CaseEventEntity.CaseEventDAO dao = new CaseEventEntity.CaseEventDAO();
        /// <summary>
        /// 创建新事件
        /// </summary>
        /// <param name="eName">时间名称</param>
        /// <param name="eKeywords">关键字</param>
        /// <param name="createTime">时间</param>
        public static void AddNewEvent(string eName, string eKeywords, DateTime createTime)
        {
            CaseEventEntity entity = new CaseEventEntity();
            entity.EventName = eName;
            entity.EventKeywords = eKeywords;
            entity.DeadCount = 0;
            entity.InjuryCount = 0;
            entity.LostCount = 0;
            entity.CreateDate = DateTime.Today; //DateTime.Parse(DateTime.Today.ToString("yyyy-MM-dd HH:mm:ss"));
            dao.Add(entity);
        }
        /// <summary>
        /// 查找刚创建的事件ID
        /// </summary>
        /// <param name="eName">时间名称</param>
        /// <param name="eKeywords">关键字</param>
        /// <param name="createTime">创建时间</param>
        /// <returns></returns>
        public static string GetNewEventId(string eName, string eKeywords)
        {
            string result = "";
            SqlParameter[] parm ={
                                    new SqlParameter("@EventName",eName),
                                    new SqlParameter("@EventKeywords",eKeywords)
                                };
            string sqlWhere = "EventName=@EventName AND EventKeywords=@EventKeywords";

            DataTable dt = GetDataSet(sqlWhere, parm);//dao.GetDataSet(sqlWhere, parm).Tables[0];
            if (dt.Rows.Count > 0)
            {
                result = dt.Rows[0]["EventID"].ToString();
            }
            return result;
        }
        public static DataTable GetDataSet(string sqlWhere, SqlParameter[] param)
        {
            DataTable dt = dao.GetDataSet(sqlWhere, param).Tables[0];
            return dt;
        }
        /// <summary>
        /// 分页查询事件列表
        /// </summary>
        /// <param name="sqlWhere">条件</param>
        /// <param name="param">参数</param>
        /// <param name="orderBy">排序字段</param>
        /// <param name="rows">结果数</param>
        /// <param name="thisPage">当前页面</param>
        /// <returns></returns>
        public static DataTable GetEventsList(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager(where, param, orderBy, pageSize, pageNumber);
        }
        public static DataTable GetEventsList(string eventids)
        {
            string sqlwhere = string.Format(" EventID IN({0})", eventids);
            return dao.GetDataSet(sqlwhere).Tables[0];
        }
        //GetDataSet
        public static DataTable GetEventsById(string eid)
        {
            string sqlwhere = " EventID=@eid";
            SqlParameter[] param ={new SqlParameter("@eid",eid)
                                 };
            return dao.GetDataSet(sqlwhere, param).Tables[0];
        }
        /// <summary>
        /// 返回检索结果数量
        /// </summary>
        /// <param name="where"></param>
        /// <param name="param"></param>
        /// <returns></returns>
        public static int GetTotalCount(string where, SqlParameter[] param)
        {
            return dao.GetPagerRowsCount(where, param);
        }
        public static CaseEventEntity GetCaseEventEntityById(string id)
        {
            CaseEventEntity model = dao.FindById(long.Parse(id));
            return model;
        }
        public static void UpdateEvent(CaseEventEntity entity)
        {
            dao.Update(entity);

        }
        public static void DelCaseEvent(int id)
        {
            CaseEventEntity entity = new CaseEventEntity() { EventID = id };
            dao.Delete(entity);
        }

    }
}
