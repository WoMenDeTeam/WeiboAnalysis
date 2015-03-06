using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.XPath;
using System.Data;

namespace IdolACINet
{
    public class IdolACIHelper
    {
        private Connection _aciConnection;
        private Connection _indexConnection;

        public Connection GetConnection()
        {
            if (_aciConnection == null)
            {
                _aciConnection = new Connection();
                _aciConnection.Host = "127.0.0.1";//"60.28.9.171";
                _aciConnection.Port = 9000;
                return _aciConnection;
            }
            else
            {
                return _aciConnection;
            }

        }
        public Connection GetIndexConnection()
        {
            if (_indexConnection == null)
            {
                _indexConnection = new Connection();
                _indexConnection.Host = "60.28.9.171";
                _indexConnection.Port = 9011;
                return _indexConnection;
            }
            else
            {
                return _indexConnection;
            }
        }

        public void DeleteDoc(string dbName,string queryText)
        {
            Connection connection = new Connection();
            connection.Host = "60.28.9.171";
            connection.Port = 9000;
            Command command = new Command("Query");
            foreach (String parameter in queryText.Split(new char[] { '&' }))
            {
                string[] keyValue = parameter.Split(new char[] { '=' });
                command.Parameters.Add(keyValue[0], keyValue[1]);
            }
            try
            {
                Response response = connection.Execute(command);
                DataSource(response,"//autn:id");
            }
            catch (ResponseException ex)
            {
                throw ex;
            }
            catch ( XPathException ex )
            {
                throw ex;
            }

            Command delCommand = new Command("");

        }

        private void DataSource(Response response,string columns)
        {
            XmlNamespaceManager namespaceManager = new XmlNamespaceManager(response.Data.NameTable);
            namespaceManager.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
            DataTable table = new DataTable();
            foreach (XmlNode node in response.Data.SelectNodes(columns, namespaceManager))
            {
                BuildTable(table, node);
                if (node is XmlElement)
                {

                }
                else if (node is XmlNode)
                {

                }
            }
        }

        private void BuildTable(DataTable table, XmlNode node)
        {
            throw new NotImplementedException();
        }

        public void Select(string dbName, string queryText, string Columns)
        {
            Connection connection = new Connection();
            connection.Host = "60.28.9.171";
            connection.Port = 9000;
            Command command = new Command("Query");
            foreach (String parameter in queryText.Split(new char[] { '&' }))
            {
                string[] keyValue = parameter.Split(new char[] { '=' });
                command.Parameters.Add(keyValue[0], keyValue[1]);
            }
            try
            {
                Response response = connection.Execute(command);
                DataSource(response, Columns);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #region idol常用操作分析
        #region  查询

        #endregion

        #region 数据修改
        public void Update()
        {



        }

        #endregion

        #region  分类操作

        #endregion

        #region  聚类操作

        ///1.生成快照
        private void GenSnapShot()
        {
            //a getConnection
            Connection aciCon = GetConnection();
            //b Command=ClusterSnapshot
            Command command = Command.ClusterSnapshot;
            //c SetParma
            //command.Parameters.Add();
            //d execute

        }

        #endregion

        #endregion



    }
}
