using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using System.Reflection;
using System.Text;
using DBDAL.Data;


namespace DBDAL.Entity
{
    [Serializable]
    public partial class OperatingLogEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "OperatingLog";
        public const string PrimaryKey = "PK_OperatingLog";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string UserName = "UserName";
            public const string IP = "IP";
            public const string Operation = "Operation";
            public const string VisitUrl = "VisitUrl";
            public const string ErrorContent = "ErrorContent";
            public const string OperateTime = "OperateTime";
        }
        #endregion

        #region constructors
        public OperatingLogEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public OperatingLogEntity(int id, string username, string ip, int operation, string visiturl, string errorcontent, DateTime operatetime)
        {
            this.ID = id;

            this.UserName = username;

            this.IP = ip;

            this.Operation = operation;

            this.VisitUrl = visiturl;

            this.ErrorContent = errorcontent;

            this.OperateTime = operatetime;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string UserName
        {
            get;
            set;
        }


        public string IP
        {
            get;
            set;
        }


        public int? Operation
        {
            get;
            set;
        }


        public string VisitUrl
        {
            get;
            set;
        }


        public string ErrorContent
        {
            get;
            set;
        }


        public DateTime? OperateTime
        {
            get;
            set;
        }

        #endregion

        public class OperatingLogDAO : SqlDAO<OperatingLogEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public OperatingLogDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(OperatingLogEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into OperatingLog(");
                strSql.Append("UserName,IP,Operation,VisitUrl,ErrorContent,OperateTime)");
                strSql.Append(" values (");
                strSql.Append("@UserName,@IP,@Operation,@VisitUrl,@ErrorContent,@OperateTime)");
                SqlParameter[] parameters = {
					new SqlParameter("@UserName",SqlDbType.NVarChar),
					new SqlParameter("@IP",SqlDbType.NVarChar),
					new SqlParameter("@Operation",SqlDbType.Int),
					new SqlParameter("@VisitUrl",SqlDbType.NVarChar),
					new SqlParameter("@ErrorContent",SqlDbType.NVarChar),
					new SqlParameter("@OperateTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.UserName;
                parameters[1].Value = entity.IP;
                parameters[2].Value = entity.Operation;
                parameters[3].Value = entity.VisitUrl;
                parameters[4].Value = entity.ErrorContent;
                parameters[5].Value = entity.OperateTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(OperatingLogEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update OperatingLog set ");
                strSql.Append("UserName=@UserName,");
                strSql.Append("IP=@IP,");
                strSql.Append("Operation=@Operation,");
                strSql.Append("VisitUrl=@VisitUrl,");
                strSql.Append("ErrorContent=@ErrorContent,");
                strSql.Append("OperateTime=@OperateTime");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@UserName",SqlDbType.NVarChar),
					new SqlParameter("@IP",SqlDbType.NVarChar),
					new SqlParameter("@Operation",SqlDbType.Int),
					new SqlParameter("@VisitUrl",SqlDbType.NVarChar),
					new SqlParameter("@ErrorContent",SqlDbType.NVarChar),
					new SqlParameter("@OperateTime",SqlDbType.DateTime)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.UserName;
                parameters[2].Value = entity.IP;
                parameters[3].Value = entity.Operation;
                parameters[4].Value = entity.VisitUrl;
                parameters[5].Value = entity.ErrorContent;
                parameters[6].Value = entity.OperateTime;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(OperatingLogEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from OperatingLog ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override OperatingLogEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from OperatingLog ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    OperatingLogEntity entity = new OperatingLogEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.UserName = row["UserName"].ToString();
                    entity.IP = row["IP"].ToString();
                    if (!Convert.IsDBNull(row["Operation"]))
                    {
                        entity.Operation = (int)row["Operation"];
                    }
                    entity.VisitUrl = row["VisitUrl"].ToString();
                    entity.ErrorContent = row["ErrorContent"].ToString();
                    if (!Convert.IsDBNull(row["OperateTime"]))
                    {
                        entity.OperateTime = (DateTime)row["OperateTime"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<OperatingLogEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM OperatingLog(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<OperatingLogEntity> list = new List<OperatingLogEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        OperatingLogEntity entity = new OperatingLogEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.UserName = row["UserName"].ToString();
                        entity.IP = row["IP"].ToString();
                        if (!Convert.IsDBNull(row["Operation"]))
                        {
                            entity.Operation = (int)row["Operation"];
                        }
                        entity.VisitUrl = row["VisitUrl"].ToString();
                        entity.ErrorContent = row["ErrorContent"].ToString();
                        if (!Convert.IsDBNull(row["OperateTime"]))
                        {
                            entity.OperateTime = (DateTime)row["OperateTime"];
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
                strSql.Append(" FROM OperatingLog(nolock)");
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
                string sql = "select count(*) from OperatingLog ";
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

                sql += " AS RowNumber,* FROM OperatingLog";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }

            #endregion

        }
    }
}

