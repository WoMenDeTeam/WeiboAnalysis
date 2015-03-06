using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data.SqlClient;
using System.Data;

namespace BLL.Facade
{
    public static class CaseFileUploadFacade
    {
        
        private static CaseFileUploadEntity.CaseFileUploadDAO dao = new CaseFileUploadEntity.CaseFileUploadDAO();
        public static void AddFile(string fileName, string filePath, int eventId)
        {
            CaseFileUploadEntity entity = new CaseFileUploadEntity();
            entity.FileName = fileName;
            entity.FilePath = filePath;
            entity.CreateDate = DateTime.Now;
            entity.CaseEventID = eventId;
            dao.Add(entity);
        }

        
        public static void UpdateFile(int id, string fileName, string filePath)
        {
            CaseFileUploadEntity entity = dao.FindById(id);
            entity.FileName = fileName;
            entity.FilePath = filePath;
            entity.CreateDate = DateTime.Now;
            // entity.CaseEventID = eventId;
            dao.Update(entity);
        }

        public static DataTable GetFileList(int eventId)
        {
            string where = " CaseEventID=@eid";
            SqlParameter[] param ={
                                      new SqlParameter("@eid",System.Data.SqlDbType.Int)
                                  };
            param[0].Value = eventId;
            return dao.GetDataSet(where, param).Tables[0];
        }
    }
}
