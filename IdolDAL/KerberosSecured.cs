using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SSPI;
using System.Xml;
using System.Net.Sockets;
using System.Net;

namespace IdolACINet
{
    internal class KerberosSecured : Network
    {
        // Fields
        private bool authenticated;
        private ClientContext clientContext;
        private TcpClient connection;

        // Methods
        internal KerberosSecured(Connection parent, string host, int port)
            : base(parent, host, port)
        {
            this.connection = new TcpClient(host, port);
        }

        private static byte[] AuthenticationRequest(string token)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("GET /ACTION=gss&gssservicename=" + token + " HTTP/1.0\r\n");
            builder.Append("Pragma: No-Cache\r\n");
            builder.Append("Host: " + Dns.GetHostName() + "\r\n");
            builder.Append("Content-Length: 0\r\n\r\n");
            return Encoding.UTF8.GetBytes(builder.ToString());
        }

        private CommandCodex Encoder(EncryptionType encryptionType)
        {
            if (encryptionType != EncryptionType.Gss)
            {
                throw new SecurityException("Unsupported encryption type: " + encryptionType);
            }
            return new GssCommandCodex(this.Context);
        }

        internal void EnsureContext()
        {
            if (!this.authenticated)
            {
                byte[] buffer = AuthenticationRequest(HttpUtility.UrlEncode(Convert.ToBase64String(this.Context.Token)));
                this.connection.GetStream().Write(buffer, 0, buffer.Length);
                string s = FindContext(Encoding.UTF8.GetString(Utility.ReadAvailableBytes(this.connection)));
                while (this.clientContext.ContinueProcessing)
                {
                    this.clientContext.Initialize(Convert.FromBase64String(s));
                    if (this.clientContext.Token != null)
                    {
                        buffer = AuthenticationRequest(HttpUtility.UrlEncode(Convert.ToBase64String(this.clientContext.Token)));
                        this.connection.GetStream().Write(buffer, 0, buffer.Length);
                        s = FindContext(Encoding.UTF8.GetString(Utility.ReadAvailableBytes(this.connection)));
                    }
                }
                this.authenticated = true;
            }
        }

        public override string Execute(Command command)
        {
            try
            {
                this.EnsureContext();
            }
            catch (SSPIException exception)
            {
                throw new SecurityException("Invalid security credentials", exception);
            }
            EncryptionType encryptionType = base.parent.Encryption.Type;
            CommandCodex codex = this.Encoder(encryptionType);
            byte[] buffer = Request(codex.Encrypt(command).AssembleParameters(Encoding.UTF8));
            this.connection.GetStream().Write(buffer, 0, buffer.Length);
            string[] strArray = Utility.ReadUntil("\r\n\r\n", this.connection);
            string str = strArray[0];
            StringBuilder builder = new StringBuilder();
            builder.Append(strArray[1]);
            builder.Append(Encoding.UTF8.GetString(Utility.ReadAvailableBytes(this.connection)));
            XmlDocument document = new XmlDocument();
            document.LoadXml(builder.ToString());
            string innerText = document.GetElementsByTagName("autn:encryptedheader")[0].InnerText;
            string input = document.GetElementsByTagName("autn:encrypteddata")[0].InnerText;
            string str4 = codex.Decrypt(input);
            str = codex.Decrypt(innerText);
            StringBuilder builder2 = new StringBuilder();
            builder2.Append("<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>");
            builder2.Append("<autnresponse xmlns:autn='http://schemas.autonomy.com/aci/'>");
            builder2.Append(str);
            builder2.Append("<responsedata>");
            builder2.Append(str4);
            builder2.Append("</responsedata>");
            builder2.Append("</autnresponse>");
            return builder2.ToString();
        }

        private static string FindContext(string reply)
        {
            int index = reply.IndexOf("<context>");
            int num2 = reply.IndexOf("</context>");
            if (((index > num2) || (index == -1)) || (num2 == -1))
            {
                throw new SecurityException("Failed to create security credentials");
            }
            index += "<context>".Length;
            reply = reply.Substring(index, num2 - index).Trim();
            return reply;
        }

        private static byte[] Request(string commandText)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("GET /");
            builder.Append(commandText);
            builder.Append(" HTTP/1.0\r\n");
            builder.Append("Pragma: No-Cache\r\n");
            builder.Append("Host: " + Dns.GetHostName() + "\r\n");
            builder.Append("Content-Length: ");
            builder.Append(0);
            builder.Append("\r\n\r\n");
            return Encoding.UTF8.GetBytes(builder.ToString());
        }

        // Properties
        internal ClientContext Context
        {
            get
            {
                if (this.clientContext == null)
                {
                    string serverPrincipal = base.parent.Encryption.Service + "/" + base.parent.Host + "@" + base.parent.Encryption.Realm;
                    Credential.Package kerberos = Credential.Package.Kerberos;
                    ClientCredential credential = new ClientCredential(kerberos);
                    ClientContext.ContextAttributeFlags mutualAuthentication = ClientContext.ContextAttributeFlags.MutualAuthentication;
                    this.clientContext = new ClientContext(credential, serverPrincipal, mutualAuthentication);
                }
                return this.clientContext;
            }
        }
    }


}
