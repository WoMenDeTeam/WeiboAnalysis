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
    public partial class EarlyWarnHotEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "EarlyWarnHot";
        public const string PrimaryKey = "PK_EarlyWarnHot";
        #endregion

        #region columns
        public struct Columns
        {
            public const string ID = "ID";
            public const string MainID = "MainID";
            public const string ItemID = "ItemID";
            public const string Text = "Text";
            public const string Count = "Count";
            public const string MCount = "MCount";
            public const string Name = "Name";
            public const string Nick = "Nick";
            public const string IsVip = "IsVip";
            public const string Timestamp = "Timestamp";
            public const string WebSource = "WebSource";
            public const string InsertTime = "InsertTime";
            public const string IsRead = "IsRead";
            public const string increment = "increment";
        }
        #endregion

        #region constructors
        public EarlyWarnHotEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public EarlyWarnHotEntity(int id, int mainid, long itemid, string text, int count, int mcount, string name, string nick, int isvip, DateTime timestamp, int websource, DateTime inserttime, int isread, int increment)
        {
            this.ID = id;

            this.MainID = mainid;

            this.ItemID = itemid;

            this.Text = text;

            this.Count = count;

            this.MCount = mcount;

            this.Name = name;

            this.Nick = nick;

            this.IsVip = isvip;

            this.Timestamp = timestamp;

            this.WebSource = websource;

            this.InsertTime = inserttime;

            this.IsRead = isread;

            this.increment = increment;

        }
        #endregion

        #region Properties

        public int? ID
        {
            get;
            set;
        }


        public int? MainID
        {
            get;
            set;
        }


        public long? ItemID
        {
            get;
            set;
        }


        public string Text
        {
            get;
            set;
        }


        public int? Count
        {
            get;
            set;
        }


        public int? MCount
        {
            get;
            set;
        }


        public string Name
        {
            get;
            set;
        }


        public string Nick
        {
            get;
            set;
        }


        public int? IsVip
        {
            get;
            set;
        }


        public DateTime? Timestamp
        {
            get;
            set;
        }


        public int? WebSource
        {
            get;
            set;
        }


        public DateTime? InsertTime
        {
            get;
            set;
        }


        public int? IsRead
        {
            get;
            set;
        }


        public int? increment
        {
            get;
            set;
        }

        #endregion

        public class EarlyWarnHotDAO : SqlDAO<EarlyWarnHotEntity>
        {
            private SqlHelper sqlHelper;
            public const string DBName = "WeiboDBStr";

            public EarlyWarnHotDAO()
            {
                string skey = Util.ConfigUtil.CacheUsreInfo.SqlDBKey();
                if (string.IsNullOrEmpty(skey))
                {
                    skey = DBName;
                }
                sqlHelper = new SqlHelper(skey);
            }

            public override void Add(EarlyWarnHotEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into EarlyWarnHot(");
                strSql.Append("MainID,ItemID,Text,Count,MCount,Name,Nick,IsVip,Timestamp,WebSource,InsertTime,IsRead,increment)");
                strSql.Append(" values (");
                strSql.Append("@MainID,@ItemID,@Text,@Count,@MCount,@Name,@Nick,@IsVip,@Timestamp,@WebSource,@InsertTime,@IsRead,@increment)");
                SqlParameter[] parameters = {
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ItemID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@MCount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@IsVip",SqlDbType.Int),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@IsRead",SqlDbType.Int),
					new SqlParameter("@increment",SqlDbType.Int)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.ItemID;
                parameters[2].Value = entity.Text;
                parameters[3].Value = entity.Count;
                parameters[4].Value = entity.MCount;
                parameters[5].Value = entity.Name;
                parameters[6].Value = entity.Nick;
                parameters[7].Value = entity.IsVip;
                parameters[8].Value = entity.Timestamp;
                parameters[9].Value = entity.WebSource;
                parameters[10].Value = entity.InsertTime;
                parameters[11].Value = entity.IsRead;
                parameters[12].Value = entity.increment;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(EarlyWarnHotEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update EarlyWarnHot set ");
                strSql.Append("MainID=@MainID,");
                strSql.Append("ItemID=@ItemID,");
                strSql.Append("Text=@Text,");
                strSql.Append("Count=@Count,");
                strSql.Append("MCount=@MCount,");
                strSql.Append("Name=@Name,");
                strSql.Append("Nick=@Nick,");
                strSql.Append("IsVip=@IsVip,");
                strSql.Append("Timestamp=@Timestamp,");
                strSql.Append("WebSource=@WebSource,");
                strSql.Append("InsertTime=@InsertTime,");
                strSql.Append("IsRead=@IsRead,");
                strSql.Append("increment=@increment");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@ID",SqlDbType.Int),
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ItemID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@MCount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@IsVip",SqlDbType.Int),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@IsRead",SqlDbType.Int),
					new SqlParameter("@increment",SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                parameters[1].Value = entity.MainID;
                parameters[2].Value = entity.ItemID;
                parameters[3].Value = entity.Text;
                parameters[4].Value = entity.Count;
                parameters[5].Value = entity.MCount;
                parameters[6].Value = entity.Name;
                parameters[7].Value = entity.Nick;
                parameters[8].Value = entity.IsVip;
                parameters[9].Value = entity.Timestamp;
                parameters[10].Value = entity.WebSource;
                parameters[11].Value = entity.InsertTime;
                parameters[12].Value = entity.IsRead;
                parameters[13].Value = entity.increment;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(EarlyWarnHotEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from EarlyWarnHot ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override EarlyWarnHotEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from EarlyWarnHot ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    EarlyWarnHotEntity entity = new EarlyWarnHotEntity();
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (int)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["ItemID"]))
                    {
                        entity.ItemID = (long)row["ItemID"];
                    }
                    entity.Text = row["Text"].ToString();
                    if (!Convert.IsDBNull(row["Count"]))
                    {
                        entity.Count = (int)row["Count"];
                    }
                    if (!Convert.IsDBNull(row["MCount"]))
                    {
                        entity.MCount = (int)row["MCount"];
                    }
                    entity.Name = row["Name"].ToString();
                    entity.Nick = row["Nick"].ToString();
                    if (!Convert.IsDBNull(row["IsVip"]))
                    {
                        entity.IsVip = (int)row["IsVip"];
                    }
                    if (!Convert.IsDBNull(row["Timestamp"]))
                    {
                        entity.Timestamp = (DateTime)row["Timestamp"];
                    }
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    if (!Convert.IsDBNull(row["IsRead"]))
                    {
                        entity.IsRead = (int)row["IsRead"];
                    }
                    if (!Convert.IsDBNull(row["increment"]))
                    {
                        entity.increment = (int)row["increment"];
                    }
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<EarlyWarnHotEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM EarlyWarnHot(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<EarlyWarnHotEntity> list = new List<EarlyWarnHotEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        EarlyWarnHotEntity entity = new EarlyWarnHotEntity();
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (int)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["MainID"]))
                        {
                            entity.MainID = (int)row["MainID"];
                        }
                        if (!Convert.IsDBNull(row["ItemID"]))
                        {
                            entity.ItemID = (long)row["ItemID"];
                        }
                        entity.Text = row["Text"].ToString();
                        if (!Convert.IsDBNull(row["Count"]))
                        {
                            entity.Count = (int)row["Count"];
                        }
                        if (!Convert.IsDBNull(row["MCount"]))
                        {
                            entity.MCount = (int)row["MCount"];
                        }
                        entity.Name = row["Name"].ToString();
                        entity.Nick = row["Nick"].ToString();
                        if (!Convert.IsDBNull(row["IsVip"]))
                        {
                            entity.IsVip = (int)row["IsVip"];
                        }
                        if (!Convert.IsDBNull(row["Timestamp"]))
                        {
                            entity.Timestamp = (DateTime)row["Timestamp"];
                        }
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
                        }
                        if (!Convert.IsDBNull(row["InsertTime"]))
                        {
                            entity.InsertTime = (DateTime)row["InsertTime"];
                        }
                        if (!Convert.IsDBNull(row["IsRead"]))
                        {
                            entity.IsRead = (int)row["IsRead"];
                        }
                        if (!Convert.IsDBNull(row["increment"]))
                        {
                            entity.increment = (int)row["increment"];
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
            #region 新增
            public DataSet GetIDList(string strWhere, string orderBy, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select ID");
                strSql.Append(" FROM EarlyWarnHot(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                if (orderBy.Trim() != "")
                {
                    strSql.Append(" order by " + orderBy);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }
            public int UpdateIsRead(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("update EarlyWarnHot set IsRead=1");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteSql(strSql.ToString(), param);
            }
            #endregion
            public DataSet GetDataSet(string strWhere, SqlParameter[] param)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM EarlyWarnHot(nolock)");
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
                string sql = "select count(*) from EarlyWarnHot ";
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

                sql += " AS RowNumber,* FROM EarlyWarnHot";

                if (!string.IsNullOrEmpty(where))
                {
                    sql += " where " + where;
                }

                sql += " ) _myResults WHERE RowNumber>" + startNumber.ToString();

                return sqlHelper.ExecuteDateSet(sql, param).Tables[0];
            }
            /// <summary>
            /// 联合查询 联合表名:Users
            /// </summary>
            /// <param name="where">查询条件，可为empty</param>
            /// <param name="orderBy">排序条件，可为empty</param>
            /// <param name="pageSize">每页显示记录数</param>
            /// <param name="pageNumber">当前页码</param>
            /// <returns>datatable</returns>
            public DataTable GetJoinPager(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
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
                sql += " AS RowNumber,u.Profile_image_url,u.UserID,u.Statuses_count,u.Friends_count,u.Followers_count,u.Gender,u.Verified_reason,ewh.* FROM EarlyWarnHot ewh inner join Users u on ewh.Name =u.Name and ewh.WebSource=u.WebSource";


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

