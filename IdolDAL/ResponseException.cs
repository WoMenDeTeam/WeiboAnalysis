using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace IdolACINet
{
    [Serializable]
    public class ResponseException : Exception
    {
        // Methods
        public ResponseException()
        {
        }

        public ResponseException(string message)
            : base(message)
        {
        }

        protected ResponseException(SerializationInfo serializationInfo, StreamingContext streamingContext)
            : base(serializationInfo, streamingContext)
        {
        }

        public ResponseException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }

    [Serializable]
    public class CommunicationException : Exception
    {
        // Methods
        public CommunicationException()
        {
        }

        public CommunicationException(string message)
            : base(message)
        {
        }

        protected CommunicationException(SerializationInfo serializationInfo, StreamingContext streamingContext)
            : base(serializationInfo, streamingContext)
        {
        }

        public CommunicationException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }

    [Serializable]
    public class SecurityException : Exception
    {
        // Methods
        public SecurityException()
        {
        }

        public SecurityException(string message)
            : base(message)
        {
        }

        protected SecurityException(SerializationInfo serializationInfo, StreamingContext streamingContext)
            : base(serializationInfo, streamingContext)
        {
        }

        public SecurityException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }

}
