using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class UserTaskEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "UserTask";
        public const string PrimaryKey = "PK_UserTask";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string TaskID = "TaskID";
            public const string ReceiverID = "ReceiverID";
            public const string ReceiverName = "ReceiverName";
            public const string CompleteInfo = "CompleteInfo";
            public const string StartTime = "StartTime";
            public const string CompleteTime = "CompleteTime";
            public const string CompleteStatus = "CompleteStatus";
        }
        #endregion

        #region constructors
        public UserTaskEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public UserTaskEntity(int id, int taskid, int receiverid, string receivername, string completeinfo, DateTime starttime, DateTime completetime, int completestatus)
        {
            this.ID = id;

            this.TaskID = taskid;

            this.ReceiverID = receiverid;

            this.ReceiverName = receivername;

            this.CompleteInfo = completeinfo;

            this.StartTime = starttime;

            this.CompleteTime = completetime;

            this.CompleteStatus = completestatus;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? TaskID
        {
            get;
            set;
        }


        public int? ReceiverID
        {
            get;
            set;
        }


        public string ReceiverName
        {
            get;
            set;
        }


        public string CompleteInfo
        {
            get;
            set;
        }


        public DateTime? StartTime
        {
            get;
            set;
        }


        public DateTime? CompleteTime
        {
            get;
            set;
        }


        public int? CompleteStatus
        {
            get;
            set;
        }

        #endregion

        public class UserTaskDAO : SqlDAO<UserTaskEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public UserTaskDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(UserTaskEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into UserTask(");
                strSql.Append("TaskID,ReceiverID,ReceiverName,CompleteInfo,StartTime,CompleteTime,CompleteStatus)");
                strSql.Append(" values (");
                strSql.Append("@TaskID,@ReceiverID,@ReceiverName,@CompleteInfo,@StartTime,@CompleteTime,@CompleteStatus)");
                SqlParameter[] parameters = {
					new SqlParameter("@TaskID",SqlDbType.Int),
					new SqlParameter("@ReceiverID",SqlDbType.Int),
					new SqlParameter("@ReceiverName",SqlDbType.VarChar),
					new SqlParameter("@CompleteInfo",SqlDbType.NVarChar),
					new SqlParameter("@StartTime",SqlDbType.DateTime),
					new SqlParameter("@CompleteTime",SqlDbType.DateTime),
					new SqlParameter("@CompleteStatus",SqlDbType.Int)
					};
                parameters[0].Value = entity.TaskID;
                parameters[1].Value = entity.ReceiverID;
                parameters[2].Value = entity.ReceiverName;
                parameters[3].Value = entity.CompleteInfo;
                parameters[4].Value = entity.StartTime;
                parameters[5].Value = entity.CompleteTime;
                parameters[6].Value = entity.CompleteStatus;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(UserTaskEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update UserTask set ");
                strSql.Append("TaskID=@TaskID,");
                strSql.Append("ReceiverID=@ReceiverID,");
                strSql.Append("ReceiverName=@ReceiverName,");
                strSql.Append("CompleteInfo=@CompleteInfo,");
                strSql.Append("StartTime=@StartTime,");
                strSql.Append("CompleteTime=@CompleteTime,");
                strSql.Append("CompleteStatus=@CompleteStatus");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@TaskID",SqlDbType.Int),
					new SqlParameter("@ReceiverID",SqlDbType.Int),
					new SqlParameter("@ReceiverName",SqlDbType.VarChar),
					new SqlParameter("@CompleteInfo",SqlDbType.NVarChar),
					new SqlParameter("@StartTime",SqlDbType.DateTime),
					new SqlParameter("@CompleteTime",SqlDbType.DateTime),
					new SqlParameter("@CompleteStatus",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.TaskID;
                parameters[2].Value = entity.ReceiverID;
                parameters[3].Value = entity.ReceiverName;
                parameters[4].Value = entity.CompleteInfo;
                parameters[5].Value = entity.StartTime;
                parameters[6].Value = entity.CompleteTime;
                parameters[7].Value = entity.CompleteStatus;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(UserTaskEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from UserTask ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override UserTaskEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from UserTask ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    UserTaskEntity entity = new UserTaskEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["TaskID"]))
                    {
                        entity.TaskID = (int)row["TaskID"];
                    }
                    if (!Convert.IsDBNull(row["ReceiverID"]))
                    {
                        entity.ReceiverID = (int)row["ReceiverID"];
                    }
                    entity.ReceiverName = row["ReceiverName"].ToString();
                    entity.CompleteInfo = row["CompleteInfo"].ToString();
                    if (!Convert.IsDBNull(row["StartTime"]))
                    {
                        entity.StartTime = (DateTime)row["StartTime"];
                    }
                    if (!Convert.IsDBNull(row["CompleteTime"]))
                    {
                        entity.CompleteTime = (DateTime)row["CompleteTime"];
                    }
                    if (!Convert.IsDBNull(row["CompleteStatus"]))
                    {
                        entity.CompleteStatus = (int)row["CompleteStatus"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<UserTaskEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserTask(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<UserTaskEntity> list = new List<UserTaskEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        UserTaskEntity entity = new UserTaskEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["TaskID"]))
                        {
                            entity.TaskID = (int)row["TaskID"];
                        }
                        if (!Convert.IsDBNull(row["ReceiverID"]))
                        {
                            entity.ReceiverID = (int)row["ReceiverID"];
                        }
                        entity.ReceiverName = row["ReceiverName"].ToString();
                        entity.CompleteInfo = row["CompleteInfo"].ToString();
                        if (!Convert.IsDBNull(row["StartTime"]))
                        {
                            entity.StartTime = (DateTime)row["StartTime"];
                        }
                        if (!Convert.IsDBNull(row["CompleteTime"]))
                        {
                            entity.CompleteTime = (DateTime)row["CompleteTime"];
                        }
                        if (!Convert.IsDBNull(row["CompleteStatus"]))
                        {
                            entity.CompleteStatus = (int)row["CompleteStatus"];
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
                strSql.Append(" FROM UserTask(nolock)");
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
                string sql = "select count(*) from UserTask ";
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

                sql += " AS RowNumber,* FROM UserTask";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            public DataTable GetPager2(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
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

                sql += " AS RowNumber,t.SenderID,t.SenderName,t.URL,t.Contents,t.EndTime,ut.ID,ut.TaskID,ut.ReceiverID,ut.ReceiverName,ut.CompleteInfo,ut.StartTime,ut.CompleteTime,ut.CompleteStatus  FROM dbo.UserTask AS ut INNER JOIN dbo.Task AS t ON ut.TaskID=t.ID ";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            public int GetPagerRowsCount2(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from UserTask as ut ";
                if (!string.IsNullOrEmpty(where))
                {
                    sql += "where " + where;
                }

                object obj = sqlHelper.GetSingle(sql, param);

                return obj == null ? 0 : Convert.ToInt32(obj);
            }



            #endregion

        }
    }
}
