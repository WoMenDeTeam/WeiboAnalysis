using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;

namespace IdolACINet
{
    public class Response
    {
        // Fields
        private XmlDocument response;
        private string results;

        private Response()
        {

        }
        // Methods
        private Response(XmlDocument response)
        {
            this.response = response;
        }

        private static void CheckForAciErrors(XmlDocument document)
        {
            if (string.Compare(document.GetElementsByTagName("response")[0].InnerText, "error", true) == 0)
            {
                throw new ResponseException(document.GetElementsByTagName("errorstring")[0].InnerText);
            }
        }

        public static Response Create(string xmlData)
        {
            if (!string.IsNullOrEmpty(xmlData) && xmlData.Contains("<?xml version"))
            {
                XmlDocument document = new XmlDocument();
                document.LoadXml(xmlData);
                //CheckForAciErrors(document);
                return new Response(document);
            }
            else
            {
                Response res = new Response();
                res.results = xmlData;
                return res;
            }
        }

        public override string ToString()
        {
            return this.response.OuterXml;
        }

        // Properties
        public XmlDocument Data
        {
            get
            {
                return this.response;
            }
        }

        public String Result
        {
            get
            {
                return this.results;
            }
        }
    }    
}
