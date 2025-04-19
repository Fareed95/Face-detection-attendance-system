import { useEffect, useRef, useState } from 'react';

const SpeakingAvatar = ({ apiKey, text }) => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateVideo = async () => {
        const url = 'https://api.d-id.com/talks';
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik53ek53TmV1R3ptcFZTQjNVZ0J4ZyJ9.eyJodHRwczovL2QtaWQuY29tL2ZlYXR1cmVzIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJvZHVjdF9pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vc3RyaXBlX2N1c3RvbWVyX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJvZHVjdF9uYW1lIjoidHJpYWwiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9zdWJzY3JpcHRpb25faWQiOiIiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9iaWxsaW5nX2ludGVydmFsIjoibW9udGgiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9wbGFuX2dyb3VwIjoiZGVpZC10cmlhbCIsImh0dHBzOi8vZC1pZC5jb20vc3RyaXBlX3ByaWNlX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJpY2VfY3JlZGl0cyI6IiIsImh0dHBzOi8vZC1pZC5jb20vY2hhdF9zdHJpcGVfc3Vic2NyaXB0aW9uX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jaGF0X3N0cmlwZV9wcmljZV9jcmVkaXRzIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jaGF0X3N0cmlwZV9wcmljZV9pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vcHJvdmlkZXIiOiJnb29nbGUtb2F1dGgyIiwiaHR0cHM6Ly9kLWlkLmNvbS9pc19uZXciOnRydWUsImh0dHBzOi8vZC1pZC5jb20vYXBpX2tleV9tb2RpZmllZF9hdCI6IiIsImh0dHBzOi8vZC1pZC5jb20vb3JnX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9hcHBzX3Zpc2l0ZWQiOlsiU3R1ZGlvIl0sImh0dHBzOi8vZC1pZC5jb20vY3hfbG9naWNfaWQiOiIiLCJodHRwczovL2QtaWQuY29tL2NyZWF0aW9uX3RpbWVzdGFtcCI6IjIwMjUtMDMtMDFUMTU6MjM6MDYuOTg5WiIsImh0dHBzOi8vZC1pZC5jb20vYXBpX2dhdGV3YXlfa2V5X2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9oYXNoX2tleSI6IjlrUUc4aWtQOURZT0RWWmNiSDdkRCIsImh0dHBzOi8vZC1pZC5jb20vcHJpbWFyeSI6dHJ1ZSwiaHR0cHM6Ly9kLWlkLmNvbS9lbWFpbCI6InNlcmlvdXNtb2RlMTBAZ21haWwuY29tIiwiaHR0cHM6Ly9kLWlkLmNvbS9jb3VudHJ5X2NvZGUiOiJJTiIsImh0dHBzOi8vZC1pZC5jb20vcGF5bWVudF9wcm92aWRlciI6InN0cmlwZSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kLWlkLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMjUxMzkyMjg2NzY5MzIxNzQ1NiIsImF1ZCI6WyJodHRwczovL2QtaWQudXMuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2QtaWQudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc0MDg0MjU4OSwiZXhwIjoxNzQwOTI4OTg5LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJHenJOSTFPcmU5Rk0zRWVEUmYzbTN6M1RTdzBKbFJZcSJ9.yAZ-nN373t-7CX4axPoG30IyAigjtIvY7v_aVyUwzbE9XYYtBjE7-Ri6pKJvPjP1c91PllkrUmKX7s0bRYpJr2bZeiALlfzZhMCjy7zMkm0tQM7IjARiEii8K_g3Q4gaoa15rxG-yuxraYVcrWCSkCF3vD9Li6hZVloItsU75HG2n_F-yj8D1E8TurjuvPVGwYXuasrCXZCuNoEMlSbjAYH-B52VZqwK8oZRbcq2wUdGXW3BenyBMiwHS8MiVNLXV2RCNzmb34TUspeILzwNcWeUmiBCbyvlJDiS8o0lLk6KbhzTMHxl2TXpOzyDn-99bbge3gVqhT1TwR1JWorn8A'
          },
          body: JSON.stringify({
            source_url: 'https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg',
            script: {
              type: 'text',
              subtitles: 'false',
              provider: {type: 'microsoft', voice_id: 'Sara'},
              input: 'Making videos is easy with D-ID',
              ssml: 'false'
            },
            config: {fluent: 'false'}
          })
        };
        
        fetch(url, options)
          .then(res => res.json())
          .then(json => console.log(json))
          .catch(err => console.error(err));
    };

    generateVideo();
  }, [apiKey, text]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {videoSrc ? (
        <video ref={videoRef} src={videoSrc} controls className="w-64 h-64 mb-4"/>
      ) : (
        <div className="w-64 h-64 mb-4 bg-gray-200 flex items-center justify-center">
          Loading...
        </div>
      )}
      <div className="p-4 border rounded shadow">
        {text}
      </div>
    </div>
  );
};

export default SpeakingAvatar;
