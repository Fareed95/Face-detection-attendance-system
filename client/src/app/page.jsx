"use client";
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Camera, User, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

export default function Home() {
  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [photos, setPhotos] = useState(Array(6).fill(null));
  const [cameraActive, setCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('upload'); // 'upload', 'info', 'loading', 'results'
  const [nameInput, setNameInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [error, setError] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const getCameraErrorMessage = (err) => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      return 'Camera access on phones requires HTTPS or localhost. Open this app over HTTPS and try again.';
    }

    if (err?.name === 'NotAllowedError') {
      return 'Camera permission was denied. Allow camera access in your browser settings and try again.';
    }

    if (err?.name === 'NotFoundError') {
      return 'No camera was found on this device.';
    }

    if (err?.name === 'NotReadableError') {
      return 'Your camera is already in use by another app.';
    }

    return 'This browser cannot access the camera on this device.';
  };

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError(getCameraErrorMessage());
        setCameraActive(false);
        return;
      }

      setCameraError(null);
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
          setCameraError(getCameraErrorMessage(err));
          setCameraActive(false);
        });
    } else if (!cameraActive) {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [cameraActive]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) return null;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const startAutoCapture = () => {
    if (isCapturing || !cameraActive) return;
    if (!videoRef.current || videoRef.current.readyState < 2) {
      setCameraError('Camera is still starting. Wait a moment and try again.');
      return;
    }

    setCameraError(null);
    const newPhotos = Array(6).fill(null);
    setPhotos([...newPhotos]);
    setIsCapturing(true);
    setCaptureCountdown(6);

    let count = 0;
    const interval = setInterval(() => {
      const frame = captureFrame();
      if (frame) newPhotos[count] = frame;
      count++;
      setPhotos([...newPhotos]);
      setCaptureCountdown(6 - count);

      if (count === 6) {
        clearInterval(interval);
        setIsCapturing(false);
        setCaptureCountdown(null);
      }
    }, 1000);
  };

  const completedPhotos = photos.filter(p => p !== null).length;
  const allPhotosCompleted = completedPhotos === 6;

  const prepareFileFromDataURL = async (dataURL, index) => {
    // Convert to JPEG format if not already
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataURL;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Ensure it's JPEG format with quality 0.9
    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Convert to file
    const res = await fetch(jpegDataUrl);
    const blob = await res.blob();
    return new File([blob], `photo${index + 1}.jpg`, { type: 'image/jpeg' });
  };

  const getUploadEndpoint = () => {
    if (MODEL_API_SERVER) {
      return `${MODEL_API_SERVER.replace(/\/$/, '')}/upload`;
    }

    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.hostname}:8000/upload`;
    }

    return 'http://localhost:8000/upload';
  };

  const handleSubmitPhotos = async () => {
    // Transition to info collection step
    setStep('info');
  };

  const handleSubmitInfo = async () => {
    if (!nameInput || !subjectInput) {
      setError("Please enter both name and subject");
      return;
    }

    try {
      setLoading(true);
      setStep('loading');
      setError(null);

      // Create form data with photos and info
      const formData = new FormData();

      // Add the name and subject
      formData.append('name', nameInput);
      formData.append('subject_name', subjectInput);

      // Add all photos as files
      for (let i = 0; i < photos.length; i++) {
        if (photos[i]) {
          const file = await prepareFileFromDataURL(photos[i], i);
          formData.append('images', file);
        }
      }

      // Send POST request
      const response = await fetch(getUploadEndpoint(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Server response:", data);
      setRecognizedFaces(data.recognized_faces);
      setStep('results');
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Failed to process images. Please try again.");
      setStep('info'); // Go back to info step
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPhotos(Array(6).fill(null));
    setNameInput('');
    setSubjectInput('');
    setStep('upload');
    setRecognizedFaces([]);
    setError(null);
    setCameraError(null);
    setIsCapturing(false);
    setCaptureCountdown(null);
    setCameraActive(false);
  };

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">

        {/* Webcam preview */}
        <div className="mb-6">
          <div className="relative aspect-video bg-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Countdown overlay */}
                {isCapturing && captureCountdown !== null && captureCountdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-7xl font-bold drop-shadow-lg">
                      {captureCountdown}
                    </span>
                  </div>
                )}
                {/* Start capturing button */}
                {!isCapturing && (
                  <button
                    onClick={startAutoCapture}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full flex items-center transition-all shadow-lg hover:shadow-cyan-500/25 font-medium"
                  >
                    <Camera size={18} className="mr-2" />
                    {completedPhotos > 0 ? 'Retake Photos' : 'Start Capturing'}
                  </button>
                )}
                {isCapturing && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2.5 bg-gray-900/80 rounded-full text-cyan-400 font-medium text-sm">
                    Capturing {completedPhotos} / 6…
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Camera size={40} className="text-gray-500" />
                <button
                  onClick={() => {
                    setCameraError(null);
                    setCameraActive(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg flex items-center transition-all shadow-lg hover:shadow-cyan-500/25"
                >
                  <Camera size={18} className="mr-2" />
                  Enable Camera
                </button>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          {cameraError && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{cameraError}</p>
            </div>
          )}
          <p className="mt-3 text-sm text-gray-500">
            Mobile browsers usually require HTTPS for camera access. If you open this page from a phone over plain HTTP, the camera API may be unavailable.
          </p>
        </div>

        {/* Captured frames grid (3×2) */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {Array(6).fill(null).map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${
                photos[index]
                  ? 'border-cyan-500'
                  : 'border-gray-700'
              }`}
            >
              {photos[index] ? (
                <img
                  src={photos[index]}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800/50 flex flex-col items-center justify-center">
                  <Camera size={18} className="text-gray-600 mb-1" />
                  <span className="text-gray-600 text-xs">{index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-full bg-gray-800/50 backdrop-blur-md rounded-full h-2.5 mr-6">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedPhotos / 6) * 100}%` }}
            />
          </div>
          <div className="whitespace-nowrap text-gray-400">
            {completedPhotos}/6 captured
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmitPhotos}
            disabled={!allPhotosCompleted}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center mx-auto transform transition-transform duration-300 ${
              allPhotosCompleted
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 hover:scale-105'
                : 'bg-gray-700 cursor-not-allowed opacity-50'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderInfoStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-center">Enter Information</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-400 mb-2 font-medium">
            Your Name
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              id="name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="w-full py-2.5 pl-10 pr-4 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="mb-8">
          <label htmlFor="subject" className="block text-gray-400 mb-2 font-medium">
            Subject Name
          </label>
          <div className="relative">
            <BookOpen size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              id="subject"
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Enter subject name"
              className="w-full py-2.5 pl-10 pr-4 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setStep('upload')}
            className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleSubmitInfo}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            Process Images
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl text-center">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin-slow"></div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3">Processing Images</h3>
        <p className="text-gray-400 mb-8">
          Our facial recognition system is analyzing the captured images. This might take a moment...
        </p>

        <div className="w-full bg-gray-800/50 backdrop-blur-md rounded-full h-2.5 mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 animate-progress rounded-full"></div>
        </div>
        <p className="text-gray-500 text-sm">Please don't close this window</p>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1">Attendance Results</h3>
            <p className="text-gray-400">
              {recognizedFaces.length} students detected • {nameInput} • {subjectInput}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-all flex items-center"
            >
              New Scan
            </button>
            <button
              onClick={() => {}} // Add export functionality if needed
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center"
            >
              Export CSV
            </button>
          </div>
        </div>

        {recognizedFaces.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-800">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50 backdrop-blur-md">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    UIN
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Parent Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/30 backdrop-blur-md divide-y divide-gray-800">
                {recognizedFaces.map((face, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white capitalize">{face.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {face.uin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {face.parent_email !== "NaN" && face.parent_email ? face.parent_email : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400">
                        <CheckCircle size={14} className="mr-1" />
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <AlertCircle size={32} className="text-gray-400" />
            </div>
            <h4 className="text-xl font-medium mb-2">No students detected</h4>
            <p className="text-gray-400 mb-6">Try capturing again with better lighting and a steadier camera position</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all inline-flex items-center"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse">
              Ipresent
            </h1>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Automated Attendance System</h2>
          <p className="text-gray-400 text-lg">Enable your webcam and capture 6 photos automatically for facial recognition attendance</p>
        </div>

        {step === 'upload' && renderUploadStep()}
        {step === 'info' && renderInfoStep()}
        {step === 'loading' && renderLoadingStep()}
        {step === 'results' && renderResultsStep()}
      </main>

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          20% { width: 20%; }
          50% { width: 50%; }
          80% { width: 70%; }
          100% { width: 90%; }
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes spin-slow {
          to { transform: rotate(-360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      <footer className="bg-gray-900/50 backdrop-blur-md border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2025 Ipresent • Automated Attendance System</p>
        </div>
      </footer>
    </div>
  );

  return (
    <>
      <Head>
        <title>Ipresent | Automated Attendance System</title>
        <meta name="description" content="Ipresent - Simplified attendance with facial recognition" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoggedIn ? renderApp() : null}
    </>
  );
}
