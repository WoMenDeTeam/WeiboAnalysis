using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IdolACINet
{
    public enum EncryptionType
    {
        None,
        Gss
    }

    public interface IConnection
    {
        Response Execute(Command command);
    }

    public class Connection : IConnection

    {
        // Fields
        private Network communicationNetwork;
        private Encryption encryption = new Encryption();
        private string host = string.Empty;
        private int port;
        private Encoding receiveEncoding = Encoding.UTF8;
        private Encoding sendEncoding = Encoding.UTF8;

        public Connection()
        {

        }
        public Connection(string hostname, int ports)
        {
            this.host = hostname;
            this.port = ports;
        }

        // Methods
        private Network CommunicationNetwork()
        {
            if (this.communicationNetwork == null)
            {
                this.SetupCommunication();
            }
            if (this.communicationNetwork == null)
            {
                throw new CommunicationException("Failed to setup communication network");
            }
            return this.communicationNetwork;
        }

        internal bool EncryptedCommuniction()
        {
            return (this.Encryption.Type != EncryptionType.None);
        }

        public override bool Equals(object obj)
        {
            if (!(obj is Connection))
            {
                return false;
            }
            Connection connection = obj as Connection;
            return (connection.Host.Equals(this.Host) && connection.Port.Equals(this.Port));
        }

        public Response Execute(Command command)
        {
            return Response.Create(this.CommunicationNetwork().Execute(command));
        }

        public override int GetHashCode()
        {
            return (this.Host.GetHashCode() ^ this.Port.GetHashCode());
        }

        private void SetupCommunication()
        {
            //if (this.EncryptedCommuniction())
            //{
            //    this.communicationNetwork = new KerberosSecured(this, this.host, this.port);
            //}
            //else
            //{
            //    this.communicationNetwork = new Http(this, this.host, this.port);
            //}

            this.communicationNetwork = new Http(this, this.host, this.port);
        }

        // Properties
        public Encryption Encryption
        {
            get
            {
                return this.encryption;
            }
        }

        public string Host
        {
            get
            {
                return this.host;
            }
            set
            {
                this.host = value;
            }
        }

        public int Port
        {
            get
            {
                return this.port;
            }
            set
            {
                this.port = value;
            }
        }

        public Encoding ReceiveEncoding
        {
            get
            {
                return this.receiveEncoding;
            }
            set
            {
                this.receiveEncoding = value;
            }
        }

        public Encoding SendEncoding
        {
            get
            {
                return this.sendEncoding;
            }
            set
            {
                this.sendEncoding = value;
            }
        }


        #region IConnection 成员

        Response IConnection.Execute(Command command)
        {
            throw new NotImplementedException();
        }

        #endregion

        public static Connection localhost
        {
            get
            {
                Connection cnn = new Connection("localhost",9000);

                return cnn;
            }
        }
    }
}
