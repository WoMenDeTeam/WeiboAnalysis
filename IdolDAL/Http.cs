using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;

namespace IdolACINet
{
    internal abstract class Network
    {
        // Fields
        internal string host;
        protected Connection parent;
        internal int port;

        // Methods
        protected Network(Connection parent, string host, int port)
        {
            this.parent = parent;
            this.host = host;
            this.port = port;
        }

        public abstract string Execute(Command command);
    }

    internal class Http : Network
    {
        // Methods
        internal Http(Connection parent, string host, int port)
            : base(parent, host, port)
        {
        }

        private Uri CreateURI(string sCommand, string sData)
        {
            //StringBuilder builder = null;
            //builder = new StringBuilder("http://");
            //builder.Append(base.host);
            //builder.Append(":");
            //builder.Append(base.port);
            //if (!sCommand.StartsWith("/"))
            //{
            //    builder.Append("/");
            //}
            //builder.Append(sCommand);
            //builder.Append(sData);
            UriBuilder builder2 = new UriBuilder();
            builder2.Host = base.host;
            builder2.Port = base.port;
            builder2.Path = "/";
            builder2.Query = sCommand + sData;
            return builder2.Uri;
        }

        private string CreateURLStr(string sCommand, string sData)
        {
            StringBuilder builder = new StringBuilder("http://");
            builder.Append(base.host);
            builder.Append(":");
            builder.Append(base.port);
            if (!sCommand.StartsWith("/"))
            {
                builder.Append("/");
            }
            builder.Append(sCommand);
            builder.Append(sData);
            return builder.ToString();
        }


        public override string Execute(Command command)
        {
            if (command.Method.Equals("Post"))
            {
                return this.Post(command.AssembleParameters(base.parent.SendEncoding), string.Empty, command.GetPostData(base.parent.SendEncoding));
            }
            else
            {
                return this.Send(command.AssembleParameters(base.parent.SendEncoding), string.Empty);
            }
        }

        private string GetAction(HttpWebRequest connection, string method)
        {
            string str;
            try
            {
                connection.Method = method;
                using (Stream stream = connection.GetResponse().GetResponseStream())
                {
                    using (StreamReader reader = new StreamReader(stream, base.parent.ReceiveEncoding))
                    {
                        str = reader.ReadToEnd();
                    }
                }
            }
            catch (Exception exception)
            {
                throw new ArgumentException(exception.Message, exception);
            }
            return str;
        }

        internal string Send(string command, string data)
        {
            HttpWebRequest connection = (HttpWebRequest)WebRequest.Create(this.CreateURLStr(command, data));
            connection.ContentType = "text/plain";
            connection.Accept = "*/*";
            connection.ProtocolVersion = HttpVersion.Version11;
            return this.GetAction(connection, "Get");
        }

        internal string Post(string command, string data,string postdata)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(this.CreateURLStr(command, data));
            request.Method = "Post";
            request.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
            //request.Connection = "Close";
            
            byte[] somebytes = Encoding.UTF8.GetBytes(postdata);
            request.ContentLength = somebytes.Length;
            Stream newstream = request.GetRequestStream();
            newstream.Write(somebytes, 0, somebytes.Length);
            newstream.Close();

            return this.GetAction(request, "Post");
        }

    }
}
