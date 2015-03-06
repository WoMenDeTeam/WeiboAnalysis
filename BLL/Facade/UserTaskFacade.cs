using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Data;

namespace BLL.Facade
{
    public static class UserTaskFacade
    {
        private static UserTaskEntity.UserTaskDAO dao = new UserTaskEntity.UserTaskDAO();
        public static DataTable GetUserTaskByTaskID(string taskId)
        {
            string where = string.Format(" TaskID={0} ", taskId);
            return dao.GetDataSet(where, null).Tables[0];
        }
        public static void AddUserTask(int taskID, int userID, string userName)
        {
            UserTaskEntity entity = new UserTaskEntity();
            entity.TaskID = taskID;
            entity.ReceiverID = userID;
            entity.ReceiverName = userName;
            entity.StartTime = DateTime.Now;
            entity.CompleteStatus = 0;
            entity.CompleteInfo = "";
            dao.Add(entity);
        }
        public static DataTable GetTaskPage(string where, string orderBy, int pageSize, int pageNumber)
        {
            return dao.GetPager2(where, null, orderBy, pageSize, pageNumber);
        }
        public static int GetCount(string where)
        {
            return dao.GetPagerRowsCount2(where, null);
        }
        public static void UpdateUserTask(int id, string compInfo)
        {
            UserTaskEntity entiy = new UserTaskEntity();
            entiy = dao.FindById(id);
            entiy.CompleteInfo = compInfo.Replace("\n", "\\n").Replace("\"", "\\\"");
            entiy.CompleteStatus = 1;
            entiy.CompleteTime = DateTime.Now;
            dao.Update(entiy);
            TaskFacade.UpdateTaskStatus(entiy.TaskID.ToString());
        }
    }
}
