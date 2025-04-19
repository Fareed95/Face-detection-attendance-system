"use client";
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Camera, Upload, User, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to true for testing
  const [uploadMode, setUploadMode] = useState('upload');
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(err => {
          console.error("Error accessing webcam:", err);
          setCameraActive(false);
        });
    } else if (!cameraActive && videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL('image/jpeg');
      const newPhotos = [...photos];
      newPhotos[currentPhotoIndex] = photoData;
      setPhotos(newPhotos);

      if (currentPhotoIndex < 3 && !newPhotos[currentPhotoIndex + 1]) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhotos = [...photos];
        newPhotos[currentPhotoIndex] = event.target.result;
        setPhotos(newPhotos);

        if (currentPhotoIndex < 3 && !newPhotos[currentPhotoIndex + 1]) {
          setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPhotoSlot = (index) => {
    setCurrentPhotoIndex(index);
    if (uploadMode === 'upload') {
      fileInputRef.current.click();
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const completedPhotos = photos.filter(p => p !== null).length;
  const allPhotosCompleted = completedPhotos === 4;

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
          <p className="text-gray-400 text-lg">Upload or capture four images to mark attendance using facial recognition</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 backdrop-blur-md p-1 rounded-lg inline-flex">
                <button
                  onClick={() => {
                    setUploadMode('upload');
                    setCameraActive(false);
                  }}
                  className={`px-4 py-2 rounded-md flex items-center transition-all duration-300 ${
                    uploadMode === 'upload'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload size={18} className="mr-2" />
                  Upload Photos
                </button>
                <button
                  onClick={() => {
                    setUploadMode('webcam');
                    setCameraActive(true);
                  }}
                  className={`px-4 py-2 rounded-md flex items-center transition-all duration-300 ${
                    uploadMode === 'webcam'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Camera size={18} className="mr-2" />
                  Use Webcam
                </button>
              </div>
            </div>

            {uploadMode === 'webcam' && (
              <div className="mb-8">
                <div className="relative aspect-video bg-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      ></video>
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-full flex items-center transition-all shadow-lg hover:shadow-cyan-500/25"
                      >
                        <Camera size={18} className="mr-2" />
                        Capture Photo {currentPhotoIndex + 1}
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <button
                        onClick={() => setCameraActive(true)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg flex items-center transition-all shadow-lg hover:shadow-cyan-500/25"
                      >
                        <Camera size={18} className="mr-2" />
                        Enable Camera
                      </button>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${
                    currentPhotoIndex === index && !photos[index]
                      ? 'border-cyan-500 border-2'
                      : 'border-gray-700 hover:border-cyan-500'
                  } relative cursor-pointer group`}
                  onClick={() => selectPhotoSlot(index)}
                >
                  {photos[index] ? (
                    <div className="relative h-full">
                      <img
                        src={photos[index]}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(index);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800/50 backdrop-blur-md flex flex-col items-center justify-center p-4">
                      {uploadMode === 'upload' ? (
                        <>
                          <Upload size={24} className="text-gray-500 mb-2" />
                          <span className="text-gray-500 text-sm text-center">
                            {index === currentPhotoIndex
                              ? "Click to upload"
                              : `Photo ${index + 1}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera size={24} className="text-gray-500 mb-2" />
                          <span className="text-gray-500 text-sm text-center">
                            {index === currentPhotoIndex
                              ? "Ready to capture"
                              : `Photo ${index + 1}`}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {uploadMode === 'upload' && (
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            )}

            <div className="flex justify-between items-center mb-8">
              <div className="w-full bg-gray-800/50 backdrop-blur-md rounded-full h-2.5 mr-6">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(completedPhotos / 4) * 100}%` }}
                ></div>
              </div>
              <div className="whitespace-nowrap text-gray-400">
                {completedPhotos}/4 completed
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {}}
                disabled={!allPhotosCompleted}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center mx-auto transform transition-transform duration-300 ${
                  allPhotosCompleted
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 hover:scale-105'
                    : 'bg-gray-700 cursor-not-allowed opacity-50'
                }`}
              >
                Scan & Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </main>

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
