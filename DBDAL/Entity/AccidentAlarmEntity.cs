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
    public class AccidentAlarmEntity
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public DateTime PublishTime { get; set; }
        public DateTime CreateTime { get; set; }
        public int DeadCount { get; set; }
        public int IsMassDeath { get; set; }
        public int AlarmState { get; set; }
        public int InjuredCount { get; set; }
        public int LostCount { get; set; }
        public int Tag { get; set; }
        public string Remark { get; set; }

        public class AccidentAlarmDAO : SqlDAO<CaseAccidentEntity>
        {
            private SqlHelper sqlHelper;

            public const string DBName = "WeiboDBStr";
            public AccidentAlarmDAO()
            {
                sqlHelper = new SqlHelper(DBName);
            }
            public void Add(AccidentAlarmEntity entity)
            {
                string sql = " INSERT INTO dbo.AccidentAlarm ( Title,Content,Url,PublishTime,CreateTime,DeadCount,IsMassDeath,AlarmState,InjuredCount,LostCount) VALUES  (  @Title ,@Content ,@Url ,@PublishTime ,@CreateTime,@DeadCount ,@IsMassDeath, @AlarmState ,@InjuredCount,@LostCount   )";
                SqlParameter[] param = { new SqlParameter("@Title",SqlDbType.VarChar),
                                           new SqlParameter("@Content",SqlDbType.VarChar),
                                       new SqlParameter("@Url",SqlDbType.VarChar),
                                       new SqlParameter("@PublishTime",SqlDbType.DateTime),
                                       new SqlParameter("@CreateTime",SqlDbType.DateTime),
                                       new SqlParameter("@DeadCount",SqlDbType.Int),
                                       new SqlParameter("@IsMassDeath",SqlDbType.Int),
                                       new SqlParameter("@AlarmState",SqlDbType.Int),
                                       new SqlParameter("@InjuredCount",SqlDbType.Int),
                                       new SqlParameter("@LostCount",SqlDbType.Int),
                                       new SqlParameter("@ID",SqlDbType.Int),
                                       };
                param[0].Value = entity.Title;
                param[1].Value = entity.Content;
                param[2].Value = entity.Url;
                param[3].Value = entity.PublishTime;
                param[4].Value = entity.CreateTime;
                param[5].Value = entity.DeadCount;
                param[6].Value = entity.IsMassDeath;
                param[7].Value = entity.AlarmState;
                param[8].Value = entity.InjuredCount;
                param[9].Value = entity.LostCount;
                param[10].Value = entity.ID;
                sqlHelper.ExecuteSql(sql, param);
            }

            public void Update(AccidentAlarmEntity entity)
            {

                string sql = "UPDATE dbo.AccidentAlarm SET Title=@Title,Content=@Content,Url=@Url,PublishTime=@PublishTime,CreateTime=@CreateTime,DeadCount=@DeadCount,IsMassDeath=@IsMassDeath,AlarmState=@AlarmState,InjuredCount=@InjuredCount,LostCount=@LostCount,Tag=@Tag,Remark=@Remark WHERE ID=@ID";
                SqlParameter[] param = { new SqlParameter("@Title",SqlDbType.VarChar),
                                           new SqlParameter("@Content",SqlDbType.VarChar),
                                       new SqlParameter("@Url",SqlDbType.VarChar),
                                       new SqlParameter("@PublishTime",SqlDbType.DateTime),
                                       new SqlParameter("@CreateTime",SqlDbType.DateTime),
                                       new SqlParameter("@DeadCount",SqlDbType.Int),
                                       new SqlParameter("@IsMassDeath",SqlDbType.Int),
                                       new SqlParameter("@AlarmState",SqlDbType.Int),
                                       new SqlParameter("@InjuredCount",SqlDbType.Int),
                                       new SqlParameter("@LostCount",SqlDbType.Int),
                                       new SqlParameter("@ID",SqlDbType.Int),
                                       new SqlParameter("@Tag",SqlDbType.Int),
                                       new SqlParameter("@Remark",SqlDbType.NVarChar)
                                       };
                param[0].Value = entity.Title;
                param[1].Value = entity.Content;
                param[2].Value = entity.Url;
                param[3].Value = entity.PublishTime;
                param[4].Value = entity.CreateTime;
                param[5].Value = entity.DeadCount;
                param[6].Value = entity.IsMassDeath;
                param[7].Value = entity.AlarmState;
                param[8].Value = entity.InjuredCount;
                param[9].Value = entity.LostCount;
                param[10].Value = entity.ID;
                param[11].Value = entity.Tag;
                param[12].Value = entity.Remark;
                sqlHelper.ExecuteSql(sql, param);
            }
            public void UpdateAlarmState(int id, int state)
            {
                string sql = "UPDATE dbo.AccidentAlarm SET AlarmState=@AlarmState WHERE ID=@ID";
                SqlParameter[] parameters = {
						new SqlParameter("@AlarmState", SqlDbType.Int),
                        new SqlParameter("@ID",SqlDbType.BigInt)
					};
                parameters[0].Value = state;
                parameters[1].Value = id;
                sqlHelper.ExecuteSql(sql, parameters);
            }
            public void UpdateAlarmStateByIds(string ids, int state)
            {
                string sql = string.Format("UPDATE dbo.AccidentAlarm SET AlarmState=({0}) WHERE ID in({1})", state, ids);
                sqlHelper.ExecuteSql(sql, null);
            }

            public void Delete(AccidentAlarmEntity entity)
            {
                string sql = string.Format("DELETE dbo.AccidentAlarm WHERE ID={0}", entity.ID);
                sqlHelper.ExecuteSql(sql, null);
            }
            private AccidentAlarmEntity DataRowToEntity(DataRow item)
            {
                AccidentAlarmEntity entity = new AccidentAlarmEntity();
                if (!Convert.IsDBNull(item["ID"]))
                {
                    entity.ID = Convert.ToInt32(item["ID"].ToString());
                }
                if (!Convert.IsDBNull(item["Title"]))
                {
                    entity.Title = item["Title"].ToString();
                }
                if (!Convert.IsDBNull(item["Content"]))
                {
                    entity.Content = item["Content"].ToString();
                }
                if (!Convert.IsDBNull(item["Url"]))
                {
                    entity.Url = item["Url"].ToString();
                }
                if (!Convert.IsDBNull(item["PublishTime"]))
                {
                    entity.PublishTime = Convert.ToDateTime(item["PublishTime"]);
                }
                if (!Convert.IsDBNull(item["CreateTime"]))
                {
                    entity.CreateTime = Convert.ToDateTime(item["CreateTime"]);
                }
                if (!Convert.IsDBNull(item["DeadCount"]))
                {
                    entity.DeadCount = Convert.ToInt32(item["DeadCount"].ToString());
                }
                if (!Convert.IsDBNull(item["IsMassDeath"]))
                {
                    entity.IsMassDeath = Convert.ToInt32(item["IsMassDeath"].ToString());
                }
                if (!Convert.IsDBNull(item["AlarmState"]))
                {
                    entity.AlarmState = Convert.ToInt32(item["AlarmState"].ToString());
                }
                if (!Convert.IsDBNull(item["InjuredCount"]))
                {
                    entity.InjuredCount = Convert.ToInt32(item["InjuredCount"].ToString());
                }
                if (!Convert.IsDBNull(item["LostCount"]))
                {
                    entity.LostCount = Convert.ToInt32(item["LostCount"].ToString());
                }
                if (!Convert.IsDBNull(item["Tag"]))
                {
                    entity.Tag = Convert.ToInt32(item["Tag"].ToString());
                }
                if (!Convert.IsDBNull(item["Remark"]))
                {
                    entity.Remark = item["Remark"].ToString();
                }
                return entity;
            }
            public AccidentAlarmEntity FindById(int id)
            {
                AccidentAlarmEntity entity = new AccidentAlarmEntity();
                string sql = string.Format("SELECT ID,Title,Content,Url,PublishTime,CreateTime,DeadCount,IsMassDeath,AlarmState,InjuredCount,LostCount,Tag,Remark FROM dbo.AccidentAlarm WHERE ID={0}", id);
                DataTable dt = sqlHelper.ExecuteDateSet(sql, null).Tables[0];
                foreach (DataRow item in dt.Rows)
                {
                    entity = DataRowToEntity(item);
                }
                return entity;
            }

            public int GetPagerRowsCount(string where, SqlParameter[] param)
            {
                string sql = "select count(*) from AccidentAlarm ";
                if (!string.IsNullOrEmpty(where))
                {
                    sql += "where " + where;
                }

                object obj = sqlHelper.GetSingle(sql, param);

                return obj == null ? 0 : Convert.ToInt32(obj);
            }
            public DataTable GetDataSet(string where)
            {
                string sql = string.Format(" SELECT  TOP 10 * FROM( SELECT *,(DeadCount+LostCount) AS HigLevel FROM dbo.AccidentAlarm WHERE {0}) AS _myResult WHERE [_myResult].AlarmState=0 ORDER BY AlarmState DESC,SourceType DESC, PublishTime DESC, HigLevel DESC ", where);
                return sqlHelper.ExecuteDateSet(sql, null).Tables[0];
            }

            public DataTable GetPager(string where, SqlParameter[] param, string orderBy, int pageSize, int pageNumber)
            {
                int startNumber = pageSize * (pageNumber - 1);
                StringBuilder sqlBuilder = new StringBuilder();
                sqlBuilder.AppendFormat(" SELECT TOP {0} * FROM (", pageSize);
                sqlBuilder.AppendFormat(" SELECT  ROW_NUMBER() OVER( ORDER BY {0}) AS RowNumber, *  FROM (", orderBy);
                sqlBuilder.AppendFormat(" SELECT (DeadCount+LostCount) AS HigLevel, * FROM dbo.AccidentAlarm WHERE {0}", where);
                sqlBuilder.Append(" ) AS _myResult1");
                sqlBuilder.AppendFormat(" )AS  _myResult WHERE RowNumber >{0} ORDER BY  AlarmState DESC,CreateTime desc", startNumber);
                return sqlHelper.ExecuteDateSet(sqlBuilder.ToString(), param).Tables[0];
            }
        }
    }
}
