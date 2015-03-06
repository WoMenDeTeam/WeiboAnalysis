using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using DBDAL.Data;

namespace DBDAL.Entity
{
    [Serializable]
    public partial class ReItemEntity
    {
        private SqlHelper sqlHelper;

        #region const fields
        public const string DBName = "Weibo";
        public const string TableName = "ReItem";
        public const string PrimaryKey = "PK_ReItem";
        #endregion

        #region columns
        public struct Columns
        {
            public const string MainID = "MainID";
            public const string ID = "ID";
            public const string SourceID = "SourceID";
            public const string Text = "Text";
            public const string Count = "Count";
            public const string Mcount = "Mcount";
            public const string Name = "Name";
            public const string UserID = "UserID";
            public const string Nick = "Nick";
            public const string IsVip = "IsVip";
            public const string Timestamp = "Timestamp";
            public const string Province = "Province";
            public const string City = "City";
            public const string Type = "Type";
            public const string WebSource = "WebSource";
            public const string InsertTime = "InsertTime";
            public const string Gender = "Gender";
        }
        #endregion

        #region constructors
        public ReItemEntity()
        {
            sqlHelper = new SqlHelper(DBName);
        }

        public ReItemEntity(int mainid, long id, long sourceid, string text, int count, int mcount, string name, string userid, string nick, int isvip, DateTime timestamp, string province, string city, int type, int websource, DateTime inserttime, string gender)
        {
            this.MainID = mainid;

            this.ID = id;

            this.SourceID = sourceid;

            this.Text = text;

            this.Count = count;

            this.Mcount = mcount;

            this.Name = name;

            this.UserID = userid;

            this.Nick = nick;

            this.IsVip = isvip;

            this.Timestamp = timestamp;

            this.Province = province;

            this.City = city;

            this.Type = type;

            this.WebSource = websource;

            this.InsertTime = inserttime;

            this.Gender = gender;

        }
        #endregion

        #region Properties

        public int? MainID
        {
            get;
            set;
        }


        public long? ID
        {
            get;
            set;
        }


        public long? SourceID
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


        public int? Mcount
        {
            get;
            set;
        }


        public string Name
        {
            get;
            set;
        }


        public string UserID
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


        public string Province
        {
            get;
            set;
        }


        public string City
        {
            get;
            set;
        }


        public int? Type
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


        public string Gender
        {
            get;
            set;
        }

        #endregion

        public class ReItemDAO : SqlDAO<ReItemEntity>
        {
            private SqlHelper sqlHelper;
            //public const string DBName =  Util.ConfigUtil.CacheUsreInfo.SqlDBKey;//"WeiboDBStr";

            public ReItemDAO()
            {
                sqlHelper = new SqlHelper(Util.ConfigUtil.CacheUsreInfo.SqlDBKey());
            }

            public override void Add(ReItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("insert into ReItem(");
                strSql.Append("MainID,ID,SourceID,Text,Count,Mcount,Name,UserID,Nick,IsVip,Timestamp,Province,City,Type,WebSource,InsertTime,Gender)");
                strSql.Append(" values (");
                strSql.Append("@MainID,@ID,@SourceID,@Text,@Count,@Mcount,@Name,@UserID,@Nick,@IsVip,@Timestamp,@Province,@City,@Type,@WebSource,@InsertTime,@Gender)");
                SqlParameter[] parameters = {
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ID",SqlDbType.BigInt),
					new SqlParameter("@SourceID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@Mcount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@UserID",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@IsVip",SqlDbType.Int),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@Province",SqlDbType.VarChar),
					new SqlParameter("@City",SqlDbType.VarChar),
					new SqlParameter("@Type",SqlDbType.Int),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@Gender",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.ID;
                parameters[2].Value = entity.SourceID;
                parameters[3].Value = entity.Text;
                parameters[4].Value = entity.Count;
                parameters[5].Value = entity.Mcount;
                parameters[6].Value = entity.Name;
                parameters[7].Value = entity.UserID;
                parameters[8].Value = entity.Nick;
                parameters[9].Value = entity.IsVip;
                parameters[10].Value = entity.Timestamp;
                parameters[11].Value = entity.Province;
                parameters[12].Value = entity.City;
                parameters[13].Value = entity.Type;
                parameters[14].Value = entity.WebSource;
                parameters[15].Value = entity.InsertTime;
                parameters[16].Value = entity.Gender;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Update(ReItemEntity entity)
            {

                StringBuilder strSql = new StringBuilder();
                strSql.Append("update ReItem set ");
                strSql.Append("MainID=@MainID,");
                strSql.Append("SourceID=@SourceID,");
                strSql.Append("Text=@Text,");
                strSql.Append("Count=@Count,");
                strSql.Append("Mcount=@Mcount,");
                strSql.Append("Name=@Name,");
                strSql.Append("UserID=@UserID,");
                strSql.Append("Nick=@Nick,");
                strSql.Append("IsVip=@IsVip,");
                strSql.Append("Timestamp=@Timestamp,");
                strSql.Append("Province=@Province,");
                strSql.Append("City=@City,");
                strSql.Append("Type=@Type,");
                strSql.Append("WebSource=@WebSource,");
                strSql.Append("InsertTime=@InsertTime,");
                strSql.Append("Gender=@Gender");

                strSql.Append(" where ID=@ID");
                SqlParameter[] parameters = {
					new SqlParameter("@MainID",SqlDbType.Int),
					new SqlParameter("@ID",SqlDbType.BigInt),
					new SqlParameter("@SourceID",SqlDbType.BigInt),
					new SqlParameter("@Text",SqlDbType.VarChar),
					new SqlParameter("@Count",SqlDbType.Int),
					new SqlParameter("@Mcount",SqlDbType.Int),
					new SqlParameter("@Name",SqlDbType.VarChar),
					new SqlParameter("@UserID",SqlDbType.VarChar),
					new SqlParameter("@Nick",SqlDbType.VarChar),
					new SqlParameter("@IsVip",SqlDbType.Int),
					new SqlParameter("@Timestamp",SqlDbType.DateTime),
					new SqlParameter("@Province",SqlDbType.VarChar),
					new SqlParameter("@City",SqlDbType.VarChar),
					new SqlParameter("@Type",SqlDbType.Int),
					new SqlParameter("@WebSource",SqlDbType.Int),
					new SqlParameter("@InsertTime",SqlDbType.DateTime),
					new SqlParameter("@Gender",SqlDbType.VarChar)
					};
                parameters[0].Value = entity.MainID;
                parameters[1].Value = entity.ID;
                parameters[2].Value = entity.SourceID;
                parameters[3].Value = entity.Text;
                parameters[4].Value = entity.Count;
                parameters[5].Value = entity.Mcount;
                parameters[6].Value = entity.Name;
                parameters[7].Value = entity.UserID;
                parameters[8].Value = entity.Nick;
                parameters[9].Value = entity.IsVip;
                parameters[10].Value = entity.Timestamp;
                parameters[11].Value = entity.Province;
                parameters[12].Value = entity.City;
                parameters[13].Value = entity.Type;
                parameters[14].Value = entity.WebSource;
                parameters[15].Value = entity.InsertTime;
                parameters[16].Value = entity.Gender;

                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override void Delete(ReItemEntity entity)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("delete from ReItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)
					};
                parameters[0].Value = entity.ID;
                sqlHelper.ExecuteSql(strSql.ToString(), parameters);
            }

            public override ReItemEntity FindById(long primaryKeyId)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select * from ReItem ");
                strSql.Append(" where ID=@primaryKeyId");
                SqlParameter[] parameters = {
						new SqlParameter("@primaryKeyId", SqlDbType.Int)};
                parameters[0].Value = primaryKeyId;
                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count == 1)
                {
                    DataRow row = ds.Tables[0].Rows[0];
                    ReItemEntity entity = new ReItemEntity();
                    if (!Convert.IsDBNull(row["MainID"]))
                    {
                        entity.MainID = (int)row["MainID"];
                    }
                    if (!Convert.IsDBNull(row["ID"]))
                    {
                        entity.ID = (long)row["ID"];
                    }
                    if (!Convert.IsDBNull(row["SourceID"]))
                    {
                        entity.SourceID = (long)row["SourceID"];
                    }
                    entity.Text = row["Text"].ToString();
                    if (!Convert.IsDBNull(row["Count"]))
                    {
                        entity.Count = (int)row["Count"];
                    }
                    if (!Convert.IsDBNull(row["Mcount"]))
                    {
                        entity.Mcount = (int)row["Mcount"];
                    }
                    entity.Name = row["Name"].ToString();
                    entity.UserID = row["UserID"].ToString();
                    entity.Nick = row["Nick"].ToString();
                    if (!Convert.IsDBNull(row["IsVip"]))
                    {
                        entity.IsVip = (int)row["IsVip"];
                    }
                    if (!Convert.IsDBNull(row["Timestamp"]))
                    {
                        entity.Timestamp = (DateTime)row["Timestamp"];
                    }
                    entity.Province = row["Province"].ToString();
                    entity.City = row["City"].ToString();
                    if (!Convert.IsDBNull(row["Type"]))
                    {
                        entity.Type = (int)row["Type"];
                    }
                    if (!Convert.IsDBNull(row["WebSource"]))
                    {
                        entity.WebSource = (int)row["WebSource"];
                    }
                    if (!Convert.IsDBNull(row["InsertTime"]))
                    {
                        entity.InsertTime = (DateTime)row["InsertTime"];
                    }
                    entity.Gender = row["Gender"].ToString();
                    return entity;
                }
                else
                {
                    return null;
                }
            }

            public override List<ReItemEntity> Find(string strWhere, SqlParameter[] parameters)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.Append("select *");
                strSql.Append(" FROM ReItem(nolock) ");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }

                DataSet ds = sqlHelper.ExecuteDateSet(strSql.ToString(), parameters);
                if (ds != null && ds.Tables.Count > 0)
                {
                    List<ReItemEntity> list = new List<ReItemEntity>();
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        ReItemEntity entity = new ReItemEntity();
                        if (!Convert.IsDBNull(row["MainID"]))
                        {
                            entity.MainID = (int)row["MainID"];
                        }
                        if (!Convert.IsDBNull(row["ID"]))
                        {
                            entity.ID = (long)row["ID"];
                        }
                        if (!Convert.IsDBNull(row["SourceID"]))
                        {
                            entity.SourceID = (long)row["SourceID"];
                        }
                        entity.Text = row["Text"].ToString();
                        if (!Convert.IsDBNull(row["Count"]))
                        {
                            entity.Count = (int)row["Count"];
                        }
                        if (!Convert.IsDBNull(row["Mcount"]))
                        {
                            entity.Mcount = (int)row["Mcount"];
                        }
                        entity.Name = row["Name"].ToString();
                        entity.UserID = row["UserID"].ToString();
                        entity.Nick = row["Nick"].ToString();
                        if (!Convert.IsDBNull(row["IsVip"]))
                        {
                            entity.IsVip = (int)row["IsVip"];
                        }
                        if (!Convert.IsDBNull(row["Timestamp"]))
                        {
                            entity.Timestamp = (DateTime)row["Timestamp"];
                        }
                        entity.Province = row["Province"].ToString();
                        entity.City = row["City"].ToString();
                        if (!Convert.IsDBNull(row["Type"]))
                        {
                            entity.Type = (int)row["Type"];
                        }
                        if (!Convert.IsDBNull(row["WebSource"]))
                        {
                            entity.WebSource = (int)row["WebSource"];
                        }
                        if (!Convert.IsDBNull(row["InsertTime"]))
                        {
                            entity.InsertTime = (DateTime)row["InsertTime"];
                        }
                        entity.Gender = row["Gender"].ToString();

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
                strSql.Append(" FROM ReItem(nolock)");
                if (strWhere.Trim() != "")
                {
                    strSql.Append(" where " + strWhere);
                }
                return sqlHelper.ExecuteDateSet(strSql.ToString(), param);
            }
            public DataSet GetPlCount(string strWhere)
            {
                if (string.IsNullOrEmpty(strWhere.Trim()))
                {
                    strWhere = "0";
                }
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat("SELECT MainID,Count (MainID)  AS PlCount FROM dbo.ReItem WHERE MainID IN({0}) GROUP BY MainID HAVING COUNT(MainID)>0", strWhere);
                return sqlHelper.ExecuteDateSet(strSql.ToString(), null);
            }

            #region paging methods

            /// <summary>
            /// 获取分页记录总数
            /// </summary>
            /// <param name="where">条件，等同于GetPaer()方法的where</param>
            /// <returns>返回记录总数</returns>
            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from ReItem ";
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

                sql += " AS RowNumber,* FROM ReItem";

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
