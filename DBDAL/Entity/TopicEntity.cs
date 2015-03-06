using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DBDAL.Entity
{
    [Serializable]
    public class TopicEntity
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Keywords { get; set; }
        public DateTime StartTime { get; set; }
        public string Industry { get; set; }
        public int OriginalCount { get; set; }
        public int ForwardCount { get; set; }
        public int CommentCount { get; set; }
        public int IsStop { get; set; }
        public int IsDel { get; set; }
    }
}
