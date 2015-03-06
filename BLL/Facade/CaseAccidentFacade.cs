using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;
using System.Data.SqlClient;

namespace BLL.Facade
{
    public static class CaseAccidentFacade
    {
        public static CaseAccidentEntity.CaseAccidentDAO dao = new CaseAccidentEntity.CaseAccidentDAO();
        public static void AddAccident(string accidentName, int pid)
        {
            CaseAccidentEntity entity = new CaseAccidentEntity();
            entity.AccidentName = accidentName;
            entity.pid = pid;
            dao.Add(entity);
        }
        public static DataTable GetNewCaseAccidentId(string accidentName, int pid)
        {
            SqlParameter[] param ={
                                     new SqlParameter("@AccidentName",accidentName),
                                     new SqlParameter("@pid",pid)
                                 };
            string sqlWhere = "AccidentName=@AccidentName AND pid=@pid";
            return dao.GetDataSet(sqlWhere, param).Tables[0];
        }
        public static DataTable GetListByPid(int pid)
        {
            SqlParameter[] param ={ new SqlParameter("@pid",pid)
                                 };
            string sqlWhere = " pid=@pid ";
            return dao.GetDataSet(sqlWhere, param).Tables[0];
        }
        public static void Delaccident(int id)
        {
            CaseAccidentEntity entity = new CaseAccidentEntity();
            entity.ID = id;
            dao.Delete(entity);
        }
        public static void UpdateAccident(int id, string accidentName)
        {
            CaseAccidentEntity entity=dao.FindById(id);
            entity.AccidentName=accidentName;
            dao.Update(entity);
        }
        
    }
}
