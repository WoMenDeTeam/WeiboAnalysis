using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Xml;
using Util;
using IdolACINet;

namespace BLL.Idol
{
    public class IdolClusterEntity
    {
        public IdolClusterEntity()
        {
            ClusterTitle = null;
            DocList = new List<ClusterDocEntity>();
        }
        public string ClusterTitle
        {
            get;
            set;
        }
        public IList<ClusterDocEntity> DocList
        {
            set;
            get;
        }
        public class IdolClusterEntityDao
        {
            //private Connection conn = new Connection(ConfigurationManager.AppSettings["IdolHttp"], 9000);
            Connection conn = new Connection(Util.ConfigUtil.CacheUsreInfo.IdolIp(), 9000);
            private string GetNodeText(XmlNode node)
            {
                try
                {
                    return node.InnerText;
                }
                catch
                {
                    return null;
                }
            }
            /// <summary>
            /// 返回最新新闻或热点新闻
            /// </summary>
            /// <param name="type">1为最新新闻，2为热点新闻</param>
            /// <returns></returns>
            public IList<IdolClusterEntity> GetClusterNews(int type, int clusterNum, int docNum)
            {
                IList<IdolClusterEntity> list = new List<IdolClusterEntity>();
                XmlDocument xmldoc = GetXmlDoc(type, clusterNum, docNum);
                if (xmldoc != null)
                {
                    XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
                    nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
                    XmlNodeList clusterList = xmldoc.SelectNodes("autnresponse/responsedata/autn:clusters/autn:cluster", nsmgr);
                    foreach (XmlNode node in clusterList)
                    {
                        IdolClusterEntity entity = new IdolClusterEntity();
                        XmlNodeList docList = node.SelectNodes("autn:docs/autn:doc", nsmgr);
                        int count = 1;
                        IList<string> hrefList = new List<string>();
                        StringBuilder urlList = new StringBuilder();
                        foreach (XmlNode Lnode in docList)
                        {
                            if (count == 1)
                            {
                                entity.ClusterTitle = GetNodeText(node.SelectSingleNode("autn:title", nsmgr));
                            }
                            var DocUrl = GetNodeText(Lnode.SelectSingleNode("autn:ref", nsmgr));
                            hrefList.Add(DocUrl);
                            if (urlList.Length > 0)
                            {
                                urlList.Append("+");
                            }
                            urlList.Append(DocUrl);
                        }
                        QueryCommand DocQuery = new QueryCommand();
                        DocQuery.Text = "*";
                        DocQuery.Parameters.Add(QueryParams.PrintFields, "MYSITENAME,DREDATE,DOMAINSITENAME,DOMAINSITENAME");
                        DocQuery.Parameters.Add(QueryParams.DatabaseMatch, ConfigurationManager.AppSettings["DATABASE"]);
                        DocQuery.Parameters.Add("MatchReference", urlList.ToString());
                        DocQuery.Parameters.Add("Sort", "Date");
                        DocQuery.Parameters.Add("Summary", "Context");
                        DocQuery.Parameters.Add("Characters", "600");
                        XmlDocument DocListXMLDoc = conn.Execute(DocQuery).Data;
                        if (DocListXMLDoc != null)
                        {
                            IdolNewsEntity.IdolNewsDao EntityDao = new IdolNewsEntity.IdolNewsDao();
                            IList<IdolNewsEntity> Llist = EntityDao.GetNewsList(DocListXMLDoc);
                            foreach (IdolNewsEntity LEntity in Llist)
                            {
                                ClusterDocEntity docEntity = new ClusterDocEntity();
                                docEntity.Title = LEntity.Title;
                                docEntity.Href = LEntity.Href;
                                docEntity.SiteName = LEntity.SiteName;
                                docEntity.TimeStr = LEntity.TimeStr;
                                entity.DocList.Add(docEntity);
                            }
                        }
                        list.Add(entity);
                    }
                }
                return list;
            }

            public IList<IdolClusterEntity> GetClusterNews(string jobname, int clusterNum, int docNum)
            {
                IList<IdolClusterEntity> list = new List<IdolClusterEntity>();
                XmlDocument xmldoc = GetXmlDoc(jobname, clusterNum, docNum);
                if (xmldoc != null)
                {
                    XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
                    nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
                    XmlNodeList clusterList = xmldoc.SelectNodes("autnresponse/responsedata/autn:clusters/autn:cluster", nsmgr);
                    foreach (XmlNode node in clusterList)
                    {
                        IdolClusterEntity entity = new IdolClusterEntity();
                        XmlNodeList docList = node.SelectNodes("autn:docs/autn:doc", nsmgr);
                        int count = 1;
                        IList<string> hrefList = new List<string>();
                        StringBuilder urlList = new StringBuilder();
                        foreach (XmlNode Lnode in docList)
                        {
                            if (count == 1)
                            {
                                entity.ClusterTitle = GetNodeText(node.SelectSingleNode("autn:title", nsmgr));
                            }
                            string title = GetNodeText(Lnode.SelectSingleNode("autn:title", nsmgr));
                            if (!string.IsNullOrEmpty(title))
                            {
                                string DocUrl = EncodeByEscape.GetEscapeStr(GetNodeText(Lnode.SelectSingleNode("autn:ref", nsmgr)));// UrlEncode.GetEncodeUrl(GetNodeText(Lnode.SelectSingleNode("autn:ref", nsmgr)));
                                hrefList.Add(DocUrl);
                                if (urlList.Length > 0)
                                {
                                    urlList.Append("+");
                                }
                                urlList.Append(DocUrl);
                            }

                        }
                        QueryCommand DocQuery = new QueryCommand();
                        DocQuery.Text = "*";
                        DocQuery.Parameters.Add(QueryParams.PrintFields, "WEBSITENAME,MYSITENAME,DREDATE,DOMAINSITENAME");
                        DocQuery.Parameters.Add(QueryParams.DatabaseMatch, ConfigurationManager.AppSettings["DATABASE"]);
                        DocQuery.Parameters.Add("MatchReference", urlList.ToString());
                        DocQuery.Parameters.Add("Sort", "Date");
                        DocQuery.Parameters.Add("Summary", "Context");
                        DocQuery.Parameters.Add("Characters", "600");
                        XmlDocument DocListXMLDoc = conn.Execute(DocQuery).Data;
                        if (DocListXMLDoc != null)
                        {
                            IdolNewsEntity.IdolNewsDao EntityDao = new IdolNewsEntity.IdolNewsDao();
                            IList<IdolNewsEntity> Llist = EntityDao.GetNewsList(DocListXMLDoc);
                            int viewCount = 1;
                            foreach (IdolNewsEntity LEntity in Llist)
                            {
                                ClusterDocEntity docEntity = new ClusterDocEntity();
                                docEntity.Title = LEntity.Title;
                                docEntity.Href = LEntity.Href;
                                docEntity.SiteName = LEntity.SiteName;
                                docEntity.TimeStr = LEntity.TimeStr;
                                docEntity.Content = LEntity.Content;
                                entity.DocList.Add(docEntity);
                                viewCount++;
                            }
                        }
                        list.Add(entity);
                    }
                }
                return list;
            }

            private XmlDocument GetXmlDoc(int type, int clusterNum, int docNum)
            {
                try
                {
                    Command query = QueryCommand.ClusterResults;
                    if (type == 1)
                    {
                        query.SetParam(QueryParams.SourceJobname, ConfigurationManager.AppSettings["NewJobName"]);
                    }
                    else if (type == 2)
                    {
                        query.SetParam(QueryParams.SourceJobname, ConfigurationManager.AppSettings["HotJobName"]);
                    }
                    else
                    {
                        query.SetParam(QueryParams.SourceJobname, ConfigurationManager.AppSettings["ReportJobName"]);
                    }
                    query.SetParam("dreanylanguage", QueryParamValue.False);
                    query.SetParam(QueryParams.NumClusters, clusterNum);
                    query.SetParam(QueryParams.NumResults, docNum);
                    query.SetParam(QueryParams.MaxTerms, 0);
                    query.SetParam("dreoutputencoding", "utf8");
                    return conn.Execute(query).Data;
                }
                catch (Exception ex)
                {
                    return null;
                }
            }

            private XmlDocument GetXmlDoc(string jobname, int clusterNum, int docNum)
            {
                try
                {
                    Command query = QueryCommand.ClusterResults;
                    query.SetParam(QueryParams.SourceJobname, jobname);
                    query.SetParam("dreanylanguage", QueryParamValue.False);
                    query.SetParam(QueryParams.NumClusters, clusterNum);
                    query.SetParam(QueryParams.NumResults, docNum);
                    query.SetParam(QueryParams.MaxTerms, 0);
                    query.SetParam("dreoutputencoding", "utf8");
                    return conn.Execute(query).Data;
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

    }
    public class ClusterDocEntity
    {
        public string Title
        {
            get;
            set;
        }
        public string Href
        {
            get;
            set;
        }

        public string SiteName
        {
            get;
            set;
        }

        public string TimeStr
        {
            get;
            set;
        }

        public string Content
        {
            get;
            set;
        }
    }
}
