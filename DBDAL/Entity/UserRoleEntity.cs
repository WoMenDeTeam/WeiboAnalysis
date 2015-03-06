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
    public class UserRoleEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "UserRole";
        public const string PrimaryKey = "PK_UserRole";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string RoleID = "RoleID";
            public const string UserID = "UserID";
        }
        #endregion

        #region constructors
        public UserRoleEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public UserRoleEntity(int id, int roleid, int userid)
        {
            this.ID = id;

            this.RoleID = roleid;

            this.UserID = userid;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }

        public int RoleID
        {
            get;
            set;
        }

        public int UserID
        {
            get;
            set;
        }
        public RoleEntity UserRole { get; set; }
        #endregion

        public class UserRoleDAO : SqlDAO<UserRoleEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public UserRoleDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(UserRoleEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into UserRole(");
                strSql.Append("RoleID,UserID)");
                strSql.Append(" values (");
                strSql.Append("@RoleID,@UserID)");
                SqlParameter[] parameters = {
					new SqlParameter("@RoleID",SqlDbType.Int),
					new SqlParameter("@UserID",SqlDbType.Int)
					};
                parameters[0].Value = entity.RoleID;
                parameters[1].Value = entity.UserID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(UserRoleEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update UserRole set ");
                strSql.Append("RoleID=@RoleID,");
                strSql.Append("UserID=@UserID");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@RoleID",SqlDbType.Int),
					new SqlParameter("@UserID",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.RoleID;
                parameters[2].Value = entity.UserID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(UserRoleEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from UserRole ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override UserRoleEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from UserRole ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    UserRoleEntity entity = new UserRoleEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["RoleID"]))
                    {
                        entity.RoleID = (int)row["RoleID"];
                    }
                    if (!Convert.IsDBNull(row["UserID"]))
                    {
                        entity.UserID = (int)row["UserID"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<UserRoleEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM UserRole(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<UserRoleEntity> list = new List<UserRoleEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        UserRoleEntity entity = new UserRoleEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["RoleID"]))
                        {
                            entity.RoleID = (int)row["RoleID"];
                        }
                        if (!Convert.IsDBNull(row["UserID"]))
                        {
                            entity.UserID = (int)row["UserID"];
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
                strSql.Append(" FROM UserRole(nolock)");
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
                string sql = "select count(*) from UserRole ";
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

                sql += " AS RowNumber,* FROM UserRole";

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
