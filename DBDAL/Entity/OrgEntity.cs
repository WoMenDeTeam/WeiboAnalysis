using System;
using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class OrgEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "WeiboUser";
        public const string TableName = "Org";
        public const string PrimaryKey = "PK_Org";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string OrgTag = "OrgTag";
            public const string OrgDesc = "OrgDesc";
            public const string InsertTime = "InsertTime";
            public const string IsDel = "IsDel";
        }
        #endregion

        #region constructors
        public OrgEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public OrgEntity(int id, string orgtag, string orgdesc, DateTime inserttime, int isdel)
        {
            this.ID = id;

            this.OrgTag = orgtag;

            this.OrgDesc = orgdesc;

            this.InsertTime = inserttime;

            this.IsDel = isdel;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string OrgTag
        {
            get;
            set;
        }


        public string OrgDesc
        {
            get;
            set;
        }


        public DateTime? InsertTime
        {
            get;
            set;
        }


        public int? IsDel
        {
            get;
            set;
        }

        #endregion

        public class OrgDAO : SqlDAO<OrgEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboUserStr";

            public OrgDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(OrgEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into Org(");
                strSql.Append("OrgTag,OrgDesc,InsertTime,IsDel)");
                strSql.Append(" values (");
                strSql.Append("@OrgTag,@OrgDesc,@InsertTime,@IsDel)");
                SqlParameter[] parameters = {
					new SqlParameter("@OrgTag",SqlDbType.VarChar),
					new SqlParameter("@OrgDesc",SqlDbType.VarChar),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@IsDel",SqlDbType.Int)
					};
                parameters[0].Value = entity.OrgTag;
                parameters[1].Value = entity.OrgDesc;
                parameters[2].Value = entity.InsertTime;
                parameters[3].Value = entity.IsDel;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(OrgEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update Org set ");
                strSql.Append("OrgTag=@OrgTag,");
                strSql.Append("OrgDesc=@OrgDesc,");
                strSql.Append("InsertTime=@InsertTime,");
                strSql.Append("IsDel=@IsDel");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@OrgTag",SqlDbType.VarChar),
					new SqlParameter("@OrgDesc",SqlDbType.VarChar),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@IsDel",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.OrgTag;
                parameters[2].Value = entity.OrgDesc;
                parameters[3].Value = entity.InsertTime;
                parameters[4].Value = entity.IsDel;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(OrgEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from Org ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override OrgEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from Org ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    OrgEntity entity = new OrgEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.OrgTag = row["OrgTag"].ToString();
                    entity.OrgDesc = row["OrgDesc"].ToString();
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    if (!Convert.IsDBNull(row["IsDel"]))
                    {
                        entity.IsDel = (int)row["IsDel"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<OrgEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM Org(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<OrgEntity> list = new List<OrgEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        OrgEntity entity = new OrgEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.OrgTag = row["OrgTag"].ToString();
                        entity.OrgDesc = row["OrgDesc"].ToString();
                        if (!Convert.IsDBNull(row["InsertTime"]))
                        {
                            entity.InsertTime = (DateTime)row["InsertTime"];
                        }
                        if (!Convert.IsDBNull(row["IsDel"]))
                        {
                            entity.IsDel = (int)row["IsDel"];
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
                strSql.Append(" FROM Org(nolock)");
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
                string sql = "select count(*) from Org ";
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

                sql += " AS RowNumber,* FROM Org";

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

