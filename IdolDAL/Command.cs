using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Web;

namespace IdolACINet
{
    public class Command
    {
        // Fields
        private string action;
        private string method;
        private StringDictionary parameters = new StringDictionary();
        private static string[] valueBooleanTrue = new string[] { "on", "yes", "1", "one", "true" };

        // Methods
        public Command(string action)
        {
            if (action == null)
            {
                throw new ArgumentNullException("action", "Action should not be null");
            }
            this.action = action;
            this.method = "Get";
        }



        public string SimpleAssembleParameters()
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("action=");
            builder.Append(this.Action);
            builder.Append(this.SimpleDataParameters());
            return builder.ToString();
        }

        public string SimpleDataParameters()
        {
            StringBuilder builder = new StringBuilder();
            foreach (string str in this.Parameters.Keys)
            {
                builder.Append("&");
                builder.Append(str);
                builder.Append("=");
                builder.Append(this.Parameters[str]);
            }
            return builder.ToString();
        }

        public string SimpleDataParameters(bool startWithAnd)
        {
            StringBuilder builder = new StringBuilder();
            int count = 0;
            foreach (string str in this.Parameters.Keys)
            {
                if (count == 0)
                {
                    if (startWithAnd)
                    {
                        builder.Append("&");
                    }
                }
                else
                {
                    builder.Append("&");
                }
                builder.Append(str);
                builder.Append("=");
                builder.Append(this.Parameters[str]);
                count++;
            }            
            return builder.ToString();
        }

        public virtual string GetPostData(Encoding encoding)
        {
            //if (this.Method.Equals("Post"))
            //{

            //}
            return string.Empty;
        }

        /// <summary>
        /// Execute 调用的方法
        /// </summary>
        /// <param name="encoding"></param>
        /// <returns></returns>
        public virtual string AssembleParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("action=");
            builder.Append(this.Action);
            builder.Append(this.SimpleDataParameters());
            //builder.Append(this.DataParameters(encoding));
            return builder.ToString();
        }
        public virtual string DataParameters(Encoding encoding)
        {
            StringBuilder builder = new StringBuilder();
            foreach (string str in this.Parameters.Keys)
            {
                builder.Append("&");
                builder.Append(str);
                builder.Append("=");
                builder.Append(HttpUtility.UrlEncode(this.Parameters[str], encoding));
            }
            return builder.ToString();
        }
        

 

 


        public override int GetHashCode()
        {
            int hashCode = this.action.GetHashCode();
            foreach (string str in this.Parameters.Keys)
            {
                hashCode ^= str.ToLower().GetHashCode() | this.Parameters[str].ToLower().GetHashCode();
            }
            return hashCode;
        }

        public void SetParam(string key, string value)
        {
            if (this.parameters.ContainsKey(key))
            {
                this.parameters[key] = value;
            }
            else
            {
                this.parameters.Add(key, value);
            }
        }
        public string String(string key)
        {
            return this.CheckedValue(key);
        }
        public string CheckedValue(string key)
        {
            if (!this.parameters.ContainsKey(key))
            {
                throw new ArgumentException("Failed to find key in parameters");
            }
            return this.parameters[key];
        }
        public bool Boolean(string key)
        {
            return (this.parameters.ContainsKey(key) && (Array.IndexOf<string>(valueBooleanTrue, this.CheckedValue(key).ToLower()) >= 0));
        }


        public void SetParam(string key, int value)
        {
            this.SetParam(key, value.ToString());
        }
        public void SetParam(string key, long value)
        {
            this.SetParam(key, value.ToString());
        }
        public void SetParam(string key, bool value)
        {
            this.SetParam(key, value.ToString());
        }

        // Properties
        internal string Action
        {
            get
            {
                return this.action;
            }
        }
        public string Method
        {
            get
            {
                return this.method;
            }
            set
            {
                this.method = value;
            }
        }
        public StringDictionary Parameters
        {
            get
            {
                return this.parameters;
            }
        }




        #region implement command

        public static Command GetStatus
        {
            get
            {
                return new Command("GetStatus");
            }
        }

        public static Command IndexerGetStatus
        {
            get
            {
                return new Command("IndexerGetStatus");
            }
        }

        public static Command Query
        {
            get
            {
                return new Command("Query");
            }
        }

        public static Command CategoryQuery
        {
            get
            {
                return new Command("CategoryQuery");
            }
        }

        public static Command ClusterResults
        {
            get
            {
                return new Command("ClusterResults");
            }
        }

        public static Command ClusterSnapshot
        {
            get
            {
                return new Command("ClusterSnapshot");
            }
        }
        public static Command ClusterCluster
        {
            get
            {
                return new Command("ClusterCluster");
            }
        }

        public static Command ClusterSGDataGen
        {
            get
            {
                return new Command("ClusterSGDataGen");
            }
        }
        #endregion

    }
}
