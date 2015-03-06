using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;
using System.Data;

namespace BLL.Facade
{
    public static class CaseActionFacade
    {
        private static CaseActionEntity.CaseActionDAO dao = new CaseActionEntity.CaseActionDAO();

        public static void addAction(DateTime? ActionDate, string ActionPersonal, string ActionTalkContent, string ActionAnalysis, string eid)
        {
            CaseActionEntity entity = new CaseActionEntity();
            entity.ActionDate = ActionDate;
            entity.ActionPersonal = ActionPersonal;
            entity.ActionTalkContent = ActionTalkContent;
            entity.ActionAnalysis = ActionAnalysis;
            entity.CaseEventID = int.Parse(eid);
            dao.Add(entity);
        }
        public static void Update(int id, DateTime? ActionDate, string ActionPersonal, string ActionTalkContent, string ActionAnalysis, string eid)
        {
            CaseActionEntity entity = new CaseActionEntity();
            entity.ID = id;
            entity.ActionDate = ActionDate;
            entity.ActionPersonal = ActionPersonal;
            entity.ActionTalkContent = ActionTalkContent;
            entity.ActionAnalysis = ActionAnalysis;
            entity.CaseEventID = int.Parse(eid);
            dao.Update(entity);
        }
        public static DataTable GetActionByEid(string eid)
        {
            string where = "CaseEventID=@eid ORDER BY ActionDate";
            SqlParameter[] param = { 
                                   new SqlParameter("@eid",SqlDbType.Int)};
            param[0].Value = eid;
            return dao.GetDataSet(where, param).Tables[0];
        }
        public static DataTable GetActionByWhere(string eids)
        {
            string where = string.Format("CaseEventID IN({0}) ORDER BY CaseEventID,ID", eids);
            return dao.GetDataSet(where, null).Tables[0];
        }
        public static void DelByWhereEventId(int caseEventID)
        {
            dao.Delete(caseEventID);
        }
    }
}
