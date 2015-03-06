using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Entity;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public class CustomPortalEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "WeiboUser";
        public const string TableName = "CustomPortal";
        public const string PrimaryKey = "PK_CustomPortal";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string UserID = "UserID";
            public const string CustomString = "CustomString";
        }
        #endregion

        #region constructors
        public CustomPortalEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public CustomPortalEntity(int id, int userid, string customstring)
        {
            this.ID = id;

            this.UserID = userid;

            this.CustomString = customstring;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? UserID
        {
            get;
            set;
        }


        public string CustomString
        {
            get;
            set;
        }

        #endregion

        public class CustomPortalDAO : SqlDAO<CustomPortalEntity>
        {
            private SqlHelper sqlHelper;

            public const string DBName = "WeiboUserStr";
            public CustomPortalDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(CustomPortalEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into CustomPortal(");
                strSql.Append("UserID,CustomString)");
                strSql.Append(" values (");
                strSql.Append("@UserID,@CustomString)");
                SqlParameter[] parameters = {
					new SqlParameter("@UserID",SqlDbType.Int),
					new SqlParameter("@CustomString",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.UserID;
                parameters[1].Value = entity.CustomString;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(CustomPortalEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update CustomPortal set ");
                strSql.Append("CustomString=@CustomString");
                strSql.Append(" where UserID=@UserID");
                SqlParameter[] parameters = {
					new SqlParameter("@UserID",SqlDbType.Int),
					new SqlParameter("@CustomString",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.UserID;
                parameters[1].Value = entity.CustomString;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(CustomPortalEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CustomPortal ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override CustomPortalEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from CustomPortal ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    CustomPortalEntity entity = new CustomPortalEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["UserID"]))
                    {
                        entity.UserID = (int)row["UserID"];
                    }
                    entity.CustomString = row["CustomString"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<CustomPortalEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM CustomPortal(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<CustomPortalEntity> list = new List<CustomPortalEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CustomPortalEntity entity = new CustomPortalEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["UserID"]))
                        {
                            entity.UserID = (int)row["UserID"];
                        }
                        entity.CustomString = row["CustomString"].ToString();

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
                strSql.Append(" FROM CustomPortal(nolock)");
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
                string sql = "select count(*) from CustomPortal ";
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

                sql += " AS RowNumber,* FROM CustomPortal";

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
