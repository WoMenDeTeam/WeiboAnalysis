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
    public partial class CaseActionEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "CaseAction";
        public const string PrimaryKey = "PK_CaseAction";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string ActionDate = "ActionDate";
            public const string ActionPersonal = "ActionPersonal";
            public const string ActionTalkContent = "ActionTalkContent";
            public const string ActionAnalysis = "ActionAnalysis";
            public const string CaseEventID = "CaseEventID";
        }
        #endregion

        #region constructors
        public CaseActionEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public CaseActionEntity(int id, DateTime actiondate, string actionpersonal, string actiontalkcontent, string actionanalysis, int caseeventid)
        {
            this.ID = id;

            this.ActionDate = actiondate;

            this.ActionPersonal = actionpersonal;

            this.ActionTalkContent = actiontalkcontent;

            this.ActionAnalysis = actionanalysis;

            this.CaseEventID = caseeventid;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public DateTime? ActionDate
        {
            get;
            set;
        }


        public string ActionPersonal
        {
            get;
            set;
        }


        public string ActionTalkContent
        {
            get;
            set;
        }


        public string ActionAnalysis
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

        public class CaseActionDAO : SqlDAO<CaseActionEntity>
        {
            private SqlHelper sqlHelper;

            public const string DBName = "WeiboDBStr";
            public CaseActionDAO()
            {
                //Util.ConfigUtil.CacheUsreInfo.SqlDBKey()
                sqlHelper = new SqlHelper(DBName);
            }

            public override void Add(CaseActionEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into CaseAction(");
                strSql.Append("ActionDate,ActionPersonal,ActionTalkContent,ActionAnalysis,CaseEventID)");
                strSql.Append(" values (");
                strSql.Append("@ActionDate,@ActionPersonal,@ActionTalkContent,@ActionAnalysis,@CaseEventID)");
                SqlParameter[] parameters = {
					new SqlParameter("@ActionDate",SqlDbType.DateTime),
					new SqlParameter("@ActionPersonal",SqlDbType.NVarChar),
					new SqlParameter("@ActionTalkContent",SqlDbType.NVarChar),
					new SqlParameter("@ActionAnalysis",SqlDbType.NVarChar),
					new SqlParameter("@CaseEventID",SqlDbType.Int)
					};
                parameters[0].Value = entity.ActionDate;
                parameters[1].Value = entity.ActionPersonal;
                parameters[2].Value = entity.ActionTalkContent;
                parameters[3].Value = entity.ActionAnalysis;
                parameters[4].Value = entity.CaseEventID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(CaseActionEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update CaseAction set ");
                strSql.Append("ActionDate=@ActionDate,");
                strSql.Append("ActionPersonal=@ActionPersonal,");
                strSql.Append("ActionTalkContent=@ActionTalkContent,");
                strSql.Append("ActionAnalysis=@ActionAnalysis,");
                strSql.Append("CaseEventID=@CaseEventID");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@ActionDate",SqlDbType.DateTime),
					new SqlParameter("@ActionPersonal",SqlDbType.NVarChar),
					new SqlParameter("@ActionTalkContent",SqlDbType.NVarChar),
					new SqlParameter("@ActionAnalysis",SqlDbType.NVarChar),
					new SqlParameter("@CaseEventID",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.ActionDate;
                parameters[2].Value = entity.ActionPersonal;
                parameters[3].Value = entity.ActionTalkContent;
                parameters[4].Value = entity.ActionAnalysis;
                parameters[5].Value = entity.CaseEventID;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(CaseActionEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CaseAction ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public void Delete(int caseEventID)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from CaseAction ");
                strSql.Append(" where CaseEventID=@CaseEventID");
                SqlParameter[] parameters = {
						new SqlParameter("@CaseEventID", SqlDbType.Int)
					};
                parameters[0].Value = caseEventID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }
            public override CaseActionEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from CaseAction ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    CaseActionEntity entity = new CaseActionEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["ActionDate"]))
                    {
                        entity.ActionDate = (DateTime)row["ActionDate"];
                    }
                    entity.ActionPersonal = row["ActionPersonal"].ToString();
                    entity.ActionTalkContent = row["ActionTalkContent"].ToString();
                    entity.ActionAnalysis = row["ActionAnalysis"].ToString();
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

            public override List<CaseActionEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM CaseAction(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<CaseActionEntity> list = new List<CaseActionEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        CaseActionEntity entity = new CaseActionEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["ActionDate"]))
                        {
                            entity.ActionDate = (DateTime)row["ActionDate"];
                        }
                        entity.ActionPersonal = row["ActionPersonal"].ToString();
                        entity.ActionTalkContent = row["ActionTalkContent"].ToString();
                        entity.ActionAnalysis = row["ActionAnalysis"].ToString();
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
                strSql.Append(" FROM CaseAction(nolock)");
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
                string sql = "select count(*) from CaseAction ";
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

                sql += " AS RowNumber,* FROM CaseAction";

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
