using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Entity;
using System.Web;
using System.Data;

namespace BLL.Facade
{
    public static class TaskFacade
    {
        private static TaskEntity.TaskDAO dao = new TaskEntity.TaskDAO();

        //添加任务列表
        public static void AddTask(HttpContext context)
        {
            TaskEntity entity = ContextToEntity(context);
            dao.Add(entity);
        }
        public static TaskEntity ContextToEntity(HttpContext context)
        {
            TaskEntity entity = new TaskEntity();
            string ID = context.Request["ID"];
            string SenderID = context.Request["SenderID"];
            string SenderName = context.Request["SenderName"];
            string URL = context.Request["URL"];
            string Contents = context.Request["Contents"];
            string StartTime = context.Request["StartTime"];
            string EndTime = context.Request["EndTime"];
            string UserCount = context.Request["UserCount"];
            string CompleteCount = context.Request["CompleteCount"];
            string CompleteStatus = context.Request["CompleteStatus"];
            string CompletionRate = context.Request["CompletionRate"];
            string ISAllocation = context.Request["ISAllocation"];
            string CreateTime = context.Request["CreateTime"];

            entity.ID = string.IsNullOrEmpty(ID) ? 0 : Convert.ToInt32(ID);
            entity.SenderID = string.IsNullOrEmpty(SenderID) ? 0 : Convert.ToInt32(SenderID);
            entity.SenderName = SenderName;
            entity.URL = URL.ToString().Replace("\n", "\\n").Replace("\"", "\\\"");
            entity.Contents = Contents.ToString().Replace("\n", "\\n").Replace("\"", "\\\"");
            if (!string.IsNullOrEmpty(StartTime))
            {
                entity.StartTime = DateTime.Parse(StartTime);
            }
            if (!string.IsNullOrEmpty(EndTime))
            {
                entity.EndTime = DateTime.Parse(EndTime);
            }
            entity.UserCount = string.IsNullOrEmpty(UserCount) ? 0 : Convert.ToInt32(UserCount);
            entity.CompleteCount = string.IsNullOrEmpty(CompleteCount) ? 0 : Convert.ToInt32(CompleteCount);
            entity.CompleteStatus = string.IsNullOrEmpty(CompleteStatus) ? 0 : Convert.ToInt32(CompleteStatus);
            entity.CompletionRate = string.IsNullOrEmpty(CompletionRate) ? 0 : Convert.ToInt32(CompletionRate);
            entity.ISAllocation = string.IsNullOrEmpty(ISAllocation) ? 0 : Convert.ToInt32(ISAllocation);
            entity.CreateTime = DateTime.Now;

            return entity;
        }
        //修改任务列表
        public static void UpdateTask(TaskEntity entity)
        {
            //TaskEntity entity = new TaskEntity();

            dao.Update(entity);
        }
        //获取一个任务列表
        public static TaskEntity GetTaskEntityById(int id)
        {
            return dao.FindById(id);
        }
        //获取我的任务列表
        public static DataTable GetTaskList(string where, string orderBy, int pageSize, int pageIndex)
        {
            return dao.GetPager(where, null, orderBy, pageSize, pageIndex);
        }
        public static int GetTotalCount(string where)
        {
            return dao.GetPagerRowsCount(where, null);
        }
        //获取我待完成的任务列表
        public static DataTable GetTaskByWhere(string where)
        {
            return dao.GetDataSet(where, null).Tables[0];
        }
        public static void DeleteTask(int id)
        {
            TaskEntity entity = new TaskEntity();
            entity.ID = id;
            dao.Delete(entity);
        }
        public static void UpdateTaskStatus(string taskId)
        {
            dao.ExecuteSql(taskId);
        }
        public static string TaskEntityToJson(TaskEntity entity)
        {
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append("{");
            strBuilder.AppendFormat("\"ID\":\"{0}\",", entity.ID);
            strBuilder.AppendFormat("\"SenderID\":\"{0}\",", entity.SenderID);
            strBuilder.AppendFormat("\"URL\":\"{0}\",", entity.URL);
            strBuilder.AppendFormat("\"Contents\":\"{0}\",", entity.Contents);
            strBuilder.AppendFormat("\"StartTime\":\"{0}\",", entity.StartTime);
            strBuilder.AppendFormat("\"EndTime\":\"{0}\",", entity.EndTime.ToString());
            strBuilder.AppendFormat("\"UserCount\":\"{0}\",", entity.UserCount);
            strBuilder.AppendFormat("\"CompleteCount\":\"{0}\",", entity.CompleteCount);
            strBuilder.AppendFormat("\"CompleteStatus\":\"{0}\",", entity.CompleteStatus);
            strBuilder.AppendFormat("\"CompletionRate\":\"{0}\",", entity.CompletionRate);
            strBuilder.AppendFormat("\"ISAllocation\":\"{0}\",", entity.ISAllocation);
            strBuilder.AppendFormat("\"CreateTime\":\"{0}\"", entity.CreateTime.ToString());
            strBuilder.Append("}");
            return strBuilder.ToString();
        }
    }
}
