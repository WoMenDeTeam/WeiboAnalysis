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
    public partial class FollowerStateEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "FollowerState";
        public const string PrimaryKey = "PK_FollowerState";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string UserName = "UserName";
            public const string WebSource = "WebSource";
            public const string UserState = "UserState";
        }
        #endregion

        #region constructors
        public FollowerStateEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public FollowerStateEntity(int id, string username, int websource, int userstate)
        {
            this.ID = id;

            this.UserName = username;

            this.WebSource = websource;

            this.UserState = userstate;

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


        public int? WebSource
        {
            get;
            set;
        }


        public int? UserState
        {
            get;
            set;
        }

        #endregion

        public class FollowerStateDAO : SqlDAO<FollowerStateEntity>
        {
            private SqlHelper sqlHelper;
            //public const string DBName = Util.ConfigUtil.CacheUsreInfo.SqlDBKey;// "WeiboDBStr";

            public FollowerStateDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(FollowerStateEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into FollowerState(");
                strSql.Append("UserName,WebSource,UserState)");
                strSql.Append(" values (");
                strSql.Append("@UserName,@WebSource,@UserState)");
                SqlParameter[] parameters = {
					new SqlParameter("@UserName",SqlDbType.VarChar),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@UserState",SqlDbType.Int)
					};
                parameters[0].Value = entity.UserName;
                parameters[1].Value = entity.WebSource;
                parameters[2].Value = entity.UserState;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(FollowerStateEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update FollowerState set ");
                strSql.Append("UserName=@UserName,");
                strSql.Append("WebSource=@WebSource,");
                strSql.Append("UserState=@UserState");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@UserName",SqlDbType.VarChar),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@UserState",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.UserName;
                parameters[2].Value = entity.WebSource;
                parameters[3].Value = entity.UserState;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(FollowerStateEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from FollowerState ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override FollowerStateEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from FollowerState ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FollowerStateEntity entity = new FollowerStateEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.UserName = row["UserName"].ToString();
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["UserState"]))
                    {
                        entity.UserState = (int)row["UserState"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public FollowerStateEntity FindByWhere(string userName, int webSource)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from FollowerState ");
                strSql.Append(" where UserName=@UserName and WebSource=@WebSource");
                SqlParameter[] parameters = {
						new SqlParameter("@UserName", SqlDbType.VarChar),
                        new SqlParameter("@WebSource",SqlDbType.Int)
                                            };
                parameters[0].Value = userName;
                parameters[1].Value = webSource;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    FollowerStateEntity entity = new FollowerStateEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.UserName = row["UserName"].ToString();
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["UserState"]))
                    {
                        entity.UserState = (int)row["UserState"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }


            public override List<FollowerStateEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM FollowerState(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<FollowerStateEntity> list = new List<FollowerStateEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        FollowerStateEntity entity = new FollowerStateEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.UserName = row["UserName"].ToString();
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
                        }
                        if (!Convert.IsDBNull(row["UserState"]))
                        {
                            entity.UserState = (int)row["UserState"];
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
                strSql.Append(" FROM FollowerState(nolock)");
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
                string sql = "select count(*) from FollowerState ";
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

                sql += " AS RowNumber,* FROM FollowerState";

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

