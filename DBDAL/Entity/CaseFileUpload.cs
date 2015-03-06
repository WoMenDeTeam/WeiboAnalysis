using System;
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
    public partial class CaseFileUploadEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "CaseFileUpload";
        public const string PrimaryKey = "PK_CaseFileUpload";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string FileName = "FileName";
            public const string FilePath = "FilePath";
            public const string CreateDate = "CreateDate";
            public const string CaseEventID = "CaseEventID";
        }
        #endregion

        #region constructors
        public CaseFileUploadEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public CaseFileUploadEntity(int id, string filename, string filepath, DateTime createdate, int caseeventid)
        {
            this.ID = id;

            this.FileName = filename;

            this.FilePath = filepath;

            this.CreateDate = createdate;

            this.CaseEventID = caseeventid;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public string FileName
        {
            get;
            set;
        }


        public string FilePath
        {
            get;
            set;
        }


        public DateTime? CreateDate
        {
            get;
            set;
        }


        public int? CaseEventID
        {
            get;
            set;
        }

        #endregion

        public class CaseFileUploadDAO : SqlDAO<CaseFileUploadEntity>
        {
            private SqlHelper sqlHelper;

            public const string DBName = "SqlEventsConnStr";
            public CaseFileUploadDAO()
            {
                //Util.ConfigUtil.CacheUsreInfo.SqlDBKey()
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(CaseFileUploadEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into CaseFileUpload(");
                strSql.Append("FileName,FilePath,CreateDate,CaseEventID)");
                strSql.Append(" values (");
                strSql.Append("@FileName,@FilePath,@CreateDate,@CaseEventID)");
                SqlParameter[] parameters = {
					new SqlParameter("@FileName",SqlDbType.NVarChar),
					new SqlParameter("@FilePath",SqlDbType.VarChar),
					new SqlParameter("@CreateDate",SqlDbType.DateTime),
					new SqlParameter("@CaseEventID",SqlDbType.Int)
					};
                parameters[0].Value = entity.FileName;
                parameters[1].Value = entity.FilePath;
                parameters[2].Value = entity.CreateDate;
                parameters[3].Value = entity.CaseEventID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(CaseFileUploadEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update CaseFileUpload set ");
                strSql.Append("FileName=@FileName,");
                strSql.Append("FilePath=@FilePath,");
                strSql.Append("CreateDate=@CreateDate,");
                strSql.Append("CaseEventID=@CaseEventID");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@FileName",SqlDbType.NVarChar),
					new SqlParameter("@FilePath",SqlDbType.VarChar),
					new SqlParameter("@CreateDate",SqlDbType.DateTime),
					new SqlParameter("@CaseEventID",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.FileName;
                parameters[2].Value = entity.FilePath;
                parameters[3].Value = entity.CreateDate;
                parameters[4].Value = entity.CaseEventID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(CaseFileUploadEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CaseFileUpload ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override CaseFileUploadEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from CaseFileUpload ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    CaseFileUploadEntity entity = new CaseFileUploadEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    entity.FileName = row["FileName"].ToString();
                    entity.FilePath = row["FilePath"].ToString();
                    if (!Convert.IsDBNull(row["CreateDate"]))
                    {
                        entity.CreateDate = (DateTime)row["CreateDate"];
                    }
                    if (!Convert.IsDBNull(row["CaseEventID"]))
                    {
                        entity.CaseEventID = (int)row["CaseEventID"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<CaseFileUploadEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM CaseFileUpload(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<CaseFileUploadEntity> list = new List<CaseFileUploadEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CaseFileUploadEntity entity = new CaseFileUploadEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        entity.FileName = row["FileName"].ToString();
                        entity.FilePath = row["FilePath"].ToString();
                        if (!Convert.IsDBNull(row["CreateDate"]))
                        {
                            entity.CreateDate = (DateTime)row["CreateDate"];
                        }
                        if (!Convert.IsDBNull(row["CaseEventID"]))
                        {
                            entity.CaseEventID = (int)row["CaseEventID"];
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
                strSql.Append(" FROM CaseFileUpload(nolock)");
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
                string sql = "select count(*) from CaseFileUpload ";
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

                sql += " AS RowNumber,* FROM CaseFileUpload";

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
