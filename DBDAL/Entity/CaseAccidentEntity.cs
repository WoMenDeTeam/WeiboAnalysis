﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Entity;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class CaseAccidentEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "CaseAccident";
        public const string PrimaryKey = "PK_CaseAccident";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string AccidentName = "AccidentName";
            public const string pid = "pid";
        }
        #endregion

        #region constructors
        public CaseAccidentEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public CaseAccidentEntity(int id, string accidentname, int pid)
        {
            this.ID = id;

            this.AccidentName = accidentname;

            this.pid = pid;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string AccidentName
        {
            get;
            set;
        }


        public int? pid
        {
            get;
            set;
        }

        #endregion

        public class CaseAccidentDAO : SqlDAO<CaseAccidentEntity>
        {
            private SqlHelper sqlHelper;

            public const string DBName = "WeiboDBStr";
            public CaseAccidentDAO()
            {
                // Util.ConfigUtil.CacheUsreInfo.SqlDBKey();
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(CaseAccidentEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into CaseAccident(");
                strSql.Append("AccidentName,pid)");
                strSql.Append(" values (");
                strSql.Append("@AccidentName,@pid)");
                SqlParameter[] parameters = {
					new SqlParameter("@AccidentName",SqlDbType.NVarChar),
					new SqlParameter("@pid",SqlDbType.Int)
					};
                parameters[0].Value = entity.AccidentName;
                parameters[1].Value = entity.pid;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(CaseAccidentEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update CaseAccident set ");
                strSql.Append("AccidentName=@AccidentName,");
                strSql.Append("pid=@pid");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@AccidentName",SqlDbType.NVarChar),
					new SqlParameter("@pid",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.AccidentName;
                parameters[2].Value = entity.pid;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(CaseAccidentEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CaseAccident ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            

            public override CaseAccidentEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from CaseAccident ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    CaseAccidentEntity entity = new CaseAccidentEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.AccidentName = row["AccidentName"].ToString();
                    if (!Convert.IsDBNull(row["pid"]))
                    {
                        entity.pid = (int)row["pid"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<CaseAccidentEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM CaseAccident(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<CaseAccidentEntity> list = new List<CaseAccidentEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CaseAccidentEntity entity = new CaseAccidentEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.AccidentName = row["AccidentName"].ToString();
                        if (!Convert.IsDBNull(row["pid"]))
                        {
                            entity.pid = (int)row["pid"];
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
                strSql.Append(" FROM CaseAccident(nolock)");
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
                string sql = "select count(*) from CaseAccident ";
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

                sql += " AS RowNumber,* FROM CaseAccident";

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
