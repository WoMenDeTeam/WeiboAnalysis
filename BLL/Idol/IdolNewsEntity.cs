using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using IdolACINet;
using System.Configuration;
using Util;

namespace BLL.Idol
{
    public class IdolNewsEntity
    {
        public string Href
        {
            set;
            get;
        }
        public string Author
        {
            set;
            get;
        }
        public string DocId
        {
            get;
            set;
        }
        public string Content
        {
            get;
            set;
        }
        public string Title
        {
            get;
            set;
        }
        /// <summary>
        /// 来源（新浪、腾讯...）
        /// </summary>
        public string SiteName
        {
            get;
            set;
        }
        /// <summary>
        /// Web来源地址 1-新浪，2腾讯
        /// </summary>
        public string WebSource { get; set; }
        public string TimeStr
        {
            get;
            set;
        }
        public string weight
        {
            get;
            set;
        }
        public string DocType
        {
            get;
            set;
        }
        public string Tag
        {
            get;
            set;
        }
        public string TotalCount
        {
            get;
            set;
        }
        public string ClusterId
        {
            get;
            set;
        }
        public string ClusterTitle
        {
            get;
            set;
        }
        /// <summary>
        /// 回复（评论数量）
        /// </summary>
        public string ReplyNum
        {
            get;
            set;
        }
        public string ClickNum
        {
            get;
            set;
        }
        public string BBSViewNum
        {
            get;
            set;
        }
        public string BBSReplyNum
        {
            get;
            set;
        }
        public string ShowContent
        {
            get;
            set;
        }
        public string AllContent
        {
            get;
            set;
        }
        public string SiteType
        {
            get;
            set;
        }
        public string Columns
        {
            get;
            set;
        }
        public string HotColumns
        {
            get;
            set;
        }
        public string ContUrl
        {
            get;
            set;
        }
        public string SameNum
        {
            get;
            set;
        }
        /// <summary>
        /// 转发数量
        /// </summary>
        public string ForwardNum
        {
            get;
            set;
        }
        /// <summary>
        /// 微博（博主地址）
        /// </summary>
        public string AuthorURL
        {
            get;
            set;
        }
        /// <summary>
        /// 昵称
        /// </summary>
        public string AuthorName { get; set; }
        /// <summary>
        /// 微博时间
        /// </summary>
        public string TimesTamp { get; set; }
        /// <summary>
        /// 原始图片
        /// </summary>
        public string OriginalPic { get; set; }
        /// <summary>
        /// 缩略图
        /// </summary>
        public string ThumbnailPic { get; set; }
        /// <summary>
        /// 头像
        /// </summary>
        public string ProfileImageUrl { get; set; }
        /// <summary>
        /// 微博数量
        /// </summary>
        public string StatusesCount { get; set; }
        /// <summary>
        /// 粉丝数量
        /// </summary>
        public string FollowersCount { get; set; }
        /// <summary>
        /// 关注人数量
        /// </summary>
        public string FriendsCount { get; set; }
        /// <summary>
        /// 性别 m-男 f-女 n-未知
        /// </summary>
        public string Gender { get; set; }
        /// <summary>
        /// 省市
        /// </summary>
        public string Province { get; set; }
        /// <summary>
        /// 内容 *注 去了标签的
        /// </summary>
        public string DreContent { get; set; }
        /// <summary>
        /// 是否+V
        /// </summary>
        public string IsVip { get; set; }
        /// <summary>
        /// +V说明（个人说明）
        /// </summary>
        public string VerifiedReason { get; set; }
        /// <summary>
        /// 父亲ID，上级微博
        /// </summary>
        public string RetweetId { get; set; }
        /// <summary>
        /// 微博ID
        /// </summary>
        public string ItemId { get; set; }
        /// <summary>
        /// 新闻性质-2负面、0中性、2正面
        /// </summary>
        public string Emotion { get; set; }
        /// <summary>
        /// 账号名称
        /// </summary>
        public string AuthorgtrueName { get; set; }
        public string AvartarLarge { get; set; }
        /// <summary>
        /// 是否关注
        /// </summary>
        public string IsFollower { get; set; }
        /// <summary>
        /// 是否收藏
        /// </summary>
        public string IsFavorite { get; set; }
        /// <summary>
        /// 字符串时间格式
        /// </summary>
        public string StrDatetime { get; set; }
        /// <summary>
        /// 视频ID（关联sql）
        /// </summary>
        public string VideoId { get; set; }
        /// <summary>
        /// 视频文件名称（视频地址）
        /// </summary>
        public string VideoFilePath { get; set; }
        /// <summary>
        /// 视频段数
        /// </summary>
        public string VideoFileCount { get; set; }
        /// <summary>
        /// 视频短连接
        /// </summary>
        public string VideoShortLink { get; set; }
        /// <summary>
        /// 视频缩略图
        /// </summary>
        public string VideoThumbPic { get; set; }
        /// <summary>
        /// 关键字
        /// </summary>
        public string Links { get; set; }
        public string WeiboUrl { get; set; }


        public class IdolNewsDao
        {
            public IList<IdolNewsEntity> GetNewsList(XmlDocument xmldoc)
            {
                IList<IdolNewsEntity> newsList = new List<IdolNewsEntity>();
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
                nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
                XmlNodeList hits = xmldoc.SelectNodes("//autn:hit", nsmgr);
                foreach (XmlNode hit in hits)
                {
                    IdolNewsEntity entity = new IdolNewsEntity();
                    entity.TotalCount = GetArticleCount(xmldoc);
                    entity.DocId = GetNodeText(hit.SelectSingleNode("autn:id", nsmgr));
                    entity.Content = GetNodeText(hit.SelectSingleNode("autn:summary", nsmgr));
                    entity.weight = GetNodeText(hit.SelectSingleNode("autn:weight", nsmgr));
                    entity.Href = GetNodeText(hit.SelectSingleNode("autn:reference", nsmgr));
                    entity.ClusterId = GetNodeText(hit.SelectSingleNode("autn:cluster", nsmgr));
                    entity.ClusterTitle = GetNodeText(hit.SelectSingleNode("autn:clustertitle", nsmgr));
                    entity.Title = GetNodeText(hit.SelectSingleNode("autn:title", nsmgr));
                    entity.Links = GetNodeText(hit.SelectSingleNode("autn:links", nsmgr));
                    XmlNode document = hit.SelectSingleNode("autn:content/DOCUMENT", nsmgr);
                    if (document != null)
                    {
                        string doctype = GetNodeText(document.SelectSingleNode("MYSRCTYPE"));
                        string doctag = GetNodeText(document.SelectSingleNode("SENTIMENT"));
                        string click = GetNodeText(document.SelectSingleNode("READNUM"));
                        click = string.IsNullOrEmpty(click) ? "0" : click;
                        entity.ClickNum = click;// GetNodeText(document.SelectSingleNode("READNUM"));
                        entity.Author = GetNodeText(document.SelectSingleNode("AUTHOR"));
                        string reply = GetNodeText(document.SelectSingleNode("REPLYNUM"));
                        reply = string.IsNullOrEmpty(reply) ? "0" : reply;
                        entity.ReplyNum = reply;
                        string forwNum = GetNodeText(document.SelectSingleNode("FORWARDNUM"));
                        forwNum = string.IsNullOrEmpty(forwNum) ? "0" : forwNum;
                        entity.ForwardNum = forwNum;
                        entity.AuthorName = GetNodeText(document.SelectSingleNode("AUTHORNAME"));
                        string bbsviewnum = GetNodeText(document.SelectSingleNode("BBSVIEWNUM"));
                        bbsviewnum = string.IsNullOrEmpty(bbsviewnum) ? "0" : bbsviewnum;
                        entity.BBSViewNum = bbsviewnum;
                        string bbsreplynum = GetNodeText(document.SelectSingleNode("BBSREPLYNUM"));
                        bbsreplynum = string.IsNullOrEmpty(bbsreplynum) ? "0" : bbsreplynum;
                        entity.BBSReplyNum = bbsreplynum;
                        entity.AuthorURL = GetNodeText(document.SelectSingleNode("AUTHORURL"));
                        entity.SiteName = GetSiteName(GetNodeText(document.SelectSingleNode("MYSITENAME")), GetNodeText(document.SelectSingleNode("DOMAINSITENAME")), GetNodeText(document.SelectSingleNode("SITENAME")));
                        entity.TimeStr = TimeHelp.ConvertToDateTimeString(GetNodeText(document.SelectSingleNode("DREDATE")));
                        entity.TimesTamp = TimeHelp.ConvertToDateTimeString(GetNodeText(document.SelectSingleNode("TIMESTAMP")));
                        entity.AllContent = GetNodeText(document.SelectSingleNode("DRECONTENT"));
                        //DRECONTENT
                        entity.DreContent = GetNodeText(document.SelectSingleNode("DRECONTENT"));
                        entity.ShowContent = GetNodeText(document.SelectSingleNode("DISPLAYCONTENT"));
                        entity.DocType = doctype == null ? "other" : doctype;
                        entity.Tag = doctag == null ? "other" : doctag;
                        entity.Columns = GetNodeText(document.SelectNodes("D1"));
                        entity.HotColumns = GetNodeText(document.SelectNodes("D2"));
                        entity.SiteType = GetNodeText(document.SelectNodes("C1"));
                        entity.SameNum = GetNodeText(document.SelectNodes("SAMENUM"));
                        entity.ContUrl = GetNodeText(document.SelectNodes("CONTURL"));
                        //ORIGINAL_PIC
                        entity.OriginalPic = GetNodeText(document.SelectNodes("ORIGINAL_PIC"));
                        //THUMBNAIL_PIC
                        entity.ThumbnailPic = GetNodeText(document.SelectNodes("THUMBNAIL_PIC"));
                        //PROFILE_IMAGE_URL
                        entity.ProfileImageUrl = GetNodeText(document.SelectNodes("PROFILE_IMAGE_URL"));
                        //STATUSES_COUNT
                        entity.StatusesCount = GetNodeText(document.SelectNodes("STATUSES_COUNT"));
                        //FOLLOWERS_COUNT
                        entity.FollowersCount = GetNodeText(document.SelectNodes("FOLLOWERS_COUNT"));
                        //FRIENDS_COUNT
                        entity.FriendsCount = GetNodeText(document.SelectNodes("FRIENDS_COUNT"));
                        //GENDER
                        entity.Gender = GetNodeText(document.SelectNodes("GENDER"));
                        //WEBSOURCE
                        entity.WebSource = GetNodeText(document.SelectNodes("WEBSOURCE"));
                        //PROVINCE
                        entity.Province = GetNodeText(document.SelectNodes("PROVINCE"));
                        //ISVIP
                        entity.IsVip = GetNodeText(document.SelectNodes("ISVIP"));
                        //  +V说明
                        entity.VerifiedReason = GetNodeText(document.SelectNodes("VERIFIED_REASON"));
                        //RETWEETID
                        entity.RetweetId = GetNodeText(document.SelectNodes("RETWEETID"));
                        //ITEMID
                        entity.ItemId = GetNodeText(document.SelectNodes("ITEMID"));
                        //EMOTION
                        entity.Emotion = GetNodeText(document.SelectNodes("EMOTION"));
                        //AUTHORGTRUENAME
                        entity.AuthorgtrueName = GetNodeText(document.SelectNodes("AUTHORGTRUENAME"));
                        entity.AvartarLarge = GetNodeText(document.SelectNodes("AVATAR_LARGE"));
                        entity.IsFollower = GetNodeText(document.SelectNodes("ISFOLLOWER"));
                        entity.IsFavorite = GetNodeText(document.SelectNodes("ISFAVORITE"));
                        /*视频新增字段*/
                        entity.StrDatetime = GetNodeText(document.SelectNodes("MYPUBDATE"));
                        entity.VideoId = GetNodeText(document.SelectNodes("VIDEOID"));
                        entity.VideoFilePath = GetNodeText(document.SelectNodes("FILEPATH"));
                        entity.VideoFileCount = GetNodeText(document.SelectNodes("FILECOUNT"));
                        entity.VideoShortLink = GetNodeText(document.SelectNodes("SHORTLINK"));
                        entity.VideoThumbPic = GetNodeText(document.SelectNodes("THUMBPIC"));
                        entity.WeiboUrl = GetNodeText(document.SelectNodes("URL"));

                    }
                    newsList.Add(entity);
                }
                return newsList;
            }
            private string GetSiteName(string a, string b, string c)
            {
                if (!string.IsNullOrEmpty(a))
                {
                    return a;
                }
                else if (!string.IsNullOrEmpty(b))
                {
                    return b;
                }
                else
                {
                    return c;
                }
            }

            public string GetArticleCount(XmlDocument xmldoc)
            {
                XmlNamespaceManager nsmgr = new XmlNamespaceManager(xmldoc.NameTable);
                nsmgr.AddNamespace("autn", "http://schemas.autonomy.com/aci/");
                string totalCount = "0";
                XmlNode totalCountElement = xmldoc.SelectSingleNode("//autn:totalhits", nsmgr);
                XmlNode MaxResult = xmldoc.SelectSingleNode("//dremaxresults");
                if (MaxResult != null)
                {
                    totalCount = GetMaxCount(totalCountElement, MaxResult);
                }
                else
                {
                    totalCount = GetNodeText(totalCountElement);
                }
                return totalCount;
            }

            private String GetMaxCount(XmlNode node1, XmlNode node2)
            {
                int value1 = Convert.ToInt32(GetNodeText(node1));
                int value2 = Convert.ToInt32(GetNodeText(node2));
                int comparevalue = value1 <= value2 ? value1 : value2;
                return comparevalue.ToString();
            }

            public IList<IdolNewsEntity> GetPagerList(string action, Dictionary<string, string> dict)
            {
                XmlDocument xmldoc = GetXmlDoc(action, dict);
                if (xmldoc != null)
                {
                    return GetNewsList(xmldoc);
                }
                else
                {
                    return null;
                }
            }

            public XmlDocument GetXmlDoc(string action, Dictionary<string, string> dict)
            {
                string idolip = Util.ConfigUtil.CacheUsreInfo.IdolIp();
                if (string.IsNullOrEmpty(idolip))
                {
                    idolip = ConfigurationManager.AppSettings["IdolHttp"];
                }

                Connection conn = new Connection(idolip, 9000);
                //Connection conn = new Connection(ConfigurationManager.AppSettings["IdolHttp"], 9000);
                //Connection conn = new Connection(Util.ConfigUtil.CacheUsreInfo.IdolIp(), 9000);
                Command query = new Command(action);
                if (dict != null)
                {
                    foreach (string key in dict.Keys)
                    {
                        query.SetParam(key, dict[key]);
                    }
                }
                return conn.Execute(query).Data;
            }

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

            private string GetNodeText(XmlNodeList nodelist)
            {
                StringBuilder vallist = new StringBuilder();
                if (nodelist != null && nodelist.Count > 0)
                {
                    foreach (XmlNode node in nodelist)
                    {
                        if (vallist.Length > 0)
                        {
                            vallist.Append(",");
                        }
                        vallist.Append(GetNodeText(node));
                    }
                }
                return vallist.ToString();
            }
        }


    }
}
