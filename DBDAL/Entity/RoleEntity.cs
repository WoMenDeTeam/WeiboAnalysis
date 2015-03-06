using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DBDAL.Data;
using System.Data.SqlClient;
using System.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public class RoleEntity
    {
        private SqlHelper sqlHelper;
        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "Role";
        public const string PrimaryKey = "PK_Role";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string RoleName = "RoleName";
        }
        #endregion

        #region constructors
        public RoleEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public RoleEntity(int id, string rolename)
        {
            this.ID = id;

            this.RoleName = rolename;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string RoleName
        {
            get;
            set;
        }

        #endregion

        public class RoleDAO : SqlDAO<RoleEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";
            public readonly string s = "";
            public RoleDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(RoleEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into Role(");
                strSql.Append("RoleName)");
                strSql.Append(" values (");
                strSql.Append("@RoleName)");
                SqlParameter[] parameters = {
					new SqlParameter("@RoleName",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.RoleName;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(RoleEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update Role set ");
                strSql.Append("RoleName=@RoleName");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@RoleName",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.RoleName;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(RoleEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Role ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override RoleEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Role ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    RoleEntity entity = new RoleEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.RoleName = row["RoleName"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<RoleEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Role(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<RoleEntity> list = new List<RoleEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        RoleEntity entity = new RoleEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.RoleName = row["RoleName"].ToString();

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
                strSql.Append(" FROM Role(nolock)");
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
                string sql = "select count(*) from Role ";
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

                sql += " AS RowNumber,* FROM Role";

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
