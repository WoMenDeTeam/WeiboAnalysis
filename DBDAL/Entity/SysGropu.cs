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
    public partial class sysGroupEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "sysGroup";
        public const string PrimaryKey = "PK_sys";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string GroupName = "GroupName";
            public const string GroupIndex = "GroupIndex";
        }
        #endregion

        #region constructors
        public sysGroupEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public sysGroupEntity(int id, string groupname, int groupindex)
        {
            this.ID = id;

            this.GroupName = groupname;

            this.GroupIndex = groupindex;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string GroupName
        {
            get;
            set;
        }


        public int? GroupIndex
        {
            get;
            set;
        }

        #endregion

        public class sysGroupDAO : SqlDAO<sysGroupEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public sysGroupDAO()
            {
                //Util.ConfigUtil.CacheUsreInfo.SqlDBKey()
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(sysGroupEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into sysGroup(");
                strSql.Append("GroupName,GroupIndex)");
                strSql.Append(" values (");
                strSql.Append("@GroupName,@GroupIndex)");
                SqlParameter[] parameters = {
					new SqlParameter("@GroupName",SqlDbType.VarChar),
					new SqlParameter("@GroupIndex",SqlDbType.Int)
					};
                parameters[0].Value = entity.GroupName;
                parameters[1].Value = entity.GroupIndex;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(sysGroupEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update sysGroup set ");
                strSql.Append("GroupName=@GroupName,");
                strSql.Append("GroupIndex=@GroupIndex");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@GroupName",SqlDbType.VarChar),
					new SqlParameter("@GroupIndex",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.GroupName;
                parameters[2].Value = entity.GroupIndex;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(sysGroupEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from sysGroup ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override sysGroupEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from sysGroup ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    sysGroupEntity entity = new sysGroupEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.GroupName = row["GroupName"].ToString();
                    if (!Convert.IsDBNull(row["GroupIndex"]))
                    {
                        entity.GroupIndex = (int)row["GroupIndex"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<sysGroupEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM sysGroup(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<sysGroupEntity> list = new List<sysGroupEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        sysGroupEntity entity = new sysGroupEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.GroupName = row["GroupName"].ToString();
                        if (!Convert.IsDBNull(row["GroupIndex"]))
                        {
                            entity.GroupIndex = (int)row["GroupIndex"];
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
                strSql.Append(" FROM sysGroup(nolock)");
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
                string sql = "select count(*) from sysGroup ";
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

                sql += " AS RowNumber,* FROM sysGroup";

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

