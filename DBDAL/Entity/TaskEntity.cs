using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Data;
using System.Data;
using System.Data.SqlClient;


namespace DBDAL.Entity
{
    [Serializable]
    public partial class TaskEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "WeiboDBStr";
        public const string TableName = "Task";
        public const string PrimaryKey = "PK_Task";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string SenderID = "SenderID";
            public const string SenderName = "SenderName";
            public const string URL = "URL";
            public const string Contents = "Contents";
            public const string StartTime = "StartTime";
            public const string EndTime = "EndTime";
            public const string UserCount = "UserCount";
            public const string CompleteCount = "CompleteCount";
            public const string CompleteStatus = "CompleteStatus";
            public const string CompletionRate = "CompletionRate";
            public const string ISAllocation = "ISAllocation";
            public const string CreateTime = "CreateTime";
        }
        #endregion

        #region constructors
        public TaskEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public TaskEntity(int id, int senderid, string sendername, string url, string contents, DateTime starttime, DateTime endtime, int usercount, int completecount, int completestatus, int completionrate, int isallocation, DateTime createtime)
        {
            this.ID = id;

            this.SenderID = senderid;

            this.SenderName = sendername;

            this.URL = url;

            this.Contents = contents;

            this.StartTime = starttime;

            this.EndTime = endtime;

            this.UserCount = usercount;

            this.CompleteCount = completecount;

            this.CompleteStatus = completestatus;

            this.CompletionRate = completionrate;

            this.ISAllocation = isallocation;

            this.CreateTime = createtime;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? SenderID
        {
            get;
            set;
        }


        public string SenderName
        {
            get;
            set;
        }


        public string URL
        {
            get;
            set;
        }


        public string Contents
        {
            get;
            set;
        }


        public DateTime? StartTime
        {
            get;
            set;
        }


        public DateTime? EndTime
        {
            get;
            set;
        }


        public int? UserCount
        {
            get;
            set;
        }


        public int? CompleteCount
        {
            get;
            set;
        }


        public int? CompleteStatus
        {
            get;
            set;
        }


        public int? CompletionRate
        {
            get;
            set;
        }


        public int? ISAllocation
        {
            get;
            set;
        }


        public DateTime? CreateTime
        {
            get;
            set;
        }

        #endregion

        public class TaskDAO : SqlDAO<TaskEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public TaskDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(TaskEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into Task(");
                strSql.Append("SenderID,SenderName,URL,Contents,StartTime,EndTime,UserCount,CompleteCount,CompleteStatus,CompletionRate,ISAllocation,CreateTime)");
                strSql.Append(" values (");
                strSql.Append("@SenderID,@SenderName,@URL,@Contents,@StartTime,@EndTime,@UserCount,@CompleteCount,@CompleteStatus,@CompletionRate,@ISAllocation,@CreateTime)");
                SqlParameter[] parameters = {
					new SqlParameter("@SenderID",SqlDbType.Int),
					new SqlParameter("@SenderName",SqlDbType.VarChar),
					new SqlParameter("@URL",SqlDbType.NVarChar),
					new SqlParameter("@Contents",SqlDbType.NVarChar),
					new SqlParameter("@StartTime",SqlDbType.DateTime),
					new SqlParameter("@EndTime",SqlDbType.DateTime),
					new SqlParameter("@UserCount",SqlDbType.Int),
					new SqlParameter("@CompleteCount",SqlDbType.Int),
					new SqlParameter("@CompleteStatus",SqlDbType.Int),
					new SqlParameter("@CompletionRate",SqlDbType.Int),
					new SqlParameter("@ISAllocation",SqlDbType.Int),
					new SqlParameter("@CreateTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.SenderID;
                parameters[1].Value = entity.SenderName;
                parameters[2].Value = entity.URL;
                parameters[3].Value = entity.Contents;
                parameters[4].Value = entity.StartTime;
                parameters[5].Value = entity.EndTime;
                parameters[6].Value = entity.UserCount;
                parameters[7].Value = entity.CompleteCount;
                parameters[8].Value = entity.CompleteStatus;
                parameters[9].Value = entity.CompletionRate;
                parameters[10].Value = entity.ISAllocation;
                parameters[11].Value = entity.CreateTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(TaskEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update Task set ");
                strSql.Append("SenderID=@SenderID,");
                strSql.Append("SenderName=@SenderName,");
                strSql.Append("URL=@URL,");
                strSql.Append("Contents=@Contents,");
                strSql.Append("StartTime=@StartTime,");
                strSql.Append("EndTime=@EndTime,");
                strSql.Append("UserCount=@UserCount,");
                strSql.Append("CompleteCount=@CompleteCount,");
                strSql.Append("CompleteStatus=@CompleteStatus,");
                strSql.Append("CompletionRate=@CompletionRate,");
                strSql.Append("ISAllocation=@ISAllocation,");
                strSql.Append("CreateTime=@CreateTime");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@SenderID",SqlDbType.Int),
					new SqlParameter("@SenderName",SqlDbType.VarChar),
					new SqlParameter("@URL",SqlDbType.NVarChar),
					new SqlParameter("@Contents",SqlDbType.NVarChar),
					new SqlParameter("@StartTime",SqlDbType.DateTime),
					new SqlParameter("@EndTime",SqlDbType.DateTime),
					new SqlParameter("@UserCount",SqlDbType.Int),
					new SqlParameter("@CompleteCount",SqlDbType.Int),
					new SqlParameter("@CompleteStatus",SqlDbType.Int),
					new SqlParameter("@CompletionRate",SqlDbType.Int),
					new SqlParameter("@ISAllocation",SqlDbType.Int),
					new SqlParameter("@CreateTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.SenderID;
                parameters[2].Value = entity.SenderName;
                parameters[3].Value = entity.URL;
                parameters[4].Value = entity.Contents;
                parameters[5].Value = entity.StartTime;
                parameters[6].Value = entity.EndTime;
                parameters[7].Value = entity.UserCount;
                parameters[8].Value = entity.CompleteCount;
                parameters[9].Value = entity.CompleteStatus;
                parameters[10].Value = entity.CompletionRate;
                parameters[11].Value = entity.ISAllocation;
                parameters[12].Value = entity.CreateTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(TaskEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Task ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override TaskEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Task ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    TaskEntity entity = new TaskEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["SenderID"]))
                    {
                        entity.SenderID = (int)row["SenderID"];
                    }
                    entity.SenderName = row["SenderName"].ToString();
                    entity.URL = row["URL"].ToString();
                    entity.Contents = row["Contents"].ToString();
                    if (!Convert.IsDBNull(row["StartTime"]))
                    {
                        entity.StartTime = (DateTime)row["StartTime"];
                    }
                    if (!Convert.IsDBNull(row["EndTime"]))
                    {
                        entity.EndTime = (DateTime)row["EndTime"];
                    }
                    if (!Convert.IsDBNull(row["UserCount"]))
                    {
                        entity.UserCount = (int)row["UserCount"];
                    }
                    if (!Convert.IsDBNull(row["CompleteCount"]))
                    {
                        entity.CompleteCount = (int)row["CompleteCount"];
                    }
                    if (!Convert.IsDBNull(row["CompleteStatus"]))
                    {
                        entity.CompleteStatus = (int)row["CompleteStatus"];
                    }
                    if (!Convert.IsDBNull(row["CompletionRate"]))
                    {
                        entity.CompletionRate = (int)row["CompletionRate"];
                    }
                    if (!Convert.IsDBNull(row["ISAllocation"]))
                    {
                        entity.ISAllocation = (int)row["ISAllocation"];
                    }
                    if (!Convert.IsDBNull(row["CreateTime"]))
                    {
                        entity.CreateTime = (DateTime)row["CreateTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<TaskEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Task(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<TaskEntity> list = new List<TaskEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        TaskEntity entity = new TaskEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["SenderID"]))
                        {
                            entity.SenderID = (int)row["SenderID"];
                        }
                        entity.SenderName = row["SenderName"].ToString();
                        entity.URL = row["URL"].ToString();
                        entity.Contents = row["Contents"].ToString();
                        if (!Convert.IsDBNull(row["StartTime"]))
                        {
                            entity.StartTime = (DateTime)row["StartTime"];
                        }
                        if (!Convert.IsDBNull(row["EndTime"]))
                        {
                            entity.EndTime = (DateTime)row["EndTime"];
                        }
                        if (!Convert.IsDBNull(row["UserCount"]))
                        {
                            entity.UserCount = (int)row["UserCount"];
                        }
                        if (!Convert.IsDBNull(row["CompleteCount"]))
                        {
                            entity.CompleteCount = (int)row["CompleteCount"];
                        }
                        if (!Convert.IsDBNull(row["CompleteStatus"]))
                        {
                            entity.CompleteStatus = (int)row["CompleteStatus"];
                        }
                        if (!Convert.IsDBNull(row["CompletionRate"]))
                        {
                            entity.CompletionRate = (int)row["CompletionRate"];
                        }
                        if (!Convert.IsDBNull(row["ISAllocation"]))
                        {
                            entity.ISAllocation = (int)row["ISAllocation"];
                        }
                        if (!Convert.IsDBNull(row["CreateTime"]))
                        {
                            entity.CreateTime = (DateTime)row["CreateTime"];
                        }

                        list.Add(entity);
                    }

                    return list;
                }
                else
                {
                    return null;
                }
            }

            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Task(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from Task ";
                if (!string.IsNullOrEmpty(where))
                {
                    sql += "where " + where;
                }

                object obj = sqlHelper.GetSingle(sql, param);

                return obj == null ? 0 : Convert.ToInt32(obj);
            }

            /// <summary>
            /// 查询分页信息，返回当前页码的记录集
            /// </summary>
            /// <param name="where">查询条件，可为empty</param>
            /// <param name="orderBy">排序条件，可为empty</param>
            /// <param name="pageSize">每页显示记录数</param>
            /// <param name="pageNumber">当前页码</param>
            /// <returns>datatable</returns>
            public DataTable GetPager(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
            {
                int startNumber = pageSize * (pageNumber - 1);

                string sql = string.Format("SELECT TOP {0} * FROM (SELECT ROW_NUMBER() OVER", pageSize);

                if (!string.IsNullOrEmpty(orderBy))
                {
                    sql += string.Format(" (ORDER BY {0})", orderBy);
                }
                else
                {

                    sql += " (ORDER BY ID)";//默认按主键排序

                }

                sql += " AS RowNumber,* FROM Task";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            public void ExecuteSql(string taskId)
            {
                string sql = string.Format("UPDATE dbo.Task SET UserCount =(SELECT COUNT(*) FROM dbo.UserTask WHERE TaskID={0}),CompleteCount=(SELECT COUNT(*) FROM dbo.UserTask WHERE TaskID={0} AND CompleteStatus=1),ISAllocation=(SELECT allcou= CASE COUNT(*) WHEN 0 THEN 0 ELSE 1 END FROM dbo.UserTask WHERE TaskID={0}),CompleteStatus=(SELECT CASE WHEN COUNT(*)=0 THEN 0 WHEN COUNT(*)= (SELECT COUNT(*) FROM dbo.UserTask WHERE TaskID={0}) THEN 1 ELSE 0 END FROM dbo.UserTask WHERE TaskID={0} AND CompleteStatus=1) WHERE dbo.Task.ID={0}",taskId);
                sqlHelper.ExecuteSql(sql, null);
            }
            #endregion

        }
    }
}
